package webauthoringSimSt;

import java.io.IOException;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.mysql.jdbc.Connection;
import com.mysql.jdbc.Statement;

/**
 * Servlet implementation class CreateTutor
 */
@WebServlet("/CreateTutor")
public class CreateTutor extends HttpServlet {
	private static final long serialVersionUID = 1L;
	    /**
     * @see HttpServlet#HttpServlet()
     */
    public CreateTutor() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		int userid = -1;
		Database db = new Database();
		String username = request.getParameter("userName");
		String tutorName = request.getParameter("tutorName");
		String ipaddress = getServletContext().getInitParameter("database");
		try {
			Class.forName(db.getJDBC_DRIVER());
			String DB_URL = "jdbc:mysql://"+ipaddress+":3306/watson";
			Connection conn = (Connection) DriverManager.getConnection(DB_URL,db.getUser(),db.getPassword());
			Statement statement = (Statement) conn.createStatement();
			
			/**
			 * get the userid from the table
			 */
			String query = "select userid from usertable where username="+ "'"+username+ "'";
			ResultSet rs = statement.executeQuery(query);
			while(rs.next())
				userid = rs.getInt(1);
			
			/**
			 * insert tutor's table 
			 */
			if(userid > -1){
				String sql = "insert into tutor (userid,tutorname) values (?,?)";
				PreparedStatement st = conn.prepareStatement(sql);
				st.setInt(1, userid);
				st.setString(2, tutorName);
				st.executeUpdate();
			}
				
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
