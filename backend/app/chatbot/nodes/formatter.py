"""
Heaven on Earth CMS Backend — Response Formatter Node

Builds the final LLM response by combining the language-specific system
prompt, conversation history, and optional RAG context, then calls Groq
and appends the result to ``state["messages"]``.

Uses ``llama-3.1-8b-instant`` as primary (high TPM limit) with
``llama3-70b-8192`` as fallback, and exponential-backoff retry on 429
rate-limit errors.

References
----------
- Req §7 (LangGraph Agent Graph), acceptance criteria 7.6
- Design § "LangGraph Agent Graph" → Node Responsibilities table → Response Formatter
- Design § "Response Speed Architecture" → Groq model selection
"""

from __future__ import annotations

import asyncio
import logging

from groq import RateLimitError
from langchain_core.messages import AIMessage, BaseMessage, SystemMessage
from langchain_groq import ChatGroq

from app.chatbot.prompts import load_system_prompt
from app.chatbot.session import AgentState
from app.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Groq clients — primary (high TPM) + fallback (lower TPM but more capable)
# ---------------------------------------------------------------------------

# llama-3.1-8b-instant: ~1M TPM on free tier — handles most requests easily
_llm_primary = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=settings.groq_api_key,
    temperature=0.7,
)

# llama3-70b-8192: fallback when primary is also rate-limited
_llm_fallback = ChatGroq(
    model="llama3-70b-8192",
    api_key=settings.groq_api_key,
    temperature=0.7,
)

# Retry settings
_MAX_RETRIES = 3
_BASE_BACKOFF = 2.0  # seconds


def _trim_trailing_ai_messages(messages: list[BaseMessage]) -> list[BaseMessage]:
    """
    Remove any trailing AIMessages from *messages* so the list always ends
    with a HumanMessage before being sent to the LLM.

    LLM APIs require the last message to have role ``"user"``.  Flow and
    confirmation nodes can append ``AIMessage`` prompts to state before the
    formatter runs, which would otherwise trigger a 400 error.
    """
    trimmed = list(messages)
    while trimmed and isinstance(trimmed[-1], AIMessage):
        trimmed.pop()
    return trimmed


async def _invoke_with_retry(llm_messages: list[BaseMessage]) -> str:
    """
    Attempt to invoke the primary LLM, retrying on 429 with exponential
    backoff.  Falls back to the secondary model if the primary is exhausted.

    Returns the response content string.
    """
    last_exc: Exception | None = None

    for attempt in range(_MAX_RETRIES):
        try:
            response = await _llm_primary.ainvoke(llm_messages)
            return str(response.content)
        except RateLimitError as exc:
            last_exc = exc
            wait = _BASE_BACKOFF * (2 ** attempt)
            logger.warning(
                "Groq primary rate limit hit (attempt %d/%d), waiting %.1fs",
                attempt + 1, _MAX_RETRIES, wait,
            )
            await asyncio.sleep(wait)

    # Primary exhausted — try fallback model once
    logger.warning("Primary model rate-limited after %d retries, trying fallback", _MAX_RETRIES)
    try:
        response = await _llm_fallback.ainvoke(llm_messages)
        return str(response.content)
    except RateLimitError as exc:
        logger.error("Fallback model also rate-limited: %s", exc)
        raise exc from last_exc


async def response_formatter_node(state: AgentState) -> AgentState:
    """
    LangGraph node: generate the final assistant response via Groq.

    The node:
    1. Loads the language-appropriate system prompt.
    2. Optionally prepends a ``[Context]`` block if RAG results are present.
    3. Strips any trailing AIMessages from the history so the LLM always
       receives a conversation ending with a user message (API requirement).
    4. Invokes Groq with retry + fallback on 429 rate-limit errors.
    5. Appends the complete ``AIMessage`` to ``state["messages"]``.

    Parameters
    ----------
    state:
        Current agent state.

    Returns
    -------
    AgentState
        Updated state with the new assistant message appended.
    """
    language = state.get("language", "en")
    system_prompt_text = load_system_prompt(language)  # type: ignore[arg-type]

    # Build the system message, optionally including retrieved context
    retrieved_context = state.get("retrieved_context") or ""
    if retrieved_context:
        system_content = (
            f"{system_prompt_text}\n\n"
            f"[Relevant Context]\n{retrieved_context}"
        )
    else:
        system_content = system_prompt_text

    system_message = SystemMessage(content=system_content)

    # Strip trailing AIMessages so the LLM always receives a conversation
    # that ends with a user message (API requirement).
    history_for_llm = _trim_trailing_ai_messages(list(state["messages"]))

    # Compose the full message list for the LLM
    llm_messages = [system_message] + history_for_llm

    # Invoke with retry + fallback on rate-limit errors
    content = await _invoke_with_retry(llm_messages)

    new_messages = list(state["messages"]) + [AIMessage(content=content)]
    return {**state, "messages": new_messages}
