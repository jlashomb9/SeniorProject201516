package edu.rosehulman.testing;

import java.lang.management.ManagementFactory;
import java.lang.management.OperatingSystemMXBean;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;

/**
 * The MPEG Dash testing base class. Holds some variables and methods too be
 * used in the testing. Variable to change.
 * 
 * @author lashomjt
 *
 */
public abstract class MPEGDashTesting implements Runnable {
	protected String workingdirectory = System.getProperty("user.dir");

	/**
	 * Hold the logic for each of the different MPEG Dash test that will be
	 * implement for the given task.
	 */
	abstract public void startTest();

	/**
	 * Prints out the different system data for the computer
	 */
	public static void printSystemData() {
		OperatingSystemMXBean operatingSystemMXBean = ManagementFactory
				.getOperatingSystemMXBean();
		for (Method method : operatingSystemMXBean.getClass()
				.getDeclaredMethods()) {
			method.setAccessible(true);
			if (method.getName().startsWith("get")
					&& Modifier.isPublic(method.getModifiers())) {
				Object value;
				try {
					value = method.invoke(operatingSystemMXBean);
				} catch (Exception e) {
					value = e;
				}
				System.out.println(method.getName() + " = " + value);
			}
		}
	}
}
