# 04: Load recent prompts from the active session directory

**What to build:** Make prompt recall include the newest prompts from earlier
sessions in the active project's session directory, including custom session
directories, without importing unrelated projects' prompts.

This ticket addresses audit findings 5 and 6. Earlier sessions are currently
scanned oldest-first before the prompt limit is applied, and history loading
assumes Pi's default session directory.

**Blocked by:** 01: Restore the prompt-editor tests.

Status: resolved

- [x] For a previous session containing 40 chronological prompts that fit in
  the scanned file tail, load prompts 11 through 40 rather than 1 through 30.
- [x] The editor's recall order remains newest-first after history is merged
  and loaded into the editor.
- [x] Use the active session manager's directory for earlier-session history,
  including when Pi was launched with a custom session directory.
- [x] Exclude the current session file from earlier-session loading while
  retaining the active branch's prompts in current-session history.
- [x] If a custom directory contains sessions from several projects, include
  only sessions whose recorded working directory matches the current project.
- [x] Preserve the existing bounds on file-tail reads and history size, and
  keep earlier-session loading off the immediate editor initialization path.
- [x] Regression tests cover the latest-30 boundary, recall ordering, current
  session exclusion, custom directories, and separation between projects.

## Answer

History now uses `sessionManager.getSessionDir()` and scans each file tail
from newest to oldest. The loader excludes the active session file and checks
the recorded project directory before importing prompts. The active branch
still supplies current-session history immediately.

Project validation reads only the first 16 KiB. Missing, malformed, or larger
headers are skipped. The existing 256 KiB tail, 30 previous prompts, and 100
merged prompts remain bounded.

Added `agents/pi/tests/prompt-editor-history.test.mjs` with five startup tests.
The tests use temporary session files and observe the editor history boundary,
without exercising keyboard handling. Existing modes tests are unchanged.

Validation completed in `/tmp/dev-tooling-history-04`:

- Red: the 40-prompt test recalled 30 through 1 instead of 40 through 11.
  The custom-directory test then failed because history was not loaded.
  The project-isolation test exposed unrelated and invalid-header prompts.
- Green: all 18 prompt-editor tests passed with the installed Pi `NODE_PATH`.
  Without `NODE_PATH`, 13 passed and five existing picker tests skipped because
  `pi-tui` was unavailable. All five history tests passed in both runs.
- Syntax checks passed for the tests and TypeScript after stripping types.
  `git diff --check` and Markdown lint passed.

No dependencies were added. Interactive keyboard behavior was not checked.
