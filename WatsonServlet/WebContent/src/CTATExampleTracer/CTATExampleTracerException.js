/* This object represents an CTATExampleTracerException */

goog.provide('CTATExampleTracerException');
goog.require('CTATBase');

/* LastModify: FranceskaXhakaj 07/14*/

/**
 * @constructor
 * @param {string} givenMessage
 */
CTATExampleTracerException = function (givenMessage)
{

/**************************** INHERITED CONSTRUCTOR ******************************************************/

	CTATBase.call(this, "CTATExampleTracerException","");
	
/**************************** PUBLIC INSTACE VARIABLES ******************************************************/

/**************************** PRIVATE INSTACE VARIABLES ******************************************************/


	/** 
	 * Message given when creating the exception.
	 * @type {string}
	 */
	var message = givenMessage;

	/**
     * Make the object available to private methods
     */ 
	var that = this;
	
/***************************** PRIVATE METHODS *****************************************************/

/***************************** PRIVILEDGED METHODS *****************************************************/
	
	/**
	 * @return {string}
	 */
	this.toString = function()
	{
		return message;
	};


/****************************** PUBLIC METHODS ****************************************************/

};

/**************************** SETTING UP INHERITANCE ******************************************************/

CTATExampleTracerException.prototype = Object.create(CTATBase.prototype);
CTATExampleTracerException.prototype.constructor = CTATExampleTracerException;

if(typeof module !== 'undefined')
 module.exports = CTATExampleTracerException;
