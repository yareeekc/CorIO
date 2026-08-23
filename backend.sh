#!/bin/bash

if [ "$1" == "--run-request" ]; then
    read -r REQUEST_LINE
    echo -e "HTTP/1.1 200 OK\r\nAccess-Control-Allow-Origin: *\r\nContent-Type: text/plain; charset=utf-8\r\nConnection: close\r\n\r"

    if echo "$REQUEST_LINE" | grep -q 'poweroff'; then
        systemctl poweroff
    elif echo "$REQUEST_LINE" | grep -q 'reboot'; then
        systemctl reboot
    elif echo "$REQUEST_LINE" | grep -q 'suspend'; then
        systemctl suspend
    elif echo "$REQUEST_LINE" | grep -q 'ping'; then
        echo "OK"
    elif echo "$REQUEST_LINE" | grep -q 'exec'; then
        RAW_CMD=$(echo "$REQUEST_LINE" | sed -E 's|.*GET /exec/([^ ]*) .*|\1|')
        DECODED_CMD=$(echo "$RAW_CMD" | sed 's/%/\\x/g' | xargs -0 printf "%b")

        if [ -n "$DECODED_CMD" ]; then
            eval "$DECODED_CMD" 2>&1
        else
            echo "using: fetch('http://127.0.0.1:2345/exec/', command);"
        fi
    else
        echo "uncnown command"
    fi
    exit 0
fi

echo 'Corio OS Kernel HTTP Server Started on Port 2345'

ncat -l -k 2345 -c "$0 --run-request"
