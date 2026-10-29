#!/usr/bin/env bash
# Run it with Bash, stopping on the first failure.
# Usage: bash -e pi-extensions.sh
set -e

# Git sources use HTTPS and do not require GitHub SSH access.
# GitHub SSH access is required for SSH sources such as git:git@github.com/OWNER/REPO.
pi install https://github.com/DietrichGebert/ponytail
pi install https://github.com/earendil-works/pi-voice
pi install https://github.com/earendil-works/pi-review-loop
pi install https://github.com/earendil-works/pi-review
pi install https://github.com/dodo-reach/pi-clarify
pi install https://github.com/dbachelder/pi-btw
pi install https://github.com/nicobailon/visual-explainer
pi install https://github.com/tintinweb/pi-subagents.git
pi install npm:@ff-labs/pi-fff
pi install npm:@plannotator/pi-extension
pi install npm:pi-simplify
pi install npm:pi-web-access
pi install npm:pi-intercom
pi install npm:pi-cached-compaction
