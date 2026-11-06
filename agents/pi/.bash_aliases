# A bash compatible file to store aliases needed by Pi.
# To config Pi to enable alias expansion, add this line to Pi's settings.json:
# "shellCommandPrefix": "shopt -s expand_aliases\nsource ~/.bash_aliases"

# Prompt before any removal and overwrite
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Some ls aliases
alias ll='ls -lF'
alias la='ls -lFA'
alias l='ls -CF'
alias l1='ls -1F'

# Some git aliases
alias gs='git status --short'
alias gsb='git status --short --branch'
alias gd='git diff'
alias gds='git diff --staged'

# Vimx editor
if command -v vimx >/dev/null 2>&1; then
    alias vim='vimx'
fi

# Markdownlint CLI
if command -v markdownlint-cli2 >/dev/null 2>&1; then
    alias markdownlint-cli='markdownlint-cli2'
fi
