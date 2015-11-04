echo "Encoding a hosting $1"

DashCast -av $1 -seg-dur 1000 -frag-dur 200 -mpd-refresh 1
cd ~/../node-gpac-dash

nodejs gpac-dash.js -segment-marker eods -chunk-media-segments
