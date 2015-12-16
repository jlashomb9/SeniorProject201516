package edu.rosehulman.mpegdash.framework;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.ProcessBuilder.Redirect;
import java.util.concurrent.Callable;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import edu.rosehulman.mpegdash.constants.Constants;

/**
 * Server class. Will initialize a state-machine to interact with current mpeg
 * dash streamed video
 *
 */
public class Server implements Runnable{

    private static final Logger LOGGER = LogManager.getLogger(Server.class);
    private String launchCommand;
    private Process ls = null;

    enum Status {
        DISABLED, ENCRYPTING, ENABLED, LAUNCHING,
    };

    private Status status;

    public Server() {
        status = Status.DISABLED;
        this.launchCommand = "";
    }

    public Server(String launchCommand) {
        status = Status.DISABLED;
        this.launchCommand = launchCommand;
    }

    // will return true on successful launch, false on failed launch.
    public void run() {
        parseXML();
        BufferedReader input = null;
        String line = null;
        BufferedReader error = null;
        String[] cmd = { "/bin/bash", "-c", this.launchCommand };

        status = Status.ENCRYPTING;
        try {
            ls = Runtime.getRuntime().exec(cmd);
            input = new BufferedReader(new InputStreamReader(ls.getInputStream()));
            error = new BufferedReader(new InputStreamReader(ls.getErrorStream()));
        } catch (IOException e1) {
            e1.printStackTrace();
            System.exit(1);
        }
        try {
            while ((line = input.readLine()) != null)
                System.out.println(line);

            while ((line = error.readLine()) != null)
                System.out.println(line);

        } catch (IOException e1) {
            e1.printStackTrace();
            System.exit(0);
        }

        status = Status.ENABLED;
        // start encrypting
        // then start launching server
        // then change to enabled
    }

    private void parseXML() {

    }

    // will return true on successful shutdown, false on failed shutdown.
    public Void shutdown() {
        status = Status.DISABLED;
        return null;
    }

    public Status getStatus() {
        return status;
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

}
