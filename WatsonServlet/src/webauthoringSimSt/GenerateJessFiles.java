package webauthoringSimSt;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import webauthoringSimSt.jessFiles.GenerateCLP;
import webauthoringSimSt.jessFiles.GenerateWME;
import webauthoringSimSt.jessFiles.GenerateXML;
import webauthoringSimSt.jessFiles.User;

/**
 * Servlet implementation class GenerateJessFiles
 */
@WebServlet("/GenerateJessFiles")
public class GenerateJessFiles extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private HashMap<String,String> tabAttribute = new HashMap<String,String>();
	HashSet<String> components = new HashSet<String>();
	String hostname = "";
	String portno = "";
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GenerateJessFiles() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//response.getWriter().append("Served at: ").append(request.getContextPath());
		hostname = getServletContext().getInitParameter("hostname");
		portno = getServletContext().getInitParameter("portnumber");
		User user = new User(request.getParameter("userName"),request.getParameter("tutorName"),request.getParameter("html"),getServletContext().getInitParameter("folderPath"));
		System.out.println(" Received request to generate Jess File");
		parseHTML(user);
		if(!tabAttribute.isEmpty()){
			GenerateXML xml = new GenerateXML(tabAttribute,user);
			xml.generateXMLFile();
			GenerateCLP clp = new GenerateCLP(components,user);
			clp.generateCLPFile();
			GenerateWME wme = new GenerateWME(tabAttribute,user);
			wme.generateWMEfile();
		}
		
		//System.out.println(" Redirecting to "+request.getContextPath()+"/SimStWebtutor/TrainSimSt.jsp");
		//response.sendRedirect(request.getContextPath()+"/TrainSimSt.jsp");
	}


	
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	public void parseHTML(User user){
		Document doc;
		try {
			doc = Jsoup.connect(hostname+":"+portno+"/interface/"+user.getUserName()+"/"+user.getTutorName()+"/"+user.getHtml()).get();
			Elements dataEnabled = doc.select("div[data-ctat-enabled=true]");
			
			for(Element element : dataEnabled){
				if(element.hasClass("CTATTable"))
					tabAttribute.put(element.id(),element.attr("data-ctat-num-rows")+","+element.attr("data-ctat-num-cols"));
				else
					tabAttribute.put(element.id(), element.attr("data-ctat-component"));
				components.add(element.attr("data-ctat-component"));

			}
			System.out.println(" Successfully parsed the html");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
}
