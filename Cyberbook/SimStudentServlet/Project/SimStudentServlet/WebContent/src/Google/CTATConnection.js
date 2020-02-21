﻿/**------------------------------------------------------------------------------------
 $Author$ 
 $Date$ 
 $Header$ 
 $Name$ 
 $Locker$ 
 $Log$

 -------------------------------------------------------------------------------------
 License:
 -------------------------------------------------------------------------------------
 ChangeLog:
 -------------------------------------------------------------------------------------
 Notes:
 ------------------------------------------------------------------------------------
*/

/**
 *
 */
function CTATConnection () 
{	
	CTATBase.call(this, "CTATConnection","connection");
	
	this.id=-1;
	this.consumed=false;
	this.url="";
	this.data="";
				
	var pointer = this;

	/**
	* Do not call this method before open is called on the http object. If you do you will
	* get a Javascript exception that says: "an attempt was made to use an object that is 
	* not or is no longer usable"
	*/
	this.init=function init ()
	{
		pointer.ctatdebug ("init ()");
	};		
}

CTATConnection.prototype = Object.create(CTATBase.prototype);
CTATConnection.prototype.constructor = CTATConnection;
