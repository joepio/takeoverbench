
def extract_stderr_from_ci(ci_string: str) -> float | None:
    """Extract standard error from 95% CI string.

    Args:
        ci_string: String like "[0.081, 0.103]"

    Returns:
        Standard error (~ 1/4 of the CI width), or None if parsing fails
    """
    try:
        # Remove brackets and spaces, then split
        ci_string = str(ci_string).strip()
        if ci_string.startswith("[") and ci_string.endswith("]"):
            ci_string = ci_string[1:-1]
        parts = [float(x.strip()) for x in ci_string.split(",")]
        if len(parts) == 2:
            # For 95% CI, stderr ≈ (upper - lower) / (2 * 1.96)
            return (parts[1] - parts[0]) / (2 * 1.96)
    except (ValueError, IndexError):
        pass
    return None
