" Last update: by Nima Nooshiri, 7 Feb 2026, Berlin

" Enable line numbering
set number

" Enable mouse usage ('all' modes)
set mouse=a

" Enable syntax highlighting
syntax on

" Enable 256 colors
set t_Co=256

" Always display status line
set laststatus=2

" Show matching brackets
set showmatch

" Use a dark background
set background=dark

" Highlight current line
set cursorline
highlight CursorLine cterm=None ctermbg=23

" Highlight vertical line
set colorcolumn=79
highlight ColorColumn ctermbg=23

" Tabs and indentation. Use 4 spaces as tabs
filetype plugin indent on
filetype indent on
set tabstop=4
set shiftwidth=4   " number of spaces to (auto) indent
set expandtab
set smartindent   " smart autoindenting when starting a new line
set autoindent   " always set autoindenting on

" Lines visible above/below cursor
set scrolloff=5

" Use system clipboard (+) by default. By setting this:
" Automatic sync: `y` (yank), `d` (delete) or `c` (change) in Vim -> Ctrl+v
" in another app.
" Easy inbound: copy in another app (Ctrl + c) -> `p` (paste) in Vim (no need
" to type `"+p`.
set clipboard=unnamedplus
