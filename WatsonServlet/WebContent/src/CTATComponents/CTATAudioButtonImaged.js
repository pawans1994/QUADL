/**-----------------------------------------------------------------------------
 $Author: mringenb $
 $Date: 2014-12-17 16:05:08 -0500 (Wed, 17 Dec 2014) $
 $HeadURL: svn://pact-cvs.pact.cs.cmu.edu/usr5/local/svnroot/AuthoringTools/trunk/HTML5/src/CTATComponents/CTATAudioButtonImaged.js $
 $Revision: 21689 $

 -
 License:
 -
 ChangeLog:
 -
 Notes:

 */
/**-----------------------------------------------------------------------------
*
* http://stackoverflow.com/questions/8179585/playing-audio-on-ipad
*
* Reference implementation:
*
* $(document).ready(function()
{
	var audioElement = document.createElement('audio');
	audioElement.setAttribute('src', 'Mogwai2009-04-29_acidjack_t16.ogg');
	audioElement.load()

	audioElement.addSafeEventListener("load", function()
	{
		audioElement.play();
		$(".duration span").html(audioElement.duration);
		$(".filename span").html(audioElement.src);
	}, true);

	$('.play').click(function()
	{
		audioElement.play();

	});

	$('.pause').click(function()
	{
		audioElement.pause();
	});

	$('.volumeMax').click(function()
	{
		audioElement.volume=1;
	});

	$('.volumestop').click(function()
	{
		audioElement.volume=0;
	});

	$('.playatTime').click(function()
	{
		audioElement.currentTime= 35;
		audioElement.play();
	});
});
*/
goog.provide('CTATAudioButtonImaged');

goog.require('CTATBinaryImages');
goog.require('CTATGlobalFunctions');
goog.require('CTATGlobals');
goog.require('CTATImageButtonComponent');

var audioDefaultImage=imgStart+"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";
var audioClickedImage=imgStart+"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";
var audioHoverImage=imgStart+"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";
var audioDisabledImage=imgStart+"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";

/**
 *
 */
CTATAudioButtonImaged = function(aDescription,aX,aY,aWidth,aHeight)
{
	CTATImageButtonComponent.call(this,
					  			  "CTATAudioButton",
					  			  "__undefined__",
					  			  aDescription,
					  			  aX,
					  			  aY,
					  			  aWidth,
					  			  aHeight);

	var hints=new Array ();

	var pointer=this;
	var audioElement=null;
	var audioButton=null;
	var soundFile="";

	pointer.setActionInput('play','-1');

	this.ctatdebug (this.getClassName() + " ("+this.getX()+","+this.getY()+","+this.getWidth()+","+this.getHeight()+")");

	this.configFromDescription ();

	this.assignImages (audioDefaultImage, audioHoverImage, audioClickedImage, audioDisabledImage);

	this.init=function init()
	{
	    pointer.ctatdebug("init (" + pointer.getName() + ")");

	    pointer.addCSSAttribute("z-index", CTATGlobalFunctions.gensym.z_index());

	    audioButton=new Image();
	    audioButton.title=pointer.getName();
	    audioButton.name=pointer.getName();
	    audioButton.setAttribute('id', CTATGlobalFunctions.gensym.div_id());
	    audioButton.setAttribute('onkeypress', 'return noenter(event)');

		pointer.setComponent(audioButton);

	    pointer.addComponentReference(pointer, audioButton);

	    pointer.ctatdebug("Final location: " + pointer.getX() + "," + pointer.getY() + " with text: " + pointer.getText());

	    pointer.setInitialized(true);

	    pointer.getDivWrap().appendChild(audioButton);

	    audioButton.src=pointer.getDefaultImage();

		var bgColor=pointer.getBackgroundColor();
		var backgroundColorString="rgba (" + hexToRgb (bgColor).r + "," + hexToRgb (bgColor).r + "," + hexToRgb (bgColor).r + "," + 0 + ")";

		pointer.modifyCSSAttribute("background-color", backgroundColorString);
		pointer.addStringCSS("filter: alpha(opacity=0);");

		pointer.addCSSAttribute("width", pointer.getWidth());
		pointer.addCSSAttribute("height", pointer.getHeight());

	    audioButton.setAttribute('style', pointer.getCSS());

	    //currentZIndex++;
	    //currentIDIndex++;

	    pointer.addSafeEventListener ('click',pointer.processClick,audioButton);

	    //this.setEnabled (false);

		audioElement=document.createElement('audio');
		//audioElement.setAttribute('src', soundFile);

	    pointer.addSafeEventListener('mouseover', pointer.processMouseOver,audioButton);
	    pointer.addSafeEventListener('mouseout', pointer.processMouseOut,audioButton);

		audioElement.addEventListener("load", function()
		{
			pointer.ctatdebug ("Audio loaded");

			pointer.setEnabled (true);
		}, true);

		pointer.render();
	};

	/**
	 *
	 * @param e
	 */
	this.processClick=function processClick (e)
	{
		//useDebugging=true;

		pointer.ctatdebug ("processClick ("+e.currentTarget.getAttribute ("id")+" -> "+e.eventPhase+")");

		if (pointer.getEnabled()==true)
		{
			pointer.ctatdebug ("Playing audio file: " + soundFile);

			audioElement.setAttribute('src', soundFile);

			audioElement.load();

			audioElement.play();

			pointer.grade();
		}
		else
			pointer.ctatdebug ("Component is disabled, not grading");

		//useDebugging=false;
    };

	/**
	 *
	 */
	this.processSerialization=function processSerialization()
	{
		//useDebugging=true;

		pointer.ctatdebug ("processSerialization()");

		var parameters=pointer.getGrDescription().parameters;

		for(var j=0;j<this.parameters.length;j++)
		{
			var aParam=this.parameters [j];

			pointer.ctatdebug ("Checking parameter name: " + aParam.paramName);

			if(aParam.paramName=="SoundFile")
			{
				pointer.ctatdebug ("Setting sound file to: " + aParam.paramValue);

				soundFile=aParam.paramValue;
			}

			if(aParam.paramName=="labelText")
			{
				pointer.setText(aParam.paramValue);
			}
		}

		//useDebugging=false;
	};
    /**
     * An Interface Action for starting the audio.
     */
    this.play = function () {
		audioElement.setAttribute('src', soundFile);
		audioElement.load();
		audioElement.play();
    };
    /**
     * An Interface Action for playing the specified audio.
     * @param {string} aURL	A url pointing to an audio file.
     */
    this.playClip = function (aURL) {
		audioElement.setAttribute('src', aURL);
		audioElement.load();
		audioElement.play();
    };
    /**
     * An Interface Action for pausing the audio.
     */
    this.pause = function () {
    	audioElement.pause();
    };
}

CTATAudioButton.prototype = Object.create(CTATImageButtonComponent.prototype);
CTATAudioButton.prototype.constructor = CTATAudioButton;