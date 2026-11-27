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

- **Data validation models**: Pydantic, SQLModel.
- **DataFrame operations**: `polars`.

## Boundaries

- Validate external data where it enters the program, with the validation
  library from Libraries that fits its shape. Branch on validated values,
  never on the truthiness of raw parsed data, so malformed input fails
  loudly.
- Validate settings at startup, so an invalid value stops the program
  instead of failing each request.

## Tests

- Place tests in `tests/` at the project root, mirroring the source layout:
  for a module with submodules, place their tests in
  `tests/test_<module-name>/`. For example, tests for
  `src/pkg/api/app.py` go in `tests/test_pkg/test_api/test_app.py`, and
  tests that drive the whole `pkg` through one entry point go in
  `tests/test_pkg/`.
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
