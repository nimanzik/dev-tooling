# Agent guide for Python projects

## Commands

- **Linting**: `uv run ruff check --fix src/`
- **Formatting**: `uv run ruff format src/`
- **Type checking**: `uv run ty check src/` (DO NOT use mypy)
- **Testing all**: `uv run pytest tests -v`
- **Testing single**: `uv run pytest tests/path/to/test_file.py::test_function_name -v`
- **Cleaning up**: `just clean` (removes cache directories)

## Code style

- **Python**: line length 88, double quotes everywhere
- **Imports**: Use `from __future__ import annotations`; `TYPE_CHECKING` block for type-only imports;
- **Types**: Strict typing required (`disallow_untyped_defs=true`); use `NDArray`, `Self`, type unions with `|`
- **Docstrings**: NumPy style convention, max doc length 79 chars
- **Error handling**: Custom exceptions in `aikit.exceptions`; use typed exception classes
- **Naming**: `snake_case` for functions/variables, `PascalCase` for classes, `UPPER_CASE` for constants
- **Models**: Pydantic v2 BaseModel or SQLModel for data validation
- **Pre-commit**: Runs ruff check + format; no commits to main branch allowed

## Code testing standards

- Write all Python tests using `pytest`. DO NOU use `unittest`
- Use descriptive function names starting with `test_`
- Prefer fixtures over setup/teardown methods
- Use assert statements directly, not `self.assertEqual`

## Markdown standards

- Always run `markdownlint` on any markdown files created or edited.
- If `markdownlint-cli` is not installed, DO NOT install it by yoursef. Ask me, so I will install it.
- Fix all linting issues before completing the task.

## Notes
- Use `uv` for all Python commands (not pip/poetry).
- DO NOT add any dependencies by yoursef. Ask me, so I will install them.
- All type hints must be complete and accurate.
- Tests under `tests/` mirror `src/<project-name>/` structure.
