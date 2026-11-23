---
name: release-management
description: Prepare package releases with Keep a Changelog and Semantic Versioning. Use when recording unreleased user-facing changes, selecting or bumping a version, preparing a release commit or tag, or publishing a package.
---

# Release management

Manage releases as a sequence of explicit states. Unreleased work stays under
`Unreleased` until the release commit is being prepared. A published package
comes from a clean commit carrying its release tag.

## Establish the release state

First, classify the request:

1. **Record work** updates the changelog without preparing a release.
2. **Prepare release** chooses a version and updates release files.
3. **Create release** commits and tags the prepared release.
4. **Publish release** publishes the clean tagged commit.

Inspect the package manifest, changelog, lockfile, repository status, existing
tags, and available project scripts before making changes. Use the repository's
actual commands rather than copying commands from this skill.

Finish this step when the current package version, next release state, affected
release files, and required checks are known.

## Record unreleased work

Use a Keep a Changelog structure:

```md
# Changelog

## Unreleased

### Added

- Added mouse support to picker menus.

### Fixed

- Prevented picker overflow in terminals under ten rows.

## 0.1.1 - 2026-03-01

### Fixed

- Made Mode picker navigation wrap between options.
```

Use only the categories that apply:

- `Added`
- `Changed`
- `Deprecated`
- `Removed`
- `Fixed`
- `Security`

Write entries for changes users can notice. Use clear user-facing language, not
commit subjects or implementation notes. Leave refactoring, formatting,
test-only changes, and internal cleanup out unless they affect users.

Keep package versions unchanged while recording unreleased work. A version
heading states that a release exists, so create it only during release
preparation.

Finish this step when every relevant user-facing change appears once under
`Unreleased`, the package version is unchanged, and the changelog passes its
formatting checks.

## Select the version

Apply Semantic Versioning to the complete set of unreleased changes:

- **Patch**, such as `0.1.1` to `0.1.2`, covers compatible fixes and small
  improvements.
- **Minor**, such as `0.1.2` to `0.2.0`, covers substantial features and
  incompatible changes while the package is below `1.0.0`.
- **Major**, such as `1.2.0` to `2.0.0`, covers incompatible changes after the
  package reaches `1.0.0`.

Check package-specific versioning rules when the repository documents them.
Explain the chosen increment from the user-visible changes before editing
release files.

Finish this step when one target version accounts for every unreleased entry
and follows the repository's versioning policy.

## Prepare the release

1. Move the release entries from `Unreleased` into a version heading with the
   release date, for example `## 0.1.2 - 2026-03-01`.
2. Keep an empty `Unreleased` section at the top for future work.
3. Update every package manifest that owns or mirrors the released version.
4. Update generated lockfiles with the project's package manager. In an npm
   project, use npm to update `package-lock.json` instead of editing it by hand.
5. Inspect the diff and confirm that package and lockfile versions agree.
6. Run the relevant package tests, repository tests when practical, type
   checking, changelog or Markdown lint, and `git diff --check`.

Keep the release changes together. Do not mix unrelated code changes into the
release preparation diff.

Finish this step when the dated changelog section, package manifests, and
lockfiles agree on the target version, every required check passes, and the
diff contains only the intended release preparation.

## Create the release commit and tag

Follow the repository's commit policy and load its commit skill when one is
available.

1. Commit the version, changelog, and lockfile updates together as the release
   commit.
2. Confirm that the commit contains the prepared files and passed verification.
3. Create a tag that points to that exact commit. Prefer a package-specific tag
   in a multi-package repository, such as `pi-prompt-mode-v0.1.2`.
4. Confirm that `HEAD` is the release commit, the tag resolves to `HEAD`, and the
   working tree is clean.

Obtain explicit approval for the exact commit or tag command when repository
policy requires it. Treat pushing commits and tags as a separate action that
also requires explicit user intent.

Finish this step when one verified release commit contains all release metadata,
the intended tag points to it, and the working tree is clean.

## Publish the release

Publish only from the clean tagged release commit.

Before publishing, confirm all of the following:

- The working tree is clean.
- `HEAD` is the intended release commit.
- The intended release tag points to `HEAD`.
- The changelog heading, package manifest, and lockfile use the same version.
- The package contents are the expected files.
- The registry does not already contain the target version.
- The required verification still passes on the tagged commit.

Run the package manager's publish command only after explicit approval when
publishing is a protected or external action. Report the package name, version,
tag, registry, and publish result.

Finish this step when the registry contains the expected package version from
the tagged commit and the local working tree remains clean.

## Release boundary

Release preparation stops before commit, tag, push, or publish unless the user
requested the next action. Never treat "release", "ship", or "publish" as
permission for every later boundary when repository policy requires separate
approval.
