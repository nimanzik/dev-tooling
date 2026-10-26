# Coding agent guide for Python projects

## Commands

- Run every Python command through `uv`.
- **Linting**: `uvx ruff check --fix .`
- **Formatting**: `uvx ruff format .`
- **Type checking**: `uvx ty check src/`
- **Testing all**: `uv run pytest tests -v --tb=short`
- **Testing single**:
  `uv run pytest tests/path/to/test_file.py::test_function_name -v --tb=short`
- **Cleaning up**: `just clean` (removes cache directories)

## Dependencies

- Ask the user before adding any dependency; the user adds it to the project.

## Code style

- **Imports**:
  - Use `from __future__ import annotations` if needed.
  - Use `TYPE_CHECKING` block for type-only imports.
- **Types**:
  - Every function has complete, accurate type hints.
  - Use `NDArray`, `Self`, type unions with `|`.
  - Use built-in generics (`list`, `dict`) and abstract collection types from
    `collections.abc` where possible.
- **Docstrings**:
  - Use NumPy style convention, max doc length 79 chars.
  - Use "or" instead of `|` in parameter type descriptions.
  - Prioritise clarity over brevity.
  - Use British English spelling (e.g., "modelling", "optimise", "colour").
- **Naming**:
  - Write words in full; abbreviate only when the full name would be
    ridiculously long.
- **Logs and error messages**:
  - Use typed exception classes.
  - Begin messages with capital letter, no ending period.
  - Progress actions should end with `...`, e.g. "Loading data...".
  - In-text names should be quoted.
- **Data validation models**: Pydantic v2 `BaseModel` or `SQLModel`.
- **DataFrame operations**: always use `polars`.

## Code testing standards

- Write all Python tests using `pytest`.
- Tests should be placed in a `tests/` directory at the root of the project.
- If a module contains submodules, create a corresponding subdirectory as
  `tests/test_<module-name>/` and place tests for submodules there.
- Prefer fixtures over setup/teardown methods.

## Git

- Read-only git operations (`git status`, `git diff`, `git log`, `git show`)
  need no approval.
- **Commits**:
  - Use Conventional Commit messages (feat, fix, docs, test etc.).
  - Commit unrelated changes separately, in logical groups.
  - Show the commit plan (files and messages per commit) and wait for
    approval before running `git add` or `git commit`.
  - Commit to a feature branch; `main` is protected.

## High-impact actions (explicit approval required)

- Before running any high-impact command, ask for explicit approval in the
  same thread and wait.
- This confirmation template can be used:
  `I am ready to run: <exact command>. Reply with: APPROVE: <exact command>`.
- If approval is ambiguous, missing, or does not match the command, stop and
  do not run it.
- If unsure whether an action is high-impact, treat it as high-impact.

High-impact commands include:

- `git push` (any remote branch)
- `gh pr create`, `gh pr edit`, `gh pr merge`, `gh pr close`
- `git config` (local or global)
- Destructive git operations (`--force`, `reset --hard`, branch/tag deletion,
  history rewrites)

Default stop point when unclear: complete local edits only and ask before any
network or git state-changing action.

## Markdown standards

- ALWAYS run `markdownlint` on markdown files that are created or edited.
- If `markdownlint-cli` is not installed, ask user to install it.
- Fix all linting issues before completing the task.
