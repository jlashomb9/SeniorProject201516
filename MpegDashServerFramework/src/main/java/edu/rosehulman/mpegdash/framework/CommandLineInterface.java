package edu.rosehulman.mpegdash.framework;

import java.util.Scanner;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import com.beust.jcommander.JCommander;

public class CommandLineInterface {

    private static final Logger LOGGER = LogManager.getLogger(CommandLineInterface.class);

    public static void main(String[] args) {
        CommandLineArgs params = new CommandLineArgs();
        JCommander cmd = new JCommander(params);

        // parse given arguments
        cmd.parse(args);

        // show usage information if help flag exists
        if (params.getHelp()) {
            cmd.usage();
            return;
        }
        
        String imageName = "mpegdash/nodejs";
        if (params.getSetup()) {
//            imageName = params.getImageName();
            DockerCommandLauncher.setupImage(imageName, params.getDashcast());
            System.exit(0);
            return;
        }
        
        ServerLauncher launcher = new ServerLauncher(params.getAutoLaunch(), params.getIP(), params.getDashcast(), params.getImageName());
        Scanner scanner = new Scanner(System.in);
        String line = null;
        printHelpMessage();
        
        while(scanner.hasNext()){
            line = scanner.nextLine();
            if(line.equals("quit")){
                System.exit(0);
            }else if(line.equals("feeds")){
                launcher.printAllServers();
            }else if(line.startsWith("launch")){
                launcher.launchServer(line.substring(7, line.length()));
            }else if(line.startsWith("shutdown")){
                launcher.shutdownServer(line.substring(9, line.length()));
            }else if(line.startsWith("restart")){
                launcher.restartServer(line.substring(8, line.length()));
            }else{
                printHelpMessage();
            }
        }
    }
    
    private static void printHelpMessage(){
        System.out.println(
                "Valid commands: \n" +
                "quit - exits the current program and shuts down all video feeds\n" +
                "feeds - prints out a list of video feeds and their details\n" +
                "launch [video title] - launches the specified server if not enabled\n" +
                "shutdown [video title] - shuts down the specified server if not disabled\n");
    }
    

}