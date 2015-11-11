while true; do
	
	startingTime = date+"%T"
	vlc "http://137.112.104.147:8008/output/dashcast.mpd" --sout-name=test
	if [ -e test]
	 then 
		endingTime = date+"%T"
		elaspeTime = endingTime - startingTime
		echo elaspeTime

done