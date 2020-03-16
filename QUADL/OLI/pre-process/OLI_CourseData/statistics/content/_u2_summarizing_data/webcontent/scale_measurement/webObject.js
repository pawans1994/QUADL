function resizeIframe(frameTop, frameLeft, frameWidth, frameHeight, iframeID, IsAutoload)
{
	console.log('Resizing Iframe');	
	
	var parentIframeDiv = $('#'+iframeID);
	parentIframeDiv = parentIframeDiv[0];
	parentIframeDiv = document.getElementById(iframeID);
	var top = "top:" + frameTop + "px; ";
	var left = "left:" + frameLeft + "px; ";
	var width = "width:" + frameWidth + "px; ";
	var height = "height:" + frameHeight + "px; ";
	var position = "position: absolute; ";
	var style = top + left + width + height + position;
	if(!IsAutoload)
	{
		//var background = "background: #c0c0c0";
		var background = "background: url('data/html/pa/play-button-overlay.png'); background-size: cover; background-repeat: no-repeat";
		parentIframeDiv.setAttribute("style", style+background);
	}
	else
	{
		parentIframeDiv.setAttribute("style", style);
	}	
}

function createWebObjectIframe(source, frameTop, frameLeft, frameWidth, frameHeight, iframeID, IsAutoload, IsScrolling, IsURL)
{
	console.log('Creating Iframe' + iframeID);
	var parentIframeDiv = document.createElement('div');
	var top = "top:" + frameTop + "px; ";
	var left = "left:" + frameLeft + "px; ";
	var width = "width:" + frameWidth + "px; ";
	var height = "height:" + frameHeight + "px; ";
	var position = "position: absolute;";
	var style = top + left + width + height + position;
	
	parentIframeDiv.id=iframeID;
	
	if(!IsAutoload)
	{
		//var background = "background: #c0c0c0";
		var background = "background: url('data/html/pa/play-button-overlay.png'); background-size: cover; background-repeat: no-repeat";
		var styleBackground = style + background;
		parentIframeDiv.setAttribute("style", styleBackground);
		
		parentIframeDiv.onclick = function(){
			this.setAttribute("style", style);
			var link = source;
			var iframe = document.createElement('iframe');
			if(IsURL)
			{
				iframe.frameBorder=1+"px";
			}
			else
			{
				iframe.frameBorder=0+"px";
			}
			iframe.style.width=100 + "%";
			iframe.style.height=100 + "%";
			iframe.id='webObjectIframe';
			iframe.setAttribute("src", link);
			if(!IsScrolling)
			{
				iframe.setAttribute("scrolling", "no");
			}
			parentIframeDiv.appendChild(iframe);
			}
	}
	else
	{
		parentIframeDiv.setAttribute("style", style);
		
		var link = source;
		var iframe = document.createElement('iframe');
		if(IsURL)
		{
			iframe.frameBorder=1+"px";
		}
		else
		{
			iframe.frameBorder=0+"px";
		}
		iframe.style.width=100 + "%";
		iframe.style.height=100 + "%";
		iframe.id='webObjectIframe';
		iframe.setAttribute("src", link);
		if(!IsScrolling)
		{
			iframe.setAttribute("scrolling", "no");
		}
		parentIframeDiv.appendChild(iframe);
	}
	document.getElementById("WebObjectHolderDiv").appendChild(parentIframeDiv);
}

function removeIframeNode(node)
{
	console.log('deleting iframe' + node.id);
	var iframeChild = node.childNodes[0];
	if(iframeChild.tagName == 'IFRAME')
	{
		node.removeChild(iframeChild);
		//node.parentNode.removeChild(node);
	}
}

function deleteWebObjectIframe()
{	
	
	var slide = document.getElementById("WebObjectHolderDiv");
	var len = slide.childNodes.length;
	console.log('deleteing iframe ' + len);
	if(len)
	{
		for(var i = 0; i<len; i++)
		{  
			console.log(i);
			var node = slide.childNodes[0];
			console.log('node id ' + node.id);
			$('#'+ node.id).remove();
		}
	}
}
