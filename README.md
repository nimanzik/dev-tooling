# dev-configs

A collection of reusable configuration files and CI/CD setups for Python projects.

## Contents

### Python Code Quality

- **ruff.toml** - Ruff linter and formatter configuration
  - NumPy-style docstrings
  - Type checking rules enabled
  - ...
- **mypy.ini** - Mypy type checker configuration
  - Strict type checking enabled
  - Pydantic and NumPy plugins configured
  - ...

### CI/CD Pipelines

- **gitlab-ci.yml** - GitLab CI pipeline
  - Multi-stage pipeline (lint-format, type-check, test)
  - Optimized caching with `uv`
- **github/workflows/ci.yml** - GitHub Actions workflow
  - Runs linting, formatting, type checking, and tests
  - Uses `uv` for fast dependency management

### Docker

- **Dockerfile** - Multi-stage Python container
  - Uses `uv` for dependency management
  - Optimized layer caching
  - Includes Streamlit application setup
- **compose.yaml** - Docker Compose configuration for dashboard service

### Development Tools

- **.justfile** - Just command runner recipes
  - Remove cache directories
  - Run `ruff` linter with auto-fix
  - Format code with `ruff`
  - Run `ty` type checker
  - Run `pytest` tests
