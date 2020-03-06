/* This object represents an CTATLinkGroup */

goog.provide('CTATLinkGroup');
goog.require('CTATBase');

/* LastModify: FranceskaXhakaj 07/14*/

/**
 * This object is to be extended by any object the group model
 * uses to represent groups.  Its purpose is solely for readability and
 * type safety
 * @constructor
 */
CTATLinkGroup = function() 
{
	CTATBase.call(this, "CTATLinkGroup","");
	
/**************************** PUBLIC INSTANCE VARIABLES ******************************************************/


/**************************** PRIVATE INSTANCE VARIABLES ******************************************************/

	/**
     * Make the object available to private methods
     */
	var that = this;
	
/***************************** PRIVATE METHODS *****************************************************/


/***************************** PRIVILEDGED METHODS *****************************************************/


/****************************** PUBLIC METHODS ****************************************************/


/****************************** MARTIN'S METHODS ****************************************************/

};


CTATLinkGroup.prototype = Object.create(CTATBase.prototype);
CTATLinkGroup.prototype.constructor = CTATLinkGroup;

if(typeof module !== 'undefined')
{
	module.exports = CTATLinkGroup;
}