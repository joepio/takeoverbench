
# Special case mappings. TODO apply these
model_renames = {
    "Claude 4.5 Sonnet": "claude-sonnet-4.5",
    "Claude 4.1 Opus": "claude-opus-4.1",
    "Claude 4 Opus": "claude-opus-4",
    "Claude 4 Sonnet": "claude-sonnet-4",
    "OpenAI o1-preview": "o1-preview",
    "OpenAI o3-mini": "o3-mini", 
    "OpenAI o1-mini": "o1-mini", 
}
# in addition " *†" needs to be r-stripped, spaces converted to '-' and the model names lowercased
