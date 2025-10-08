# Agent Guide for aikit

## Commands
- **Lint**: `uv run ruff check --fix src/`
- **Format**: `uv run ruff format src/`
- **Typecheck**: `uv run ty check src/`
- **Test all**: `uv run pytest tests -v`
- **Test single**: `uv run pytest tests/path/to/test_file.py::test_function_name -v`
- **Clean**: `just clean` (removes cache directories)

## Code Style
- **Python**: 3.12+, line length 88, double quotes everywhere
- **Imports**: Use `from __future__ import annotations`; TYPE_CHECKING block for type-only imports; absolute imports from `aikit`
- **Types**: Strict typing required (`disallow_untyped_defs=true`); use `NDArray`, `Self`, type unions with `|`
- **Docstrings**: NumPy style convention, max doc length 79 chars
- **Error handling**: Custom exceptions in `aikit.exceptions`; use typed exception classes
- **Naming**: snake_case for functions/variables, PascalCase for classes, UPPER_CASE for constants
- **Models**: Pydantic v2 BaseModel or SQLModel for data validation
- **Pre-commit**: Runs ruff check + format; no commits to main branch allowed

## Notes
- Use `uv` for all Python commands (not pip/poetry)
- All type hints must be complete and accurate
- Tests under `tests/` mirror `src/aikit/` structure
