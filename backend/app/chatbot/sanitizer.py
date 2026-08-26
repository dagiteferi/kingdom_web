
from __future__ import annotations

import re

# ---------------------------------------------------------------------------
# Basic cleanup
# ---------------------------------------------------------------------------

# Control characters U+0000–U+001F, excluding tab (\t), newline (\n), CR (\r)
_CONTROL_CHAR_RE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f]")

_MAX_LENGTH = 2000

# ---------------------------------------------------------------------------


_INJECTION_PATTERNS: list[re.Pattern[str]] = [
    # "ignore / disregard / forget [previous / above / all] instructions"
    re.compile(
        r"\b(ignore|disregard|forget|bypass|override)\b.{0,40}"
        r"\b(previous|prior|above|all|system|original)\b.{0,40}"
        r"\b(instructions?|prompts?|rules?|guidelines?|constraints?)\b",
        re.IGNORECASE | re.DOTALL,
    ),
    # "you are now / act as / pretend to be / roleplay as"
    re.compile(
        r"\b(you\s+are\s+now|act\s+as|pretend\s+(to\s+be)?|roleplay\s+as"
        r"|behave\s+as|simulate|impersonate)\b",
        re.IGNORECASE,
    ),
    # "new instructions / new system prompt / new role"
    re.compile(
        r"\b(new|updated?|revised?|different)\b.{0,20}"
        r"\b(instructions?|system\s+prompt|role|persona|directive)\b",
        re.IGNORECASE,
    ),
    # "repeat / print / reveal / output your (system) prompt / instructions"
    re.compile(
        r"\b(repeat|print|reveal|show|output|display|tell\s+me|what\s+(is|are))\b"
        r".{0,30}"
        r"\b(system\s+prompt|your\s+instructions?|your\s+rules?|your\s+prompt"
        r"|initial\s+prompt|original\s+prompt)\b",
        re.IGNORECASE | re.DOTALL,
    ),
    # DAN / jailbreak trigger words
    re.compile(
        r"\b(DAN|jailbreak|do\s+anything\s+now|developer\s+mode"
        r"|god\s+mode|unrestricted\s+mode|no\s+restrictions?)\b",
        re.IGNORECASE,
    ),
    # Delimiter injection: ### SYSTEM, [SYSTEM], <system>, --- NEW ---
    re.compile(
        r"(#{2,}|<{1,2}|\[{1,2}|-{3,}|={3,})\s*(system|instruction|prompt|role|override)",
        re.IGNORECASE,
    ),
    # "From now on / starting now / as of now [you will / your role]"
    re.compile(
        r"\b(from\s+now\s+on|starting\s+now|as\s+of\s+now|henceforth)\b"
        r".{0,30}\b(you\s+will|your\s+(new\s+)?role|you\s+must|you\s+are)\b",
        re.IGNORECASE | re.DOTALL,
    ),
    # Instruction injection via code-block delimiters
    re.compile(r"```\s*(system|instruction|prompt)", re.IGNORECASE),
    # "End of conversation / end system prompt — now do X"
    re.compile(
        r"\b(end\s+(of\s+)?(conversation|system\s+prompt|instructions?))\b",
        re.IGNORECASE,
    ),
]

# Safe fallback reply when injection is detected (returned instead of the
# injected text so the LLM never sees the malicious content).
_INJECTION_BLOCKED_MSG = "[Message blocked: invalid input]"


def _contains_injection(text: str) -> bool:
    """Return True if *text* matches any known injection pattern."""
    for pattern in _INJECTION_PATTERNS:
        if pattern.search(text):
            return True
    return False


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def sanitize_input(text: str) -> str:
    """
    Sanitize a user chat message before passing it to the LLM agent.

    Steps applied in order:
    1. Strip leading/trailing whitespace.
    2. Truncate to 2 000 characters.
    3. Remove null bytes and control characters (U+0000–U+001F) except
       ``\\t``, ``\\n``, and ``\\r``.
    4. Detect prompt injection attempts.  If an attempt is found, replace
       the entire message with a safe blocked-message placeholder so the
       LLM never processes the injected content.

    Parameters
    ----------
    text:
        Raw user input string.

    Returns
    -------
    str
        Cleaned string safe to pass to the agent pipeline.  An empty string
        is returned for blank input; a blocked-message placeholder is
        returned when an injection attempt is detected.
    """
    # 1. Strip whitespace
    text = text.strip()
    if not text:
        return ""

    # 2. Truncate
    text = text[:_MAX_LENGTH]

    # 3. Remove disallowed control characters
    text = _CONTROL_CHAR_RE.sub("", text)

    # 4. Prompt injection guard
    if _contains_injection(text):
        import structlog
        structlog.get_logger(__name__).warning(
            "prompt_injection_attempt_blocked",
            preview=text[:120],
        )
        return _INJECTION_BLOCKED_MSG

    return text
