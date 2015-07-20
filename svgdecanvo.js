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
			styleArr = [],
			styleName,
			styleValue,
			i;

		// Copy the parent attributes
		for ( i in attrib ) {
			// Dont copy this parent attribute
			if ( attrib[i].name == 'class' || attrib[i].name == 'id' ) {
				continue;
			}
			if ( attrib[i].name == 'transform' && svgElm.attributes['transform']) {
				svgElm.setAttribute(attrib[i].name, attrib[i].value + ' ' +
					svgElm.attributes['transform'].value);
				continue
			}
			// If attribute not exist copy parent attribute
			if ( typeof attrib[i] == 'object' && !svgElm.attributes[attrib[i].name]) {
				svgElm.setAttribute([attrib[i].name], attrib[i].value);
			}
		}

		// Include style attribute that are not present in the attribute list
		if ( svgElm.attributes && svgElm.attributes['style'] ) {
			styleArr = svgElm.attributes['style'].value.replace(/;$/, '').split(';');
			for ( i in styleArr ) {
				styleName = styleArr[i].split(':')[0].trim();
				if ( !svgElm.attributes[styleName] ) {
					// bypass the style element starting with -webkit
					try {
						svgElm.setAttribute(styleName, styleArr[i].split(':')[1].trim());
					} catch ( e ) {

					}
					
				}
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

	/************************** Draw Methods start ****************************
	* Below are the functions that will be used for drawing the relative SVG 
	* elements on canvas
	* function name should be like draw{tagName} for ex - for text element
	* name will be drawtext.
	* the function will get one argument the respective SVG with all Attributes
	* required to draw it perfectly
	***************************************************************************/

	SvgDeCanvo.prototype.drawtext = function( elem ) {
		// Internally calling the drawspan function
		this.drawtspan( elem );
	}

	SvgDeCanvo.prototype.drawtspan = function( elem ) {
		// innerHTML for chrome and firefox textContent for safari and IE
		var text = elem.innerHTML || elem.textContent, 
			x = elem.attributes.x ? elem.attributes.x.value : 0,
			y = elem.attributes.y ? elem.attributes.y.value : 0,
			dx = elem.attributes.dx ? elem.attributes.dx.value : 0,
			dy = elem.attributes.dy ? elem.attributes.dy.value : 0,
			fontFamily = elem.attributes['font-family'] ? 
						elem.attributes['font-family'].value : 'serif',
			fontWeight = elem.attributes['font-weight'] ? 
						elem.attributes['font-weight'].value : 'normal',
			textAlign = elem.attributes['text-anchor'] ? 
						elem.attributes['text-anchor'].value : 'start',
			fontSize = elem.attributes['font-size'] ? 
						elem.attributes['font-size'].value : '12px';

		x = Number(x) + Number(dx);
		y = Number(y) + Number(dy);
		text = text.trim();
		textAlign = textAlign == 'middle' ? 'center' : textAlign;
		context.font = fontWeight + " " + fontSize + " " + fontFamily;
		context.textAlign = textAlign;
		if ( elem.attributes['transform'] ) {
			this.startTransform( elem.attributes['transform'].value );
		}
		if ( elem.attributes['fill'] && elem.attributes['fill'].value != 'none' ) {
			this.applyFillEffect( elem );
			context.fillText(text, x, y);
			this.endFillEffect( elem );
		}
		if ( elem.attributes['stroke'] && elem.attributes['stroke'].value != 'none' ) {
			this.applyStrokeEffect( elem );
			context.strokeText(text, x, y);
			this.endStrokeEffect( elem );
		}
		if ( elem.attributes['transform'] ) {
			this.resetTransform( );
		}
		
	}

	SvgDeCanvo.prototype.drawcircle = function( elem ) {
		var cx = Number(elem.attributes['cx'].value),
			cy = Number(elem.attributes['cy'].value),
			r = Number(elem.attributes['r'].value);
		
		if ( elem.attributes['transform'] ) {
			this.startTransform( elem.attributes['transform'].value );
		}
		context.beginPath();
		context.arc(cx, cy, r, 0, Math.PI*2);
		if ( elem.attributes['fill'] && elem.attributes['fill'].value != 'none' ) {
			this.applyFillEffect( elem );
			context.fill();
			this.endFillEffect( elem );
		}
		if ( elem.attributes['stroke'] && elem.attributes['stroke'].value != 'none' ) {
			this.applyStrokeEffect( elem );
			context.stroke();
			this.endStrokeEffect( elem );
		}
		if ( elem.attributes['transform'] ) {
			this.resetTransform( );
		}
		context.closePath();
		
	}

	SvgDeCanvo.prototype.drawrect = function( elem ) {
		var x = Number(elem.attributes['x'].value),
			y = Number(elem.attributes['y'].value),
			height = Number(elem.attributes['height'].value),
			width = Number(elem.attributes['width'].value);
		
		if ( elem.attributes['transform'] ) {
			this.startTransform( elem.attributes['transform'].value );
		}
		if ( elem.attributes['fill'] && elem.attributes['fill'].value != 'none' ) {
			this.applyFillEffect( elem );
			context.fillRect(x, y, width, height);
			this.endFillEffect( elem );
		}
		if ( elem.attributes['stroke'] && elem.attributes['stroke'].value != 'none' ) {
			this.applyStrokeEffect( elem );
			context.strokeRect(x, y, width, height);
			this.endStrokeEffect( elem );
		}
		if ( elem.attributes['transform'] ) {
			this.resetTransform( );
		}
		
	}

	/*
	* method for drawing the path attribute of SVG onto the canvas
	* @param {attribute object} elem - the object containing all the attribute required
	* the drawing purpose.
	 */
	SvgDeCanvo.prototype.drawpath = function( elem ) {
		var subPath = elem.attributes['d'].value.match( /[a-z][^a-z"]*/ig ),
			a,
			cmdName,
			cmdDetails,
			cx = 0,
			cy = 0,
			i;

		// control the transformtion of the object
		if ( elem.attributes['transform'] ) {
			this.startTransform( elem.attributes['transform'].value );
		}
		context.beginPath();
		// The switch statement decide which part to draw.
		for (a in subPath ) {
			cmdName = subPath[a].substring(0,1);
			cmdDetails = this.getArgsAsArray(subPath[a].substring(1, (subPath[a].length)));
			switch ( cmdName ) {
				case 'M':
					cx = Number(cmdDetails[0]);
					cy = Number(cmdDetails[1]);
					context.moveTo(cx, cy);
					break;
				case 'm':
					cx += Number(cmdDetails[0]);
					cy += Number(cmdDetails[1]);
					context.moveTo(cx, cy);
					break;
				case 'L':
					for ( i = 0; cmdDetails[i]; i += 2 ) {
						cx = Number(cmdDetails[i]);
						cy = Number(cmdDetails[i+1]);
						context.lineTo(cx, cy);
					}
					break;
				case 'l':
					for ( i = 0; cmdDetails[i]; i += 2 ) {
						cx += Number(cmdDetails[i]);
						cy += Number(cmdDetails[i+1]);
						context.lineTo(cx, cy);
					}
					break;
				case 'V':
					for ( i = 0; cmdDetails[i]; i += 2 ) {
						cy = Number(cmdDetails[i+1]);
						context.moveTo(cx, Number(cmdDetails[i]));
						context.lineTo(cx, cy);
					}
					break;
				case 'v':
					for ( i = 0; cmdDetails[i]; i += 1 ) {
						cy += Number(cmdDetails[i]);
						context.lineTo(cx, cy);
					}
					break;
				case 'Q':
					for ( i = 0; cmdDetails[i]; i += 4 ) {
						context.quadraticCurveTo(Number(cmdDetails[i]),
							Number(cmdDetails[i+1]), cx = Number(cmdDetails[i+2]),
							cy = Number(cmdDetails[i+3]));
					}
					break;
				case 'q':
					for ( i = 0; cmdDetails[i]; i += 4 ) {
						cx += Number(cmdDetails[i+2]);
						cy += Number(cmdDetails[i+3]);
						context.quadraticCurveTo(cmdDetails[i], cmdDetails[i+1],
							cx, cy);
					}
				case 'C':
					for ( i = 0; cmdDetails[i]; i += 6 ) {
						cx = Number(cmdDetails[i+4]);
						cy = Number(cmdDetails[i+5]);
						context.bezierCurveTo(cmdDetails[i], cmdDetails[i+1],
							cmdDetails[i+2], cmdDetails[i+3], cx, cy);
					}
					break;
				case 'c':
					for ( i = 0; cmdDetails[i]; i += 6 ) {

						context.bezierCurveTo(cx + Number(cmdDetails[i]),
							cy + Number(cmdDetails[i+1]), cx + Number(cmdDetails[i+2]),
							cy + Number(cmdDetails[i+3]), cx += Number(cmdDetails[i+4]),
							cy += Number(cmdDetails[i+5]));
					}
					
					break;
				case 'a':
				case 'A':
					for ( i = 0; cmdDetails[i]; i += 7 ) {
						var rx = Number(cmdDetails[i]),
							ry = Number(cmdDetails[i+1]),
							xAngle, 
							aFlag,
							sFlag,
							ex,
							ey,
							x1,
							y1,
							signValue,
							s2sqrt,
							centx1,
							centy1,
							centx,
							centy,
							startAngle,
							dAngle,
							rErrFlag,
							radius,
							xShift,
							yShift;

						// moding the radius value
						rx = rx < 0 ? -rx : rx;
						ry = ry < 0 ? -ry : ry;
						if( rErrFlag > 1 ) {
							rx *= rErrFlag;
							ry *= rErrFlag;
						};
						radius = rx > ry ? rx : ry;
						xShift = rx > ry ? 1 : rx / ry;
						yShift = rx > ry ? ry / rx : 1;

						// Converting to radian
						xAngle = Number(cmdDetails[i+2]) * (Math.PI / 180);
						aFlag = Number(cmdDetails[i+3]);
						sFlag = Number(cmdDetails[i+4]);
						ex = Number(cmdDetails[i+5]);
						ey = Number(cmdDetails[i+6]);
						// http://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
						// Calculation are based on the above link
						// Step 1
						x1 = Math.cos(xAngle) * (cx - ex) / 2 + 
								Math.sin(xAngle) * (cy - ey) / 2;
						y1 = -Math.sin(xAngle) * (cx - ex) / 2 + 
								Math.cos(xAngle) * (cy - ey) / 2;
						// Step 2
						signValue = aFlag == sFlag ? -1 : 1;
						// Take the square root part as an variable
						s2sqrt = signValue * Math.sqrt( ( ( Math.pow( rx, 2 ) * Math.pow( ry, 2) )
							- ( Math.pow( rx, 2 ) * Math.pow( y1, 2 ) ) - ( Math.pow( ry, 2 ) * 
							Math.pow( x1, 2 ) ) ) / ( Math.pow( rx, 2 ) * Math.pow( y1, 2 ) + 
							Math.pow( ry, 2 ) * Math.pow( x1,2 ) ));
						centx1 = s2sqrt * ( rx * y1 ) / ry;
						centy1 = - s2sqrt * ( ry * x1 ) / rx;
						// Step 3
						centx = (centx1 * Math.cos( xAngle ) - centy1 * Math.sin( xAngle )) +
							( cx + ex ) / 2;
						centy = (centx1 * Math.sin( xAngle ) + centy1 * Math.cos( xAngle )) +
							( cy + ey ) / 2;
						// Step 4 computing the Angles
						startAngle = this.angleBetweenVectors( 1, 0, (x1 - centx1)/rx,
							(y1 - centy1)/ry);
						dAngle = this.angleBetweenVectors( (x1 - centx1)/rx, (y1 - centy1)/ry,
							(-x1 - centx1)/rx, (-y1 - centy1)/ry );
						rErrFlag = Math.pow(x1,2)/Math.pow(rx,2)+Math.pow(y1,2)/Math.pow(ry,2);
						

						// Moding the end angle
						if( sFlag == 0 && dAngle > 0 ) {
							dAngle -= 360 * (Math.PI / 180);
						}
						if( sFlag == 1 && dAngle < 0 ) {
							dAngle += 360 * (Math.PI / 180);
						}
						// Check the condition for radius
						if ( rx == 0 && ry == 0 ) {
							context.lineTo(ex, ey);
							break;
						};
						

						context.save();
						context.translate( centx, centy );
						context.rotate( xAngle );
						context.scale(xShift, yShift);
				        context.arc(0, 0, radius, startAngle, startAngle + dAngle, 1 - sFlag);
				        context.restore();

						if ( cmdName == 'A' ) {
							cx = Number(cmdDetails[i+5]);
							cy = Number(cmdDetails[i+6]);
						} else {
							cx += Number(cmdDetails[i+5]);
							cy += Number(cmdDetails[i+6]); 
						}
					}
					break;
				case 'Z':
				case 'z':
					context.closePath();
					break;
				default :
			}
		} 

		if ( elem.attributes['fill'] && elem.attributes['fill'].value != 'none' ) {
			this.applyFillEffect( elem );
			context.fill();
			this.endFillEffect( elem );
		}
		if ( elem.attributes['stroke'] && elem.attributes['stroke'].value != 'none' ) {
			this.applyStrokeEffect( elem );
			context.stroke();
			this.endStrokeEffect( elem );
		}
		if ( elem.attributes['transform'] ) {
			this.resetTransform( );
		}
	}

	/************************** Draw Methods End ****************************/

	/************************** Support Methods start *************************
	* Below are the functions that will be usefull for drawing
	* All reusuable method stays here
	***************************************************************************/

	/*
	* Method to handle the various transformation
	* @param {Context} ctx - the context of the canvas where to apply the transformation
	* @param {data} the data that contain the transformation information-
	* data can be like matrix(1,0,0,1,230,345) rotate(34) seperated by coma.
	* @TODO - support the other transformation methods
	 */
	SvgDeCanvo.prototype.startTransform = function ( data ) {
		var prevArgs = [],
			t = data.match(/[^\s][a-z,0-9.\-(\s]+\)/gi),
			a = 1,
			b = 0,
			c = 0,
			d = 1,
			e = 0,
			f = 0,
			args,
			i;
		// Loop through every transformation
		for ( i in t ) {
			if ( t[i].indexOf("matrix") > -1 ) {
				args = this.stringToArgs(t[i]);
				a = Number(args[0]) == 0 ? Number(args[0]) :
						a * Number(args[0]);
				b += Number(args[1]);
				c += Number(args[2]);
				d *= Number(args[3]) == 0 ? Number(args[3]) :
						a * Number(args[3]);
				e += Number(args[4]);
				f += Number(args[5]);
				
			}
			if ( t[i].indexOf("translate") > -1 ) {
				args = this.stringToArgs(t[i]);
				e += Number(args[0]);
				f += Number(args[1]);
				
			}
		}
		context.setTransform(a, b, c, d, e, f);
		
	}

	/*
	* Method that restore the canvas to its original position
	 */
	SvgDeCanvo.prototype.resetTransform = function ( ) {
		context.setTransform(1, 0, 0, 1, 0, 0);
	}

	/*
	* Method that give argument from a function type definition
	* ex - for string function( abc, def ) this function will return 
	* abc and def in an array.
	* @param {string} data - the striing from which the args to be extracted.
	 */
	SvgDeCanvo.prototype.stringToArgs = function ( data ) {
		var insideBracket = /\(([^\)]+)/.exec(data)[1];
		return this.getArgsAsArray( insideBracket )
	}

	/*
	* Method that return coma or space seperated string as array.
	* @param {atring} data - the string from which the ars should be extracted
	 */
	SvgDeCanvo.prototype.getArgsAsArray = function ( data ) {
		var i;
		data = data.trim().split(/[\s,]+/);

		for ( i = 0; i < data.length; i++ ) {
			data[i].trim();
			if ( data[i].length == 0 ) {
				data.splice( i, 1 );
			}
		}
		return data;
	}

	SvgDeCanvo.prototype.applyFillEffect = function ( elem ) {
		if (elem.attributes['fill-opacity'] && 
				elem.attributes['fill-opacity'].value != 'none') {
			context.globalAlpha = elem.attributes['fill-opacity'].value;
		}

		context.fillStyle = elem.attributes['fill'].value;
	}

	SvgDeCanvo.prototype.endFillEffect = function ( elem ) {
		if (elem.attributes['fill-opacity'] && 
				elem.attributes['fill-opacity'].value != 'none') {
			context.globalAlpha = 1;
		}
	}

	SvgDeCanvo.prototype.applyStrokeEffect = function ( elem ) {
		if (elem.attributes['stroke-opacity'] && 
				elem.attributes['stroke-opacity'].value != 'none') {
			context.globalAlpha = elem.attributes['stroke-opacity'].value;
		}
		if (elem.attributes['stroke-width']) {
			context.lineWidth = elem.attributes['stroke-width'].value;
			if ( elem.attributes['stroke-width'].value == 0 ) {
				context.globalAlpha = 0;
			}
		}
		if (elem.attributes['stroke-dasharray'] && 
				elem.attributes['stroke-dasharray'].value != 'none') {
			context.setLineDash(this.getArgsAsArray(elem.attributes['stroke-dasharray'].value));
		}
		context.strokeStyle = elem.attributes['stroke'].value;
	}

	SvgDeCanvo.prototype.endStrokeEffect = function ( elem ) {
		if (elem.attributes['stroke-opacity'] && 
				elem.attributes['stroke-opacity'].value != 'none') {
			context.globalAlpha = 1;
			context.setLineDash([]);
			context.lineWidth = 1;
		}
	}

	/*
	* Method calculating the angle between two vectors
	* 
	 */
	SvgDeCanvo.prototype.angleBetweenVectors = function ( ux, uy, vx, vy ) {
		var sign = ux*vy < uy*vx ? -1 : 1,
			dotProduct = ux * vx + uy * vy,
			uMagnitude = Math.sqrt( Math.pow(ux, 2) + Math.pow(uy, 2)),
			vMagnitude = Math.sqrt( Math.pow(vx, 2) + Math.pow(vy, 2));
			return sign * Math.acos(dotProduct/(uMagnitude * vMagnitude));
	}

	/************************** Support Methods end *************************/

} () );