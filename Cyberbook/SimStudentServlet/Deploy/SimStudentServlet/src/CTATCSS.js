/**-----------------------------------------------------------------------------
 $Author: mringenb $
 $Date: 2014-12-17 16:05:08 -0500 (Wed, 17 Dec 2014) $
 $HeadURL: svn://pact-cvs.pact.cs.cmu.edu/usr5/local/svnroot/AuthoringTools/trunk/HTML5/src/CTATCSS.js $
 $Revision: 21689 $

 -
 License:
 -
 ChangeLog:
 -
 Notes:

 */
goog.provide('CTATCSS');
/**
 *
 */
CTATCSS = function()
{
	var currPair=0;
	var attributeValuePairs=[];

	var currSelector=0;
	var selectorAttributes=new Array();

	var currStr=0;
	var cssStringArray=[];

	this.resetSelectors=function resetSelectors ()
	{
		currSelector=0;
		selectorAttributes=new Array();
		selectorAttributes[currSelector]=new Array();
	};

	this.resetCSSStringArray=function resetCSSStringArray()
	{
		cssStringArray=[];
		currStr=0;
	};

	this.clearCSS=function clearCSS()
	{
		this.resetSelectors();
		this.resetCSSStringArray();
		attributeValuePairs=new Array();
		currPair=0;
	};

	this.addStringCSS=function addStringCSS(str)
	{
		cssStringArray[currStr]=str;
		currStr++;
	};

	this.addCSSAttribute=function addCSSAttribute(attribute, value)
	{
		attributeValuePairs[currPair]=attribute;
		attributeValuePairs[currPair+1]=value;

		currPair+=2;
	};

	this.removeStringCSS=function removeStringCSS(str)
	{
		var index=cssStringArray.indexOf(str);
		cssStringArray.splice(index, 1);
	};

	this.removeCSSAttribute=function removeCSSAttribute(attribute)
		{
		var index=attributeValuePairs.indexOf(attribute);
		attributeValuePairs.splice(index, 2);
	};

	this.modifyCSSAttribute=function modifyCSSAttribute(attribute, value)
	{
		var attribIndex=attributeValuePairs.indexOf(attribute);

		if(attribIndex==-1)
		{
			this.addCSSAttribute(attribute, value);
			return;
		}

		attributeValuePairs[attribIndex+1]=value;
	};

	this.addSelector=function addSelector(selector)
	{
		selectorAttributes[currSelector]=new Array();
		selectorAttributes[currSelector][0]=selector;
		currSelector++;
	};

	function getSelectorIndex(sel)
	{

		//Return 0 since we never added any selectors
		if(currSelector==0)
		{
			return 0;
		}

		for(var i=0; i<selectorAttributes.length; i++)
		{
			//This means that what we are looking for does not exist
			if(selectorAttributes[i][0]==null)
			{
				return -1;
			}

			//We found the selector we were looking for
			if(selectorAttributes[i][0]==sel)
			{
				return i;
			}
		}

		return -1;
	}

	this.addSelectorAttribute=function addSelectorAttribute(selector, attribute, value)
	{
		var j=1;
		var selectorIndex=getSelectorIndex(selector);

		while(selectorAttributes[selectorIndex][j] != undefined) { j++; }

		selectorAttributes[selectorIndex][j]=attribute;
		selectorAttributes[selectorIndex][j+1]=value;
	};

	this.toCSSString=function toCSSString()
	{
		var cssString="";
		var doesNeedPixels=false;

		for(var i=0; i<selectorAttributes.length; i++)
		{
			cssString+=selectorAttributes[i][0]+" { ";
			for(var j=1; j<selectorAttributes[i].length; j++)
			{
				cssString+=selectorAttributes[i][j];

				if(j%2==0)
				{
					cssString+="; ";
				}

				else
				{
					cssString+=": ";
				}
			}

			cssString+=" }; ";
		}


		for(var i=0; i<attributeValuePairs.length; i++)
		{
			cssString+=attributeValuePairs[i];

			if(i%2==0)
			{
				cssString+=": ";
			}

			else
			{
				cssString+="; ";
			}
		}

		for(var i=0; i<cssStringArray.length; i++)
		{
			cssString+=cssStringArray[i]+" ";
		}

		return cssString;
	};
}
