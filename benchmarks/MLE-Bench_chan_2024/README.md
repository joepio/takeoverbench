# MLE Bench

**Data Source:**

`https://raw.githubusercontent.com/openai/mle-bench/refs/heads/main/README.md`

**Model meta data:**

From local meta data.

**Column used as score metric:**

`All (%)`

**Implemenation notes:**

- Need to combine model and agent name to one field. `df["model"] + " - " + df["agent"]`
