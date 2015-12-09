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
public class Server {

    private static final Logger LOGGER = LogManager.getLogger(Server.class);
    private String launchCommand;

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
    public Server launch() {
        parseXML();
        Process ls = null;
        BufferedReader input = null;
        String line = null;
        String[] cmd = { "/bin/bash", "-c", this.launchCommand };

        try {

            ls = Runtime.getRuntime().exec(cmd);
            input = new BufferedReader(new InputStreamReader(ls.getInputStream()));

        } catch (IOException e1) {
            e1.printStackTrace();
            System.exit(1);
        }

        try {
            while ((line = input.readLine()) != null)
                System.out.println(line);

        } catch (IOException e1) {
            e1.printStackTrace();
            System.exit(0);
        }
        try {
            while(ls.waitFor() == 1){
                System.out.println(line);
            }
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        status = Status.ENCRYPTING;
        // start encrypting
        // then start launching server
        // then change to enabled
        return this;
    }

    private void parseXML() {

    }

    // will return true on successful shutdown, false on failed shutdown.
    public Server shutdown() {
        status = Status.DISABLED;
        return this;
    }

    public Status getStatus() {
        return status;
    }

    public Server update() {
        shutdown();
        return launch();
    }

    public static Server runWithBackoff(int maxRetries, Callable<Server> func) {
        int exponentialBackoffTime = Constants.INITIAL_BACKOFF;
        int numRetries = 0;
        boolean interrupted = false;
        Server result = null;
        try {
            do {
                if (numRetries >= maxRetries) {
                    break;
                }
                try {
                    result = func.call();
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
            } while (result == null);
            return result;
        } finally {
            if (interrupted) {
                Thread.currentThread().interrupt();
            }
        }
    }

}
