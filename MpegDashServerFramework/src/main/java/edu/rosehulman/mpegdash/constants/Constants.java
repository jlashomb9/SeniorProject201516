package edu.rosehulman.mpegdash.constants;

public class Constants {
    public static final int SEGMENT_DURATION = 1000;
    public static final int FRAGMENT_DURATION = 200;
    public static final int MPD_REFRESH_TIME = 1;
    // -v since audio encoding is experiencing issues.
    // add video at runtime.
    public static final String DASHCAST_LIVESTREAM_COMMAND = "DashCast -seg-dur " + SEGMENT_DURATION + " -frag-dur "
            + FRAGMENT_DURATION + " -mpd-refresh " + MPD_REFRESH_TIME + " -v ";
    // add ip and port at runtime.
    public static final String INITIALIZE_SERVER_COMMAND = "nodejs gpac-dash.js -segment-marker eods -chunk-media-segments";
    public static final String PATH_TO_SERVER_CONFIGURATIONS = "src/main/resources/servers";
    public static final int MAX_EXPONENTIAL_BACKOFF_TIME = 2048;
    public static final int INITIAL_BACKOFF = 128;
    public static final int WAITING_PERIOD_FOR_THREAD_TERMINATION_SECONDS = 10;

    public static String getDashcastLaunchVideoCommand(int port, String srProjRoot) {
//        return "echo hi";
        return "gksudo docker run -p " + port + ":" + port
                + " -v " + srProjRoot + ":/home/SeniorProject201516 mpegdash/nodejs /bin/bash -c './home/SeniorProject201516/node-gpac-dash/encode.sh /home/SeniorProject201516/node-gpac-dash/SampleVideo_720x480_50mb.mp4 "
                + port + "' &";
    }
}