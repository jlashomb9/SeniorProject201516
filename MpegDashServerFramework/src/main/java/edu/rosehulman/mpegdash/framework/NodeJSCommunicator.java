package edu.rosehulman.mpegdash.framework;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.Scanner;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import edu.rosehulman.mpegdash.constants.Constants;

public class NodeJSCommunicator implements Runnable {

    private static final Logger LOGGER = LogManager.getLogger(DirectoryMonitor.class);

    private WatchService watcher;
    private Path dir;
    public String currentDir;
    public ServerLauncher serverLauncher;

    public NodeJSCommunicator(ServerLauncher serverLauncher) {
        try {
            watcher = FileSystems.getDefault().newWatchService();
        } catch (IOException e) {
            LOGGER.error("Error initializing WatchService:\n" + e);
            System.exit(1);
        }
        String absPath = Constants.absolutePathToNodeJS().replaceAll("%20", " ");
        final File folder = new File(absPath);
        dir = folder.toPath();
        this.serverLauncher = serverLauncher;
    }

    public void run() {
        while (!Thread.interrupted()) {
            try {
                WatchKey key = dir.register(watcher, StandardWatchEventKinds.ENTRY_CREATE);
                for (WatchEvent<?> event : key.pollEvents()) {
                    WatchEvent.Kind<?> kind = event.kind();
                    WatchEvent<Path> ev = (WatchEvent<Path>) event;
                    Path filename = ev.context();
                    if (kind == StandardWatchEventKinds.OVERFLOW) {
                        continue;
                    } else if (kind == StandardWatchEventKinds.ENTRY_CREATE) {
                        String result = "";
                        try {
                            Thread.sleep(1000);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                        System.out.println(dir + File.separator + filename.toString());
                        Scanner myScanner = new Scanner(new File(dir + File.separator + filename.toString()));
                        while(myScanner.hasNextLine()){
                            result += myScanner.nextLine();
                        }
                        serverLauncher.parseCommand(result);
                    }
                }
            } catch (IOException x) {
                LOGGER.error("Error retrieving server configurations " + x);
            }
        }
    }

}
