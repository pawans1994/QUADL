/*-----------------------------------------------------------------*\
|	File:			loadXML.as
|	Language:		Flash 5 ActionScript
|	Purpose:		Define generic functions that can be used by
|					any Flash 5 application to receive
|					JavaScript Objects from a server via XML.
|
|					This makes it so that the Flash 5 developer
|					doesn't have to hand-code all of the logic
|					for loading and stepping thorugh complex data 
|					structures via XML.  ECMAScript Objects 
|					are much simpler to deal with.
|
|	Dependancies:	none
|	By:				Phil Scott
|	Developed:		April 2001
|
|	Class:			LoadXML
|
|	Constructor:
|		var myXML = new LoadXML();
|				(or)
|		var myXML = new LoadXML(myObject);
|
|	Public Methods:
|		.getFrom( strURL )
|
|	Public Properties:
|		.errorMsg			// string value, containing any error messages after a call
|							//		to any one of the class methods.  If everything was
|							//		processed successfully, this property should have a
|							//		value of "" (empty string).
|		.transferComplete	// boolean (true or false) value, set after a call to the
|							//     .sentTo() or .getFrom() method.
|		.onLoad				// function reference, pointing to a user-defined function
|							// 		that gets called by LoadXML whenever Flash
|							//		finishes loading the XML data.
|
|	Private Properties:
|		.object
|		.xmlString
|		.xmlDoc
|
|	Private Functions:
|		XMLDocToObject(oXML)
|		buildObject(obj, eItem)
|
|	Copyright Juxt Interactive, 2001.  All Rights Reserved.
\*-----------------------------------------------------------------*/


var XML_NODE_TYPE_TEXT = 3;
var XML_NODE_TYPE_ELEMENT = 1;


//-------------------------------------------------------------------
// Purpose: given an XML document converts the contents into 
//			a JavaScript object.
//-------------------------------------------------------------------
function XMLDocToObject(oXML) {
	var obj = [];

	if (oXML == null) {
		return obj;
	}

	//--- Step past the root element to the first ARRAY node ---
	var eRoot = oXML.firstChild;
	if (eRoot != null) {

		//--- Start with the first node ---
		obj = buildObject(obj, eRoot);
	}

//dumpObject(obj, 0, 'XMLDocToObject: obj');

	return obj;
}

//-------------------------------------------------------------------
// Purpose: Called by XMLDocToObject() function, to recursively build
//			the object from the XML document.
//-------------------------------------------------------------------
function buildObject(obj, eItem) {

	var idx, eChild;
	var oTarget;


	//--- Loop through the sibling elements in this level of the XML ---
	while (eItem != null) {
   		idx = eItem.nodeName;

		if (eItem.nodeType == XML_NODE_TYPE_ELEMENT) {

			//
			//--- Recursively process any other child nodes ---
			oTarget = buildObject( {}, eItem.firstChild);


			//
			//--- Process any XML node attributes ---
			for (var attrib in eItem.attributes) {
				oTarget[attrib] = eItem.attributes[attrib];
			}

			//
			//--- Check the first child, and see if it's a simple text node ---
			if (eItem.nodeValue != null) {
				//--- Save the value from the TEXT element into the object ---
				oTarget._value = eItem.nodeValue;
			} else {
				eChild = eItem.firstChild;
				if (eChild != null) {
					if (eChild.nodeType == XML_NODE_TYPE_TEXT) {
						if (eChild.nodeValue != null) {
							//--- Save the value from the TEXT element into the object ---
							oTarget._value = eChild.nodeValue;
						}
					}
				}
			}

			//
			//--- If there are duplicate nodenames, convert them to an array ---
			if (obj[idx] != null) {
				if (obj[idx]._type != 'array') {
				//	oTarget = new Array();
				//	oTarget[0] = obj[idx];
				//	obj[idx] = oTarget;
	
					obj[idx] = [ obj[idx] ];
					obj[idx]._type = 'array';
					obj[idx][1] = oTarget;
				} else {
					obj[idx][ obj[idx].length ] = oTarget;
				}
			} else {
				obj[idx] = oTarget;
			}

		}	//*** END OF: if (eItem.nodeType == XML_NODE_TYPE_ELEMENT) ***



		//-- Get the next sibling node in this level of the XML ---
		eItem = eItem.nextSibling;

	}	//*** END OF: while(eItem != null) ***

	return obj;
}

//-------------------------------------------------------------------
// Purpose: Class constructor for LoadXML Class.
//-------------------------------------------------------------------
function LoadXML ( obj, fpHandlerFunction ) {
	if (null == obj) {
		this.object = {};
	} else {
		this.object = obj;
	}

	this.onLoad = fpHandlerFunction;

	this.xmlString = "";
	this.errorMsg = "";
	this.xmlDoc = new XML();

	return this;
}

//-------------------------------------------------------------------
// Purpose: Starts the process of loading an object (via XML) from
//			a URL. 
// Notes: The object does not become available immediately upon return
//			of this function.  The transfer starts running in the
//			background.  When the object has been loaded, the
//			.transferComplete property of the LoadXML will be
//			true.   
//			example:
//				if(myAryTrans.transferComplete == true) {
//					gotoAndPlay('continue');
//				}
//-------------------------------------------------------------------
function _getFrom( strURL ) {

	//--- Make sure the caller passed a URL ---
	if (null == strURL) {
		this.errorMsg = "object.getFrom() requires a 'strURL' parameter.";
		return;
	}

	if (null == this.xmlDoc) {
		this.xmlDoc = new XML();
	}


	this.errorMsg = "";

	//--- Set up an event handler for the response document ---
	this.xmlDoc.onLoad = onXMLLoaded;
	this.xmlDoc.refToLoadXMLObj = this;

	//--- Initialize the .transferComplete property so the loader can check when we're done ---
	this.transferComplete = false;

	//--- Start the asynchronous data transfer with the server ---
	this.xmlDoc.load(strURL);

	return; 
}

//--- Attach this function definition to the Class, as a method ---
LoadXML.prototype.getFrom = _getFrom;


//-------------------------------------------------------------------
// Purpose:  handle onLoad event from XML.load() function.
//-------------------------------------------------------------------
function onXMLLoaded() {
	var oXML = this;

	//--- extract a pointer to the original LoadXML object from the XML object ---
	var oLoadXML = this.refToLoadXMLObj;

	//--- Convert the XML document to an object ----
	oLoadXML.object = XMLDocToObject( oXML );

	//--- Set a flag to let outsiders know we're done! ---
	oLoadXML.transferComplete = true;

	//--- If a handler function has been assigned, call it now ---
	if (typeof(oLoadXML.onLoad) == 'function') {
		oLoadXML.onLoad( oLoadXML );
	}

}

//----------------------------------------------------------------------------
// --- debugging function....
function dumpObject( obj, nLevels, sName ) {
	var idx, sPre = '';
	if (nLevels == null) {
		nLevels = 0;
	}
	for (idx=1; idx<=nLevels; idx++) {
		sPre += '\t';
	}
	trace(sPre + sName + '{');
	nLevels++;
	for (idx in obj) {
		if (typeof(obj[idx]) == 'object') {
			dumpObject( obj[idx], nLevels, idx );
		} else {
			trace(sPre + idx + '="' + obj[idx] + '"');
		}
	}

	trace(sPre + '}');

}
