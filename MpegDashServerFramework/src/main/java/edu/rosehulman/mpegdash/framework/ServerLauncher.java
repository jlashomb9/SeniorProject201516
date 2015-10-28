package edu.rosehulman.mpegdash.framework;

import java.io.File;
import java.util.HashMap;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import edu.rosehulman.mpegdash.constants.Constants;

public class ServerLauncher {

    private static final Logger LOGGER = LogManager.getLogger(ServerLauncher.class);

    private HashMap<String, Server> servers;
    private DirectoryMonitor directoryMonitor;

    private Thread directoryThread;

    public ServerLauncher() {
        addShutdownHook();
        servers = new HashMap<String, Server>();

        this.directoryMonitor = new DirectoryMonitor(this);

        final File folder = new File(Constants.PATH_TO_SERVER_CONFIGURATIONS);
        for (final File fileEntry : folder.listFiles())

        {
            System.out.println(fileEntry.getName());
            addServer(fileEntry.getName());
        }
        directoryThread = new Thread(this.directoryMonitor);
        directoryThread.start();
    }

    private void addShutdownHook() {
        Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
            public void run() {
                directoryThread.interrupt();
                ExecutorService es = Executors.newCachedThreadPool();
                for (final String key : servers.keySet()) {
                    Runnable run = new Runnable() {
                        public void run() {
                            Server server = servers.get(key);
                            server.shutdown();
                        }
                    };
                    es.execute(run);
                }
                boolean interrupted = false;
                es.shutdown();
                try {
                    while (!es.awaitTermination(Constants.WAITING_PERIOD_FOR_THREAD_TERMINATION_SECONDS,
                            TimeUnit.SECONDS)) {
                        LOGGER.info("Waiting for the threadpool to terminate...");
                    }
                } catch (InterruptedException e) {
                    interrupted = true;
                    LOGGER.warn("Threadpool was interrupted when trying to shutdown: " + e.getMessage());
                } finally {
                    if (interrupted)
                        Thread.currentThread().interrupt();
                }
            }
        }));
    }

    protected Server addServer(String filename) {
        if (servers.containsKey(filename)) {
            LOGGER.info("Server with that name already exists... Updating server configuration");
            final Server server = servers.get(filename);
            return Server.runWithBackoff(3, new Callable<Server>() {
                public Server call() {
                    return server.update();
                }
            });
        }
        final Server server = new Server();
        Server result = Server.runWithBackoff(3, new Callable<Server>() {

            public Server call() {
                return server.shutdown();
            }

        });
        if (result == null) {
            LOGGER.error("server failed to launch");
            return result;
        }
        LOGGER.info("server successfully launched");
        return servers.put(filename, server);
    }

    protected Server removeServer(String filename) {
        final Server server = servers.get(filename);
        Server result = Server.runWithBackoff(3, new Callable<Server>() {
            public Server call() {
                return server.shutdown();
            }
        });
        if (result == null) {
            LOGGER.error("server failed to shutdown");
            return result;
        }
        LOGGER.info("server successfully shutdown");
        return servers.remove(filename);
    }
}
