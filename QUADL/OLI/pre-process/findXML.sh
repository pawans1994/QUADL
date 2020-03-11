#!/bin/sh
walk_dir () {
    shopt -s nullglob dotglob
    for pathname in "$1"/*; do
        if [ -d "$pathname" ]; then
            walk_dir "$pathname"
        else
          case "$pathname" in
            *.xml)
              python3 /Users/pawan/PycharmProjects/QUADL/run.py $pathname $q_id
              #printf '%s\n' "$pathname"
          esac
        fi
    done
}

DOWNLOADING_DIR=/Users/pawan/Documents/Project/statistics/content/

python3 /Users/pawan/PycharmProjects/QUADL/create_csv.py $pathname
walk_dir "$DOWNLOADING_DIR"
#python3 /Users/pawan/PycharmProjects/QUADL/generate_question_id.py $pathname
