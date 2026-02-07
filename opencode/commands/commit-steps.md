---
description: Create organised commits by grouping related changes
---
Commit the current changes step by step

Steps:

1. Analyse all changes. For example, use:
   - Files changed: !`git status --porcelain`
   - Detailed diff: !`git diff`
2. If no changes, report "No changes to commit" and stop
3. Group related changes logically (config, docs, features, tests, etc.)
4. Show me a plan with proposed commits and files in each group
5. Wait for my explicit approval (e.g., "yes", "proceed", "lgtm", "go ahead", "approve" etc.)
6. Create separate commits for each group using conventional commit format
7. Show a summary: !`git log --oneline -5`
