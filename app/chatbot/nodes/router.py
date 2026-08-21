"""
Heaven on Earth CMS Backend — Intent Router Node

Classifies the user's intent via Groq LLM when the conversation is idle or
when the user signals they want to exit an active flow.

References
----------
- Req §7 (LangGraph Agent Graph), acceptance criteria 7.1–7.3
- Design § "LangGraph Agent Graph" → Node Responsibilities table
"""

from __future__ import annotations

import re

from langchain_core.messages import HumanMessage
from langchain_groq import ChatGroq

from app.chatbot.session import AgentState
from app.config import settings

# ---------------------------------------------------------------------------
# Exit keywords — any of these in the user message ends an active flow
# ---------------------------------------------------------------------------
_EXIT_PATTERN = re.compile(r"\b(cancel|stop|exit|quit)\b", re.IGNORECASE)

# ---------------------------------------------------------------------------
# Intent classification prompt
# ---------------------------------------------------------------------------
_CLASSIFICATION_PROMPT = """You are an intent classifier for a church chatbot.
Classify the user message into exactly ONE of these intents:
- testimony (user wants to share a personal testimony)
- prayer (user wants to submit a prayer request)
- partnership (user wants to explore partnership or give financially)
- qa (user is asking a question about the church)
- unknown (unclear or off-topic)

Respond with ONLY one word from the list above. No punctuation, no explanation.

User message: {message}
Intent:"""


def intent_router_node(state: AgentState) -> AgentState:
    """
    LangGraph node: route the conversation based on detected user intent.

    If an action flow is currently active (``state["flow"] != "idle"``) and
    the user has NOT typed an exit keyword, the intent is kept equal to the
    active flow name (continuing slot-filling).

    Otherwise the last user message is sent to Groq ``llama-3.1-8b-instant``
    for zero-shot intent classification, and the result is stored in
    ``state["intent"]``.

    Parameters
    ----------
    state:
        Current agent state.

    Returns
    -------
    AgentState
        Updated state with ``intent`` set.
    """
    # Find the last human message
    last_user_content = ""
    for message in reversed(state["messages"]):
        if isinstance(message, HumanMessage):
            last_user_content = str(message.content)
            break

    current_flow = state.get("flow", "idle") or "idle"

    # If in an active flow and no exit keyword → continue the flow
    if current_flow != "idle" and not _EXIT_PATTERN.search(last_user_content):
        return {**state, "intent": current_flow}

    # Otherwise → classify with Groq
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=settings.groq_api_key,
        temperature=0,
    )

    prompt = _CLASSIFICATION_PROMPT.format(message=last_user_content)
    response = llm.invoke(prompt)
    raw_intent = str(response.content).strip().lower()

    # Normalise to one of the valid intents
    valid_intents = {"testimony", "prayer", "partnership", "qa", "unknown"}
    intent = raw_intent if raw_intent in valid_intents else "unknown"

    # If user typed an exit keyword, reset the flow to idle
    new_flow = "idle" if _EXIT_PATTERN.search(last_user_content) else current_flow

    return {**state, "intent": intent, "flow": new_flow}
