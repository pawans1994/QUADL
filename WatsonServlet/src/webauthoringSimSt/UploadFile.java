package webauthoringSimSt;

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

/**
 * Servlet implementation class UploadFile
 */
@WebServlet("/UploadFile")
public class UploadFile extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private String filePath;
    private File file;
    
    
   
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UploadFile() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		//response.getWriter().append("Served at: ").append(request.getContextPath());
    	filePath = getServletContext().getInitParameter("folderPath");
    	String username="";
    	String tutor="";
    	File dir = null; 
    	
    	
		DiskFileItemFactory factory = new DiskFileItemFactory();
		ServletFileUpload upload = new ServletFileUpload(factory);
		
		try{
			List<FileItem> files = upload.parseRequest(request);
			for(int i=0; i<files.size(); i++){
				FileItem fileItem = files.get(i);
				
				 if( fileItem.isFormField()) {
	                  if(fileItem.getFieldName().equals("tutorName"))
	                	  tutor = fileItem.getString();
	                  else
	                	  username = fileItem.getString();
	                  
	                  if(tutor.length() > 0 && username.length() > 0){
	                	  dir = new File(filePath+File.separator+username+File.separator+tutor);
	                  	  dir.mkdirs();
	                  }
	               } else {
	                  file = new File(dir.getAbsolutePath()+File.separator+fileItem.getName()) ;
	                  System.out.println(" Path : "+file.getAbsolutePath());
   	 				 fileItem.write(file);

	               }
			}
			System.out.println(" Successfully uploaded !");
		}
		catch(Exception ex){
			ex.printStackTrace();
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
