Initial Installation
========

Download the latest version of java here:
	https://www.java.com/en/download/

Download docker by following the instructions here:
	https://docs.docker.com/engine/installation/

Download a copy of this code library from github.

Setup
========
Go into the folder MpegDashServerFramework/target and run the following command:
```
java -jar mpeg-dash-server-framework-1.0.0-shaded.jar -setup
```
	[this will setup the docker image for launching video feeds]
		
There is an example configuration file located in MpegDashServerFramework/src/main/resources/servers
This is where you will setup parameters for encoding the video into MPEG-DASH format, as well as specifying the video name, port, and 
	[ip address of video to encode and stream, OR a video file name of the file located in node-gpac-dash folder. (you must place the file there OR use the client to upload the video)]


Running the server
=======

Now that the docker image is setup, you can run the server with the following command:
```
java -jar mpeg-dash-server-framework-1.0.0-shaded.jar
```
	[optional parameter '-autolaunch false' -default true, if set to false the program will launch with the videos DISABLED]

Running the web client
========

	From the terminal go to the git rep folder.
	Change directory to MPEGDashPlayer.
	To deploy locally type "meteor".
