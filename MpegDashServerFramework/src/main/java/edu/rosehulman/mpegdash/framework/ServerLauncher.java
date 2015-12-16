package edu.rosehulman.mpegdash.framework;

import java.io.File;
import org.w3c.dom.*;
import javax.xml.parsers.*;
import java.io.*;
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
        addShutdownHook();
        servers = new HashMap<String, Server>();

        this.directoryMonitor = new DirectoryMonitor(this);

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

    protected Void addServer(String name, String command) {
        if (servers.containsKey(name)) {
            LOGGER.info("Server with that name already exists... Updating server configuration");
            final Server server = servers.get(name);
            return Server.runWithBackoff(3, new Callable<Void>() {
                public Void call() {
                    server.update();
                    return null;
                }
            });
        }
        final Server server = new Server(command);
        servers.put(name, server);
        return Server.runWithBackoff(3, new Callable<Void>() {
            public Void call() {
                new Thread(server).start();
                return null;
            }
        });
    }

    // NOT UP TO-DATE
    protected Void addServer(String filename) {
        final File folder = new File("").getAbsoluteFile();
        String srProjRoot = folder.getParentFile().getParentFile().getAbsolutePath();
        String videoTitle = null;
        int port = 0;
        String videoName = null;
        String dashcastCommand = "DashCast -v ";
        try {
            File inputFile = new File(filename);
            System.out.println(inputFile.toString());
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(inputFile);
            doc.getDocumentElement().normalize();
            port = Integer.parseInt(doc.getElementsByTagName("Port").item(0).getTextContent());
            videoTitle = doc.getElementsByTagName("Name").item(0).getTextContent();
            videoName = doc.getElementsByTagName("VideoFile").item(0).getTextContent();
            dashcastCommand += videoName + " ";
            dashcastCommand += doc.getElementsByTagName("DashcastParameters").item(0).getTextContent();
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("port : " + port + "\nvideoTitle: " + videoTitle + "\nvideoName " + videoName
                + "\ndashcastCommand: " + dashcastCommand);

        System.out.println(Constants.getDashcastLaunchVideoCommand(port, videoName, dashcastCommand));
//        return null;
        return addServer(videoTitle,
                Constants.getDashcastLaunchVideoCommand(port, videoName, dashcastCommand));
    }

    protected void removeServer(String filename) {
        final Server server = servers.get(filename);
        servers.remove(filename);
        Server.runWithBackoff(3, new Callable<Void>() {
            public Void call() {
                return server.shutdown();
            }
        });
    }
}
