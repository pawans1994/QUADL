/* This object represents an CTATDefaultGroupModel */

goog.provide('CTATDefaultGroupModel');

goog.require('CTATExampleTracerException');
goog.require('CTATDefaultLinkGroup');
goog.require('CTATGroupIterator');
goog.require('CTATGroupModel');

//goog.require('CTATExampleTracerLink');//
//goog.require('CTATLinkGroup');//
//goog.require('CTATBase');

/* LastModify: FranceskaXhakaj 07/14*/

/**
 * @constructor
 * @augments CTATGroupModel
 */
CTATDefaultGroupModel = function() 
{

/**************************** INHERITED CONSTRUCTOR ******************************************************/

	//calling the constructor of the super class
	CTATGroupModel.call(this);

/**************************** PUBLIC INSTANCE VARIABLES ******************************************************/

/**************************** PRIVATE INSTANCE VARIABLES ******************************************************/

	/** 
	 * The maximum number of records.
	 * @type {CTATDefaultLinkGroup}
	 */
	var TopLevel = null;

	/** 
	 * The maximum number of records.
	 * @type {boolean}
	 */
	var isDefaultReenterable = false;

	/**
     * Make the object available to private methods
     */
	var that = this;

/***************************** PRIVATE METHODS *****************************************************/

	/**
	 * @param {CTATLinkGroup} grp 
	 * @param {CTATExampleTracerLink} link 
	 * @param {boolean} canRemoveFromTopLevel  
	 * @return {undefined}
	 */
	function internalRemoveLinkFromGroupRecursive (grp, link, canRemoveFromTopLevel)
	{
		//ctatdebug("CTATDefaultGroupModel --> in internalRemoveLinkFromGroupRecursive");

		if(grp.containsLink(link) === true)
		{
			//ctatdebug("CTATDefaultGroupModel --> in internalRemoveLinkFromGroupRecursive in if cond");

			that.getGroupSubgroups(grp).forEach(function(subgroup)
			{
				that.removeLinkFromGroup(subgroup, link);
			});

			if(grp !== TopLevel || canRemoveFromTopLevel)
			{
				//ctatdebug("CTATDefaultGroupModel --> in internalRemoveLinkFromGroupRecursive in inner if cond");

				internalRemoveLinkFromGroup(grp, link);
			}
		}
	}
	
	/**
	 * @param {CTATLinkGroup} grp 
	 * @param {CTATExampleTracerLink} link 
	 * @return {boolean}
	 */
	function internalRemoveLinkFromGroup(grp, link)
	{
		//ctatdebug("CTATDefaultGroupModel --> in internalRemoveLinkFromGroup");
		return grp.removeLink(link);
	}

	/**
	 * @param {CTATLinkGroup} grp
	 * @param {CTATExampleTracerLink} link of type 
	 * @return {undefined}
	 */
	function internalAddLinkToGroup(grp, link)
	{
		//ctatdebug("CTATDefaultGroupModel --> in internalAddLinkToGroup");
		grp.addLink(link);
		//ctatdebug("CTATDefaultGroupModel --> out of internalAddLinkToGroup");
	}

	/**
	 * @param {CTATExampleTracerLink} link 
	 * @param {CTATLinkGroup} group 
	 * @return {CTATLinkGroup}
	 */
	function getImmediateGroupOfLink (link, group)
	{
		//ctatdebug("CTATDefaultGroupModel --> in getImmediateGroupOfLink");

		var temp = null;

		var retVal = false;
		var val = null;

		that.getGroupSubgroups(group).forEach(function(subGroup)
		{
			if (retVal === true) 
			{
				return;
			}

			if(that.isLinkInGroup(subGroup, link) === true)
			{
				temp = that.getImmediateGroupOfLink(link, subGroup);

				if(temp !== null && typeof(temp) !== 'undefined')
				{
					val = temp;
					retVal = true;
					return;
				}
				else
				{
					val = subGroup;
					retVal = true;
					return;
				}
			}
		});

		if(retVal === true)
		{
			return val;
		}

		return null;
	}

	/**
	 * @param {CTATLinkGroup} group 
	 * @param {CTATExampleTracerLink} links  
	 * @return {CTATLinkGroup}
	 */
	function getNaturalContainingGroup(group, links)
	{
		//ctatdebug("CTATDefaultGroupModel --> in getNaturalContainingGroup");

		if(links.size === that.getGroupLinks(group).size)
		{
			that.getGroupLinks(group).forEach(function(link)
			{
				if(links.has(link) === false)
				{
					throw new CTATExampleTracerException("Invalid link selection: Partial overlap with existing group: " + group);
				}
			});

			throw new CTATExampleTracerException("Group containing this set of links already exists: " + group);
		}

		if(links.size >= that.getGroupLinks(group).size)
		{
			throw new CTATExampleTracerException("Invalid link selection: Partial overlap with existing group: "+group);
		}

		var retVal = false;
		var val = null;

		links.forEach(function(link)
		{
			if(retVal === true)
			{
				return;
			}

			if(that.isLinkInGroup(group, link) === false)
			{
				throw new CTATExampleTracerException("Invalid link selection: Partial overlap with existing group: "+group);
			}

			that.getGroupSubgroups(group).forEach(function(subgroup)
			{
				if(retVal === true)
				{
					return;
				}

				if(that.isLinkInGroup(subgroup, link) === true)
				{
					if(that.getGroupLinkCount(subgroup) >= links.size)
					{
						val = getNaturalContainingGroup(subgroup, links);
						retVal = true;
						return;
						//return getNaturalContainingGroup(subgroup, links);
					}
					else
					{
						that.getGroupLinks(subgroup).forEach(function(subgroupLink)
						{
							if(links.has(subgroupLink) === false)
							{
								throw new CTATExampleTracerException("Invalid link selection: Partial overlap with existing group: "+group);
							}
						});
					}
				}
			});
		});

		if(retVal === true)
		{
			return val;
		}

		return group;
	}

	/**
	 * @param {CTATLinkGroup} parent 
	 * @param {CTATLinkGroup} child  
	 * @return {undefined}
	 */
	function addSubgroupPreserveSanity(parent, child)
	{
		//ctatdebug("CTATDefaultGroupModel --> in addSubgroupPreserveSanity parent: " + parent.getName());
		//ctatdebug("CTATDefaultGroupModel --> in addSubgroupPreserveSanity child: " + child.getName());
		//ctatdebug("CTATDefaultGroupModel --> in addSubgroupPreserveSanity size: " + that.getGroupSubgroups(parent).size);

		that.getGroupSubgroups(parent).forEach(function(parentSubgroup)
		{
			var parentSubgroupLinks = that.getGroupLinks(parentSubgroup);
			
			if(parentSubgroupLinks.size === 0)
			{
				//ctatdebug("CTATDefaultGroupModel --> in addSubgroupPreserveSanity parentSubgroupLinks is zero");
				that.getGroupSubgroups(parent).delete(parentSubgroup);
				addSubgroup(child, parentSubgroup);
			}
			else
			{
				//ctatdebug("CTATDefaultGroupModel --> in addSubgroupPreserveSanity else branch");
				
				var firstOne = null;
				var gotIt = false;

				//mimicking the Java functionality of getting the first element of a Set
				parentSubgroupLinks.forEach(function(el)
				{
					if(gotIt === false)
					{
						firstOne = el;
						gotIt = true;
					}
					
					return;	
				});

				if(that.isLinkInGroup(child, firstOne) === true)
				{
					//ctatdebug("CTATDefaultGroupModel --> in addSubgroupPreserveSanity isLinkInGroup true");
					that.getGroupSubgroups(parent).delete(parentSubgroup);
					
					//ctatdebug("CTATDefaultGroupModel --> in addSubgroupPreserveSanity child if: " + child.getName());
					//ctatdebug("CTATDefaultGroupModel --> in addSubgroupPreserveSanity parentSubgroup if: " + parentSubgroup.getName());
					addSubgroup(child, parentSubgroup);
				}
			}
		});

		//ctatdebug("CTATDefaultGroupModel --> out if addSubgroupPreserveSanity parent: " + parent.getName());
		//ctatdebug("CTATDefaultGroupModel --> out if addSubgroupPreserveSanity child: " + child.getName());
		addSubgroup(parent, child);
	}

	/**
	 * @param {CTATLinkGroup} parent  
	 * @param {CTATLinkGroup} child 
	 * @return {undefined}
	 */
	function addSubgroup(parent, child)
	{
		//ctatdebug("CTATDefaultGroupModel --> in addSubgroup");

		parent.addSubgroup(child);
		child.setParent(parent);

		//ctatdebug("CTATDefaultGroupModel --> out of addSubgroup");
	}


/***************************** PRIVILEDGED METHODS *****************************************************/
	
	/**
	 * @return {undefined}
	 */
	this.clear = function()
	{
		//ctatdebug("CTATDefaultGroupModel --> in clear");

		TopLevel = new CTATDefaultLinkGroup("defaultName", true, isDefaultReenterable, null);
		//we do not have listeners, this call is not needed

		//ctatdebug("CTATDefaultGroupModel --> out of clear");
	};

	/**
	 * @param {boolean} givenIsDefaultReenterable True if groups should be reenterable
	 * by default, false otherwise
	 * @return {undefined}
	 */
	this.setDefaultReenterable = function(givenIsDefaultReenterable)
	{
		//ctatdebug("CTATDefaultGroupModel --> in setDefaultReenterable");

		isDefaultReenterable = givenIsDefaultReenterable;

		//ctatdebug("CTATDefaultGroupModel --> out of setDefaultReenterable");
	};

	/**
	 * @param {CTATLinkGroup} group The group whose ordered is to be set
	 * @param {boolean} isOrdered Should be true if the group is ordered, false
	 * if unordered
	 * @return {undefined}
	 */
	this.setGroupOrdered = function(group, isOrdered)
	{
		//ctatdebug("CTATDefaultGroupModel --> in setGroupOrdered");

		group.setOrdered(isOrdered);
		//we do not have listeners

		//ctatdebug("CTATDefaultGroupModel --> out of setGroupOrdered");
	};

	/**
	 * @return {CTATLinkGroup} The CTATLinkGroup representing the TopLevel group
	 */
	this.getTopLevelGroup = function()
	{
		ctatdebug("CTATDefaultGroupModel --> in getTopLevelGroup");

		return TopLevel;
	};

	/**
	 * @param {CTATLinkGroup} group The group whose name is to be set
	 * @param {String} name The name to associate with the given group
	 * @return {undefined}
	 */
	this.setGroupName = function (group, name)
	{
		//ctatdebug("CTATDefaultGroupModel --> in setGroupName");

		group.setName(name);
		//we do not have listeners

		//ctatdebug("CTATDefaultGroupModel --> out of setGroupName");
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
		//ctatdebug("CTATDefaultGroupModel --> in addLinkToGroup");

		that.removeLinkFromGroup(TopLevel, link);

		//this should work correctly
		for( ; group !== null && typeof(group) !== 'undefined'; group = that.getGroupParent(group))
		{
			internalAddLinkToGroup(group, link);
		}

		//ctatdebug("CTATDefaultGroupModel --> out of addLinkToGroup");

		//we do not have listeners
	};

	/**
	 * @param {CTATLinkGroup} grp 
	 * @return {boolean}
	 */
	this.isGroupOrdered = function(grp)
	{
		//ctatdebug("CTATDefaultGroupModel --> in isGroupOrdered");

		return grp.getIsOrdered();
	};

	/**
	 * @param {CTATLinkGroup} grp 
	 * @return {boolean}
	 */
	this.isGroupReenterable = function(grp)
	{
		//ctatdebug("CTATDefaultGroupModel --> in isGroupReenterable");

		return grp.getIsReenterable();
	};

	/**
	 * @param {CTATLinkGroup} grp 
	 * @param {CTATExampleTracerLink} link
	 * @return {boolean}
	 */
	this.isLinkInGroup = function(grp, link)
	{
		//ctatdebug("CTATDefaultGroupModel --> in isLinkInGroup");

		return grp.containsLink(link);
	};

	/**
	 * @param {CTATExampleTracerLink} link  
	 */
	this.getGroupsContainingLink = function(link)
	{
		console.log("CTATDefaultGroupModel --> in getGroupsContainingLink(" + link + "): TopLevel " + TopLevel + ", typeof(TopLevel) " + typeof(TopLevel));

		var groups = new Set(); //of CTATLinkGroup

		var groupIter = new CTATGroupIterator(TopLevel);

		console.log("CTATDefaultGroupModel --> in getGroupsContainingLink before loop: groupIter " + groupIter + ", typeof(groupIter) " + typeof(groupIter));

		while(groupIter.hasNext() === true)
		{
			var group = groupIter.next();

			if(that.isLinkInGroup(group, link) === true)
			{
				groups.add(group);
			}
		}

		/*that.getTopLevelGroup().getSubgroups().forEach(function(group) //over who are we iterating
		{
			if(that.isLinkInGroup(group, link) === true)
			{
				groups.add(group);
			}
		});*/

		console.log("CTATDefaultGroupModel --> in getGroupsContainingLink returning groups.size " + groups.size);
		return groups;
	};

	/**
	 * @param {CTATExampleTracerLink} link 
	 * @return {CTATLinkGroup}
	 */
	this.getLowestLevelGroupOfLink = function(link)
	{
		//ctatdebug("CTATDefaultGroupModel --> in getLowestLevelGroupOfLink");

		var temp = getImmediateGroupOfLink(link, TopLevel);

		if(temp !== null && typeof(temp) !== 'undefined')
		{
			return temp;
		}

		if(that.isLinkInGroup(TopLevel, link) === true)
		{
			return TopLevel;
		}

		return null;
	};

	/**
	 * @param {CTATLinkGroup} grp 
	 * @return {Set of CTATLinkGroup}
	 */
	this.getGroupSubgroups = function(grp)
	{
		//ctatdebug("CTATDefaultGroupModel --> in getGroupSubgroups");

		return (grp !== null && typeof(grp) !== 'undefined' ? grp.getSubgroups() : null);
	};

	/**
	 * @param {CTATLinkGroup} group 
	 * @return {Set of CTATExampleTracerLink} 
	 */
	this.getUniqueLinks = function(group)
	{
		//ctatdebug("CTATDefaultGroupModel --> in getUniqueLinks");

		var uniqueLinks = new Set(); //set of CTATExampleTracerLink

		that.getGroupLinks(group).forEach(function(el)
		{
			uniqueLinks.add(el);
		});

		that.getGroupSubgroups(group).forEach(function(subgroup)
		{
			that.getGroupLinks(subgroup).forEach(function(link)
			{
				uniqueLinks.delete(link); //Remove all links contained by subgroups
			});
		});

		return uniqueLinks; //remaining links are the unique links
	};

	/**
	 * @param {CTATLinkGroup} grp 
	 * @return {Set of CTATExampleTracerLink}
	 */
	this.getGroupLinks = function(grp)
	{
		//ctatdebug("CTATDefaultGroupModel --> in getGroupLinks");

		return grp.getLinks();
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
		//ctatdebug("CTATDefaultGroupModel --> in removeLinkFromGroup");

		internalRemoveLinkFromGroupRecursive(group, link, false);
		//we do not have listeners

		//ctatdebug("CTATDefaultGroupModel --> out of removeLinkFromGroup");
	};

	/**
	 * 
	 * @param {CTATLinkGroup} grp The group whose parent is to be returned
	 * @return {CTATLinkGroup} The group which contains the given group as a child.
	 * Null if the given group is the TopLevel group
	 */
	this.getGroupParent = function(grp)
	{
		//ctatdebug("CTATDefaultGroupModel --> in getGroupParent");

		return grp.getParent();
	};

	/**
	 * @param {String} name The name to which the group maps
	 * @param {boolean} isOrdered True if the group maps to ordered, false if it maps to unordered
	 * @param {Set of CTATExampleTracerLink} links The set of links the group will contain
	 * @return {String} Equivalent to isLinkSetAddableAsGroup(links)
	 */
	this.addGroup = function(name, isOrdered, links)
	{
		//ctatdebug("CTATDefaultGroupModel --> in addGroup");

		var naturalContainingGroup = null; //of type CTATLinkGroup

		try
		{
			//ctatdebug("CTATDefaultGroupModel --> in addGroup in try");

			naturalContainingGroup = getNaturalContainingGroup(TopLevel, links);
			
			//ctatdebug("CTATDefaultGroupModel --> in addGroup out of try");

		}
		catch(e)
		{
			//ctatdebug("CTATDefaultGroupModel --> in addGroup in catch");
			return e.toString();
		}


		var newGroup = new CTATDefaultLinkGroup(name, isOrdered, isDefaultReenterable, links); //of type CTATDefaultLinkGroup

		//ctatdebug("CTATDefaultGroupModel --> in addGroup after creating new group");

		addSubgroupPreserveSanity(naturalContainingGroup, newGroup);

		//we do not have listeners

		//ctatdebug("CTATDefaultGroupModel --> in addGroup: New group added: " + newGroup.getName());

		return "";
	};

	/**
	 * 
	 * @param {CTATLinkGroup} grp The group whose reenterable status is to be set
	 * @param {boolean} givIsReenterable Should be true if the group is reenterable, 
	 * false if not
	 * @return {undefined}
	 */
	this.setGroupReenterable = function(grp, givIsReenterable)
	{
		//ctatdebug("CTATDefaultGroupModel --> in setGroupReenterable");

		grp.setReenterable(givIsReenterable);
	};

	/**
	 * 
	 * @param {CTATLinkGroup} grp The group whose ordered is to be set
	 * @param {boolean} givIsOrdered Should be true if the group is ordered, false
	 * if unordered
	 * @return {undefined}
	 */
	this.setGroupOrdered = function(grp, givIsOrdered)
	{
		//ctatdebug("CTATDefaultGroupModel --> in setGroupOrdered");

		grp.setOrdered(givIsOrdered);

		//we do not have any listeners
	};

	/**
	 * @return {Map<Integer, CTATExampleTracerLink>}
	 */
	this.createIdToLinkMap = function()
	{
		ctatdebug("CTATDefaultGroupModel --> in createIdToLinkMap");

		var map = {};

		that.getGroupLinks(TopLevel).forEach(function(link)
		{
			map[link.getUniqueID()] = link;
		});

		return map;
	};

	/**
	 * @param {String} name
	 * @return {CTATLinkGroup}
	 */
	this.getGroupByName = function(name)
	{
		//ctatdebug("CTATDefaultGroupModel --> in getGroupByName TopLevel has: " + TopLevel.getSubgroups().size);

		var groupIter = new CTATGroupIterator(TopLevel);
		
		while(groupIter.hasNext() === true)
		{
			var group = groupIter.next();

			//ctatdebug("CTATDefaultGroupModel --> in getGroupByName first if that.getGroupName(group): " + that.getGroupName(group));
			//ctatdebug("CTATDefaultGroupModel --> in getGroupByName first if name: " + name);
			//ctatdebug("CTATDefaultGroupModel --> in getGroupByName number of subgroups of group: " + group.getSubgroups().size);

			if(that.getGroupName(group).toString() === name.toString())
			{
				return group;
			}
		}

		/*that.getTopLevelGroup().getSubgroups().forEach(function(group)
		{
			//ctatdebug("CTATDefaultGroupModel --> in getGroupByName first loop");

			if(retVal === true)
			{
				//ctatdebug("CTATDefaultGroupModel --> in getGroupByName first if cond");
				return;
			}

			//ctatdebug("CTATDefaultGroupModel --> in getGroupByName first if that.getGroupName(group): " + that.getGroupName(group));
			//ctatdebug("CTATDefaultGroupModel --> in getGroupByName first if name: " + name);
			//ctatdebug("CTATDefaultGroupModel --> in getGroupByName number of subgroups of group: " + group.getSubgroups().size);

			if(that.getGroupName(group).toString() === name.toString())
			{
				//ctatdebug("CTATDefaultGroupModel --> in getGroupByName second if cond");
				val = group;
				retVal = true;
				return;
				//return group;
			}
		});


		if(retVal === true)
		{
			//ctatdebug("CTATDefaultGroupModel --> in getGroupByName returning val " + (val === null));
			return val;
		}*/

		//ctatdebug("CTATDefaultGroupModel --> in getGroupByName returning null");
		return null;
	};

	/**
	 * @param {CTATLinkGroup} grp 
	 * @return {String}
	 */
	this.getGroupName = function(grp)
	{
		return grp.getName();
	};



/****************************** PUBLIC METHODS ****************************************************/


/****************************** CONSTRUCTOR CALLS ****************************************************/

	that.clear();
};

/**************************** SETTING UP INHERITANCE ******************************************************/

CTATDefaultGroupModel.prototype = Object.create(CTATGroupModel.prototype);
CTATDefaultGroupModel.prototype.constructor = CTATDefaultGroupModel;

if(typeof module !== 'undefined')
{
	module.exports = CTATDefaultGroupModel;
}