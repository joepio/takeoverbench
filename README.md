# TakeOverBench

_Status: WIP, pre-alpha_

AI Safety benchmark for LLMs, testing capabilities toward loss-of-control risks.

Specifically, we focus on:

- Long term planning
- Self-replication & cybersecurity
- Tool use

## Running

```sh
# Clone the repo
git clone https://github.com/pauseai/takeoverbench.git
cd takeoverbench

# Create a .env file from the template, fill in your API keys
cp template.env .env

# Install dependencies
pip install inspect-ai cua-agent[all]
# Possibly also model providers like openai, anthropic, etc.

# Run the benchmark using AISI's Inspect cli
inspect eval
```
