package edu.rosehulman.mpegdash.framework;

import java.io.File;
import org.w3c.dom.*;
import javax.xml.parsers.*;
import java.io.*;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import edu.rosehulman.mpegdash.constants.Constants;
import edu.rosehulman.mpegdash.framework.Server.Status;

public class ServerLauncher {

    private static final Logger LOGGER = LogManager.getLogger(ServerLauncher.class);

    private HashMap<String, Server> servers;
    private DirectoryMonitor directoryMonitor;

    private Thread directoryThread;

    public ServerLauncher(boolean autoLaunch) {
        addShutdownHook();
        servers = new HashMap<String, Server>();

        this.directoryMonitor = new DirectoryMonitor(this, autoLaunch);

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

    protected Void addServer(String videoTitle, String command, int port, String videoFile) {
        if (servers.containsKey(videoFile)) {
            System.out.println("Server with that name already exists.");
            return null;
        }
        final Server server = new Server(command, videoTitle, port, videoFile);
        servers.put(videoTitle, server);
        return null;
    }

    protected Void launchServer(String serverName) {
        System.out.println("launching server: " + serverName);
        final Server server = servers.get(serverName);
        if(!servers.containsKey(serverName)){
            System.out.println("Server: [" + serverName + "] does not exist");
            return null;
        }
        if(server.getStatus() == Status.ENABLED){
            return null;
        }
        return Server.runWithBackoff(3, new Callable<Void>() {
            public Void call() {
                new Thread(server).start();
                return null;
            }
        });
    }

    public Void shutdownServer(String serverName) {
        System.out.println("shutting down server: " + serverName);
        if(!servers.containsKey(serverName)){
            System.out.println("Server: [" + serverName + "] does not exist");
            return null;
        }
        final Server server = servers.get(serverName);
        if(server.getStatus() == Status.DISABLED){
            return null;
        }
        return server.shutdown();
    }

    public Void restartServer(String serverName) {
        shutdownServer(serverName);
        return launchServer(serverName);
    }

    // NOT UP TO-DATE
    protected String addServer(String filename) {
        final File folder = new File("").getAbsoluteFile();
        String srProjRoot = folder.getParentFile().getParentFile().getAbsolutePath();
        String videoFile = null;
        int port = 0;
        String videoTitle = null;
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
            videoFile = doc.getElementsByTagName("VideoFile").item(0).getTextContent();
            dashcastCommand += videoTitle + " ";
            dashcastCommand += doc.getElementsByTagName("DashcastParameters").item(0).getTextContent();
        } catch (Exception e) {
            e.printStackTrace();
        }
        LOGGER.debug("port : " + port + "\nvideoTitle: " + videoTitle + "\nvideoFile " + videoFile
                + "\ndashcastCommand: " + dashcastCommand);

        LOGGER.debug(Constants.getDashcastLaunchVideoCommand(port, videoFile, dashcastCommand, videoTitle));
        // return null;
        addServer(videoTitle, Constants.getDashcastLaunchVideoCommand(port, videoFile, dashcastCommand, videoTitle), port,
                videoFile);
        return videoTitle;
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

    public void printAllServers() {
        Columns columns = new Columns();
        columns.addLine("TITLE", "PORT", "VIDEO_FILE", "STATUS");
        columns.addLine("_____", "____", "__________", "______");
        for (String serverName : servers.keySet()) {
            Server server = servers.get(serverName);
            columns.addLine(server.getTitle(), "" + server.getPort(), server.getVideoFile(), "" + server.getStatus());
        }
        columns.print();
    }

    public class Columns {

        List<List<String>> lines = new ArrayList<>();
        List<Integer> maxLengths = new ArrayList<>();
        int numColumns = -1;

        public Columns addLine(String... line) {
            if (numColumns == -1) {
                numColumns = line.length;
                for (int i = 0; i < numColumns; i++) {
                    maxLengths.add(0);
                }
            }
            if (numColumns != line.length) {
                throw new IllegalArgumentException();
            }
            for (int i = 0; i < numColumns; i++) {
                maxLengths.set(i, Math.max(maxLengths.get(i), line[i].length()));
            }
            lines.add(Arrays.asList(line));
            return this;
        }

        public void print() {
            System.out.println(toString());
        }

        public String toString() {
            String result = "";
            for (List<String> line : lines) {
                for (int i = 0; i < numColumns; i++) {
                    result += pad(line.get(i), maxLengths.get(i) + 1);
                }
                result += System.lineSeparator();
            }
            return result;
        }

        private String pad(String word, int newLength) {
            while (word.length() < newLength) {
                word += " ";
            }
            return word;
        }
    }


}
