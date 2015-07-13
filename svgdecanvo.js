var SvgDeCanvo;

( function () {
	var win = window,
		doc = win.document,
		nodeArr = [],
		styleArr = [],
		suppTag = [
				'text'
				],
		svg;
	
	/*
	* The Constructor function
	* @constructor
	* @param {string/SVG DOM Object} - SVG element to be draw on canvas
	* @param {function} - The function to be called after successsfully drawing in canvas
	*/
	SvgDeCanvo = function ( svgElem, callback ) {
        // Check if call as class or function
        if (!(this instanceof SvgDeCanvo))
            throw("This function should be used as class");
		
		if (typeof(svgElem.documentElement) != 'undefined') {
			svg = svgElem;
		}
		else if (svgElem.substr(0,1) == '<') {
			svg = this.StrToDom(svgElem);
		}
		
	}
	
	
	/*
	* Method that will convert svg string to dom structure
	* @param {string} str - The svg string
	* @return {DOM Element} - The equivalent dom element of the SVG string
	 */
	SvgDeCanvo.prototype.StrToDom = function (str) {
		var parser,
			doc;
			
		if (win.DOMParser)
		  {
		    parser = new DOMParser();
		    doc = parser.parseFromString(str,"text/xml");
		  }
		else // Internet Explorer
		  {
		    doc = new ActiveXObject("Microsoft.XMLDOM");
		    doc.async = false;
		    doc.loadXML(str);
		  }
		  
		  return doc;
	}


} () );