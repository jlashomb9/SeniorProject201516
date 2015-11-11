package edu.rosehulman.testing;
import java.io.IOException;

/**
 * Does server load testing to see many streams can be put out of one server.
 * 
 * @author lashomjt
 *
 */
public class ServerLoadTest extends MPEGDashTesting {

	private int numOfServers;

	public ServerLoadTest(int numberOfServers) {
		this.numOfServers = numberOfServers;
	}

	@Override
	public void startTest() {
		String[] env = { "PATH=/bin:/usr/bin/" };
		String cmd = workingdirectory + System.getProperty("file.separator")
				+ "MPEGDashTesting" + System.getProperty("file.separator")
				+ "BashScripts" + System.getProperty("file.separator")
				+ "serverLoadTesting.sh " + this.numOfServers; // e.g test.sh
																// -dparam1
																// -oout.txt
		try {
			Runtime.getRuntime().exec(cmd, env);
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	@Override
	public void run() {
		startTest();
		while (true) {
			printSystemData();
			try {
				Thread.sleep(10000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}

	}

}
