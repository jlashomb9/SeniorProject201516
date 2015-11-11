package edu.rosehulman.testing;

import java.io.IOException;

/**
 * Does client load testing to see how many clients can attach to one server.
 * 
 * @author lashomjt
 *
 */
public class ClientLoadTest extends MPEGDashTesting {
	private int numClients;

	public ClientLoadTest(int numOfClients) {
		this.numClients = numOfClients;
	}

	public void startTest() {
		String[] env = { "PATH=/bin:/usr/bin/" };
		String cmd = workingdirectory + System.getProperty("file.separator")
				+ "MPEGDashTesting" + System.getProperty("file.separator")
				+ "BashScripts" + System.getProperty("file.separator")
				+ "clientLoadTesting.sh " + this.numClients; // e.g test.sh
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
