#!/bin/sh
if [ "$(id -u)" -ne 0 ]; then
   echo "Please, Run Script like Root: sudo ./install.sh"
   exit 1
fi

echo "Installing CorIO Shell"

apt update && apt install -y cage chromium ncat zip unzip
mkdir -p /corio/
cp -r ./* /corio/
printf "cage -- chromium --kiosk --disable-web-security file:///corio/index.html &\n/corio/backend.sh\n" > /usr/bin/corio
chmod +x /usr/bin/corio

echo ""
echo "CorIO Installed Successfully! Now You can Run \"sudo corio\"!"
echo "Visit https://github.com/yareeekc/CorIO/"
echo "Thanks for Staying with Us!"
echo "With Love, From Yareeekc."
