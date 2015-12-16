package edu.rosehulman.mpegdash.framework;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import edu.rosehulman.mpegdash.constants.Constants;

public class DirectoryMonitor implements Runnable {

    private static final Logger LOGGER = LogManager.getLogger(DirectoryMonitor.class);

    private WatchService watcher;
    private Path dir;
    public String currentDir;
    public ServerLauncher serverLauncher;

    public DirectoryMonitor(ServerLauncher serverLauncher) {
        try {
            watcher = FileSystems.getDefault().newWatchService();
        } catch (IOException e) {
            LOGGER.error("Error initializing WatchService:\n" + e);
            System.exit(1);
        }
        dir = new File(Constants.PATH_TO_SERVER_CONFIGURATIONS).toPath();
        final File folder = new File(Constants.PATH_TO_SERVER_CONFIGURATIONS);
        for (final File fileEntry : folder.listFiles()) {
            serverLauncher.addServer(fileEntry.getAbsolutePath().toString());
        }
        this.serverLauncher = serverLauncher;
    }

    public void run() {
        while (!Thread.interrupted()) {
            try {
                WatchKey key = dir.register(watcher, StandardWatchEventKinds.ENTRY_CREATE,
                        StandardWatchEventKinds.ENTRY_DELETE, StandardWatchEventKinds.ENTRY_MODIFY);
                for (WatchEvent<?> event : key.pollEvents()) {
                    WatchEvent.Kind<?> kind = event.kind();
                    WatchEvent<Path> ev = (WatchEvent<Path>) event;
                    Path filename = ev.context();
                    if (!filename.toUri().toString().endsWith(".xml")) {
                        continue;
                    }
                    if (kind == StandardWatchEventKinds.OVERFLOW) {
                        continue;
                    } else if (kind == StandardWatchEventKinds.ENTRY_CREATE) {
                        serverLauncher.addServer(filename.toString());
                    } else if (kind == StandardWatchEventKinds.ENTRY_DELETE) {
                        serverLauncher.removeServer(filename.toString());
                    }
                }
            } catch (IOException x) {
                LOGGER.error("Error retrieving server configurations " + x);
            }
        }
    }

}
