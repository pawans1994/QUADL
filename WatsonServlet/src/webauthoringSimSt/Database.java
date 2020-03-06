package webauthoringSimSt;

public class Database {
	private  final String JDBC_DRIVER="com.mysql.jdbc.Driver";
	private  final String user = "root";
	private final  String password = "simstudent";
	public String getJDBC_DRIVER() {
		return JDBC_DRIVER;
	}
	public String getUser() {
		return user;
	}
	public String getPassword() {
		return password;
	}
}
