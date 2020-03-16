//	HYPE.documents["oli-metacognitive"]

(function HYPE_DocumentLoader() {
	var resourcesFolderName = "oli-metacognitive.hyperesources";
	var documentName = "oli-metacognitive";
	var documentLoaderFilename = "olimetacognitive_hype_generated_script.js";
	var mainContainerID = "olimetacognitive_hype_container";

	// find the URL for this script's absolute path and set as the resourceFolderName
	try {
		var scripts = document.getElementsByTagName('script');
		for(var i = 0; i < scripts.length; i++) {
			var scriptSrc = scripts[i].src;
			if(scriptSrc != null && scriptSrc.indexOf(documentLoaderFilename) != -1) {
				resourcesFolderName = scriptSrc.substr(0, scriptSrc.lastIndexOf("/"));
				break;
			}
		}
	} catch(err) {	}

	// Legacy support
	if (typeof window.HYPE_DocumentsToLoad == "undefined") {
		window.HYPE_DocumentsToLoad = new Array();
	}
 
	// load HYPE.js if it hasn't been loaded yet
	if(typeof HYPE_160 == "undefined") {
		if(typeof window.HYPE_160_DocumentsToLoad == "undefined") {
			window.HYPE_160_DocumentsToLoad = new Array();
			window.HYPE_160_DocumentsToLoad.push(HYPE_DocumentLoader);

			var headElement = document.getElementsByTagName('head')[0];
			var scriptElement = document.createElement('script');
			scriptElement.type= 'text/javascript';
			scriptElement.src = resourcesFolderName + '/' + 'HYPE.js?hype_version=160';
			headElement.appendChild(scriptElement);
		} else {
			window.HYPE_160_DocumentsToLoad.push(HYPE_DocumentLoader);
		}
		return;
	}
	
	// handle attempting to load multiple times
	if(HYPE.documents[documentName] != null) {
		var index = 1;
		var originalDocumentName = documentName;
		do {
			documentName = "" + originalDocumentName + "-" + (index++);
		} while(HYPE.documents[documentName] != null);
		
		var allDivs = document.getElementsByTagName("div");
		var foundEligibleContainer = false;
		for(var i = 0; i < allDivs.length; i++) {
			if(allDivs[i].id == mainContainerID && allDivs[i].getAttribute("HYPE_documentName") == null) {
				var index = 1;
				var originalMainContainerID = mainContainerID;
				do {
					mainContainerID = "" + originalMainContainerID + "-" + (index++);
				} while(document.getElementById(mainContainerID) != null);
				
				allDivs[i].id = mainContainerID;
				foundEligibleContainer = true;
				break;
			}
		}
		
		if(foundEligibleContainer == false) {
			return;
		}
	}
	
	var hypeDoc = new HYPE_160();
	
	var attributeTransformerMapping = {b:"i",c:"i",bC:"i",d:"i",aS:"i",M:"i",e:"f",aT:"i",N:"i",f:"d",O:"i",g:"c",aU:"i",P:"i",Q:"i",aV:"i",R:"c",bG:"f",aW:"f",aI:"i",S:"i",bH:"d",l:"d",aX:"i",T:"i",m:"c",bI:"f",aJ:"i",n:"c",aK:"i",bJ:"f",X:"i",aL:"i",A:"c",aZ:"i",Y:"bM",B:"c",bK:"f",bL:"f",C:"c",D:"c",t:"i",E:"i",G:"c",bA:"c",a:"i",bB:"i"};
	
	var resources = {"7":{n:"bubble-man3.png",p:1},"3":{n:"5-apply.png",p:1},"8":{n:"bubble-man2.png",p:1},"4":{n:"6-reflect.png",p:1},"0":{n:"2-assess.png",p:1},"5":{n:"1-main.png",p:1},"1":{n:"3-evaluate.png",p:1},"6":{n:"bubble-man4.png",p:1},"2":{n:"4-plan.png",p:1}};
	
	var scenes = [{x:0,p:"600px",c:"#FFFFFF",v:{"63":{o:"content-box",h:"7",x:"visible",a:272,q:"100% 100%",b:176,j:"absolute",r:"inline",c:93,k:"div",z:"8",d:126,e:"0.000000"},"2":{o:"content-box",h:"0",x:"visible",a:0,q:"100% 100%",b:0,j:"absolute",r:"inline",c:629,k:"div",z:"5",d:483,e:"1.000000"},"57":{a:404,z:"16",b:146,c:107,K:"None",L:"None",d:104,aS:6,M:0,bD:"none",aD:[{timelineIdentifier:"kTimelineDefaultIdentifier",type:9,goToTime:2}],N:0,aT:6,O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",D:"#A0A0A0",t:13,aA:[{timelineIdentifier:"kTimelineDefaultIdentifier",type:9,goToTime:2}],F:"center",G:"#000000",aP:"pointer",w:"",x:"visible",I:"None",aC:[{type:1,sceneOid:"1",transition:1}],y:"preserve",J:"None"},"3":{o:"content-box",h:"1",x:"visible",a:0,q:"100% 100%",b:0,j:"absolute",r:"inline",c:629,k:"div",z:"4",d:483,e:"1.000000"},"58":{a:332,z:"17",b:307,c:107,K:"None",L:"None",d:104,aS:6,M:0,bD:"none",aD:[{timelineIdentifier:"kTimelineDefaultIdentifier",type:9,goToTime:3}],N:0,aT:6,O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",D:"#A0A0A0",t:13,aA:[{timelineIdentifier:"kTimelineDefaultIdentifier",type:9,goToTime:3}],F:"center",G:"#000000",aP:"pointer",w:"",x:"visible",I:"None",aC:[{type:1,sceneOid:"1",transition:1}],y:"preserve",J:"None"},"64":{o:"content-box",h:"8",x:"visible",a:272,q:"100% 100%",b:176,j:"absolute",r:"inline",c:93,k:"div",z:"7",d:126,e:"0.000000"},"4":{o:"content-box",h:"2",x:"visible",a:0,q:"100% 100%",b:0,j:"absolute",r:"inline",c:629,k:"div",z:"3",d:483,e:"1.000000"},"60":{a:131,z:"19",b:103,c:107,K:"None",L:"None",d:104,aS:6,M:0,bD:"none",aD:[{timelineIdentifier:"kTimelineDefaultIdentifier",type:9,goToTime:5}],N:0,aT:6,O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",D:"#A0A0A0",t:13,aA:[{timelineIdentifier:"kTimelineDefaultIdentifier",type:9,goToTime:5}],F:"center",G:"#000000",aP:"pointer",w:"",x:"visible",I:"None",aC:[{type:1,sceneOid:"1",transition:1}],y:"preserve",J:"None"},"5":{o:"content-box",h:"3",x:"visible",a:0,q:"100% 100%",b:0,j:"absolute",r:"inline",c:629,k:"div",z:"2",d:483,e:"1.000000"},"50":{a:261,z:"10",b:28,c:107,K:"None",L:"None",d:104,aS:6,M:0,bD:"none",aD:[{timelineIdentifier:"kTimelineDefaultIdentifier",type:9,goToTime:1}],N:0,aT:6,O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",D:"#A0A0A0",t:13,aA:[{timelineIdentifier:"kTimelineDefaultIdentifier",type:9,goToTime:1}],F:"center",G:"#000000",aP:"pointer",w:"",x:"visible",I:"None",aC:[{type:1,sceneOid:"1",transition:1}],y:"preserve",J:"None"},"59":{a:155,z:"18",b:272,c:107,K:"None",L:"None",d:104,aS:6,M:0,bD:"none",aD:[{timelineIdentifier:"kTimelineDefaultIdentifier",type:9,goToTime:4}],N:0,aT:6,O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",D:"#A0A0A0",t:13,aA:[{timelineIdentifier:"kTimelineDefaultIdentifier",type:9,goToTime:4}],F:"center",G:"#000000",aP:"pointer",w:"",x:"visible",I:"None",aC:[{type:1,sceneOid:"1",transition:1}],y:"preserve",J:"None"},"6":{o:"content-box",h:"4",x:"visible",a:0,q:"100% 100%",b:0,j:"absolute",r:"inline",c:629,k:"div",z:"1",d:483,e:"1.000000"},"7":{o:"content-box",h:"5",x:"visible",a:0,q:"100% 100%",b:0,j:"absolute",r:"inline",c:629,k:"div",z:"6",d:483,e:"1.000000"},"56":{b:173,z:"15",K:"None",c:61,L:"None",d:114,aS:6,M:0,bD:"none",N:0,aT:6,O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",D:"#A0A0A0",t:13,aA:[{type:1,sceneOid:"1",transition:1}],F:"center",G:"#000000",aP:"pointer",w:"",x:"visible",I:"None",a:284,y:"preserve",J:"None"},"62":{o:"content-box",h:"6",x:"visible",a:272,q:"100% 100%",b:176,j:"absolute",r:"inline",c:93,k:"div",z:"9",d:126,e:"0.000000"}},n:"Scene-1",onSceneLoadActions:[{type:3,timelineIdentifier:"kTimelineDefaultIdentifier"}],T:{kTimelineDefaultIdentifier:{d:6,i:"kTimelineDefaultIdentifier",n:"Main Timeline",a:[{f:"2",t:0,d:0.29,i:"e",e:"1.000000",s:"1.000000",o:"7"},{f:"0",t:0,d:0.08,i:"e",e:"1.000000",s:"0.000000",o:"64"},{f:"0",t:0.08,d:0.08,i:"e",e:"1.000000",s:"0.000000",o:"63"},{f:"0",t:0.08,d:0.21,i:"e",e:"0.000000",s:"1.000000",o:"64"},{f:"0",t:0.16,d:0.08,i:"e",e:"1.000000",s:"0.000000",o:"62"},{f:"0",t:0.16,d:0.13,i:"e",e:"0.000000",s:"1.000000",o:"63"},{f:"0",t:0.24,d:0.05,i:"e",e:"0.000000",s:"1.000000",o:"62"},{f:"0",t:0.29,p:2,d:0.01,i:"Actions",e:[{type:7,timelineIdentifier:"kTimelineDefaultIdentifier"}],s:[{type:9,timelineIdentifier:"kTimelineDefaultIdentifier",goToTime:0}],o:"kTimelineDefaultIdentifier"},{f:"2",t:0.29,d:0.01,i:"e",e:"0.000000",s:"1.000000",o:"7"},{f:"2",t:1,d:1,i:"e",e:"0.000000",s:"1.000000",o:"2"},{f:"0",t:1,p:2,d:1,i:"Actions",e:[{type:7,timelineIdentifier:"kTimelineDefaultIdentifier"}],s:[{type:7,timelineIdentifier:"kTimelineDefaultIdentifier"}],o:"kTimelineDefaultIdentifier"},{f:"0",t:2,p:2,d:1,i:"Actions",e:[{type:7,timelineIdentifier:"kTimelineDefaultIdentifier"}],s:[{type:7,timelineIdentifier:"kTimelineDefaultIdentifier"}],o:"kTimelineDefaultIdentifier"},{f:"2",t:2,d:1,i:"e",e:"0.000000",s:"1.000000",o:"3"},{f:"0",t:3,p:2,d:1,i:"Actions",e:[{type:7,timelineIdentifier:"kTimelineDefaultIdentifier"}],s:[{type:7,timelineIdentifier:"kTimelineDefaultIdentifier"}],o:"kTimelineDefaultIdentifier"},{f:"2",t:3,d:1,i:"e",e:"0.000000",s:"1.000000",o:"4"},{f:"0",t:4,p:2,d:1,i:"Actions",e:[{type:7,timelineIdentifier:"kTimelineDefaultIdentifier"}],s:[{type:7,timelineIdentifier:"kTimelineDefaultIdentifier"}],o:"kTimelineDefaultIdentifier"},{f:"2",t:4,d:1,i:"e",e:"0.000000",s:"1.000000",o:"5"},{f:"0",t:5,p:2,d:0,i:"Actions",s:[{type:7,timelineIdentifier:"kTimelineDefaultIdentifier"}],o:"kTimelineDefaultIdentifier"},{f:"2",t:5,d:1,i:"e",e:"0.000000",s:"1.000000",o:"6"}],f:30}},o:"1"},{x:1,p:"600px",c:"#FFFFFF",v:{"11":{o:"content-box",h:"0",x:"visible",a:0,q:"100% 100%",b:0,j:"absolute",r:"inline",c:629,k:"div",z:"1",d:483}},n:"Scene-2",T:{kTimelineDefaultIdentifier:{d:0,i:"kTimelineDefaultIdentifier",n:"Main Timeline",a:[],f:30}},o:"14"},{x:2,p:"600px",c:"#FFFFFF",v:{"16":{o:"content-box",h:"1",x:"visible",a:0,q:"100% 100%",b:0,j:"absolute",r:"inline",c:629,k:"div",z:"2",d:483}},n:"Scene-3",T:{kTimelineDefaultIdentifier:{d:0,i:"kTimelineDefaultIdentifier",n:"Main Timeline",a:[],f:30}},o:"21"},{x:3,p:"600px",c:"#FFFFFF",v:{"25":{o:"content-box",h:"2",x:"visible",a:0,q:"100% 100%",b:0,j:"absolute",r:"inline",c:629,k:"div",z:"3",d:483}},n:"Scene-4",T:{kTimelineDefaultIdentifier:{d:0,i:"kTimelineDefaultIdentifier",n:"Main Timeline",a:[],f:30}},o:"28"},{x:4,p:"600px",c:"#FFFFFF",v:{"29":{o:"content-box",h:"3",x:"visible",a:0,q:"100% 100%",b:0,j:"absolute",r:"inline",c:629,k:"div",z:"4",d:483}},n:"Scene-5",T:{kTimelineDefaultIdentifier:{d:0,i:"kTimelineDefaultIdentifier",n:"Main Timeline",a:[],f:30}},o:"35"},{x:5,p:"600px",c:"#FFFFFF",v:{"41":{o:"content-box",h:"4",x:"visible",a:0,q:"100% 100%",b:0,j:"absolute",r:"inline",c:629,k:"div",z:"5",d:483}},n:"Scene-6",T:{kTimelineDefaultIdentifier:{d:0,i:"kTimelineDefaultIdentifier",n:"Main Timeline",a:[],f:30}},o:"42"}];
	
	var javascripts = [];
	
	var functions = {};
	var javascriptMapping = {};
	for(var i = 0; i < javascripts.length; i++) {
		try {
			javascriptMapping[javascripts[i].identifier] = javascripts[i].name;
			eval("functions." + javascripts[i].name + " = " + javascripts[i].source);
		} catch (e) {
			hypeDoc.log(e);
			functions[javascripts[i].name] = (function () {});
		}
	}
	
	hypeDoc.setAttributeTransformerMapping(attributeTransformerMapping);
	hypeDoc.setResources(resources);
	hypeDoc.setScenes(scenes);
	hypeDoc.setJavascriptMapping(javascriptMapping);
	hypeDoc.functions = functions;
	hypeDoc.setCurrentSceneIndex(0);
	hypeDoc.setMainContentContainerID(mainContainerID);
	hypeDoc.setResourcesFolderName(resourcesFolderName);
	hypeDoc.setShowHypeBuiltWatermark(0);
	hypeDoc.setShowLoadingPage(false);
	hypeDoc.setDrawSceneBackgrounds(true);
	hypeDoc.setGraphicsAcceleration(true);
	hypeDoc.setDocumentName(documentName);

	HYPE.documents[documentName] = hypeDoc.API;
	document.getElementById(mainContainerID).setAttribute("HYPE_documentName", documentName);

	hypeDoc.documentLoad(this.body);
}());

