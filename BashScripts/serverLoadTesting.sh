sudo docker build -t mpegdash
read numServers
COUNTER=0
DOCKERPORT = 8000
LOCALPORT = 80
while [  $COUNTER -lt numServers ]; do
	echo On server $COUNTER
	sudo docker run -p -it LOCALPORT:DOCKERPORT mpegdash
 	let COUNTER=COUNTER+1 
done