/**-----------------------------------------------------------------------------
 $Author: mringenb $
 $Date: 2014-12-17 16:05:08 -0500 (Wed, 17 Dec 2014) $
 $HeadURL: svn://pact-cvs.pact.cs.cmu.edu/usr5/local/svnroot/AuthoringTools/trunk/HTML5/src/CTATComponentHierarchy/CTATMovieClip.js $
 $Revision: 21689 $

 -
 License:
 -
 ChangeLog:
 -
 Notes:

 */
goog.provide('CTATMovieClip');

goog.require('CTATBase');
goog.require('CTATGlobals');
goog.require('CTATGlobalFunctions');
/**
 *
 */
CTATMovieClip = function(anInstance,aX,aY,aWidth,aHeight)
{
	CTATBase.call(this, "CTATMovieClip", anInstance);

	var x=aX;
	var y=aY;
	var width=aWidth;
	var height=aHeight;

	var topDivZIndex=CTATGlobalFunctions.gensym.z_index();
	var topDivID=CTATGlobalFunctions.gensym.div_id();

	var canvasZIndex=CTATGlobalFunctions.gensym.z_index();
	var canvasID=CTATGlobalFunctions.gensym.div_id();

	var componentList=new Array ();

	var pointer=this;

	var divWrapper=null;

	/**
	 *
	 */
	this.wrapComponent=function wrapComponent(aParent)
	{
		divWrapper=document.createElement('div');
		divWrapper.setAttribute('id', topDivID);
		divWrapper.setAttribute('name', this.getName ());
		divWrapper.setAttribute('style', "z-index: "+topDivZIndex);

		divWrapper.setAttribute('width', width+"px");
		divWrapper.setAttribute('height', height+"px");

		divWrapper.setAttribute("style", "border: 0px; position: absolute; left:"+x+"px; top:"+y+"px; z-index:"+canvasZIndex+";");
		//divWrapper.setAttribute("style", "border: 0px; position: relative; left:"+x+"px; top:"+y+"px; z-index: inherit;");

		aParent.appendChild(divWrapper);

		return (divWrapper);
	};

	/**
	*
	*/
	this.getDivWrapper=function getDivWrapper ()
	{
		return (divWrapper);
	};

	/**
	*
	*/
	this.addComponent=function addComponent (aComponentName)
	{
		pointer.ctatdebug ("addComponent ("+aComponentName+")");

		componentList.push(aComponentName);
	}
	/**
	*
	*/
	this.isRegistered=function isRegistered (aComponentName)
	{
		for (var i=0;i<componentList.length;i++)
		{
			if (componentList [i]==aComponentName)
			{
				return (true);
			}
		}

		return (false);
	}
}

CTATMovieClip.prototype = Object.create(CTATBase.prototype);
CTATMovieClip.prototype.constructor = CTATMovieClip;
