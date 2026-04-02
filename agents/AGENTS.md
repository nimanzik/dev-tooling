# Agent guide for Python projects

## Commands

- **Linting**: `uv run ruff check --fix src/`
- **Formatting**: `uv run ruff format src/`
- **Type checking**: `uv run ty check src/` (DO NOT use mypy)
- **Testing all**: `uv run pytest tests -v --tb=short`
- **Testing single**:
  `uv run pytest tests/path/to/test_file.py::test_function_name -v --tb=short`
- **Cleaning up**: `just clean` (removes cache directories)

## Code style

- **Python**:
  - Line length 88.
  - Use double quotes everywhere.
- **Imports**:
  - Use `from __future__ import annotations`.
  - Use `TYPE_CHECKING` block for type-only imports.
- **Types**:
  - Strict typing required (`disallow_untyped_defs=true`).
  - Use `NDArray`, `Self`, type unions with `|`.
  - DO NOT use deprecated aliases like `typing.List`, `typing.Dict` etc.
  - Use an abstract collection type from `collections.abc` where possible.
  - All type hints must be complete and accurate.
- **Docstrings**:
  - Use NumPy style convention, max doc length 79 chars.
  - Use "or" instead of `|` in parameter type descriptions.
  - When writing docstrings, prioritise clarity over brevity.
  - DO NOT abbreviate words unless it would result in ridiculously long names.
  - Use British English spelling (e.g., "modelling", "optimise", "colour").
- **Logs and error messages**:
  - Use typed exception classes.
  - Begin messages with capital letter, no ending period.
  - Progress actions should end with `...`, e.g. "Loading data...".
  - In-text names should be quoted.
- **Naming**:
  - `snake_case` for functions/variables, `PascalCase` for classes, and
    `UPPER_CASE` for constants.
- **Models**:
  - Pydantic v2 BaseModel or SQLModel for data validation.
- **DataFrame operations**:
  - Always use `polars`. DO NOT use `pandas`.
- **Pre-commit**:
  - Runs ruff check + format.
  - No commits to main branch allowed.

## Code testing standards

- Write all Python tests using `pytest`. DO NOT use `unittest`.
- Tests should be placed in a `tests/` directory at the root of the project.
- If a module contains submodules, create a corresponding subdirectory as
  `tests/test_<module-name>/` and place tests for submodules there.
- Use descriptive function names starting with `test_`.
- Prefer fixtures over setup/teardown methods.
- Use assert statements directly, not `self.assertEqual`.

## Git commits

- Always use conventional commits (feat, fix, chore, docs, build, test, etc.).
- When committing multiple unrelated changes, commit them separately in logical groups.
- Show the plan before committing.

## High-impact actions (explicit approval required)

- Before running any high-impact command, ask for explicit approval in the same
  thread and wait.
- Use this confirmation template:
  `I am ready to run: <exact command>. Reply with: APPROVE: <exact command>`.
- If approval is ambiguous, missing, or does not match the command, do not run
  it.
- If unsure whether an action is high-impact, treat it as high-impact.

High-impact commands include:

- `git push` (any remote/branch)
- `gh pr create`, `gh pr edit`, `gh pr merge`, `gh pr close`
- `git config` (local or global)
- Destructive git operations (`--force`, `reset --hard`, branch/tag deletion,
  history rewrites)

Default stop point when unclear: complete local edits only and ask before any
network or git state-changing action.

## Markdown standards

- Always run `markdownlint` on any markdown files created or edited.
- If `markdownlint-cli` is not installed, DO NOT install it by yoursef. Ask me,
  so I will install it.
- Fix all linting issues before completing the task.

## Notes

- Use `uv` for all Python commands (not pip or poetry).
- DO NOT add any dependencies by yourself without asking. If you need a new
  library, ask user first, and they will add it to the project.
- Do NOT run git operations that change the git state, e.g. `git add`,
  `git commit`, `git push`. You may do ONLY read-only git operations without
  asking, e.g. `git status`, `git diff`, `git show`.
- Always prioritise code quality, readability, and maintainability.
- When in doubt, ask me for clarification.
