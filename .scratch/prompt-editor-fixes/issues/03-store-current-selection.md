# 03: Store the current model and thinking selection

**What to build:** Store or create modes using the model and thinking level
currently active, and keep the displayed mode consistent with manual changes.
This ticket addresses audit finding 3: a cached custom selection can retain
an old thinking level after the user changes it.

**Blocked by:** 01: Restore the prompt-editor tests.

**Status:** resolved

- [x] After a manual model change followed by a thinking change from `high`
  to `off`, storing the selection saves the current model and thinking `off`.
- [x] Both the store command and the mode selector's store action capture
  the latest selection rather than a stale custom selection.
- [x] Adding a mode after manual selection changes also captures the current
  model and thinking level.
- [x] Storing into an existing mode preserves its configured colour.
- [x] A manual thinking change away from the selected mode's settings updates
  the mode indicator to `custom` and requests a render.
- [x] Model and thinking changes made while applying a mode do not incorrectly
  change the resulting mode indicator to `custom`.
- [x] Regression tests cover storing through both interfaces, adding a mode,
  preserving colour, and distinguishing manual changes from mode application.

## Answer

Store commands, selector store actions, and new modes now read the active
model and thinking level instead of a cached custom selection. Existing
mode colours remain unchanged. The supported `thinking_level_select` event
updates the indicator and requests a render for manual changes. Removed the
unused selection cache.

The integration review found that Pi dispatches thinking events without waiting
for delivery, and an earlier handler can delay delivery beyond the application
guard. The extension now retains the effective thinking level after application
and checks the active selection when an event arrives. Delayed intermediate
levels do not change the applied mode to `custom`, including model clamping.
Manual changes away from the effective selection still show `custom`.
Mode application does not wait for thinking handlers.

Validation:

- TDD: command store, selector store, and add mode each failed with stale
  thinking `high` instead of `off`, then passed after their fixes.
- TDD: manual thinking changes first left the indicator at `default`; after
  the event handler, it becomes `custom` and requests a render. Applying a
  mode then retains its named indicator and stores its active selection.
- Integration red: 21 tests passed and one failed because the modes harness
  lacked `getSessionDir()`. Returning an isolated temporary session directory
  restored all 22 tests.
- Delayed-event red: an earlier synchronous no-op handler caused applying
  `fast` to display `custom`. The effective-selection check made it pass.
  Further tests cover delayed intermediate model clamping, application without
  waiting for delivery, no-op setters, clamped setters, and manual changes.
- Combined validation on `ab43e11`: all 25 prompt-editor tests pass with
  `NODE_PATH=/home/nima/.pi/agent/install/releases/1.4.0/node_modules`.
- With `env -u NODE_PATH`: 20 tests pass and five existing picker tests skip
  because their Pi TUI dependency is unavailable. All history tests pass.
- Type-stripped extension module and all three test files pass syntax checks.
  Direct Node syntax checking does not parse this TypeScript module.
- Markdown lint and Git whitespace checks pass.

No terminal drawing or live interactive session was tested. No dependencies
were added.
