/* This object represents an CTATGroupModel */

goog.provide('CTATGroupModel');
goog.require('CTATBase');

//goog.require('CTATExampleTracerLink');//
//goog.require('CTATLinkGroup');//

/* LastModify: FranceskaXhakaj 07/14*/

/**
 * The class defines methods for a class that models a group structure.
 * The groups that are to be modeled have the following properties:
 * Each group contains a name(String) which may be queried or set
 * Each group contains an ordering(boolean).  True means ordered. False means unordered.  The ordering may be queried or set
 * Each group contains a set of ExampleTracerLinks which may be queried or set with restrictions
 * Each group contains a set of groups.  These are its subgroups.  They may be queried or set with restrictions
 * There is a single "TopLevel" group which contains at least the union of all links in all the groups
 * Note that if group B is a subgroup of group A, we refer to group A as group B's parent. 
 * The organization of groups and links has the following restrictions: 
 * If group A is a subgroup of group B, groups A's links must be a subgroup 
 * of group B's links
 * If group A contains link 1, at most one of link A's subgroups may contain
 * link 1
 * We say the group sanity is preserved if these conditions are followed and that group
 * sanity is violated if they are not
 * @constructor
 */
CTATGroupModel = function() 
{
	CTATBase.call(this, "CTATGroupModel","");

/**************************** PUBLIC INSTANCE VARIABLES ******************************************************/


/**************************** PRIVATE INSTANCE VARIABLES ******************************************************/

	/**
     * Make the object available to private methods
     */
	var that = this;

/***************************** PRIVATE METHODS *****************************************************/


/***************************** PRIVILEDGED METHODS *****************************************************/
	
	/**
	 * Removes all group information from the model
	 * @return {undefined}
	 */
	this.clear = function()
	{

	};

	/**
	 * @param {boolean} givenIsDefaultReenterable True if groups should be reenterable
	 * by default, false otherwise
	 * @return {undefined}
	 */
	this.setDefaultReenterable = function(givenIsDefaultReenterable)
	{

	};

	/**
	 * @param {CTATLinkGroup} group The group whose ordered is to be set
	 * @param {boolean} isOrdered Should be true if the group is ordered, false
	 * if unordered
	 * @return {undefined}
	 */
	this.setGroupOrdered = function(group, isOrdered)
	{

	};

	/**
	 * @return {CTATLinkGroup} The CTATLinkGroup representing the TopLevel group
	 */
	this.getTopLevelGroup = function()
	{

	};

	/**
	 * @param {CTATLinkGroup} group The group whose name is to be set
	 * @param {String} name The name to associate with the given group
	 * @return {undefined}
	 */
	this.setGroupName = function (group, name)
	{

	};

	/**
	 * Adds the given link to the given group's set of links.  To ensure that
	 * group sanity is preserved, the link is first removed from all other groups
	 * which contain it, except the TopLevel group.  It is then added to the given
	 * group and all the given groups parents.
	 * 
	 * @param {CTATLinkGroup} group The group which is to contain the given link
	 * @param {CTATExampleTracerLink} link The link which is to be added
	 * @return {undefined}
	 */
	this.addLinkToGroup = function(group, link)
	{

	};

	/**
	 * @param {CTATLinkGroup} group The group whose ordering is to be returned
	 * @return {boolean} True if the group is ordered, false if unordered
	 */	
	this.isGroupOrdered = function(group)
	{

	};

	/**
	 * @param {CTATLinkGroup} group The group whose reenterable status is to be returned
	 * @return {boolean} True if the group is reenterable, false if not
	 */	
	this.isGroupReenterable = function(group)
	{

	};

	/**
	 * @param {CTATLinkGroup} group The group to be queried regarding link inclusion
	 * @param {CTATExampleTracerLink} link The link to be tested for
	 * @return {boolean} True if the given group contains the given link, false otherwise
	 */
	this.isLinkInGroup = function()
	{

	};

	/**
	 * 
	 * @param {CTATExampleTracerLink} link The link which all returned groups must include
	 * @return {set of CTATLinkGroup} A set of groups which contains the given link
	 */
	this.getGroupsContainingLink = function(link)
	{

	};

	/**
	 * 
	 * @param {CTATLinkGroup} group The groups whose link count is to be returned
	 * @return {integer} The number of links the given group contains
	 */
	this.getGroupLinkCount = function(group)
	{
		//ctatdebug("CTATGroupModel --> in getGroupLinkCount");
		return that.getGroupLinks(group).size;
	};

	/**
	 * 
	 * @param {CTATExampleTracerLink} link The link in question
	 * @return {CTATLinkGroup} The deepest LinkGroup that contains link.
	 */
	this.getLowestLevelGroupOfLink = function(link)
	{

	};

	/**
	 * 
	 * @param {CTATLinkGroup} group The group whose subgroups are to be returned
	 * @return {set of CTATLinkGroup} The set of groups which are a subgroup of the given group
	 */
	this.getGroupSubgroups = function(group)
	{

	};

	/**
	 * 
	 * @param {CTATLinkGroup} group The group whose unique links are to be returned
	 * @return {set of CTATExampleTracerLink} The set of links which this group contains, but none of its
	 * subgroups contain.  May be an empty set
	 */
	this.getUniqueLinks = function(group)
	{

	};

	/**
	 * 
	 * @param {CTATLinkGroup} group The group whose links are to be returned
	 * @return {set of type CTATExampleTracerLink} The set of links which the given group contains
	 */
	this.getGroupLinks = function(group)
	{

	};

	/**
	 * Removes the link from all subgroups of group.  Also removes the link from
	 * group, if group is not the topLevel group.
	 * @param {CTATLinkGroup} group The group which is to have its link removed
	 * @param {CTATExampleTracerLink} link The link to remove
	 * @return {undefined}
	 */
	this.removeLinkFromGroup = function(group, link)
	{

	};


	/**
	 * @param {CTATLinkGroup} group The group whose parent is to be returned
	 * @return {CTATLinkGroup} The group which contains the given group as a child.
	 * Null if the given group is the TopLevel group
	 */
	 this.getGroupParent = function(group)
	 {

	 };

	/**
	 * @param {String} name The name to which the group maps
	 * @param {boolean} isOrdered True if the group maps to ordered, false if it maps to unordered
	 * @param {set of CTATExampleTracerLink} links The set of links the group will contain
	 * @return {string} Equivalent to isLinkSetAddableAsGroup(links)
	 */
	this.addGroup = function(name, isOrdered, links)
	{

	};

	/**
	 * 
	 * @param {CTATLinkGroup} grp The group whose reenterable status is to be set
	 * @param {boolean} isReenterable Should be true if the group is reenterable, 
	 * false if not
	 * @return {undefined}
	 */
	this.setGroupReenterable = function(grp, isReenterable)
	{

	};

/****************************** PUBLIC METHODS ****************************************************/

};

CTATGroupModel.prototype = Object.create(CTATBase.prototype);
CTATGroupModel.prototype.constructor = CTATGroupModel;

if(typeof module !== 'undefined')
{
	module.exports = CTATGroupModel;
} 