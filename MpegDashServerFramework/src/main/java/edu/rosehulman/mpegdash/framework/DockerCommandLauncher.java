package edu.rosehulman.mpegdash.framework;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import edu.rosehulman.mpegdash.constants.Constants;
import edu.rosehulman.mpegdash.framework.Server.Status;

public class DockerCommandLauncher {

    
    public static final void setupImage(String name, boolean dashcast){
        Process ls = null;
        String[] cmd = { "/bin/bash", "-c", Constants.getDashcastSetupCommand(name, dashcast)};

        BufferedReader input = null;
        String line = null;
        BufferedReader error = null;
        try {
            ls = Runtime.getRuntime().exec(cmd);
            input = new BufferedReader(new InputStreamReader(ls.getInputStream()));
            error = new BufferedReader(new InputStreamReader(ls.getErrorStream()));
        } catch (IOException e1) {
            e1.printStackTrace();
            System.exit(1);
        }
        try {
            while ((line = input.readLine()) != null)
                System.out.println(line);

            while ((line = error.readLine()) != null)
                System.out.println(line);

        } catch (IOException e1) {
            e1.printStackTrace();
            System.exit(1);
        }
    }

}
