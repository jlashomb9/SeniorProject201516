package edu.rosehulman.mpegdash.framework;

import java.io.File;
import java.nio.file.Path;
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
//        addShutdownHook();
        servers = new HashMap<String, Server>();

//        this.directoryMonitor = new DirectoryMonitor(this);

        final File folder = new File("").getAbsoluteFile();
        String srProjRoot = folder.getParentFile().getAbsolutePath();
        
        addServer("new name of video", Constants.getDashcastLaunchVideoCommand(8090, srProjRoot));
//        directoryThread = new Thread(this.directoryMonitor);
//        directoryThread.start();
        while(true){
            
        }
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
    protected Server addServer(String name, String command) {
    	if (servers.containsKey(name)) {
            LOGGER.info("Server with that name already exists... Updating server configuration");
            final Server server = servers.get(name);
            return Server.runWithBackoff(3, new Callable<Server>() {
                public Server call() {
                    return server.update();
                }
            });
        }
    	final Server server = new Server(command);
        Server result = Server.runWithBackoff(3, new Callable<Server>() {

            public Server call() {
                return server.launch();
            }

        });
        if (result == null) {
            LOGGER.error("server failed to launch");
            return result;
        }
        LOGGER.info("server successfully launched");
        return servers.put(name, server);
    }

    //NOT UP TO-DATE
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
                return server.launch();
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
