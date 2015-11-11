package edu.rosehulman.testing;

public class StartTests {
	static final int NUMBER_OF_CLIENTS = 5;
	static final int NUMBER_OF_SERVERS = 30;
	
	public static void main(String[] args) {
		String testType = args[0];
		 MPEGDashTesting loadTest = null;
		 if(testType.equalsIgnoreCase("client"))
		 	loadTest = new ClientLoadTest(NUMBER_OF_CLIENTS);
		 else if(testType.equalsIgnoreCase("server"))//server load test
		 	loadTest = new ServerLoadTest(NUMBER_OF_SERVERS);
		
		 new Thread(loadTest).start();
		
	
	}

}
