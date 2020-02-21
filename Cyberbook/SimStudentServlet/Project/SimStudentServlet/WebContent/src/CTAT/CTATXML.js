/**-----------------------------------------------------------------------------
 $Author: mringenb $
 $Date: 2014-12-17 16:05:08 -0500 (Wed, 17 Dec 2014) $
 $HeadURL: svn://pact-cvs.pact.cs.cmu.edu/usr5/local/svnroot/AuthoringTools/trunk/HTML5/src/CTAT/CTATXML.js $
 $Revision: 21689 $

 -
 License:
 -
 ChangeLog:
 -
 Notes:

 http://stackoverflow.com/questions/22512097/parsexml-returns-invalid-xml-in-google-apps-script
 http://api.jquery.com/jQuery.parseXML/

 -------------------------------------------------------------------------------
 */

goog.provide('CTATXML');

goog.require('CTATBase');

/**
 *
 */
CTATXML = function()
{
	CTATBase.call(this, "CTATXML","xml");

	/**
	 *
	 * @returns
	 */
	this.parse=function parse (aMessage)
	{
		return (this.parseXML (aMessage));
	}

	/**
	 *
	 * @returns
	 */
	this.parseXML=function parseXML (aMessage)
	{
		this.ctatdebug ("parseXML ()");
		this.ctatdebug ("message: " + aMessage);

		var xmlDoc=null;

		try
		{
			if(typeof($)!=='undefined')
			{
				xmlDoc = $.parseXML(aMessage);
				$xml=$(xmlDoc);
			}
			else if(typeof(XMLParser)!=='undefined')
			{
				//Parse in a NodeJS environment
				xmlDoc = new XMLParser().parseFromString(aMessage);
			}
		}
		catch (err)
		{
                    console.log("error - > "+err);
			if (xmlDoc!=null)
			{
				this.ctatdebug ("JQuery could not process the provided XML: " + err.message + " ("+xmlDoc.parseError.errorCode+") ("+xmlDoc.parseError.reason + ") (" + xmlDoc.parseError.line + ")");
			}
			else
			{
				this.ctatdebug ("JQuery could not process the provided XML (xmlDoc==null): " + err.message);
			}

			return (null);
		}

		this.ctatdebug ("Parsing complete, checking and converting ...");

		if (xmlDoc==null)
		{
			this.ctatdebug ("Unspecified error parsing xml message. xmlDoc is null");

			return (null);
		}

		this.ctatdebug ("parseXML () done");
		return (xmlDoc.documentElement);
	};
	/**
	*
	*/
	this.getElementName=function getElementName (anElement)
	{
		return (anElement.nodeName);
	};
	/**
	*
	*/
	this.getElementValue=function getElementValue (anElement)
	{
		return (anElement.nodeValue);
	};
	/**
	*
	*/
	this.getElementChildren=function getElementChildren (anElement)
	{
		//Skips #text nodes (dhruv)
		var children = [];

		for(var i = 0 ; i<anElement.childNodes.length; i++)
		{
			if(anElement.childNodes[i].nodeType == 1)
			children.push(anElement.childNodes[i]);
		}

		return (children);
	};
	/**
	 * This method can handle the following cases:
	 *
	 *	<Action>UpdateTextField</Action>
	 *
	 *	<Action>
	 *		<value>UpdateTextField</value>
	 *	</Action>
	 */
	this.getNodeTextValue=function getNodeTextValue (aNode)
	{
		//this.ctatdebug ("getNodeTextValue ()");

		if (aNode==null)
		{
			//this.ctatdebug ("Node argument is null");
			return ("");
		}

		if (aNode.childNodes==null)
		{
			//this.ctatdebug ("Node does not have any children");
			return (aNode.nodeValue);
		}

		if (aNode.childNodes.length==0)
		{
			//this.ctatdebug ("Node has children size of 0");
			return ("");
		}

		//this.ctatdebug ("First do a check to see if it has a 'value' sub element");

		var entries=aNode.childNodes;

		for (var t=0;t<entries.length;t++)
		{
			var entry=entries [t];

			//console.log ("entry.nodeName: " + entry.nodeName + ", entry.childNodes.length: " + entry.childNodes.length);

			if ((entry.nodeName=="value") || (entry.nodeName=="Value"))
			{
				if(entry.childNodes.length==1)
				{
					//console.log ("Data: ("+entry.childNodes[0].nodeName+")" + entry.childNodes[0].nodeValue);

					return (entry.childNodes[0].nodeValue);
				}
				else
				{
					if(entry.childNodes.length==0)
					{
						//console.log ("Bottoming out? " + aNode.childNodes[0].nodeValue);

						return (aNode.childNodes[0].nodeValue);
					}
					else
					{
						//console.log ("Data: ("+entry.childNodes[1].nodeName+")" + entry.childNodes[1].nodeValue);

						return (entry.childNodes[1].nodeValue);
					}
				}
			}
		}

		//this.ctatdebug ("Bottoming out ...");

		return (aNode.childNodes[0].nodeValue);
	};

    /**
     *
     */
    this.getElementAttr = function getElementAttr(anElement, attr)
    {
        //return (anElement.getAttribute(attr));

		if (!anElement.attributes)
		{
			this.ctatdebug ("Warning: Element " + anElement.nodeName + " does not have any attributes");
			return ("");
		}

		this.listElementAttr (anElement);

		for (var i=0;i<anElement.attributes.length;i++)
		{
			if (anElement.attributes [i].nodeName==attr)
			{
				return (anElement.attributes [i].nodeValue);
			}
		}

		return ("");
    };

	/**
	*
	*/
	this.listElementAttr = function listElementAttr (anElement)
	{
		this.ctatdebug ("Listing " + anElement.attributes.length + " attributes for element " + anElement.nodeName + " ...");

		for (var i=0;i<anElement.attributes.length;i++)
		{
			console.log (i + " name: " +  anElement.attributes [i].nodeName + ", value: " + anElement.attributes [i].nodeValue);
		}
	};
	/**
	*
	*/
	this.xmlToString=function xmlToString(xmlData)
	{
		this.ctatdebug ("xmlToString ()");

		if (xmlData==null)
		{
			this.ctatdebug ("Error: xml data is null");
			return (null);
		}

        var output = (new XMLSerializer()).serializeToString(xmlData);

		return (output);
	};
}

CTATXML.prototype = Object.create(CTATBase.prototype);
CTATXML.prototype.constructor = CTATXML;

if(typeof module !== 'undefined')
{
	module.exports = CTATXML;
}
