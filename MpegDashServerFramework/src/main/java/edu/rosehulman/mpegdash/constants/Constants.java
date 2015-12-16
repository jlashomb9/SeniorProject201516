package edu.rosehulman.mpegdash.constants;

public class Constants {
    // -v since audio encoding is experiencing issues.
    // add video at runtime.
    public static final String DASHCAST_DEFAULT_LIVESTREAM_ARGUMENTS = "-seg-dur 1000 -frag-dur 200 -mpd-refresh 10000 -time-shift -1 "
            + "-seg-marker eods -min-buffer 0.2 -pixf yuv420p -insert-utc -low-delay -no-loop";
    // add ip and port at runtime.
    public static final String INITIALIZE_SERVER_COMMAND = "nodejs gpac-dash.js -segment-marker eods -chunk-media-segments";
    public static final String PATH_TO_SERVER_CONFIGURATIONS = "src/main/resources/servers";
    public static final int MAX_EXPONENTIAL_BACKOFF_TIME = 2048;
    public static final int INITIAL_BACKOFF = 128;
    public static final int WAITING_PERIOD_FOR_THREAD_TERMINATION_SECONDS = 10;

    public static String getDashcastLaunchVideoCommand(int port, String srProjRoot, String videoName, String dashcastCommand) {
        // return "ls -l | echo hi | echo hi | echo hi";
        return "sudo docker run -p " + port + ":" + port + " -v " + srProjRoot
                + ":/home/SeniorProject201516 mpegdash/nodejs /bin/bash -c './home/SeniorProject201516/node-gpac-dash/encode.sh "
                + "/home/SeniorProject201516/node-gpac-dash/" + videoName + " " + port + " " + dashcastCommand + "'";
    }
}