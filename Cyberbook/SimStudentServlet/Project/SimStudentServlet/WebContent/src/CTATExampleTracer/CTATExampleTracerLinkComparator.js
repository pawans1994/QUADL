/* This object represents an CTATExampleTracerLinkComparator */

goog.provide('CTATExampleTracerLinkComparator');
goog.require('CTATBase');
goog.require('CTATMatcherComparator');
goog.require('CTATExampleTracerLink');

/* LastModify: FranceskaXhakaj 07/14*/

/**
 * Comparator to choose the better of 2 CTATExampleTracerLink's to suggest.
 * Set the interpretation context for the link comparisons.
 * @param givenInterp (of type CTATExampleTracerInterpretation)
 * @param givenTracer (of type CTATExampleTracerTracer) --> as this class used to be 
 * part of ExampleTracerTracer.java, and refers to functions in CTATExampleTracerTracer in JavaScript,
 * I though it is best to pass an object of CTATExampleTracerTracer as parameter
*/

CTATExampleTracerLinkComparator = function (givenInterp, givenTracer)
{
		CTATBase.call(this, "CTATExampleTracerLinkComparator","");

	/**************************** PUBLIC INSTACE VARIABLES ******************************************************/


	/**************************** PRIVATE INSTACE VARIABLES ******************************************************/

	//Interpretation context for getting traversal counts
	var interp = givenInterp; //CTATExampleTracerInterpretation type
	var tracer = givenTracer; //CTATExampleTracerTracer type

	var that = this;

	/***************************** PRIVATE METHODS *****************************************************/
	


	/***************************** PRIVILEDGED METHODS *****************************************************/

	/**
	 * Compare links pairwise. Criteria (in this order): 
	 * result of CTATExampleTracerLink.compareLinkTypes(String, String);
	 * prefer the link with hints if one of the pair lacks them; 
	 * prefer links higher (that is, earlier) in the path; 
	 * prefer necessary links to optional links; 
	 * if only 1 of the pair is isPreferredLink()}, choose it;
	 * choose the link preferred by Matcher.compare(Matcher, Matcher)};
	 * choose the link with the lower getUniqueID().
	 * @param l1 (of type CTATExampleTracerLink) 1st link to compare
	 * @param l2 (of typeCTATExampleTracerLink) 2nd link to compare
	 * @return integer: -1 to prefer 1st, 1 to prefer 2nd
	 */
	this.compare = function(l1, l2)
	{
		//ctatdebug("CTATExampleTracerLinkComparator --> in compare");

		var t1 = l1.getType();
		var t2 = l2.getType();

		var m = CTATExampleTracerLink.compareLinkTypes(t1, t2); //returns an integer

		if(m !== 0)
		{
			//ctatdebug("CTATExampleTracerLinkComparator --> in compare m: " + m);
			return m;
		}

		var h1 = tracer.nonEmptyHints(l1, interp.getVariableTable());
		var h2 = tracer.nonEmptyHints(l2, interp.getVariableTable());

		//ctatdebug("CTATExampleTracerLinkComparator --> in compare h1, h2: " + h1 + ", " + h2);

		if(h1 > 0 && h2 <= 0)  // a link with no hints is deprecated
		{
			return -1;
		}
		else if(h1 <= 0 && h2 > 0)
		{
			return 1;
		}

		//ctatdebug("CTATExampleTracerLinkComparator --> in compare l1.getDepth(), l2.getDepth(): " + l1.getDepth() + ", " + l2.getDepth());

		if(l1.getDepth() < l2.getDepth())
		{ 
			return -1; // prefer links higher in the path
		}
		else if(l1.getDepth() > l2.getDepth())
		{
			return 1;
		}

		var tc1 = interp.getTraversalCount(l1) - l1.getMinTraversals();
		var tc2 = interp.getTraversalCount(l2) - l2.getMinTraversals();

		//ctatdebug("CTATExampleTracerLinkComparator --> in compare tc1, tc2: " + tc1 + ", " + tc2);

		if(tc1 < 0 && tc2 >= 0)
		{
			return -1;  // prefer necessary over optional links
		}
		else if(tc1 >= 0 && tc2 < 0)
		{
			return 1;
		}

		// links at same depth in same interpretation should be siblings?

		//ctatdebug("CTATExampleTracerLinkComparator --> in compare l1.getIsPreferredLink(): " + l1.getIsPreferredLink());
		//ctatdebug("CTATExampleTracerLinkComparator --> in compare l2.getIsPreferredLink(): " + l2.getIsPreferredLink());

		if(l1.getIsPreferredLink())
		{
			return -1;
		}
		else if(l2.getIsPreferredLink())
		{
			return 1;
		}

		if((m = CTATMatcherComparator.compare(l1.getMatcher(), l2.getMatcher())) !== 0)
		{
			return m;
		}

		//ctatdebug("CTATExampleTracerLinkComparator --> in compare l1.getUniqueID(): " + l1.getUniqueID());
		//ctatdebug("CTATExampleTracerLinkComparator --> in compare l2.getUniqueID(): " + l2.getUniqueID());

		if(l1.getUniqueID() < l2.getUniqueID())
		{
			return -1;
		}
		else
		{
			return 1;
		}
	};

	
	/****************************** PUBLIC METHODS ****************************************************/

};

CTATExampleTracerLinkComparator.prototype = Object.create(CTATBase.prototype);
CTATExampleTracerLinkComparator.prototype.constructor = CTATExampleTracerLinkComparator;

if(typeof module !== 'undefined')
{
	module.exports = CTATExampleTracerLinkComparator;
}
     