#!/bin/bash

DashCast -v $1 -seg-dur 1000 -frag-dur 200 -mpd-refresh 10000 -time-shift -1 -seg-marker eods -min-buffer 0.2 -pixf yuv420p -insert-utc -low-delay -no-loop

IPvar=$(/sbin/ifconfig eth0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}')

cd /home/SeniorProject201516/node-gpac-dash/

echo $IPvar

nodejs gpac-dash.js -cors -segment-marker eods -chunk-media-segments -ip $IPvar -port $2
