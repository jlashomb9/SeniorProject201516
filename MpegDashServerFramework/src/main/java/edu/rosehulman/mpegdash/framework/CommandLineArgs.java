package edu.rosehulman.mpegdash.framework;

import com.beust.jcommander.Parameter;

/**
 * This class contains the parameters to input when executing the program from
 * command line.
 */
public class CommandLineArgs {
    public static final String HELP = "--help";
    @Parameter(names = HELP, description = "Display usage information", help = true)
    private boolean help;

    public boolean getHelp() {
        return help;
    }
    

    public static final String SETUP = "-setup";
    @Parameter(names = SETUP, description = "Setup docker image from the supplied Dockerfile")
    private boolean setup = false;
    public boolean getSetup() {
        return setup;
    }
    
    public static final String SETUP_IMAGE_NAME = "-imagename";
    @Parameter(names = SETUP_IMAGE_NAME, description = "Name associated with docker image when initializing.")
    private String imageName = "mpegdash/nodejs";
    public String getImageName() {
        return imageName;
    }
    public static final String AUTO_LAUNCH = "-autolaunch";
    @Parameter(names = AUTO_LAUNCH, description = "default true, if set to false the program will launch with the videos DISABLED")
    private boolean autoLaunch = true;
    public boolean getAutoLaunch() {
        return autoLaunch;
    }
    

    public static final String IP = "-ip";
    @Parameter(names = IP, description = "IP address of your server. Will be used to host videos on different ports.", required = true)
    private String ip = null;
    public String getIP() {
        return ip;
    }
    
    public static final String DASHCAST = "-dashcast";
    @Parameter(names = DASHCAST, description = "default false, if set to true the program will use dashcast to encode videos instead of google's edash")
    private boolean dashcast = false;
    public boolean getDashcast() {
        return dashcast;
    }
}
