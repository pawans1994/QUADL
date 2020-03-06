package webauthoringSimSt.jessFiles;

public class User {
	private String userName;
	private String tutorName;
	private String html;
	private String parentPath;

	public User(String userName, String tutorName, String html, String parentPath) {
		super();
		this.userName = userName;
		this.tutorName = tutorName;
		this.html = html;
		this.parentPath = parentPath;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getTutorName() {
		return tutorName;
	}
	public void setTutorName(String tutorName) {
		this.tutorName = tutorName;
	}
	public String getHtml() {
		return html;
	}
	public void setHtml(String html) {
		this.html = html;
	}
	public String getParentPath() {
		return parentPath;
	}
	public void setParentPath(String parentPath) {
		this.parentPath = parentPath;
	}
	
}
