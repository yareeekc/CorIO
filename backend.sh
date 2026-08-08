#!/bin/bash
echo 'Server Starting on 2345 Port'

while true; do
    nc -l -k 2345 > /tmp/request.txt

    {
        if grep -q 'suspend' /tmp/request.txt; then
            systemctl suspend
        elif grep -q 'poweroff' /tmp/request.txt; then
            systemctl poweroff
        elif grep -q 'poweroff' /tmp/request.txt; then
            systemctl reboot
        elif grep -q 'ls' /tmp/request.txt; then
            ls
        elif grep -q 'exec' /tmp/request.txt; then
            RAW_CMD=$(grep 'exec' /tmp/request.txt | sed -E 's|.*GET /exec/([^ ]*) .*|\1|')

            DECODED_CMD=$(echo "$RAW_CMD" | awk '{
                gsub(/%20/, " "); gsub(/%2F/, "/"); gsub(/%3A/, ":");
                gsub(/%2D/, "-"); gsub(/%3E/, ">"); gsub(/%3C/, "<");
                print
            }')

            if [ -n "$DECODED_CMD" ]; then
                eval "$DECODED_CMD"
            else
                echo 'usage: "exec <COMMAND>"'
            fi
        fi
    } | nc -l -k 2345 > /dev/null
done
