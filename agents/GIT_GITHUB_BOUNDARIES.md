# Git / GitHub Action Boundaries (Strict)

These rules are mandatory for every repository and task.

## 1) Default stop point

- Unless explicitly instructed otherwise in the current user turn, stop after local changes (or local commit, if requested).
- Do not assume permission for push/PR actions from prior context.

## 2) Commit skill enforcement

- Before any `git commit`, load and follow the `commit` skill.
- If the skill is unavailable, do not commit; ask the user how to proceed.

## 3) Push gate

- Never run `git push` unless the user explicitly says to push in the current turn.
- If intent is ambiguous ("ship", "submit", "finalize"), ask:
  "Should I stop after commit, or also push?"

## 4) PR gate

- Never run `gh pr create`, `gh pr edit`, open PR URLs, or perform any PR action unless explicitly requested in the current turn.
- For fork workflows, default target is user fork only; upstream PR creation always requires explicit approval.

## 5) Git config safety

- Never run `git config` (local or global) unless user explicitly requests that exact action.
- If commit identity is missing, stop and ask the user; do not auto-configure identity.

## 6) Execution transparency

- Before any git/network-impacting action, state a short plan with explicit stop boundary.
- After execution, report exactly what was done and what was intentionally not done.

---

## Operational checklist

Before git actions, verify and state:

- [ ] commit skill loaded (if committing)
- [ ] files to be staged
- [ ] commit message proposal
- [ ] whether push was explicitly requested
- [ ] whether PR action was explicitly requested
