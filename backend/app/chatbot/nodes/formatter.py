"""
Heaven on Earth CMS Backend — Response Formatter Node

Builds the final LLM response by combining the language-specific system
prompt, conversation history, and optional RAG context, then calls Groq
``llama3-70b-8192`` and appends the result to ``state["messages"]``.

References
----------
- Req §7 (LangGraph Agent Graph), acceptance criteria 7.6
- Design § "LangGraph Agent Graph" → Node Responsibilities table → Response Formatter
- Design § "Response Speed Architecture" → Groq model selection
"""

from __future__ import annotations

from langchain_core.messages import AIMessage, BaseMessage, SystemMessage
from langchain_groq import ChatGroq

from app.chatbot.prompts import load_system_prompt
from app.chatbot.session import AgentState
from app.config import settings

# ---------------------------------------------------------------------------
# Module-level Groq client — instantiated once, reused across all invocations
# ---------------------------------------------------------------------------
_llm = ChatGroq(
    model="groq/compound",
    api_key=settings.groq_api_key,
    temperature=0.7,
)


def _trim_trailing_ai_messages(messages: list[BaseMessage]) -> list[BaseMessage]:
    """
    Remove any trailing AIMessages from *messages* so the list always ends
    with a HumanMessage before being sent to the LLM.

    LLM APIs (OpenAI, Groq, Anthropic, etc.) require the last message in the
    conversation to have role ``"user"``.  Flow and confirmation nodes can
    append ``AIMessage`` prompts to state *before* the formatter runs, which
    would otherwise trigger a 400 "last message role must be 'user'" error.

    Parameters
    ----------
    messages:
        The full conversation history from ``state["messages"]``.

    Returns
    -------
    list[BaseMessage]
        A copy of *messages* with any trailing ``AIMessage`` entries removed.
    """
    trimmed = list(messages)
    while trimmed and isinstance(trimmed[-1], AIMessage):
        trimmed.pop()
    return trimmed


async def response_formatter_node(state: AgentState) -> AgentState:
    """
    LangGraph node: generate the final assistant response via Groq.

    The node:
    1. Loads the language-appropriate system prompt.
    2. Optionally prepends a ``[Context]`` block if RAG results are present.
    3. Strips any trailing AIMessages from the history so the LLM always
       receives a conversation ending with a user message (required by the
       Groq / OpenAI API).
    4. Invokes Groq with ``ainvoke`` (non-streaming; streaming is handled at
       the WebSocket layer).
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

    # Call Groq — non-streaming (streaming handled at WebSocket layer)
    response = await _llm.ainvoke(llm_messages)

    new_messages = list(state["messages"]) + [AIMessage(content=response.content)]
    return {**state, "messages": new_messages}
