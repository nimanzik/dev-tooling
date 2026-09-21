---
name: commit
description: "MANDATORY before any git commit. Commit only; never push unless explicitly requested in the current turn."
---

# Git Commit with Conventional Commits

Create a git commit for the current changes using a concise Conventional
Commits-style subject.

## Execution Boundary (Strict)

- Default stop point is: commit created locally.
- Do NOT run `git push` unless the user explicitly asks to push in the current turn.
- Do NOT create, edit, or view PRs unless explicitly asked in the current turn.
- If request is ambiguous (e.g., "ship this", "submit this"), ask:
  "Do you want me to stop after commit, or also push?"

## Format (header)

`<type>(<scope>): <description>`

- `type` is REQUIRED. Use `feat` for new features, `fix` for bug fixes etc.
  See the following section for a list of commit types.
- `scope` is OPTIONAL. Short noun in parentheses for the affected area (e.g.,
  `api`, `parser`, `ui`).
- `description` is REQUIRED. Short, present tense, imperative.
- Header must be maximum 50 characters, no trailing period.

## Commit Types

| Type       | Purpose                        |
| ---------- | -------------------------------|
| `feat`     | New feature                    |
| `fix`      | Bug fix                        |
| `docs`     | Documentation only             |
| `style`    | Formatting/style (no logic)    |
| `refactor` | Code refactor (no feature/fix) |
| `perf`     | Performance improvement        |
| `test`     | Add/update/refactoring tests   |
| `build`    | Build system/dependencies      |
| `ci`       | CI/config changes              |
| `chore`    | Maintenance/misc               |
| `revert`   | Revert commit                  |

## Notes

- Body is OPTIONAL. If needed, add a blank line after the subject and write
  short paragraphs.
- Do NOT include breaking-change markers or footers.
- Do NOT add sign-offs (no `Signed-off-by`).
- Before committing, explicitly state intended files and commit message and
  wait for approval.
- If user requested commit but did not clearly request push, stop after commit
  and report: "Committed locally. I did not push."
- Treat "open PR", "create PR", "submit PR" as separate actions requiring
  explicit instruction.
- If it is unclear whether a file should be included, ask the user which
  files to commit.
- If commit fails due to hooks, fix and create NEW commit (do not amend).
- Treat any caller-provided arguments as additional commit guidance. Common
  patterns:
  - Free-form instructions should influence scope, summary, and body.
  - File paths or globs should limit which files to commit. If files are
    specified, only stage/commit those unless the user explicitly asks
    otherwise.
  - If arguments combine files and instructions, honor both.

## Steps

1. Parse user intent and classify allowed actions: commit-only vs commit+push
   vs PR actions.
2. If push/PR intent is not explicit, set boundary to commit-only.
3. Review `git status --porcelain`, `git diff --staged` (if staged), and
   `git diff` (if nothing staged) to understand current changes (limit to
   argument-specified files if provided).
4. Propose exact files to stage and commit subject/body; wait for explicit
   approval.
5. Stage only intended files. If no files specified, stage all files only if
   it clearly matches user intent.
6. Run `git commit -m "<subject>"` (and `-m "<body>"` if needed).
7. Report commit hash and stop.
8. If (and only if) user explicitly requested push, ask final confirmation if
   target remote/branch is ambiguous, then push.

## Best Practices

- One logical change per commit: group related changes logically (docs,
  features, tests etc).
- Show user a plan with proposed commits and files, and wait for explicit.
  approval ("yes", "proceed", "lgtm").
- Present tense: "add" not "added".
- Imperative mood: "fix bug" not "fixes bug".
- Reference issues when relevant: `Closes #123`, `Refs #456`.

## Quick Intent Examples

- "Commit these changes" → commit only, no push.
- "Commit and push to my fork branch X" → commit, then push to X.
- "Prepare contribution" → ask whether to stop at commit, push, or PR.

## Git Safety Protocol

- NEVER run `git config` (local or global) unless user explicitly requests
  that exact action.
- NEVER push without explicit request in the current turn.
- NEVER perform any GitHub PR action (`gh pr create/edit/view`) unless
  explicitly requested in the current turn.
- If identity is missing for commit, stop and ask user how to proceed; do not
  set identity yourself.
- NEVER force push to main/master branch.
- NEVER run destructive commands (`--force`, hard reset) without explicit
  request.
- NEVER commit secrets (`.env`, `credentials.json`, private keys).
- NEVER skip hooks (`--no-verify`) unless user asks.
