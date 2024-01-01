parse_git_branch() {
    git branch 2> /dev/null | sed -n -e 's/^\* \(.*\)/[\1]/p'
}

setopt PROMPT_SUBST
# export TERM="xterm-color" 
export PROMPT='%F{green}$(parse_git_branch)%f %F{yellow}%1~ %F{normal}$%f '
# The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/hudekker/myPortfolio/google-cloud-sdk/path.zsh.inc' ]; then . '/Users/hudekker/myPortfolio/google-cloud-sdk/path.zsh.inc'; fi

# The next line enables shell command completion for gcloud.
if [ -f '/Users/hudekker/myPortfolio/google-cloud-sdk/completion.zsh.inc' ]; then . '/Users/hudekker/myPortfolio/google-cloud-sdk/completion.zsh.inc'; fi

# alias tree2='find . -name "node_modules" -prune -o -print | sed -e "/node_modules/d" -e "/^\\s*$/d"'
alias tree2='find . -name ".git" -prune -o -name "node_modules" -prune -o -print | sed -e "/node_modules/d" -e "/^\\s*$/d" -e "/.git/d"'



