package webauthoringSimSt.jessFiles;

import java.io.File;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;


public class GenerateXML {
	
	HashMap<String,String> tabAttribute;
	User user;
	public GenerateXML(HashMap<String,String> components, User user){
		this.tabAttribute = components;
		this.user = user;
		
	}
	public void generateXMLFile(){
		 DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
		 try {
			 
			DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
			org.w3c.dom.Document doc = docBuilder.newDocument();
			
			/***
			 * Create <MessageBundle>
			 */
			org.w3c.dom.Element rootElement = doc.createElement("MessageBundle");
			doc.appendChild(rootElement);
			
			/**
			 * generate <message> node for each component
			 */		
					
			for(Map.Entry<String, String> tabEntry : tabAttribute.entrySet()){
				if(tabEntry.getValue().contains(",")){
					int row = Integer.parseInt(tabEntry.getValue().split(",")[0]);
					int col = Integer.parseInt(tabEntry.getValue().split(",")[1]);
					for(int i=0 ;i<row; i++){
						for(int j=0; j<col; j++){
							rootElement.appendChild(generateMessageNode(doc, tabEntry.getKey()+"_C"+j+"R"+i));
						}
					}
					
				}
				else
					rootElement.appendChild(generateMessageNode(doc,tabEntry.getKey()));

			}
			
			
			/**
			 *  Create <message> node for textFieldSkill as this is not part of CTAT element but servlet expects
			 */
			rootElement.appendChild(generateMessageNode(doc,"textFieldSkill"));
			
			if(!tabAttribute.containsKey("done"))
				rootElement.appendChild(generateMessageNode(doc,"done"));

			TransformerFactory transformerFactory = TransformerFactory.newInstance();
			Transformer transformer = transformerFactory.newTransformer();
			transformer.setOutputProperty("omit-xml-declaration", "yes");
			DOMSource source = new DOMSource(doc);
			StreamResult result = new StreamResult(new File(user.getParentPath()+File.separator+user.getUserName()+File.separator+user.getTutorName()+File.separator+"interface.xml"));
			transformer.transform(source, result);
			
			
			
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (TransformerConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (TransformerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		 
		 
		 
	}
	
	public org.w3c.dom.Element generateMessageNode(org.w3c.dom.Document doc, String node){
		
		/**Create <message>**/
		org.w3c.dom.Element messageNode = doc.createElement("message");
		/** Create <verb>**/
		org.w3c.dom.Element verbNode = doc.createElement("verb");
		verbNode.appendChild(doc.createTextNode("NotePropertySet"));
		messageNode.appendChild(verbNode);
		/**Create <property>**/
		messageNode.appendChild(generatePropertyNodes(doc,node));
		return messageNode;

	}
	
	
	
	public org.w3c.dom.Element generatePropertyNodes(org.w3c.dom.Document doc, String nodeName){
		 LinkedHashMap<String,String> property = new LinkedHashMap<String,String>();
		 property.put("MessageType","InterfaceAttribute");
		 property.put("component",nodeName);
		 property.put("background_color","#ffffff");
		 property.put("border_color", "#999999");
		 property.put("border_style", "solid");
		 property.put("border_width", "1px");
		 property.put("enabled", "true");
		 property.put("font_color", "#000000");
		 property.put("font_size", "12");
		 property.put("height", "20");
		 property.put("hint_highlight", "false");
		 property.put("text", "");
		 property.put("width", "100");
		 property.put("x_coor", "200");
		 property.put("y_coor", "20");
		 property.put("session_id", "803da443-b605-3a62-ff2d-85ca5ae1162c");


		org.w3c.dom.Element propertiesNode = doc.createElement("properties");
		
		for(Map.Entry<String,String> entry : property.entrySet()){
				org.w3c.dom.Element node = doc.createElement(entry.getKey());
				node.appendChild(doc.createTextNode(entry.getValue()));
				propertiesNode.appendChild(node);
		}
		
		return propertiesNode;
	}
}
