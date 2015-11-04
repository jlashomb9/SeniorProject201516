package edu.rosehulman.mpegdash.framework;

import com.beust.jcommander.Parameter;

/**
 * This class contains the parameters to input when executing the program from
 * command line.
 */
public class CommandLineArgs {
    public static final String HELP = "--help";
    @Parameter(names = HELP, description = "Display usage information", help = true)
    private boolean help;

    public boolean getHelp() {
        return help;
    }
}
