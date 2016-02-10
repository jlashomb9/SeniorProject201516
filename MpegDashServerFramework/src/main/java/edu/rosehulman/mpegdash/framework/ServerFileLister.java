package edu.rosehulman.mpegdash.framework;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import edu.rosehulman.mpegdash.constants.Constants;

public class ServerFileLister {
    
    private String directoryOfServers;
    private String directoryOfResources;
    private String directoryToClient;
    
    public ServerFileLister(){
        directoryOfServers = Constants.absolutePathToServerConfigurations();
        directoryOfResources = Constants.absolutePathToResources();
        directoryToClient = Constants.absolutePathToWebService();
    }
    
    public void copyFolder(){
        try {
            FileUtils.copyDirectoryToDirectory(new File(directoryOfServers), new File(directoryToClient));
            FileUtils.copyFileToDirectory(new File(directoryOfResources + "//" + Constants.SERVER_LIST_FILE_NAME), new File(directoryToClient));
        } catch (IOException e) {
            System.out.println("Error copying directory to webservice.");
            e.printStackTrace();
        }
    }

}
