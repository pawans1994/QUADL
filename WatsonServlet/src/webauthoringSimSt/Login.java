package webauthoringSimSt;

import java.io.IOException;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.mindrot.jbcrypt.BCrypt;

import com.mysql.jdbc.Connection;
import com.mysql.jdbc.Statement;

/**
 * Servlet implementation class Login
 */
@WebServlet("/Login")
public class Login extends HttpServlet {
	private static final long serialVersionUID = 1L;
	/**
     * @see HttpServlet#HttpServlet()
     */
    public Login() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//response.getWriter().append("Served at: ").append(request.getContextPath());
	
	
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		String ipaddress = getServletContext().getInitParameter("database");
		System.out.println(" User name : "+username+" Password : "+password);
		boolean matched = authenticateUser(username,password,ipaddress);
		System.out.println(" Result : "+matched);
		if(matched)
			response.getWriter().write("valid");
		else
			response.getWriter().write("invalid");
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	
	protected boolean authenticateUser(String username, String pwd,String ipaddress){
		Connection conn = null;
		try {
			System.out.println("Authenticating the user");
			String hashedPwd="";
			String DB_URL = "jdbc:mysql://"+ipaddress+":3306/watson";
			Database db = new Database();
			Class.forName(db.getJDBC_DRIVER());
			conn = (Connection) DriverManager.getConnection(DB_URL,db.getUser(),db.getPassword());
			Statement statement = (Statement) conn.createStatement();
			String sqlQuery = "select password from usertable where username="+ "'"+username+ "'";
			ResultSet rs = statement.executeQuery(sqlQuery);
			while(rs.next())
				hashedPwd  = rs.getString("password");
			System.out.println("completed Authenticating the user "+hashedPwd+" given : "+pwd);
			
			
			return BCrypt.checkpw(pwd,hashedPwd);
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally{
			 if( conn != null){
				 try {
						conn.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
			 }			
		}
	   return false;
		
	}

}
