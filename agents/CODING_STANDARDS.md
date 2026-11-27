# Python coding standards

## Types

- Every function has complete, accurate type hints.
- Use `NDArray`, `Self`, and type unions with `|`.
- Use built-in generics (`list`, `dict`) and abstract collection types from
  `collections.abc` where possible.
- Put type-only imports in a `TYPE_CHECKING` block (add
  `from __future__ import annotations` on Python < 3.14), except types
  needed at runtime by Pydantic or SQLModel.

## Docstrings

- Use NumPy style, max line length 79 chars.
- Use "or" instead of `|` in parameter type descriptions.
- Use British English spelling (e.g., "modelling", "optimise", "colour").

## Naming

- Write words in full; abbreviate only when the full name would be
  ridiculously long.

## Logs and error messages

- Raise specific or custom exception subclasses instead of bare `Exception`.
- Begin messages with a capital letter, no ending period.
- End progress actions with `...`, e.g. "Loading data...".
- Quote in-text names, e.g. "Column 'id' not found".

## Libraries

- **Data validation models**: Pydantic (SQLModel for database-backed models).
- **DataFrame operations**: `polars`.

## Boundaries

- Validate external data where it enters the program, with the validation
  library from Libraries that fits its shape. Branch on validated values,
  never on the truthiness of raw parsed data, so malformed input fails
  loudly.
- Validate settings at startup, so an invalid value stops the program
  instead of failing each request.

## Tests

- Place tests in `tests/` at the project root, mirroring the source layout
  without the package directory: `src/my_package/api/client.py` is tested by
  `tests/api/test_client.py` (include package directories only when `src/`
  has multiple packages).
- Split into `tests/unit/`, `tests/integration/`, and `tests/e2e/` when a
  project has distinct test tiers, mirroring the source layout inside
  `tests/unit/`. Small projects can use a flat `tests/`.
- Keep shared fixtures in `tests/conftest.py`, narrower fixtures in
  subdirectory `conftest.py` files, and static test data in `tests/data/`.
- Group tests for the same function or class in a `Test<Name>` class, even
  when it has a single test (plain class, no `__init__`); share setup through
  fixtures.
- When the code compares test data with the current time (retention,
  "last 24 hours"), build that data from the current time, so the test
  cannot pass or fail because of the calendar. A fixed dataset that the
  code never compares with the current time keeps its fixed dates.
- Test a boundary with data on both sides of it, chosen so that checking the
  wrong field or the wrong side fails the test.
- An assertion over a collection, such as `all()` or `any()`, also checks the
  collection's size or exact contents, so an empty result fails.
