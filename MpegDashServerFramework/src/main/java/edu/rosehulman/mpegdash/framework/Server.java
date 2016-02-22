package edu.rosehulman.mpegdash.framework;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.ProcessBuilder.Redirect;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.Callable;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import edu.rosehulman.mpegdash.constants.Constants;
import edu.rosehulman.mpegdash.framework.Server.Status;

/**
 * Server class. Will initialize a state-machine to interact with current mpeg
 * dash streamed video
 *
 */
public class Server implements Runnable{

    private static final Logger LOGGER = LogManager.getLogger(Server.class);
    private String launchCommand;
    private Process ls = null;
    private String name;
    private int port;
    private String ip;
    private String videoFile;
    private String imageID;
    private String outputFolder;
    private String address;

    enum Status {
        DISABLED, ENABLED
    };

    private Status status;

    public Server() {
        status = Status.DISABLED;
        this.name = "";
        this.port = 8088;
        this.videoFile = "";
        this.outputFolder = "";
        this.ip = "";
        this.address = "";
        this.launchCommand = Constants.getDashcastLaunchVideoCommand(port, "", "", "", "");
    }

    public Server(String launchCommand, String name, int port, String videoFile, String ip) {
        status = Status.DISABLED;
        this.launchCommand = launchCommand;
        this.name = name;
        this.port = port;
        this.videoFile = videoFile;
        this.outputFolder = name;
        this.ip = ip;
        this.address = "http://" + ip + ":" + this.getPort() + "/" + this.getOutputFolder() + "/dashcast.mpd";
    }
    
    public String getAddress(){
        return this.address;
    }
    
    public String getLaunchCommand(){
        return launchCommand;
    }
    
    public int getPort(){
        return port;
    }
    
    public String getName(){
        return name;
    }
    
    public String getVideoFile(){
        return videoFile;
    }

    public void run() {
        BufferedReader input = null;
        String line = null;
        BufferedReader error = null;
        status = Status.ENABLED;
        String[] cmd = { "/bin/bash", "-c", this.launchCommand };
        try {
            ls = Runtime.getRuntime().exec(cmd);
            input = new BufferedReader(new InputStreamReader(ls.getInputStream()));
            error = new BufferedReader(new InputStreamReader(ls.getErrorStream()));
        } catch (IOException e1) {
            e1.printStackTrace();
            System.exit(1);
        }
        try {
            while ((line = input.readLine()) != null){
                System.out.println(line);
                imageID = line;
            }

            while ((line = error.readLine()) != null)
                System.out.println(line);

        } catch (IOException e1) {
            LOGGER.debug("process was shutdown");
        }

    }

    public Void shutdown() {
        status = Status.DISABLED;
        System.out.println(Constants.getDashcastShutdownCommand(imageID));
        String[] cmd = { "/bin/bash", "-c", Constants.getDashcastShutdownCommand(imageID)};
        try {
            Runtime.getRuntime().exec(cmd);
        } catch (IOException e) {
            e.printStackTrace();
        }
        if(ls != null){
            ls.destroy();
        }
        return null;
    }

    public Status getStatus() {
        return status;
    }

    public String getStatusAsString() {
        return status.toString();
    }

    public void update() {
        shutdown();
        run();
    }

    public static Void runWithBackoff(int maxRetries, Callable<Void> callable) {
        int exponentialBackoffTime = Constants.INITIAL_BACKOFF;
        int numRetries = 0;
        boolean interrupted = false;
        try {
            do {
                try {
                    callable.call();
                    return null;
                } catch (Exception e) {
                    LOGGER.error("Error occurred, backing off...\n" + e);
                    try {
                        Thread.sleep(exponentialBackoffTime);
                    } catch (InterruptedException e1) {
                        interrupted = true;
                    }
                    numRetries++;
                } finally {
                    exponentialBackoffTime *= 2;
                    if (exponentialBackoffTime > Constants.MAX_EXPONENTIAL_BACKOFF_TIME) {
                        exponentialBackoffTime = Constants.MAX_EXPONENTIAL_BACKOFF_TIME;
                    }
                }
            } while (numRetries < maxRetries);
        } finally {
            if (interrupted) {
                Thread.currentThread().interrupt();
            }
        }
        return null;
    }

    public String getOutputFolder() {
        return outputFolder;
    }

    public void setStatus(Status enabled) {
        status = Status.ENABLED;
    }
    
}

