# ~/.bashrc: executed by bash(1) for non-login shells.

RCFILES=(
    ~/.bashrc_local
    ~/.bashrc_interactive
)

for RCFILE in ${RCFILES[@]};do
    if [ -f ${RCFILE} ];then
        source ${RCFILE}
    fi
done


# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/home/nima/mambaforge-pypy3/bin/conda' 'shell.bash' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/home/nima/mambaforge-pypy3/etc/profile.d/conda.sh" ]; then
        . "/home/nima/mambaforge-pypy3/etc/profile.d/conda.sh"
    else
        export PATH="/home/nima/mambaforge-pypy3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<


source /home/nima/.config/broot/launcher/bash/br
. "$HOME/.cargo/env"

# Added by LM Studio CLI (lms)
export PATH="$PATH:/home/nima/.lmstudio/bin"
# End of LM Studio CLI section

