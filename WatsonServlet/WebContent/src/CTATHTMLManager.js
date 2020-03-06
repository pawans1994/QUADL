/**-----------------------------------------------------------------------------
 $Author: mringenb $
 $Date: 2014-12-17 16:05:08 -0500 (Wed, 17 Dec 2014) $
 $HeadURL: svn://pact-cvs.pact.cs.cmu.edu/usr5/local/svnroot/AuthoringTools/trunk/HTML5/src/CTATHTMLManager.js $
 $Revision: 21689 $

 -
 License:
 -
 ChangeLog:
 -
 Notes:

 */
goog.provide('CTATHTMLManager');

goog.require('CTATGlobalFunctions');
/**
*
*/
CTATHTMLManager = function()
{
	//CTATBase.call(this, "CTATHTMLManager","htmlManager");

	var aryEntities=null;
	var temper="";
	var singleQuoteEscape=true;
	var maxEntities=50;

	this.urldecode=function urldecode(str)
	{
	   return decodeURIComponent((str+'').replace(/\+/g, '%20'));
	};
	/**
	*
	*/
	this.showEntities=function showEntities ()
	{
		ctatdebug ("showEntities ()");

		var entity = null;
		//for (var entity:String in aryEntities)
		for (var i=0;i<aryEntities.length;i++)
		{
			entity=aryEntities [i];

			ctatdebug (entity);
		}
	};
	/**
	*
	*/
	this.initEntities=function initEntities ()
	{
		if (aryEntities==null)
		{
			aryEntities=new Array();

			aryEntities["&amp;"]   = "*!*"; // non-breaking space
			aryEntities["&nbsp;"]   = "\u00A0"; // non-breaking space
			aryEntities["&iexcl;"]  = "\u00A1"; // inverted exclamation mark
			aryEntities["&cent;"]   = "\u00A2"; // cent sign
			aryEntities["&pound;"]  = "\u00A3"; // pound sign
			aryEntities["&curren;"] = "\u00A4"; // currency sign
			aryEntities["&yen;"]    = "\u00A5"; // yen sign
			aryEntities["&brvbar;"] = "\u00A6"; // broken vertical bar (|)
			aryEntities["&sect;"]   = "\u00A7"; // section sign
			aryEntities["&uml;"]    = "\u00A8"; // diaeresis
			aryEntities["&copy;"]   = "\u00A9"; // copyright sign
			aryEntities["&reg;"]    = "\u00AE"; // registered sign
			aryEntities["&deg;"]    = "\u00B0"; // degree sign
			aryEntities["&plusmn;"] = "\u00B1"; // plus-minus sign
			aryEntities["&sup1;"]   = "\u00B9"; // superscript one
			aryEntities["&sup2;"]   = "\u00B2"; // superscript two
			aryEntities["&sup3;"]   = "\u00B3"; // superscript three
			aryEntities["&acute;"]  = "\u00B4"; // acute accent
			aryEntities["&micro;"]  = "\u00B5"; // micro sign
		   	aryEntities["&frac14;"] = "\u00BC"; // vulgar fraction one quarter
		   	aryEntities["&frac12;"] = "\u00BD"; // vulgar fraction one half
		   	aryEntities["&frac34;"] = "\u00BE"; // vulgar fraction three quarters
		   	aryEntities["&iquest;"] = "\u00BF"; // inverted question mark
		   	aryEntities["&Agrave;"] = "\u00C0"; // Latin capital letter A with grave
		   	aryEntities["&Aacute;"] = "\u00C1"; // Latin capital letter A with acute
		   	aryEntities["&Acirc;"]  = "\u00C2"; // Latin capital letter A with circumflex
		   	aryEntities["&Atilde;"] = "\u00C3"; // Latin capital letter A with tilde
		   	aryEntities["&Auml;"]   = "\u00C4"; // Latin capital letter A with diaeresis
		   	aryEntities["&Aring;"]  = "\u00C5"; // Latin capital letter A with ring above
		   	aryEntities["&AElig;"]  = "\u00C6"; // Latin capital letter AE
		   	aryEntities["&Ccedil;"] = "\u00C7"; // Latin capital letter C with cedilla
		   	aryEntities["&Egrave;"] = "\u00C8"; // Latin capital letter E with grave
		   	aryEntities["&Eacute;"] = "\u00C9"; // Latin capital letter E with acute
		   	aryEntities["&Ecirc;"]  = "\u00CA"; // Latin capital letter E with circumflex
		   	aryEntities["&Euml;"]   = "\u00CB"; // Latin capital letter E with diaeresis
		   	aryEntities["&Igrave;"] = "\u00CC"; // Latin capital letter I with grave
		   	aryEntities["&Iacute;"] = "\u00CD"; // Latin capital letter I with acute
		   	aryEntities["&Icirc;"]  = "\u00CE"; // Latin capital letter I with circumflex
		   	aryEntities["&Iuml;"]   = "\u00CF"; // Latin capital letter I with diaeresis
		   	aryEntities["&ETH;"]    = "\u00D0"; // Latin capital letter ETH
		   	aryEntities["&Ntilde;"] = "\u00D1"; // Latin capital letter N with tilde
		   	aryEntities["&Ograve;"] = "\u00D2"; // Latin capital letter O with grave
		   	aryEntities["&Oacute;"] = "\u00D3"; // Latin capital letter O with acute
		   	aryEntities["&Ocirc;"]  = "\u00D4"; // Latin capital letter O with circumflex
		   	aryEntities["&Otilde;"] = "\u00D5"; // Latin capital letter O with tilde
		   	aryEntities["&Ouml;"]   = "\u00D6"; // Latin capital letter O with diaeresis
		   	aryEntities["&Oslash;"] = "\u00D8"; // Latin capital letter O with stroke
		   	aryEntities["&Ugrave;"] = "\u00D9"; // Latin capital letter U with grave
		   	aryEntities["&Uacute;"] = "\u00DA"; // Latin capital letter U with acute
		   	aryEntities["&Ucirc;"]  = "\u00DB"; // Latin capital letter U with circumflex
		   	aryEntities["&Uuml;"]   = "\u00DC"; // Latin capital letter U with diaeresis
		   	aryEntities["&Yacute;"] = "\u00DD"; // Latin capital letter Y with acute
		   	aryEntities["&THORN;"]  = "\u00DE"; // Latin capital letter THORN
		   	aryEntities["&szlig;"]  = "\u00DF"; // Latin small letter sharp s = ess-zed
		   	aryEntities["&agrave;"] = "\u00E0"; // Latin small letter a with grave
		   	aryEntities["&aacute;"] = "\u00E1"; // Latin small letter a with acute
		   	aryEntities["&acirc;"]  = "\u00E2"; // Latin small letter a with circumflex
		   	aryEntities["&atilde;"] = "\u00E3"; // Latin small letter a with tilde
		   	aryEntities["&auml;"]   = "\u00E4"; // Latin small letter a with diaeresis
		   	aryEntities["&aring;"]  = "\u00E5"; // Latin small letter a with ring above
		   	aryEntities["&aelig;"]  = "\u00E6"; // Latin small letter ae
		   	aryEntities["&ccedil;"] = "\u00E7"; // Latin small letter c with cedilla
		   	aryEntities["&egrave;"] = "\u00E8"; // Latin small letter e with grave
		   	aryEntities["&eacute;"] = "\u00E9"; // Latin small letter e with acute
		   	aryEntities["&ecirc;"]  = "\u00EA"; // Latin small letter e with circumflex
		   	aryEntities["&euml;"]   = "\u00EB"; // Latin small letter e with diaeresis
		   	aryEntities["&igrave;"] = "\u00EC"; // Latin small letter i with grave
		   	aryEntities["&iacute;"] = "\u00ED"; // Latin small letter i with acute
		   	aryEntities["&icirc;"]  = "\u00EE"; // Latin small letter i with circumflex
		   	aryEntities["&iuml;"]   = "\u00EF"; // Latin small letter i with diaeresis
		   	aryEntities["&eth;"]    = "\u00F0"; // Latin small letter eth
		   	aryEntities["&ntilde;"] = "\u00F1"; // Latin small letter n with tilde
		   	aryEntities["&ograve;"] = "\u00F2"; // Latin small letter o with grave
		   	aryEntities["&oacute;"] = "\u00F3"; // Latin small letter o with acute
		   	aryEntities["&ocirc;"]  = "\u00F4"; // Latin small letter o with circumflex
		   	aryEntities["&otilde;"] = "\u00F5"; // Latin small letter o with tilde
		   	aryEntities["&ouml;"]   = "\u00F6"; // Latin small letter o with diaeresis
		   	aryEntities["&oslash;"] = "\u00F8"; // Latin small letter o with stroke
		   	aryEntities["&ugrave;"] = "\u00F9"; // Latin small letter u with grave
		   	aryEntities["&uacute;"] = "\u00FA"; // Latin small letter u with acute
		   	aryEntities["&ucirc;"]  = "\u00FB"; // Latin small letter u with circumflex
		   	aryEntities["&uuml;"]   = "\u00FC"; // Latin small letter u with diaeresis
		   	aryEntities["&yacute;"] = "\u00FD"; // Latin small letter y with acute
		   	aryEntities["&thorn;"]  = "\u00FE"; // Latin small letter thorn
		   	aryEntities["&yuml;"]   = "\u00FF"; // Latin small letter y with diaeresis

		   	aryEntities["&gt;"]     = ">"; // Latin small letter thorn
		   	aryEntities["&lt;"]     = "<"; // Latin small letter y with diaeresis

		   	aryEntities["&#61;"]    = "="; // Why oh why did we skip this?
		   	aryEntities["&361;"]    = "="; // Why oh why did we skip this?

		   	aryEntities["&quot;"]   = "\u0022"; //
		}

		if (singleQuoteEscape==true)
		{
			ctatdebug ("(singleQuoteEscape==true) Replacing &apos; with: \\\'");
			aryEntities["&apos;"]   = "\\\'"; //
		}
		else
		{
			ctatdebug ("(singleQuoteEscape==false) Replacing &apos; with: \'");
			aryEntities["&apos;"]   = "\'"; //
		}
	};
	/**
	*
	*/
	this.entitiesConvert=function entitiesConvert (str)
 	{
		ctatdebug ("entitiesConvert ()");

		/*
		this.initEntities ();

		if (str=="&")
		{
			temper="&amp;";
			return (temper);
		}

		temper=str;

		if (temper==null)
		{
 			ctatdebug ("Internal error: provided string is undefined or null");
  			return ("");
		}

		ctatdebug ("Making the string javascript safe ...");

		while (temper.indexOf ("\'")!=-1)
		{
			temper=replaceString (temper,"\'","&apos;");
		}

		ctatdebug ("Javascript safe: " + temper);

		ctatdebug ("First pass replacing ...");

		var found=false;
		var breakout=false;

		var countEntities=0;

		while ((temper.indexOf ('&')!=-1) && (breakout==false))
		{
			found=false;

			//for (var entity:String in aryEntities)
			for (var i=0;i<aryEntities.length;i++)
			{
				entity=aryEntities [i];

  				temper=replaceString (temper,entity,aryEntities [entity]);

  				found=true;
			}

			if (found==false)
			{
  				ctatdebug ("Error: unknown code found!");
  				breakout=true;
   				return temper;
			}

			countEntities++;

			if (countEntities>maxEntities)
			{
  				ctatdebug ("Possible endless loop detected, aborting");
  				breakout=true;
			}
		}

		ctatdebug ("Intermediate result: " + temper);

		ctatdebug ("Final pass replacing ...");

		while (temper.indexOf ('*!*')!=-1)
		{
			temper=replaceString (temper,"*!*","&");
		}

		return (temper);

		*/

		return (this.urldecode (unescape (str)));
 	};
 	/**
	*
	*/
	this.entitiesGenerate=function entitiesGenerate (str)
 	{
		temper=str;

		return (temper);
 	};

 	this.htmlEncode=function htmlEncode (value)
 	{
 		//create a in-memory div, set it's inner text(which jQuery automatically encodes)
 		//then grab the encoded contents back out.  The div never exists on the page.

 		//return $('<div/>').text(value).html();

		return value;
 	};

 	this.htmlDecode=function htmlDecode (value)
 	{
		if(typeof($)!=='undefined')
		{
			return $('<div/>').html(value).text();
		}
 		else if(typeof(Entities)!=='undefined')
 		{
			return new Entities().decode(value);
		}
 	};
}

/*
CTATHTMLManager.prototype = Object.create(CTATBase.prototype);
CTATHTMLManager.prototype.constructor = CTATHTMLManager;
*/


if(typeof module !== 'undefined')
    module.exports = CTATHTMLManager;
