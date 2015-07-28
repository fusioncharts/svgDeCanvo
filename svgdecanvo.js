var SvgDeCanvo;

( function () {
	var win = window,
		doc = win.document,
		nodeArr = [],
		drawArr = [],
		defs,
		context,
		svg,
		bBox = [];
	
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
			bBox = [];
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
		this.bBoxFromPoint([cx, cx*1+r*1, cx*1-r*1], [cy, cy*1+r*1, cy*1-r*1])
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
		this.bBoxFromPoint([x, x+width], [y, y+height]);
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
						this.bBoxFromPoint([cx, cmdDetails[i]], [cy, cmdDetails[i+1]]);
						cx = Number(cmdDetails[i]);
						cy = Number(cmdDetails[i+1]);
						context.lineTo(cx, cy);
					}
					break;
				case 'l':
					for ( i = 0; cmdDetails[i]; i += 2 ) {
						this.bBoxFromPoint([cx, cx*1 + 1*cmdDetails[i]], 
							[cy, cy*1 + 1*cmdDetails[i+1]]);
						cx += Number(cmdDetails[i]);
						cy += Number(cmdDetails[i+1]);
						context.lineTo(cx, cy);
					}
					break;
				case 'V':
					for ( i = 0; cmdDetails[i]; i += 2 ) {
						this.bBoxFromPoint([cx], [cy, cmdDetails[i+1]]);
						cy = Number(cmdDetails[i+1]);
						context.moveTo(cx, Number(cmdDetails[i]));
						context.lineTo(cx, cy);
					}
					break;
				case 'v':
					for ( i = 0; cmdDetails[i]; i += 1 ) {
						this.bBoxFromPoint([cx], [cy, cy*1 + 1*cmdDetails[i]]);
						cy += Number(cmdDetails[i]);
						context.lineTo(cx, cy);
					}
					break;
				case 'Q':
					for ( i = 0; cmdDetails[i]; i += 4 ) {
						this.qBezierBBox(cx, cy, cmdDetails[i], cmdDetails[i+1],
							cmdDetails[i+2], cmdDetails[i+3]);
						context.quadraticCurveTo(Number(cmdDetails[i]),
							Number(cmdDetails[i+1]), Number(cmdDetails[i+2]),
							Number(cmdDetails[i+3]));
						cx = Number(cmdDetails[i+2]);
						cy = Number(cmdDetails[i+3]);
					}
					break;
				case 'q':
					for ( i = 0; cmdDetails[i]; i += 4 ) {
						this.qBezierBBox(cx, cy, cx + 1*cmdDetails[i], cy + 1*cmdDetails[i+1],
							cx*1 + 1*cmdDetails[i+2], cy*1 + 1*cmdDetails[i+3]);
						context.quadraticCurveTo(cx + 1*cmdDetails[i], cy + 1*cmdDetails[i+1],
							cx += Number(cmdDetails[i+2]), cy += Number(cmdDetails[i+3]));
					}
				case 'C':
					for ( i = 0; cmdDetails[i]; i += 6 ) {
						this.cBezierBBox(cx, cy, cmdDetails[i], cmdDetails[i+1],
							cmdDetails[i+2], cmdDetails[i+3], cmdDetails[i+4], cmdDetails[i+5]);
						context.bezierCurveTo(cmdDetails[i], cmdDetails[i+1],
							cmdDetails[i+2], cmdDetails[i+3], cmdDetails[i+4], cmdDetails[i+5]);
						cx = Number(cmdDetails[i+4]);
						cy = Number(cmdDetails[i+5]);
					}
					break;
				case 'c':
					for ( i = 0; cmdDetails[i]; i += 6 ) {
						this.cBezierBBox(cx, cy, cx + 1*cmdDetails[i], cy*1 + 1*cmdDetails[i+1],
							cx + 1*cmdDetails[i+2], cy*1 + 1*cmdDetails[i+3], 
							cx + 1*cmdDetails[i+4], cy*1 + 1*cmdDetails[i+5]);
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

						// moding the radius value
						rx = rx < 0 ? -rx : rx;
						ry = ry < 0 ? -ry : ry;
						rErrFlag = Math.pow(x1,2)/Math.pow(rx,2)+Math.pow(y1,2)/Math.pow(ry,2);
						if( rErrFlag > 1 ) {
							rx *= Math.sqrt(rErrFlag);
							ry *= Math.sqrt(rErrFlag);
						};
						radius = rx > ry ? rx : ry;
						xShift = rx > ry ? 1 : rx / ry;
						yShift = rx > ry ? ry / rx : 1;

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
						/*context.translate( centx, centy );
						context.rotate( xAngle );
						context.scale(xShift, yShift);*/
						var transformMatrix = this.combineTransformMatrix(
							[[1,0,centx,0,1,centy],
							[Math.cos(xAngle),Math.sin(xAngle),0,Math.sin(xAngle),
				        		Math.cos(xAngle), 0],
				        	[xShift,0,0,0,yShift,0]])
						context.transform(transformMatrix[0],transformMatrix[3],transformMatrix[1],
							transformMatrix[4],transformMatrix[2],transformMatrix[5]);
				        context.arc(0, 0, radius, startAngle, startAngle + dAngle, 1 - sFlag);
				        context.restore();
				        this.arcBBox(0, 0, radius, startAngle, startAngle + dAngle, 1 - sFlag,
				        	[transformMatrix[0],transformMatrix[3],transformMatrix[1],
							transformMatrix[4],transformMatrix[2],transformMatrix[5]]);
						//this.bBoxFromPoint([cx, ex], [cy, ey]);

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
		var fillValue;
		if (elem.attributes['fill-opacity'] && 
				elem.attributes['fill-opacity'].value != 'none') {
			context.globalAlpha = elem.attributes['fill-opacity'].value;
		}

		if (elem.attributes['fill'].value.indexOf("url(") > -1) {
			fillValue = this.getFillStyleById(/url\(['"]*#([^\)'"]+)/
					.exec(elem.attributes['fill'].value)[1]);
			context.fillStyle = fillValue;
		} else {
			context.fillStyle = elem.attributes['fill'].value;
		}
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
				elem.attributes['stroke-dasharray'].value != 'none' &&
				context.setLineDash ) {
			context.setLineDash(this.getArgsAsArray(elem.attributes['stroke-dasharray'].value));
		}
		context.strokeStyle = elem.attributes['stroke'].value;
	}

	SvgDeCanvo.prototype.endStrokeEffect = function ( elem ) {
		if (elem.attributes['stroke-opacity'] && 
				elem.attributes['stroke-opacity'].value != 'none') {
			context.globalAlpha = 1;
			if (context.setLineDash) {
				context.setLineDash([]);
			}
			context.lineWidth = 1;
		}
	}

	SvgDeCanvo.prototype.getFillStyleById = function ( id ) {
		var gradElem = defs.getElementById(id);
		/*context.strokeRect(bBox['xMin'], bBox['yMin'], bBox['xMax'] - bBox['xMin'],
			bBox['yMax'] - bBox['yMin']);*/
		if (gradElem.tagName == 'linearGradient') {
			return this.getLinearGradient( gradElem );
		}
		if (gradElem.tagName == 'radialGradient') {
			return this.getRadialGradient( gradElem );
		}
		return '#FFFFFF';
	}

	SvgDeCanvo.prototype.getLinearGradient = function ( element ) {
		var sx = element.attributes['x1'] ? this.getPercentValue(
			element.attributes['x1'].value, bBox['xMax'] - bBox['xMin'], bBox['xMin']) : 0,
			sy = element.attributes['y1'] ? this.getPercentValue(
			element.attributes['y1'].value, bBox['yMax'] - bBox['yMin'], bBox['yMin']) : 0,
			ex = element.attributes['x2'] ? this.getPercentValue(
			element.attributes['x2'].value, bBox['xMax'] - bBox['xMin'], bBox['xMin']) : 0,
			ey = element.attributes['y2'] ? this.getPercentValue(
			element.attributes['y2'].value, bBox['yMax'] - bBox['yMin'], bBox['yMin']) : 0,
			lingrad, children, a, color, opacity;

		linGrad = context.createLinearGradient(sx, sy, ex, ey);
		children = element.childNodes;
		for (a in children) {
			if (children[a].attributes && children[a].attributes['stop-color']) {
				color = this.toRGB(children[a].attributes['stop-color'].value);
				opacity = children[a].attributes['stop-opacity'] ? 
					children[a].attributes['stop-opacity'].value : 1;
				if (color.status) {
					linGrad.addColorStop(this.getPercentValue(children[a].attributes['offset'].value, 1, 0),
				 		'rgba('+color.r+','+color.g+','+color.b+','+opacity+')');
				} else {
					linGrad.addColorStop(this.getPercentValue(children[a].attributes['offset'].value, 1, 0),
				 		children[a].attributes['stop-color'].value);
				}
				
			}
		}
		return linGrad;
	}

	SvgDeCanvo.prototype.getRadialGradient = function ( element ) {
		var cx = element.attributes['cx'] ? this.getPercentValue(
			element.attributes['cx'].value, bBox['xMax'] - bBox['xMin'], bBox['xMin']) : 
			(bBox['xMax'] - bBox['xMin'])*0.5,
			cy = element.attributes['cy'] ? this.getPercentValue(
			element.attributes['cy'].value, bBox['yMax'] - bBox['yMin'], bBox['yMin']) : 
			(bBox['yMax'] - bBox['yMin'])*0.5,
			fx = element.attributes['fx'] ? this.getPercentValue(
			element.attributes['fx'].value, bBox['xMax'] - bBox['xMin'], bBox['xMin']) :
			(bBox['xMax'] - bBox['xMin'])*0.5,
			fy = element.attributes['fy'] ? this.getPercentValue(
			element.attributes['fy'].value, bBox['yMax'] - bBox['yMin'], bBox['yMin']) :
			(bBox['yMax'] - bBox['yMin'])*0.5,
			r = element.attributes['r'] ? this.getPercentValue(
			element.attributes['r'].value, (bBox['yMax'] - bBox['yMin'] + 
				bBox['xMax'] - bBox['xMin'])/2, 0) : this.getPercentValue(
			'50%', (bBox['yMax'] - bBox['yMin'] + 
				bBox['xMax'] - bBox['xMin'])/2, 0),
			radGrad, children, a, color, opacity;

		radGrad = context.createRadialGradient(fx, fy, 0, cx, cy, r);
		children = element.childNodes;
		for (a in children) {
			if (children[a].attributes && children[a].attributes['stop-color']) {
				color = this.toRGB(children[a].attributes['stop-color'].value);
				opacity = children[a].attributes['stop-opacity'] ? 
					children[a].attributes['stop-opacity'].value : 1;
				if (color.status) {
					radGrad.addColorStop(this.getPercentValue(children[a].attributes['offset'].value, 1, 0),
				 		'rgba('+color.r+','+color.g+','+color.b+','+opacity+')');
				} else {
					radGrad.addColorStop(this.getPercentValue(children[a].attributes['offset'].value, 1, 0),
				 		children[a].attributes['stop-color'].value);
				}
				
			}
		}
		return radGrad;
	}

	SvgDeCanvo.prototype.getPercentValue = function ( percent, value, correction) {
		var mVal;
		if (percent.indexOf('%') != -1) {
			mVal = /(\d+)%/.exec(percent)[1];
			if (mVal > 100){
				mVal = 100;
			}
			return (mVal*value)/100 + correction*1;
		} else {
			if(percent > 1) {
				return percent;
			}
			return percent*value + correction*1;
		}
	}

	SvgDeCanvo.prototype.bBoxFromPoint = function ( xPointArr, yPointArr ) {
		if (bBox['xMin']) {
			xPointArr.push(bBox['xMin'], bBox['xMax']);
			yPointArr.push(bBox['yMin'], bBox['yMax']);
		}
		bBox['xMin'] = Math.min.apply(this, xPointArr);
		bBox['xMax'] = Math.max.apply(this, xPointArr);
		bBox['yMin'] = Math.min.apply(this, yPointArr);
		bBox['yMax'] = Math.max.apply(this, yPointArr);
	}
	/*
	* Method to compute the bounding box but its not working as expected
	 */
	SvgDeCanvo.prototype.arcBBox = function ( cx, cy, r, sa, ea, cc, transform) {
		var rsa,rea,
        	startArcX, endArcX, startArcY, endArcY,
        	xMin, yMin, xMax, yMax, xArr, yArr, isBetween;

        if (transform instanceof Array) {
        	cx = cx * transform[0] + cy * transform[2] + transform[4];
        	cy = cx * transform[1] + cy * transform[3] + transform[5];
        }
        isBetween = function( start, end, angle ) {
        	// making the start angle and end angle negative
        	start = (start + 2 * Math.PI) % (2 * Math.PI);
            end = (end + 2 * Math.PI) % (2 * Math.PI);
			if (start <= end) {
                if (start <= angle && angle <= end) {
                  	return true;
                }
                else {
                  	return false;
                }
            }
            else if (start >= end){
                if (start >= angle && angle >= end){
                  return false;
                }
                else {
                  return true;
                }
            }
		}
        rsa = sa % (2 * Math.PI);
        rea = ea % (2 * Math.PI);
        if (cc){
          rsa = ea % (2 * Math.PI);
          rea = sa % (2 * Math.PI);
        }
        startArcX = cx + r * Math.cos(rsa);
        startArcY = cy + r * Math.sin(rsa);
        endArcX = cx + r * Math.cos(rea);
        endArcY = cy + r * Math.sin(rea);

        xArr = [cx, startArcX, endArcX];
        yArr = [cy, startArcY, endArcY];

        if (isBetween(rsa, rea, 0)){
			xArr.push(cx*1 + r*1);
			yArr.push(cy);
		}
		if (isBetween(rsa, rea, 0.5 * Math.PI)){
			xArr.push(cx);
			yArr.push(cy*1 + r*1);
		}
		if (isBetween(rsa, rea, Math.PI)){
			xArr.push(cx - r*1);
			yArr.push(cy);
		}
		if (isBetween(rsa, rea, 1.5 * Math.PI)){
			xArr.push(cx);
			yArr.push(cy - r*1);
		}
        xMax = Math.max.apply(this, xArr);
		xMin = Math.min.apply(this, xArr);
		yMax = Math.max.apply(this, yArr);
		yMin = Math.min.apply(this, yArr);

		if (bBox['xMin']) {
			bBox['xMin'] = Math.min(xMin, bBox['xMin']);
			bBox['xMax'] = Math.max(xMax, bBox['xMax']);
			bBox['yMin'] = Math.min(yMin, bBox['yMin']);
			bBox['yMax'] = Math.max(yMax, bBox['yMax']);
		} else {
			bBox['xMin'] = xMin;
			bBox['xMax'] = xMax;
			bBox['yMin'] = yMin;
			bBox['yMax'] = yMax;
		}

		
		
	}

	/*
	* Method for calculating the bounding box for quadratic bezier curves
	* @param {co-ordinate point} sx - starting x coordinate
	* @param {co-ordinate point} sy - starting y coordinate
	* @param {co-ordinate point} cx - first control x
	* @param {co-ordinate point} cy - first control y
	* @param {co-ordinate point} ex - end x coordinate
	* @param {co-ordinate point} ey - end y coordinate
	 */
	SvgDeCanvo.prototype.qBezierBBox = function ( sx, sy, cx, cy, ex, ey) {
		var txd = sx*1.0 - 2*cx + ex*1.0,
			tyd = sy*1.0 - 2*cy + ey*1.0,
			tx, ty, xMin, yMin, xMax, yMax, curveX, curveY;

		/*context.beginPath();
		context.moveTo(sx,sy)
		for (t = 0 ; t <= 10; t++) {
			context.lineTo(sx * Math.pow(1 - (t/10), 2) + 2 * cx * (1 - (t/10)) * (t/10) + ex * Math.pow((t/10), 2),
				sy * Math.pow(1 - (t/10), 2) + 2 * cy * (1 - (t/10)) * (t/10) + ey * Math.pow((t/10), 2))
		}
		context.stroke();*/

		if (txd == 0 || tyd == 0) {
			xMax = Math.max(sx,ex);
			xMin = Math.min(sx,ex);
			yMax = Math.max(sy,ey);
			yMin = Math.min(sy,ex);
		} else {
			tx = (sx - cx) / txd;
			ty = (sy - cy) / tyd;
			curveX = sx * Math.pow(1 - tx, 2) + 2 * cx * (1 - tx) * tx + ex * Math.pow(tx, 2);
			curveY = sy * Math.pow(1 - ty, 2) + 2 * cy * (1 - ty) * ty + ey * Math.pow(ty, 2);

			xMax = Math.max(sx,ex,curveX);
			xMin = Math.min(sx,ex,curveX);
			yMax = Math.max(sy,ey,curveY);
			yMin = Math.min(sy,ex,curveY);
		}
		
		if (bBox['xMin']) {
			bBox['xMin'] = Math.min(xMin, bBox['xMin']);
			bBox['xMax'] = Math.min(xMax, bBox['xMax']);
			bBox['yMin'] = Math.min(yMin, bBox['yMin']);
			bBox['yMax'] = Math.min(yMax, bBox['yMax']);
		} else {
			bBox['xMin'] = xMin;
			bBox['xMax'] = xMax;
			bBox['yMin'] = yMin;
			bBox['yMax'] = yMax;
		}

	}

	/*
	* Method for calculating the bounding box for cubic bezier curves
	* @param {co-ordinate point} sx - starting x coordinate
	* @param {co-ordinate point} sy - starting y coordinate
	* @param {co-ordinate point} cx - first control x
	* @param {co-ordinate point} cy - first control y
	* @param {co-ordinate point} c1x - second control x
	* @param {co-ordinate point} c1y - second control y
	* @param {co-ordinate point} ex - end x coordinate
	* @param {co-ordinate point} ey - end y coordinate
	 */
	SvgDeCanvo.prototype.cBezierBBox = function ( sx, sy, cx, cy, c1x, c1y, ex, ey) {
		var xMin, xMax, yMin, yMax, a, b, c, root, t1, t2, calculateBound,
		xTemp, yTemp;
		// Converting the quadratic curve points to cubic curve points
		if ( c1x == null && c1y == null) {
			cx = sx + ( 2.0/3.0 * ( cx - sx ) );
			c1x = sy + ( 2.0/3.0 * ( cy - sy ) ); 
			cy = cx + ( 1.0/3.0 * ( ex - sx ) );
			c1y = c1x + ( 1.0/3.0 * ( ey - sy ) );
			
		}
		// http://pomax.nihongoresources.com/pages/bezier/
		// details formula
		calculateBound = function(a, b, c, d, t) {
			return a * Math.pow((1 - t), 3) + 3 * b * t * Math.pow((1 - t), 2) +
					3 * c * t * t * (1 - t) + d * t * t * t;
		}
		// For x coordinates
		a = 3 * ex - 9 * c1x + 9 * cx - 3 * sx;
    	b = 6 * sx - 12 * cx + 6 * c1x;
    	c = 3 * cx - 3 * sx;
    	root = Math.pow(b, 2) - 4 * a * c;
    	xMin = sx;
	    xMax = sx;
	    if (ex < xMin) {
	    	xMin = ex;
	    }
	    if (ex > xMax) {
	    	xMax = ex;
	    }
	    if (root >= 0) {
	        t1 = (-b + Math.sqrt(root)) / (2 * a);
	        if (t1 > 0 && t1 < 1) {
	            xTemp = calculateBound(sx, cx, c1x, ex, t1);
	            if (xTemp < xMin) {
	            	xMin = xTemp;
	            }
	            if (xTemp > xMax) {
	            	xMax = xTemp;
	            }
	        }

	        t2 = (-b - Math.sqrt(root)) / (2 * a);
	        if (t2 > 0 && t2 < 1) {
	            xTemp = calculateBound(sx, cx, c1x, ex, t2);
	            if (xTemp < xMin) xMin = xTemp;
	            if (xTemp > xMax) xMax = xTemp;
	        }
	    }

	    a = 3 * ey - 9 * c1y + 9 * cy - 3 * sy;
	    b = 6 * sy - 12 * cy + 6 * c1y;
	    c = 3 * cy - 3 * sy;
	    root = Math.pow(b, 2) - 4 * a * c;
	    var yMin = sy;
	    var yMax = sy;
	    if (ey < yMin) yMin = ey;
	    if (ey > yMax) yMax = ey;
	    if (root >= 0) {
	        t1 = (-b + Math.sqrt(root)) / (2 * a);
	        if (t1 > 0 && t1 < 1) {
	            yTemp = calculateBound(sy, cy, c1y, ey, t1);
	            if (yTemp < yMin) {
	            	yMin = yTemp;
	            }
	            if (yTemp > yMax) {
	            	yMax = yTemp;
	            }
	        }
	        t2 = (-b - Math.sqrt(root)) / (2 * a);
	        if (t2 > 0 && t2 < 1) {
	            yTemp = calculateBound(sy, cy, c1y, ey, t2);
	            if (yTemp < yMin) {
	            	yMin = yTemp;
	            }
	            if (yTemp > yMax) {
	            	yMax = yTemp;
	            }
	        }
	    }
	    if (bBox['xMin']) {
			bBox['xMin'] = Math.min(xMin, bBox['xMin']);
			bBox['xMax'] = Math.min(xMax, bBox['xMax']);
			bBox['yMin'] = Math.min(yMin, bBox['yMin']);
			bBox['yMax'] = Math.min(yMax, bBox['yMax']);
		} else {
			bBox['xMin'] = xMin;
			bBox['xMax'] = xMax;
			bBox['yMin'] = yMin;
			bBox['yMax'] = yMax;
		}

	}

	SvgDeCanvo.prototype.combineTransformMatrix = function ( matrices ) {
		var mlast = matrices.length - 1,
		resMatrix;
		if (mlast <= 0) {
			return matrices[0];
		}
		resMatrix = matrices[0];
		for (i = 1; i <= mlast; i++) {
			resMatrix[0] = resMatrix[0]*matrices[i][0] + resMatrix[1]*matrices[i][3];
			resMatrix[1] = resMatrix[0]*matrices[i][1] + resMatrix[1]*matrices[i][4];
			resMatrix[2] = resMatrix[0]*matrices[i][2] + resMatrix[1]*matrices[i][5] + 
				resMatrix[2]*1;
			resMatrix[3] = resMatrix[3]*matrices[i][0] + resMatrix[4]*matrices[i][3];
			resMatrix[4] = resMatrix[3]*matrices[i][1] + resMatrix[4]*matrices[i][4];
			resMatrix[5] = resMatrix[3]*matrices[i][2] + resMatrix[4]*matrices[i][5] +
				resMatrix[5]*1;
		}
		return resMatrix;
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

	SvgDeCanvo.prototype.toRGB = function ( color ) {
		var rgb = {r:0,g:0,b:0,status:0},
			tmpVar, prepareRGB, a;
		prepareRGB = function ( arr ) {
			for (a in arr) {
				if (arr[a] < 0 || isNaN(arr[a])) {
					arr[a] = 0; 
				} else if (arr[a] > 255) {
					arr[a] = 255;
				}
			}
			rgb = {r:arr[0], g:arr[1], b:arr[2], status:1};
			return rgb;
		}
		color = color.trim();
		if (color.match(/^rgb\(|^rgba\(/i)) {
			tmpVar = /\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})/.exec(color);
			prepareRGB([parseInt(tmpVar[1]),
						parseInt(tmpVar[2]),
						parseInt(tmpVar[3])]);
		} else if(color.match(/^#/)) {
			tmpVar = /(\w{2})(\w{2})(\w{2})/.exec(color);
			prepareRGB([parseInt(tmpVar[1], 16),
						parseInt(tmpVar[2], 16),
						parseInt(tmpVar[3], 16)]);
		}
		return rgb;
	}

	/************************** Support Methods end *************************/

} () );