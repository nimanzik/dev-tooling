default:
    @just --list

clean:
    @find . -type d -name "__pycache__" -exec rm -rf {} +
    @find . -type d -name ".pytest_cache" -exec rm -rf {} +
    @find . -type d -name ".ruff_cache" -exec rm -rf {} +

lint:
    @uv run ruff check --fix src/

format:
    @uv run ruff format src/

type-check:
    @uv run ty check src/

test:
    @uv run pytest tests -v
