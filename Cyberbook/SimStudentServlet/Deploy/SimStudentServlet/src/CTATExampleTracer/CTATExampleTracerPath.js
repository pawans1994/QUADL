/* This object represents an CTATExampleTracerPath */

goog.provide('CTATExampleTracerPath');
goog.require('CTATBase');
goog.require('CTATExampleTracerLink');
goog.require('CTATExampleTracerPathComparator');

/* LastModify: sewall 2014/10/31 */

/**
 * @constructor
 * @param {CTATExampleTracerLink} givenLinks
 */
CTATExampleTracerPath = function(givenLinks) 
{
	CTATBase.call(this, "CTATExampleTracerPath","");

/**************************** PUBLIC INSTACE VARIABLES ******************************************************/

/**************************** PRIVATE INSTACE VARIABLES ******************************************************/

	/**
	 * The links in the path, not ordered
     * @type {Set of CTATExampleTracerLink}
     */
	var links = new Set();

	//if we are given a set of CTATExampleTracerLinks with the constructor
	if(typeof(givenLinks) !== 'undefined' && givenLinks !== null)
	{
		givenLinks.forEach(function(el)
		{
			ctatdebug("CTATExampleTracerPath --> in constructor building links with " + el);
			links.add(el); //creating a Set with the given set
		});
	}
	
	/**
	 * Sorted links.
     * @type {array of CTATExampleTracerLink}
     */
	var sortedLinks = null;
	
	/**
	 * The length of the initial subpath consisting only of preferred links.
     * @type {integer}
     */
	var numberOfPreferredPrefixLinks = null; 
	
	/**
	 * The total count of preferred links anywhere in the path.
     * @type {integer}
     */
	var numberOfPreferredLinks = null;
	
	/**
	 * Number of CTATExampleTracerLink.FIREABLE_BUGGY_ACTION links in the path.
     * @type {integer}
     */
	var numberOfSuboptimalLinks = null;
	
	/**
	 * Whether this path leads to a Done state.
     * @type {boolean}
     */
	var donePath = null;

	/**
	 * Whether this path includes an CTATExampleTracerLink.BUGGY_ACTION link.
     * @type {boolean}
     */
	var incorrectPath = null;

	/**
     * Make the object available to private methods
     */
	var that = this; // used to make the object available to the private methods

/***************************** PRIVATE METHODS *****************************************************/



/***************************** PRIVILEDGED METHODS *****************************************************/

	/**
	 * @return {boolean}
	 */
	this.isIncorrectPath = function()
	{
		ctatdebug("CTATExampleTracerPath --> in isIncorrectPath");
		
		if(incorrectPath !== null && typeof(incorrectPath) !== 'undefined')
		{
			return incorrectPath; //we can return a boolean like this
		}

		var returnValue = false;

		that.getLinks().forEach(function(link)
		{
			if(returnValue === true)
			{
				return;
			}

			if(link.getType().toString() === CTATExampleTracerLink.BUGGY_ACTION.toString())
			{
				incorrectPath = true;
				returnValue = true; //we cannot break from a forEach, this is a fixup
				return;
			}
		});

		if(returnValue === true)
		{
			return true; //we should have returned in the forEach
		}
		
		incorrectPath = false;

		ctatdebug("CTATExampleTracerPath --> out of isIncorrectPath");
		return false;
	};

	/**
	 * Count the number of getLinks()entries whose 
	 * CTATExampleTracerLink.getType() matches
	 * CTATExampleTracerLink.FIREABLE_BUGGY_ACTION
	 * @return {integer}
	 */
	this.getNumberOfSuboptimalLinks = function()
	{
		ctatdebug("CTATExampleTracerPath --> in getNumberOfSuboptimalLinks");

		that.getSortedLinks(); //because we are calling an iterator from this function

		if(numberOfSuboptimalLinks !== null && typeof(numberOfSuboptimalLinks) !== 'undefined')
		{
			return numberOfSuboptimalLinks;
		}

		var result = 0; //of type integer

		that.getLinks().forEach(function(link)
		{
			if(CTATExampleTracerLink.FIREABLE_BUGGY_ACTION.toString() === link.getType().toString())
			{
				result++;
			}
		});

		numberOfSuboptimalLinks = result;

		ctatdebug("CTATExampleTracerPath --> out of getNumberOfSuboptimalLinks");
		return result;
	};

	/**
	 * @return {integer}
	 */
	this.getNumberOfPreferredPrefixLinks = function()
	{
		ctatdebug("CTATExampleTracerPath --> in getNumberOfPreferredPrefixLinks");

		if(numberOfPreferredPrefixLinks !== null && typeof(numberOfPreferredPrefixLinks) !== 'undefined')
		{
			return numberOfPreferredPrefixLinks;
		}

		var prefs = 0; //of type integer

		var breakValue = false;

		that.getSortedLinks().forEach(function(link) //we are traversing over sorted links
		{
			if(breakValue === true)
			{
				return;
			}

			if(link.getIsPreferredLink() === true)
			{
				prefs++;
			}
			else
			{
				breakValue = true; //we cannot break from a forEach therefore this is a fixup
				return;
			}
		});

		numberOfPreferredPrefixLinks = prefs;

		ctatdebug("CTATExampleTracerPath --> out of getNumberOfPreferredPrefixLinks");
		
		return prefs;
	};
	
	/**
	 * If we only want the path up to a certain point.  Take the
	 * deepest link from the set given and return the path from
	 * there up.
	 * @param {array of CTATExampleTracerLink} matchedLinks 
	 * @return {set of CTATExampleTracerLink}
	 */
	this.getLinksRestricted = function(matchedLinks)
	{
		ctatdebug("CTATExampleTracerPath --> in getLinksRestricted");

		var deepest = CTATExampleTracerPath.getDeepestLink(matchedLinks); //this is how you call a static method
		var restrictedLinks = new Set();

		links.forEach(function(link) 
		{
			if(link.getDepth() <= deepest.getDepth())
			{
				restrictedLinks.add(link);
			}
		});

		ctatdebug("CTATExampleTracerPath --> out of getLinksRestricted");
		return restrictedLinks;
	};

	/**
	 * @return {set of CTATExampleTracerLink} The list of links
	 */
	this.getLinks = function()
	{
		ctatdebug("CTATExampleTracerPath --> in getLinks");
		return links;
	};

	/**
	 * Method added to make up for the PathComparator class in Java
	 * @return {array} Links sortend in ascending order
	 */
	this.getSortedLinks = function()
	{
		ctatdebug("CTATExampleTracerPath --> in getSortedLinks");

		//if(sortedLinks === null || typeof(sortedLinks) === 'undefined')
		//{
			sortedLinks = [];
			
			ctatdebug("CTATExampleTracerPath --> in getSortedLinks inside if");
			//we want a copy of the links
			//we do not want to modify the links directly

			ctatdebug("CTATExampleTracerPath --> in getSortedLinks that.getLinks(): " + that.getLinks());

			that.getLinks().forEach(function(el)
			{
				ctatdebug("CTATExampleTracerPath --> in getSortedLinks building array with " + el);
				sortedLinks.push(el);
			});

			//sortedLinks = that.getLinks().slice(); //WRONG: getLinks() returns sets not arrays

			ctatdebug("CTATExampleTracerPath --> in getSortedLinks sortedLinks.length(): " + sortedLinks.length);
			//sorting in ascending order
			sortedLinks.sort(function(arg0, arg1)
			{
				ctatdebug("CTATExampleTracerPath --> in getSortedLinks arg0.getDepth()" + arg0.getDepth());
				ctatdebug("CTATExampleTracerPath --> in getSortedLinks arg1.getDepth()" + arg1.getDepth());
			
				return (arg0.getDepth()-arg1.getDepth());
			});
		//}

		sortedLinks.forEach(function(el)
		{
			ctatdebug("CTATExampleTracerPath --> in getSortedLinks after sorting " + el);
		});


		ctatdebug("CTATExampleTracerPath --> out of getSortedLinks");
		return sortedLinks;
	};

	/**
 	 * @return {boolean}
	 */
	this.isDonePath = function ()
	{
		ctatdebug("CTATExampleTracerPath --> in isDonePath");

		if(donePath !== null && typeof(donePath) !== 'undefined')
		{
			return donePath;
		}

		var returnValue = false;

		that.getLinks().forEach(function(link)
		{
			if(returnValue === true)
			{
				return;
			}

			if(link.isDone() === true)
			{
				donePath = true;
				returnValue = true;
				return;
			}

		});

		if(returnValue === true)
		{
			return true; //we should have returned within forEach but we cannot break out of it
		}

		donePath = false;

		ctatdebug("CTATExampleTracerPath --> out of isDonePath");

		return false;
	};

	/**
	 * @param {CTATExampleTracerLink} exampleTracerLink
	 * @return {undefined}
	 */
	this.addLink = function (exampleTracerLink)
	{
		ctatdebug("CTATExampleTracerPath --> in addLink (" + exampleTracerLink + ")");

		links.add(exampleTracerLink);
		sortedLinks = null;
		numberOfPreferredPrefixLinks = null; // recalculate on next get()
		numberOfPreferredLinks = null;
		numberOfSuboptimalLinks = null;
		donePath = null;
		incorrectPath = null;

		ctatdebug("CTATExampleTracerPath --> out of addLink");
	};

	/**
	 * Count the number of getLinks() entries whose 
	 * link satisfies getIsPreferredLink()
	 * @return {integer} Count of such links
	 */
	this.getNumberOfPreferredLinks = function()
	{
		ctatdebug("CTATExampleTracerPath --> in getNumberOfPreferredLinks");

		if(numberOfPreferredLinks !== null && typeof(numberOfPreferredLinks) !== 'undefined')
		{
			return numberOfPreferredLinks;
		}

		var count = 0;

		that.getLinks().forEach(function(link)
		{
			if(link.getIsPreferredLink() === true)
			{
				count++;
			}
		});

		numberOfPreferredLinks = count;

		ctatdebug("CTATExampleTracerPath --> out of getNumberOfPreferredLinks");

		return count;
	};

	/**
	 * @return {string}
	 */
	this.toString = function()
	{
		var sb = "CTATExampleTracerPath: links";

		that.getSortedLinks().forEach(function(link)
		{
			sb += " " + link;
		});

		return sb;
	};


/****************************** STATIC METHODS ****************************************************/
	
	/**
	 * Static method. Can be called as CTATExampleTracerPath.getDeepestLink
	 * without the need of an instance of the class
	 * @static
	 * @param {array of CTATExampleTracerLink} c
	 * @return {CTATExampleTracerLink}
	 */
	CTATExampleTracerPath.getDeepestLink = function(c)
	{
		ctatdebug("CTATExampleTracerPath --> in getDeepestLink");

		var curr = null;

		c.forEach(function(link){

			if(curr === null || typeof(curr) === 'undefined' || curr.getDepth() < link.getDepth())
			{
				curr = link;
			}
		});

		ctatdebug("CTATExampleTracerPath --> out of getDeepestLink");
		
		return curr;
	};

	/**
	 * @static
	 * @param {set of CTATExampleTracerPath} paths 
	 * @return {CTATExampleTracerPath}
	 */
	CTATExampleTracerPath.getBestPath = function(paths)
	{
		ctatdebug("CTATExampleTracerPath --> in getBestPath");

		var bestPath = null;
		var comp = new CTATExampleTracerPathComparator();

		paths.forEach(function(path)
		{
			ctatdebug("CTATExampleTracerPath --> in getBestPath loop");

			if(bestPath === null || typeof(bestPath) === 'undefined' || comp.compare(bestPath, path) > 0)
			{
				bestPath = path;
			}
		});
		
		ctatdebug("CTATExampleTracerPath --> out of getBestPath");

		return bestPath;
	};

	/**
	 * Static method. Can be called as CTATExampleTracerPath.getHighesttLink
	 * without the need of an instance of the class.
	 * Highest means having the smallest depth === distance to the start node.
	 * @static
	 * @param {array of CTATExampleTracerLink} c
	 * @return {CTATExampleTracerLink}
	 */
	CTATExampleTracerPath.getHighesttLink = function(c)
	{
		ctatdebug("CTATExampleTracerPath --> in getHighesttLink");

		var curr = null;

		c.forEach(function(link){

			if(curr === null || typeof(curr) === 'undefined' || curr.getDepth() > link.getDepth())
			{
				curr = link;
			}
		});

		ctatdebug("CTATExampleTracerPath --> out of getHighesttLink");
		
		return curr;
	};

	/****************************** PUBLIC METHODS ****************************************************/
};

CTATExampleTracerPath.prototype = Object.create(CTATBase.prototype);
CTATExampleTracerPath.prototype.constructor = CTATExampleTracerPath;

if(typeof module !== 'undefined')
{
	module.exports = CTATExampleTracerPath;
}