../sudo docker build -t mpegdash
../sudo docker run -p -it 8000:8000 mpegdash
read numClients
COUNTER=0
PORT = 3000
while [  $COUNTER -lt numClients ]; do
	echo On client $COUNTER
	let PORT = COUNTER + PORT
	meteorapp : meteor --port PORT
	meteor
 	let COUNTER=COUNTER+1 
done