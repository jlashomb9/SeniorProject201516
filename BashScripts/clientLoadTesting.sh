#../sudo docker build -t mpegdash
#../sudo docker run -p -it 8000:8000 mpegdash
read numClients
COUNTER=0
PORT = 3000
while [  $COUNTER -lt numClients ]; do
	echo On client $COUNTER
	let PORT = COUNTER + PORT
	../MPEGDashPlayer/meteorapp : meteor --port PORT
	../MPEGDashPlayer/meteor
 	let COUNTER=COUNTER+1 
done