#!/bin/sh
walk_dir () {
    shopt -s nullglob dotglob
    for pathname in "$1"/*; do
        if [ -d "$pathname" ]; then
            walk_dir "$pathname"
        else
          case $pathname in *.xml)
              python3 run.py $pathname
              #printf '%s\n' "$pathname"
          esac
        fi
    done
}

DOWNLOADING_DIR=/Users/pawan/Documents/Project/a_and_p/content/
python3   create_csv.py $pathname
walk_dir "$DOWNLOADING_DIR"
#python3 /Users/pawan/PycharmProjects/QUADL_PreProcess/edit_fill_in_the_blanks.py $pathname
