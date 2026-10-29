# Agent guide

## Commands

- Run every Python command through `uv`: `uv run python ...`
- **Linting**: `uvx ruff check --fix`
- **Formatting**: `uvx ruff format`
- **Type checking**: `uvx ty check`
- **Testing**: `uv run pytest tests -v --tb=short`

## Dependencies

- Ask the user before adding any dependency; the user adds it to the project.

## Python code

- **Writing, reviewing, or testing Python code**: read `CODING_STANDARDS.md`
  first.

## Git

- Read-only git (`status`, `diff`, `log`, `show`) needs no approval.
- Before any commit, load the `commit` skill.
- In Python projects, commit to a feature branch.

## High-impact actions

The following actions need explicit approval of the exact command in the
current turn:

- `git push`, and any `gh pr` action (PRs target the user's fork by default)
- `git config`; if commit identity is missing, ask the user
- `--force`, `reset --hard`, branch or tag deletion, history rewrites

Treat anything uncertain as high-impact. Run only a command whose approval
matches it exactly; otherwise ask again. Default stop point: local edits.

## Markdown

- After editing Markdown, run `markdownlint` and fix every issue. If
  `markdownlint-cli` is missing, ask the user to install it.

## Matt Pocock's skills – Pi delegation compatibility

- For `code-review`, issue both reviewer `Agent` calls in one message with
  `run_in_background: false`, overriding the background default.
- Before delegating `tdd` implementation, obtain the user's seam approval
  and pass the approved seams to each implementer. Implementers must
  request approval through the parent before testing additional seams.
