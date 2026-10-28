# 01: Restore the prompt-editor tests

**What to build:** Restore executable model-picker tests for the prompt-editor
extension so later fixes can be checked against the existing behaviour.
This ticket addresses audit finding 7: evaluating an undefined `pickerSource`
currently crashes the test file before any tests run.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [x] Load the model-picker source before evaluating it. Test startup no longer
  fails with an undefined-source error.
- [x] With Pi dependencies available, all existing model-picker tests execute
  and pass, including selection, cancellation, searching, and terminal resizing.
- [x] Without Pi dependencies, tests skip cleanly without evaluating code that
  requires unavailable dependencies.
- [x] Record the test command and result so subsequent tickets can repeat it.

## Comments

The test loader now reads the picker function from the local extension before
evaluating it. Loading and evaluation run only when Pi TUI is available.
Production code and existing test assertions are unchanged.

Run from the repository root with Node.js v26.12.1 and the installed Pi packages:

```sh
NODE_PATH=/home/nima/.pi/agent/install/releases/1.4.0/node_modules \
  node --test agents/pi/tests/prompt-editor.test.mjs
```

Result: all five tests pass, including selection, cancellation, search, and
terminal resizing. Node reports its experimental TypeScript stripping warning.

Run without Pi packages:

```sh
env -u NODE_PATH node --test agents/pi/tests/prompt-editor.test.mjs
```

Result: all five tests skip with the dependency message, and the process exits
successfully without evaluating the picker.

`node --check agents/pi/tests/prompt-editor.test.mjs` also passes. No TypeScript
compiler or project type-check configuration is available for this test suite.
