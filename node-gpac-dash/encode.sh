#!/bin/bash

cd /home/SeniorProject201516/node-gpac-dash/

DashCast -v $1 $3

IPvar=$(/sbin/ifconfig eth0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}')

echo $IPvar

nodejs gpac-dash.js -cors -segment-marker eods -chunk-media-segments -ip $IPvar -port $2
