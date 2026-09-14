default:
    @just --list

clean:
    @find . -type d -name "__pycache__" -exec rm -rf {} +
    @find . -type d -name ".pytest_cache" -exec rm -rf {} +
    @find . -type d -name ".ruff_cache" -exec rm -rf {} +

uv_quality_options := "--frozen --isolated --no-dev --group quality"
uv_test_options := "--frozen --isolated --no-dev --group test --extra torch-cpu"
uv_example_options := "--frozen --isolated --no-dev --group examples --extra torch-cpu"
pytest_options := "-v --tb=short"

lint:
    @uv run {{ uv_quality_options }} ruff check --fix

lint-check:
    @uv run {{ uv_quality_options }} ruff check

format:
    @uv run {{ uv_quality_options }} ruff format

format-check:
    @uv run {{ uv_quality_options }} ruff format --check

typecheck:
    @uv run {{ uv_quality_options }} --group examples --group test --extra torch-cpu ty check

example epochs="1000":
    @uv run {{ uv_example_options }} python examples/monthly_sunspots.py \
        --epochs "{{ epochs }}"

example-check:
    @uv run {{ uv_example_options }} \
        python examples/monthly_sunspots.py --epochs 1 --no-show

test python_version="3.13":
    @uv run {{ uv_test_options }} --python "{{ python_version }}" \
        pytest -m "not legacy_tf" -rs {{ pytest_options }} tests/

test-parity python_version="3.13":
    @uv run {{ uv_test_options }} --group parity --python "{{ python_version }}" \
        pytest -m "legacy_tf" -rs {{ pytest_options }} tests/

build-check python_version="3.13":
    @rm -rf dist/
    uv build --python "{{ python_version }}"
    uv run --frozen --isolated --no-dev --group build --python "{{ python_version }}" \
        twine check dist/*
