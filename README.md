# dev-tooling

My personalised collection of reusable configuration files, CI/CD pipelines, agent configurations, and custom skills for Python project development and automation.

## Contents

### 📋 Code Quality & Linting

- `astral/ruff.toml`: `ruff` linter and formatter configuration
  - NumPy-style docstrings
  - Type checking rules enabled
  - Line length: 88 characters

- `mypy/mypy.ini`: `mypy` type-checker configuration
  - Strict type checking enabled
  - Pydantic and NumPy plugins configured

- `prek/.pre-commit-config.yaml`: Pre-commit hooks
  - Runs `ruff` check and format automatically before commits

### 🔄 CI/CD Pipelines

- `github/workflows/`: GitHub Actions workflows
  - Multi-stage pipeline: lint-format → type-check → test
  - Uses `uv` for optimised dependency management

- `gitlab/.gitlab-ci.yml`: GitLab CI pipeline
  - Equivalent multi-stage setup for GitLab environments
  - Optimised caching with `uv`

### 🐳 Docker

- `docker/Dockerfile`: Multi-stage Python container
  - Uses `uv` for dependency management
  - Optimised layer caching
  - Supports Streamlit applications

- `docker/compose.yaml`: Docker Compose configuration
  - Dashboard service set-up

- `docker/.dockerignore`: Docker ignore rules

### 🛠️ Development Tools

- `just/.justfile`: Just command runner recipes
  - `clean`: Remove cache directories (`__pycache__`, `.pytest_cache`, etc.)
  - `lint`: Run `ruff check` with auto-fix
  - `format`: Format code with `ruff`
  - `type-check`: Run `mypy` type-checker
  - `test`: Run `pytest` test suite

### 👥 Agents

- [`agents/AGENTS.md`](agents/AGENTS.md): Agent guidelines and standards for Python projects
  - Code style conventions (Python, imports, types, docstrings)
  - Testing standards with pytest
  - Git commit conventions
  - High-impact action approval requirements
  - Development workflow rules

- [`agents/copilot/`](agents/copilot/): Copilot agent configuration
  - `mcp-config.json`: MCP server configuration

- [`agents/opencode/`](agents/opencode/): OpenCode agent configuration
  - Agent definitions and command workflows
  - Code reviewer and documentation writer agents

- [`agents/pi/`](agents/pi/): Pi coding agent extensions and themes
  - **Extensions**: Custom TUI tools for agent workflows (answer, btw, context, files, go-to-bed, notify, prompt-editor, review, session-breakdown, todos)
  - **Themes**: Custom visual themes (nightowl)

### 🎓 Skills

Custom skills extend agent capabilities with specialised knowledge and workflows:

- [`alphaxiv-paper-lookup`](skills/alphaxiv-paper-lookup/): Look up arXiv papers on alphaxiv.org for structured AI-generated summaries

- [`commit`](skills/commit/): Git commit with conventional commit message analysis and validation

- [`context7`](skills/context7/): Retrieve up-to-date documentation for software libraries, frameworks, and components

- [`documentation-writer`](skills/documentation-writer/): Diátaxis Documentation Expert for creating high-quality technical documentation

- [`find-skills`](skills/find-skills/): Discover and install agent skills based on user needs

- [`git-commit`](skills/git-commit/): Execute git commits with intelligent staging and conventional commit message generation

- [`github`](skills/github/): Interact with GitHub using the `gh` CLI (issues, PRs, CI runs, advanced queries)

- [`self-improve`](skills/self-improve/): End-of-session retrospective for identifying improvements to agent config, tests, and docs

- [`skill-creator`](skills/skill-creator/): Guide for creating effective skills that extend agent capabilities


