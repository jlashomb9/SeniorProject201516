package edu.rosehulman.mpegdash.framework;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import com.beust.jcommander.JCommander;

import edu.rosehulman.mpegdash.framework.ServerLauncher;

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
        ServerLauncher launcher = new ServerLauncher();
    }

}