package edu.rosehulman.mpegdash.framework;

import java.net.URL;

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
    private NodeJSCommunicator nodeJSCommunicator;
    private boolean autoLaunch;
    private String ip;

    private Thread directoryThread;
    private Thread nodeJSThread;
    private ServerFileLister lister;
    private boolean dashcast;
    private String imageName;
    private Server serverListerServer;

    public ServerLauncher(boolean autoLaunch, String ip, boolean dashcast, String imageName) {
        serverListerServer = new Server();
        new Thread(serverListerServer).start();
        this.dashcast = dashcast;
        this.imageName = imageName;
        
        this.autoLaunch = autoLaunch;
        servers = new HashMap<String, Server>();
        lister = new ServerFileLister();
        updateServerList();
        this.ip = ip;

        this.directoryMonitor = new DirectoryMonitor(this, autoLaunch);

        directoryThread = new Thread(this.directoryMonitor);
        directoryThread.start();
        this.nodeJSCommunicator = new NodeJSCommunicator(this);

        nodeJSThread = new Thread(this.nodeJSCommunicator);
        nodeJSThread.start();
        addShutdownHook();
    }

    private void addShutdownHook() {
        Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
            public void run() {
                directoryThread.interrupt();
                ExecutorService es = Executors.newCachedThreadPool();
                Runnable run = new Runnable() {
                    public void run() {
                        serverListerServer.shutdown();
                    }
                };
                es.execute(run);
                for (final String key : servers.keySet()) {
                    run = new Runnable() {
                        public void run() {
                            Server server = servers.get(key);
                            server.shutdown();
                            updateServerList();
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
        final Server server = new Server(command, videoTitle, port, videoFile, ip);
        servers.put(videoTitle, server);

        updateServerList();
        return null;
    }

    protected Void launchServer(String serverName) {
        System.out.println("launching server: " + serverName);
        final Server server = servers.get(serverName);
        if (!servers.containsKey(serverName)) {
            System.out.println("Server: [" + serverName + "] does not exist");
            return null;
        }
        if (server.getStatus() == Status.ENABLED) {
            return null;
        }
        return Server.runWithBackoff(3, new Callable<Void>() {
            public Void call() {
                new Thread(server).start();
                server.setStatus(Status.ENABLED);
                updateServerList();
                return null;
            }
        });
    }

    public Void shutdownServer(String serverName) {
        System.out.println("shutting down server: " + serverName);
        if (!servers.containsKey(serverName)) {
            System.out.println("Server: [" + serverName + "] does not exist");
            return null;
        }
        final Server server = servers.get(serverName);
        if (server.getStatus() == Status.DISABLED) {
            return null;
        }
        server.shutdown();
        updateServerList();
        return null;
    }

    public Void restartServer(String serverName) {
        shutdownServer(serverName);
        return launchServer(serverName);
    }
    
    protected String addServer(String filename){
        if(dashcast){
            return addServerDashcast(filename);
        }
        final File folder = new File("").getAbsoluteFile();
        String srProjRoot = folder.getParentFile().getParentFile().getAbsolutePath();
        String videoFile = null;
        int port = 0;
        String videoTitle = null;
        String parameters = null;
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
            parameters += doc.getElementsByTagName("Parameters").item(0).getTextContent();
        } catch (Exception e) {
            LOGGER.error("Could not launch edash video" + videoTitle + "\n" + e);
            e.printStackTrace();
        }
        
        String command = null;
        if(parameters.contains("-live")){
            String[] parametersArray = parameters.split(" ");
            String videoBandwidth = parametersArray[parameters.indexOf("--video_bandwidth")+1];
            String audioBandwidth = parametersArray[parameters.indexOf("--audio_bandwidth")+1];
            command = "packager ";
            String type = "audio";
            command += "input=" + videoFile + ",stream=" + type + ",init_segment=" + videoTitle + "-" + type + "-" + audioBandwidth + "-" + ".mp4,segment_template=" + videoTitle + "-" + type + "-" + audioBandwidth + ".mp4,bandwidth=" + audioBandwidth + " ";
            type = "video";
            command += "input=" + videoFile + ",stream=" + type + ",init_segment=" + videoTitle + "-" + type + "-" + videoBandwidth + "-" + ".mp4,segment_template=" + videoTitle + "-" + type + "-" + videoBandwidth + ".mp4,bandwidth=" + videoBandwidth + " ";
            command += "--profile live --mpd_output " + videoTitle + ".mpd";
        }else{
            command = "packager input=/home/SeniorProject201516/node-gpac-dash/" + videoFile + ",stream=audio,output=" + videoTitle + "_audio.mp4 " +
                "input=/home/SeniorProject201516/node-gpac-dash/" + videoFile + ",stream=video,output=" + videoTitle + "_video.mp4 " +
                "--profile on-demand --mpd_output " + videoTitle + ".mpd";
        }

        // return null;
        addServer(videoTitle, Constants.getDashcastLaunchVideoCommand(port, videoFile, command, videoTitle, imageName),
                port, videoFile);
        return videoTitle;
    }

    protected String addServerDashcast(String filename) {
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
            dashcastCommand += videoFile + " ";
//            dashcastCommand += "-out " + videoTitle;
            dashcastCommand += doc.getElementsByTagName("Parameters").item(0).getTextContent();
        } catch (Exception e) {
            LOGGER.error("Could not launch dashcast video" + videoTitle + "\n" + e);
            e.printStackTrace();
        }
        LOGGER.debug("port : " + port + "\nvideoTitle: " + videoTitle + "\nvideoFile " + videoFile
                + "\ndashcastCommand: " + dashcastCommand);

        LOGGER.debug(Constants.getDashcastLaunchVideoCommand(port, videoFile, dashcastCommand, videoTitle, imageName));
        // return null;
        addServer(videoTitle, Constants.getDashcastLaunchVideoCommand(port, videoFile, dashcastCommand, videoTitle, imageName),
                port, videoFile);
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

    private void updateServerList() {
        File serverList = new File(Constants.absolutePathToResources() + "//" + Constants.SERVER_LIST_FILE_NAME);
        try {
            PrintWriter writer = new PrintWriter(serverList, "UTF-8");
            writer.println("<Servers>");
            for (String key : servers.keySet()) {
                Server server = servers.get(key);
                writer.println("<Server>");
                writer.println("<Name>" + server.getName() + "</Name>");
                writer.println("<Address>" + server.getAddress() + "</Address>");
                writer.println("<VideoFile>" + server.getVideoFile() + "</VideoFile>");
                writer.println("<Status>" + server.getStatusAsString() + "</Status>");
                writer.println("</Server>");
            }
            writer.println("</Servers>");
            writer.close();
        } catch (FileNotFoundException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        lister.copyFolder();
    }

    public void printAllServers() {
        Columns columns = new Columns();
        columns.addLine("TITLE", "ADDRESS", "VIDEO_FILE", "STATUS");
        columns.addLine("_____", "_______", "__________", "______");
        for (String serverName : servers.keySet()) {
            Server server = servers.get(serverName);
            columns.addLine(server.getName(), "" + server.getAddress(), server.getVideoFile(), "" + server.getStatus());
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

    public void parseCommand(String command) {
        System.out.println(command);
        if (command.equals("quit")) {
            System.exit(0);
        } else if (command.equals("feeds")) {
            this.printAllServers();
        } else if (command.startsWith("launch")) {
            this.launchServer(command.substring(7, command.length()));
        } else if (command.startsWith("shutdown")) {
            this.shutdownServer(command.substring(9, command.length()));
        } else if (command.startsWith("restart")) {
            this.restartServer(command.substring(8, command.length()));
        }
        return;
    }

    public void createServer(String result) {
        //TODO parse strings from file sent, and load video from client.
        String videoName = null;
        int maxPort = 0;
        for (String key : servers.keySet()) {
            Server server = servers.get(key);
            int port = server.getPort();
            if(port > maxPort){
                maxPort = port;
            }
        }
        String videoPort = "" + (maxPort + 1);
        String videoFile = null;
        String dashcastParameters = null;
        String toWrite = "<Server>\n";
        toWrite += "<Server>\n";
        toWrite += "<Name>" + videoName + "</Name>\n";
        toWrite += "<Port>" + videoPort + "</Port>\n";
        toWrite += "<VideoFile>" + videoFile + "</VideoFile>\n";
        toWrite += "<DashcastParameters>" + dashcastParameters + "</DashcastParameters>\n";
        toWrite += "</Server>\n";
        toWrite += "</Servers>\n";
        File newConfigFile = new File(Constants.absolutePathToResources() + "//servers//" + "config-" + videoName);
        try {
            PrintWriter writer = new PrintWriter(newConfigFile, "UTF-8");
            writer.print(toWrite);
            writer.close();
        } catch (FileNotFoundException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

}
