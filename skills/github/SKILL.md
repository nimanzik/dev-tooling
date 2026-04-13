---
name: github
description: "Interact with GitHub using the `gh` CLI. Use `gh issue`, `gh pr`, `gh run`, and `gh api` for issues, PRs, CI runs, and advanced queries."
---

# GitHub Skill

Use the `gh` CLI to interact with GitHub. Always specify `--repo owner/repo` when not in a git directory, or use URLs directly.

## Safety Defaults for Fork Contributions

When helping with open-source contributions from a fork, default to a conservative flow:

1. Create/switch to a branch.
2. Make requested changes.
3. Commit.
4. Push to the user's fork remote.
5. Stop and report status.

### PR Action Approval Gate (Required)

For fork workflows, you MUST NOT run PR-mutating commands unless the user explicitly asks for that action in the current request.

- Disallowed without explicit approval:
  - `gh pr create`
  - `gh pr edit`
  - `gh pr merge`
  - any equivalent PR-creating or PR-editing API calls via `gh api`
- If intent is ambiguous, ask a clarifying question and wait.

### Target Confirmation (Required Before PR Actions)

Before any approved PR action, state the exact source and target, for example:
- head: `myfork:feature-branch`
- base: `upstream:main`

Then proceed only after explicit user confirmation.

### Examples

Prepare contribution only (default):
```text
Done: branch created, changes committed, pushed to fork.
Stopping here. If you want, I can create a PR to upstream next.
```

Create PR (only after explicit request):
```bash
gh pr create --repo upstream-owner/repo --head myfork:feature-branch --base main
```

## Pull Requests

Check CI status on a PR:
```bash
gh pr checks 55 --repo owner/repo
```

List recent workflow runs:
```bash
gh run list --repo owner/repo --limit 10
```

View a run and see which steps failed:
```bash
gh run view <run-id> --repo owner/repo
```

View logs for failed steps only:
```bash
gh run view <run-id> --repo owner/repo --log-failed
```

## API for Advanced Queries

The `gh api` command is useful for accessing data not available through other subcommands.

Get PR with specific fields:
```bash
gh api repos/owner/repo/pulls/55 --jq '.title, .state, .user.login'
```

## JSON Output

Most commands support `--json` for structured output.  You can use `--jq` to filter:

```bash
gh issue list --repo owner/repo --json number,title --jq '.[] | "\(.number): \(.title)"'
```
