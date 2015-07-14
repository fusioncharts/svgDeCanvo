var SvgDeCanvo;

( function () {
	var win = window,
		doc = win.document,
		nodeArr = [],
		drawArr = [],
		defs,
		context,
		svg;
	
	/*
	* The Constructor function
	* @constructor
	* @param {string/SVG DOM Object} - SVG element to be draw on canvas
	* @param {function} - The function to be called after successsfully drawing in canvas
	*/
	SvgDeCanvo = function ( svgElem, canvasElem, callback ) {
		nodeArr = [];
        // Check if call as class or function
        if (!(this instanceof SvgDeCanvo)) {
        	throw("This function should be used as class");
        }
            
        if ( canvasElem.getContext && canvasElem.getContext('2d') ) {
        	// Assigning the 2d context
        	context = canvasElem.getContext('2d');
        	// Clearing the canvas for fresh rendering
        	context.clearRect(0, 0, canvasElem.width, canvasElem.height);
        } else { // if canvas is not supported
        	return;
        }
		
		// Create the svg document object also if string is passed
		if (typeof(svgElem.documentElement) != 'undefined') {
			svg = svgElem;
		}
		else if (svgElem.substr(0,1) == '<') {
			svg = this.StrToDom(svgElem);
		}
		
		this.prepareDomTree(nodeArr, [], svg);
		console.log(nodeArr);
		this.drawOnCanvas(nodeArr);
		
	}

	/*
	* Method that draw the element in the dom tree in order
	* this is also recursive and will draw only the innermost 
	* Element of a node.
	* @param {array} arr - the dom array
	 */
	SvgDeCanvo.prototype.drawOnCanvas = function (arr) {
		var a,
			fncName;

		// If the last element and if its related function exist
		// then call the function to draw it on the canvas
		if(arr.constructor !== Array) {
			fncName = "draw" + arr.tagName;
			if( this[fncName] ) {
				this[fncName]( arr );
			}
			return;
		}
		// call the function recursively draw all the innermost node
		for ( a in arr ) {
			this.drawOnCanvas( arr[a] );
		}

	}
	
	/*
	* Method that create the dom tree in order (Recursive)
	* @param {array} arr - Array where the dom tree will be stored
	* @param {array} attrib - Attribute lists from its parent
	* @param {SVG} svgElem - the svg element whose dom tree will be created
	 */
	SvgDeCanvo.prototype.prepareDomTree = function (arr, attrib, svgElm) {
		var chldrn = svgElm.childNodes,
			numChldrn = chldrn ? chldrn.length : 0,
			chArr = [],
			i;

		// Copy the parent attributes
		for ( i in attrib ) {
			// Dont copy this parent attribute
			if ( attrib[i].name == 'class' || attrib[i].name == 'id' ) {
				continue;
			}
			// If attribute not exist copy parent attribute
			if ( typeof attrib[i] == 'object' && !svgElm.attributes[attrib[i].name]) {
				svgElm.setAttribute([attrib[i].name], attrib[i].value);
			}
		}
		// If this element is the last element in the hirarchy then push it to the array
		if(numChldrn == 0 || (numChldrn == 1 && !chldrn[0].tagName)) {
			arr.push(svgElm);
			return;
		}
		
		// if the 
		for ( i = 0; i < numChldrn; i++ ) {
			// Keep the defs tag seperate from the dom array
			if (chldrn[i].tagName == 'defs') {
				defs = svgElm;
				continue;
			}
			// Keep the unwanted tag out from the dom array
			if (!chldrn[i].tagName) {
				continue;
			}
			// Prepare the dom array with the tag name 
			arr[chldrn[i].tagName +"|"+i] = [];
			// Recursively call the function until the innermost node is reached
			this.prepareDomTree(arr[chldrn[i].tagName +"|"+i],
				svgElm.tagName == 'svg' ? [] : svgElm.attributes, chldrn[i]);
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

	/***************************************************************************
	* Below are the functions that will be used for drawing the relative SVG 
	* elements on canvas
	* function name should be like draw{tagName} for ex - for text element
	* name will be drawtext.
	* the function will get one argument the respective SVG with all Attributes
	* required to draw it perfectly
	***************************************************************************/

	SvgDeCanvo.prototype.drawtext = function( elem ) {
		// innerHTML for chrome and firefox textContent for safari and IE
		var text = elem.innerHTML || elem.textContent, 
			x = elem.attributes.x.value,
			y = elem.attributes.y.value;
		context.fillText(text, x, y);
	}

	SvgDeCanvo.prototype.drawtspan = function( elem ) {
		// innerHTML for chrome and firefox textContent for safari and IE
		var text = elem.innerHTML || elem.textContent, 
			x = elem.attributes.x.value,
			y = elem.attributes.y.value;
		context.fillText(text, x, y);
	}

} () );