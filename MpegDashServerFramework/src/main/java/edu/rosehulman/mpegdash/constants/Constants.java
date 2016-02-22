package edu.rosehulman.mpegdash.constants;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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
    public static final String SERVER_LIST_FILE_NAME = "serverlist.xml";

    public static String getDashcastLaunchVideoCommand(int port, String videoName, String dashcastCommand, String videoTitle, String imageName) {
        // return "ls -l | echo hi | echo hi | echo hi";
        return "docker run -d -p " + port + ":" + port + " -v " + pathToServerConfigurations()
                + ":/home/SeniorProject201516 " + imageName + " /bin/bash -c '/home/SeniorProject201516/node-gpac-dash/encode.sh "
                + "/home/SeniorProject201516/node-gpac-dash/" + videoName + " " + port + " \"" + dashcastCommand + "\"'";
    }
    
    public static String pathToServerConfigurations(){
        final File folder = new File("").getAbsoluteFile();
        String srProjRoot = folder.getAbsolutePath().substring(0, folder.getAbsolutePath().indexOf("MpegDashServerFramework"));
        return srProjRoot;
    }
    
    public static String absolutePathToServerConfigurations(){
        final File folder = new File("").getAbsoluteFile();
        String srProjRoot = folder.getAbsolutePath().substring(0, folder.getAbsolutePath().indexOf("MpegDashServerFramework"));
        return srProjRoot += "MpegDashServerFramework/" + PATH_TO_SERVER_CONFIGURATIONS;
    }

    public static String absolutePathToResources(){
        final File folder = new File("").getAbsoluteFile();
        String srProjRoot = folder.getAbsolutePath().substring(0, folder.getAbsolutePath().indexOf("MpegDashServerFramework"));
        return srProjRoot += "MpegDashServerFramework/src/main/resources/";
    }

    public static String getDashcastSetupCommand(String name, boolean dashcast) {
        final File folder = new File("").getAbsoluteFile();
        String srProjRoot = folder.getAbsolutePath().substring(0, folder.getAbsolutePath().indexOf("MpegDashServerFramework"));
        if(dashcast){
            return "docker build -f " + srProjRoot + "Dockerfile" + (name != null ? " -t " + name : "") + " " + srProjRoot;
        }
        return "docker build -f " + srProjRoot + "DockerfileEDash" + (name != null ? " -t " + name : "") + " " + srProjRoot;
    }
    
    public static String absolutePathToWebService(){
        final File folder = new File("").getAbsoluteFile();
        String srProjRoot = folder.getAbsolutePath().substring(0, folder.getAbsolutePath().indexOf("MpegDashServerFramework"));
        return srProjRoot + "/node-gpac-dash";
    }

    public static String getDashcastShutdownCommand(String imageID) {
        return "docker kill " + imageID;
    }

    public static String absolutePathToNodeJS() {
        final File folder = new File("").getAbsoluteFile();
        String srProjRoot = folder.getAbsolutePath().substring(0, folder.getAbsolutePath().indexOf("MpegDashServerFramework"));
        return srProjRoot + "/node-gpac-dash/client";
    }
}