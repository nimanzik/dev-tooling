# Python coding standards

## Imports

- Put type-only imports in a `TYPE_CHECKING` block.

## Types

- Every function has complete, accurate type hints.
- Use `NDArray`, `Self`, and type unions with `|`.
- Use built-in generics (`list`, `dict`) and abstract collection types from
  `collections.abc` where possible.

## Docstrings

- Use NumPy style, max doc length 79 chars.
- Use "or" instead of `|` in parameter type descriptions.
- Use British English spelling (e.g., "modelling", "optimise", "colour").

## Naming

- Write words in full; abbreviate only when the full name would be
  ridiculously long.

## Logs and error messages

- Use typed exception classes.
- Begin messages with a capital letter, no ending period.
- End progress actions with `...`, e.g. "Loading data...".
- Quote in-text names.

## Libraries

- **Data validation models**: Pydantic v2 `BaseModel` or `SQLModel`.
- **DataFrame operations**: `polars`.

## Tests

- Place tests in `tests/` at the project root, mirroring the source layout:
  for a module with submodules, place their tests in
  `tests/test_<module-name>/`.
- Group tests for the same function or class in a `Test<Name>` class, even
  when it has a single test (plain class, no `__init__`); share setup through
  fixtures.
