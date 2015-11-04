echo -n "How clients would you like"
read numClients
COUNTER=0
PORT = 3000
while [  $COUNTER -lt numServers ]; do
	echo On client $COUNTER
	let PORT = COUNTER+ PORT
	meteorapp : meteor --port PORT
	meteor
 	let COUNTER=COUNTER+1 
done
