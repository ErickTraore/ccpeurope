#!/bin/bash
echo "Lancement du frontend à $(date)" >> /var/log/frontend-start.log
/usr/local/bin/serve -s build -l 3000 >> /var/log/frontend-out.log 2>> /var/log/frontend-error.log
