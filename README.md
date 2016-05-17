Initial Installation
========

Download the latest version of java here:
	https://www.java.com/en/download/

Download docker by following the instructions here:
	https://docs.docker.com/engine/installation/

Download a copy of this code library from github.

Download and install maven.

Setup
========
Go into the MpegDashServerFramework folder and run the following 2 commands:
```
mvn clean
mvn install
```

Now go into the folder MpegDashServerFramework/target and run the following command:
```
java -jar mpeg-dash-server-framework-1.0.0.jar -setup -ip <insert your ip here>
```

[this will setup the docker image for launching video feeds, only run once after installation]
		
There is an example configuration file located in MpegDashServerFramework/src/main/resources/servers
This is where you will setup parameters for encoding the video into MPEG-DASH format, as well as specifying the video name, port, and 
	[ip address of video to encode and stream, OR a video file name of the file located in node-gpac-dash folder. (you must place the file there OR use the client to upload the video)]


Running the server
=======

Now that the docker image is setup, go into the MpegDashServerFramework/target folder and run the server with the following command:
```
java -jar mpeg-dash-server-framework-1.0.0.jar -ip <insert your ip here>
```



[optional parameter '-autolaunch false' -default true, if set to false the program will launch with the videos DISABLED]

Running the web client
========

	From the terminal go to the git rep folder.
	Change directory to MPEGDashPlayer.
	To deploy locally type "meteor".

Download a sample mp4 file located here:
https://download.blender.org/durian/trailer/sintel_trailer-480p.mp4

then click Launch video, fill out the form with the uploaded video and click 'launch'.

The video will take a few seconds to upload, and then the window should disappear when the upload is finished.

Then click the add Video button and play the newly launched video.

Docker Location
========
Server's Docker container located at https://hub.docker.com/r/mpegdashrosehulman/v1/

This contains all of the necessary libraries and this github project in it's home directory.

All you need is to run -setup and then you should be able to launch the jar.

(NOTE: start the docker daemon before running setup using 'service docker start' or else you will get an error saying the docker daemon is not running)

Updating the Docker Container
========

When adding new features to the client or server docker images and you would like to host the new docker image on docker hub, follow this guide
for committing and pushing the image to a docker hub account repository:

https://docs.docker.com/engine/userguide/containers/dockerrepos/

