#!/bin/bash
echo 'Server Starting on 2345 Port'

while true; do
    nc -l 2345 > /tmp/request.txt

    {
        if grep -q 'suspend' /tmp/request.txt; then
            systemctl suspend
        elif grep -q 'poweroff' /tmp/request.txt; then
            systemctl poweroff
        elif grep -q 'poweroff' /tmp/request.txt; then
            systemctl reboot
        elif grep -q 'ls' /tmp/request.txt; then
            ls
        fi
    } | nc -l 2345 > /dev/null
done
