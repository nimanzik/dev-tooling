!/bin/env zsh

DESTDIR="$HOME/ubuntu-app-inventory"
[[ -d "$DESTDIR" ]] || mkdir "$DESTDIR"

{
    echo "# This file was auto-generated via the following command:"
    echo "#   apt-mark showmanual | sort"
    apt-mark showmanual | sort
} > "$DESTDIR/apt-manual.txt"

{
    echo "# This file was auto-generated via the following command:"
    echo "#   snap list"
    snap list
} > "$DESTDIR/snap-apps.txt"

{
    echo "# This file was auto-generated via the following command:"
    echo "#   flatpak list --app --columns=application,name,origin"
    flatpak list --app --columns=application,name,origin
} > "$DESTDIR/flatpak-apps.txt"

{
    echo "# This file was auto-generated via the following command:"
    echo "#   npm list -g --depth=0"
    npm list -g --depth=0
} > "$DESTDIR/npm-global.txt"

{
    echo "# This file was auto-generated via the following command:"
    echo "#   uv tool list"
    uv tool list
} > "$DESTDIR/uv-tools.txt"

{
    echo "# This file was auto-generated via the following command:"
    echo "#   npx skills@latest list --global"
    npx skills@latest list --global
} > "$DESTDIR/skills.txt"

{
    echo "# This file was auto-generated via the following command:"
    echo "#   cargo install --list"
    cargo install --list
} > "$DESTDIR/cargo.txt" 2>&1
