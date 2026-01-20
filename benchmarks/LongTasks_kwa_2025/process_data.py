def infer_org_from_name(name: str) -> str:
    """Infer organization from model name."""
    name_lower = name.lower()
    if "gpt" in name_lower or "davinci" in name_lower:
        return "OpenAI"
    elif "claude" in name_lower:
        return "Anthropic"
    elif "gemini" in name_lower:
        return "Google"
    elif "deepseek" in name_lower:
        return "DeepSeek"
    elif "grok" in name_lower:
        return "xAI"
    elif "qwen" in name_lower:
        return "Alibaba"
    elif "o1" in name_lower or "o3" in name_lower or "o4" in name_lower:
        return "OpenAI"
    else:
        return "Unknown"

def calculate_stderr(ci_low: float, ci_high: float) -> float:
    """Calculate standard error from 95% CI bounds.

    Args:
        ci_low: Lower bound of 95% CI
        ci_high: Upper bound of 95% CI

    Returns:
        Standard error
    """
    # For 95% CI, stderr ≈ (upper - lower) / (2 * 1.96)
    return (ci_high - ci_low) / (2 * 1.96)
