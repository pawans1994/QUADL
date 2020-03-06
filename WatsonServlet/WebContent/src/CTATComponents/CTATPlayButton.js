/**-----------------------------------------------------------------------------
 $Author: mringenb $
 $Date: 2014-12-17 16:05:08 -0500 (Wed, 17 Dec 2014) $
 $HeadURL: svn://pact-cvs.pact.cs.cmu.edu/usr5/local/svnroot/AuthoringTools/trunk/HTML5/src/CTATComponents/CTATPlayButton.js $
 $Revision: 21689 $

 -
 License:
 -
 ChangeLog:
 -
 Notes:

 */
goog.provide('CTATPlayButton');

goog.require('CTATBase');
goog.require('CTATCanvasComponent');
goog.require('CTATSandboxDriver');
goog.require('CTATShape');

CTATPlayButton = function()
{
	CTATBase.call(this, "CTATPlayButton", "__undefined__");

	//Enumerate the different parts of the overall component
	var playButton=null;
	var playCircle=null;
	var playTriangle=null;
	var playBackground=null;

	//This is where we will create the object
	var playDiv=null;

	//Event handlers for the play button
	function playOver()
	{
		playTriangle.setFillColor("black");
		playTriangle.drawTriangleFilled();

		playCircle.setFillColor("rgb(36, 85, 00)");
		playCircle.drawCircleFilled();
	}

	function playOut()
	{
		playTriangle.setFillColor("white");
		playTriangle.drawTriangleFilled();

		playCircle.setFillColor("green");
		playCircle.drawCircleFilled();
	}

	function playTutor()
	{
		playButton.removeComponent();
		getSafeElementById('container').removeChild(playDiv);
		initTutor ();
	}

	function init()
	{
		var mainCanvas=getSafeElementById("main-canvas");

		playDiv=document.createElement("div");
		playDiv.id='ctatdivPlayTutor';

		//These are not real div attributes. They are here for ease of access.
		playDiv.width=mainCanvas.width;
		playDiv.height=mainCanvas.height;

		playDiv.setAttribute("style", "width: "+mainCanvas.width+"px; height: "+mainCanvas.height+
									  "px; left: "+0+"px; top: "+0+"px; position:absolute");
		getSafeElementById('container').appendChild(playDiv);
	}

	function drawPlayButton()
	{
		playButton=new CTATCanvasComponent();

		var playCircleRadius=playDiv.height/3;

		playBackground=new CTATShape("PlayTutor",
									 "play background",
									 0, 0, playDiv.width+1, playDiv.height+1);

		playBackground.addPoint(0, 0);

		playBackground.setFillColor("rgb(66, 0, 66)");
		playBackground.drawRectangleFilled();

		playCircle=new CTATShape("PlayTutor",
								 "play circle",
								 ((playDiv.width/2)-playCircleRadius),
								 ((playDiv.height/2)-playCircleRadius),
								 playCircleRadius*2,
								 playCircleRadius*2);

		playCircle.addPoint(0, 0);

		playCircle.setFillColor("green");
		playCircle.setRadius(playCircleRadius);
		playCircle.drawCircleFilled();

		var scale=1/4;
		var offset=5;

		playTriangle=new CTATShape("PlayTutor",
								   "play triangle",
								   playCircle.getXOffset()+(playCircle.getWidth()*scale)-offset,
								   playCircle.getYOffset()+(playCircle.getHeight()*scale)-offset,
								   playCircle.getWidth()-(playCircle.getWidth()*scale),
								   playCircle.getHeight()*(3/5));

		playTriangle.addPoint(0, 0);
		playTriangle.addPoint(0, playTriangle.getHeight());
		playTriangle.addPoint(playTriangle.getWidth(), playTriangle.getHeight()/2);

		playTriangle.setFillColor("white");
		playTriangle.drawTriangleFilled();

		playButton.addShape(playBackground);
		playButton.addShape(playCircle);
		playButton.addShape(playTriangle);

		playCircle.addEventListener('mouseover', playOver);
		playCircle.addEventListener('mouseout', playOut);
		playTriangle.addEventListener('mouseover', playOver);
		playTriangle.addEventListener('mouseout', playOut);

		playTriangle.addEventListener('click', playTutor);
		playCircle.addEventListener('click', playTutor);
	}

	init();
	drawPlayButton();
}

CTATPlayButton.prototype = Object.create(CTATBase.prototype);
CTATPlayButton.prototype.constructor = CTATPlayButton;