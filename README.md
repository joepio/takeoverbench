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

# Install dependencies
pip install inspect-ai
# Possibly also model providers like openai, anthropic, etc.

# Run the benchmark using AISI's Inspect cli
inspect eval
```
