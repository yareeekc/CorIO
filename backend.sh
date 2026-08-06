#!/bin/bash
echo 'Server Starting on 2345 Port'

while true; do
    echo -e "HTTP/1.1 200 OK\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\nOK" | nc -l 2345 > /tmp/request.txt

    if grep -q 'suspend' /tmp/request.txt; then
        systemctl suspend
    elif grep -q 'poweroff' /tmp/request.txt; then
        systemctl poweroff
    elif grep -q 'poweroff' /tmp/request.txt; then
        systemctl reboot
    fi
done
