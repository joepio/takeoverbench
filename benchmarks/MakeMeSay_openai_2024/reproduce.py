from pathlib import Path
from inspect_evals.makemesay import makemesay

LOGS_BASE_DIR = Path(__file__).parent / "logs"

def run_inspect_evals(*args, **kwargs):
    # mostly to provide default commands and specify log dir name using current datestamp
    # should call the eval() or the eval_set function of Inspect AI. 3 to 10 lines of code.
    raise NotImplementedError("TODO")
    ...

def main():
    tasks = [makemesay]
    run_inspect_evals(tasks, LOGS_BASE_DIR, 
                      model_roles={"judge": "openrouter/openai/gpt-4o",
                                   "manipulatee": "openrouter/openai/gpt-4o"
                                   })


if __name__ == "__main__":
    main()

