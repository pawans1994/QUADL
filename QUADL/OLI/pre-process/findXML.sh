#!/bin/sh
walk_dir () {
    shopt -s nullglob dotglob

    for pathname in "$1"/*; do
        if [ -d "$pathname" ]; then
            walk_dir "$pathname"
        else
          case "$pathname" in
            *.xml)
              python3 /Users/pawan/PycharmProjects/XMLcsv/app5.py $pathname
              #printf '%s\n' "$pathname"
          esac
        fi
    done
}

DOWNLOADING_DIR=/Users/pawan/Documents/Project/statistics/content/

python3 /Users/pawan/PycharmProjects/XMLcsv/create_csv.py $pathname
walk_dir "$DOWNLOADING_DIR"
