# dev-tooling

A collection of reusable configuration files and CI/CD setups for Python projects,
covering developer tooling, CI pipelines, and Docker workflows.

## Contents

### Python Code Quality

- `astral/ruff.toml`: `ruff` linter and formatter configuration
  - NumPy-style docstrings
  - Type checking rules enabled
  - ...
- `mypy/mypy.ini`: `mypy` type checker configuration
  - Strict type checking enabled
  - Pydantic and NumPy plugins configured
  - ...
- `prek/.pre-commit-config.yaml`: Pre-commit hooks and tooling

### CI/CD Pipelines

- `gitlab/.gitlab-ci.yml`: GitLab CI pipeline
  - Multi-stage pipeline (lint-format, type-check, test)
  - Optimized caching with `uv`
- `github/workflows/ci.yml`: GitHub Actions workflow
  - Runs linting, formatting, type checking, and tests
  - Uses `uv` for fast dependency management

### Docker

- `docker/Dockerfile`: Multi-stage Python container
  - Uses `uv` for dependency management
  - Optimized layer caching
  - Includes Streamlit application setup
- `docker/compose.yaml`: Docker Compose configuration for dashboard service
- `docker/.dockerignore`: Docker ignore rules

### Development Tools

- `just/.justfile`: Just command runner recipes
  - Remove cache directories
  - Run `ruff` linter with auto-fix
  - Format code with `ruff`
  - Run `ty` type checker
  - Run `pytest` tests
