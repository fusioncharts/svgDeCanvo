/**
 * SvgDeCanvo 1.0.2 - JavaScript Vector Library
 * Copyright (c) 2015-2018 FusionCharts, Inc. <http://www.fusioncharts.com>
 * Licensed under the MIT license.
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.SvgDeCanvo=e()}(this,function(){"use strict";var t,e="undefined"!=typeof window?window:null,a=e.document,r={},i={};return(t=function(e,a,r,i,o,s,n){var u={svg:"",context:"",callBack:"",imageArr:[],canvas:"",dimention:{}};if(!(this instanceof t))throw new Error("This function should be used as class");this._getStore=function(t){return void 0!==u[t]&&u[t]},this._setStore=function(t,e){void 0!==u[t]&&(u[t]=e)},this._setStore("dimention",{x:r,y:i,width:o,height:s}),e&&this.setSVG(e),a&&this.setContext(a),n&&this.setCallback(n),this.drawOnCanvas()}).prototype.setContext=function(t){var e;if(!t.getContext||!t.getContext("2d"))throw new Error("Please provide valid canvas");e=t.getContext("2d"),this._setStore("canvas",t),this._setStore("context",e)},t.prototype.getContext=function(){return this._getStore("context")},t.prototype.setSVG=function(t){var e;if(void 0!==t.documentElement)e=t,this._setStore("svg",e);else{if("<"!==t.substr(0,1))throw new Error("Please provide valid SVG");e=i.StrToDom(t),this._setStore("svg",e)}},t.prototype.getSVG=function(){return this._getStore("svg")},t.prototype.setCallback=function(t){"function"==typeof t&&this._setStore("callBack",t)},t.prototype.getCallback=function(){return this._getStore("callBack")},t.prototype.drawOnCanvas=function(t,e,a,r,o,s,n){var u,l,b,c,f,h,p,m;t&&this.setSVG(t),e&&this.setContext(e),n&&this.setCallback(n),e=e||this._getStore("canvas"),p=this._getStore("dimention"),n=this.getCallback(),u=this.getContext(),(l=this.getSVG())&&u&&(b=(m=i.getSvgDimention(l)).width,c=m.height,a=a||p.x||0,r=r||p.y||0,o=o||b||p.width,s=s||c||p.height,f=m.width?p.width/o:1,h=m.height?p.height/s:1,i.startTransform("translate("+a+","+r+") scale("+f+","+h+")",u),u.save(),u.fillStyle="#ffffff",u.fillRect(0,0,o,s),u.restore(),i.storeImagesInArr(this),i.drawNodes([l],[],this,u,function(){"function"==typeof n&&n(),i.resetTransform(u)}))},r.common=function(t,e,a,o,s){var n,u,l,b,c=t.childNodes,f=function(){t.attributes&&o.restore(),s&&s()};for(u in e)e.hasOwnProperty(u)&&"class"!==e[u].name&&"id"!==e[u].name&&"transform"!==e[u].name&&"clip-path"!==e[u].name&&"object"==typeof e[u]&&t.attributes&&!t.attributes[e[u].name]&&t.setAttribute([e[u].name],e[u].value);if(t.attributes&&t.attributes.style)for(u in l=t.attributes.style.value.replace(/;$/,"").split(";"))if(l.hasOwnProperty(u)&&(b=l[u].split(":")[0].trim(),!t.attributes[b]||"undefined"===t.attributes[b].value))try{t.setAttribute(b,l[u].split(":")[1].trim())}catch(t){}t.attributes&&(o.save(),t.attributes.transform&&i.startTransform(t.attributes.transform.value,o),t.attributes["clip-path"]&&i.applyClip(t.attributes["clip-path"].value,o,a)),0===c.length||1===c.length&&!c[0].tagName?void 0!==t.tagName?(n="draw"+t.tagName,r[n]?t.attributes.display&&"none"===t.attributes.display.value?f():r[n](t,o,a,"draw",f):f()):f():i.drawNodes(c,"svg"===t.tagName?[]:t.attributes,a,o,f)},r.drawtext=function(t,e,a,r,i){this.drawtspan(t,e,a,r,i)},r.drawtspan=function(t,r,o,s,n){var u,l,b,c,f,h=t.innerHTML||t.textContent,p=t.attributes.x?t.attributes.x.value:0,m=t.attributes.y?t.attributes.y.value:0,M=t.attributes.dx?t.attributes.dx.value:0,x=t.attributes.dy?t.attributes.dy.value:0,y="serief",v="normal",d="16px",g=[];a.getElementsByTagName("body")[0]&&((u=e.getComputedStyle(a.getElementsByTagName("body")[0],null)).getPropertyValue("font-family")&&(y=u.getPropertyValue("font-family")),u.getPropertyValue("font-weight")&&(v=u.getPropertyValue("font-weight")),u.getPropertyValue("font-size")&&(d=u.getPropertyValue("font-size"))),l=t.attributes["font-family"]?t.attributes["font-family"].value:y,b=t.attributes["font-weight"]?t.attributes["font-weight"].value:v,c=t.attributes["text-anchor"]?t.attributes["text-anchor"].value:"start",f=t.attributes["font-size"]?t.attributes["font-size"].value:d,p=Number(p)+Number(M),m=Number(m)+Number(x),h=h.trim(),c="middle"===c?"center":c,r.save(),r.font=b+" "+f+" "+l,r.textAlign=c,"draw"===s&&((!t.attributes.fill||t.attributes.fill&&"none"!==t.attributes.fill.value)&&(i.applyFillEffect(t,r,o,g),r.fillText(h,p,m),i.endFillEffect(t,r)),(!t.attributes.stroke||t.attributes.stroke&&"none"!==t.attributes.stroke.value)&&(i.applyStrokeEffect(t,r,o,g),r.strokeText(h,p,m),i.endStrokeEffect(t,r))),r.restore(),"function"==typeof n&&n()},r.drawcircle=function(t,e,a,r,o){var s=Number(t.attributes.cx.value),n=Number(t.attributes.cy.value),u=Number(t.attributes.r.value),l=[];e.beginPath(),e.arc(s,n,u,0,2*Math.PI),i.bBoxFromPoint([s,1*s+1*u,1*s-1*u],[n,1*n+1*u,1*n-1*u],l),"draw"===r&&((!t.attributes.fill||t.attributes.fill&&"none"!==t.attributes.fill.value)&&(i.applyFillEffect(t,e,a,l),e.fill(),i.endFillEffect(t,e)),(!t.attributes.stroke||t.attributes.stroke&&"none"!==t.attributes.stroke.value)&&(i.applyStrokeEffect(t,e,a,l),e.stroke(),i.endStrokeEffect(t,e))),e.closePath(),"function"==typeof o&&o()},r.drawrect=function(t,e,a,r,o){var s=Number(t.attributes.x&&t.attributes.x.value||0),n=Number(t.attributes.y&&t.attributes.y.value||0),u=t.attributes.rx?Number(t.attributes.rx.value):0,l=t.attributes.ry?Number(t.attributes.ry.value):0,b=Number(t.attributes.height.value),c=Number(t.attributes.width.value),f=[],h=e.lineCap;e.lineCap="square",i.bBoxFromPoint([s,s+c],[n,n+b],f),e.beginPath(),e.moveTo(s+u,n),e.lineTo(s+c-u,n),e.quadraticCurveTo(s+c,n,s+c,n+l),e.lineTo(s+c,n+b-l),e.quadraticCurveTo(s+c,n+b,s+c-u,n+b),e.lineTo(s+u,n+b),e.quadraticCurveTo(s,n+b,s,n+b-l),e.lineTo(s,n+l),e.quadraticCurveTo(s,n,s+u,n),"draw"===r&&((!t.attributes.fill||t.attributes.fill&&"none"!==t.attributes.fill.value)&&(i.applyFillEffect(t,e,a,f),e.fill(),i.endFillEffect(t,e)),(!t.attributes.stroke||t.attributes.stroke&&"none"!==t.attributes.stroke.value)&&(i.applyStrokeEffect(t,e,a,f),e.stroke(),i.endStrokeEffect(t,e))),e.closePath(),e.lineCap=h,"function"==typeof o&&o()},r.drawellipse=function(t,e,a,r,o){var s=Number(t.attributes.cx.value),n=Number(t.attributes.cy.value),u=Number(t.attributes.rx.value),l=Number(t.attributes.ry.value),b=.5522848*u,c=.5522848*l,f=s+u,h=n+l,p=[];e.beginPath(),e.moveTo(s-u,n),e.bezierCurveTo(s-u,n-c,s-b,n-l,s,n-l),e.bezierCurveTo(s+b,n-l,f,n-c,f,n),e.bezierCurveTo(f,n+c,s+b,h,s,h),e.bezierCurveTo(s-b,h,s-u,n+c,s-u,n),i.bBoxFromPoint([s+u,s-u],[n+l,n-l],p),"draw"===r&&((!t.attributes.fill||t.attributes.fill&&"none"!==t.attributes.fill.value)&&(i.applyFillEffect(t,e,a,p),e.fill(),i.endFillEffect(t,e)),(!t.attributes.stroke||t.attributes.stroke&&"none"!==t.attributes.stroke.value)&&(i.applyStrokeEffect(t,e,a,p),e.stroke(),i.endStrokeEffect(t,e))),e.closePath(),"function"==typeof o&&o()},r.drawimage=function(t,e,a,r,i){var o,s=t.attributes.x?Number(t.attributes.x.value):0,n=t.attributes.y?Number(t.attributes.y.value):0,u=t.attributes.height?Number(t.attributes.height.value):0,l=t.attributes.width?Number(t.attributes.width.value):0,b=a._getStore("imageArr");e.save(),t.attributes.opacity&&(e.globalAlpha=t.attributes.opacity.value),t.attributes["xlink:href"]?(o=t.attributes["xlink:href"].value,"complete"===b[o].status?(e.drawImage(b[o].obj,s,n,l,u),e.globalAlpha=1,e.restore(),"function"==typeof i&&i()):"error"===b[o].status?(e.globalAlpha=1,e.restore(),"function"==typeof i&&i()):"progress"===b[o].status?(b[o].callback=function(){e.drawImage(b[o].obj,s,n,l,u),e.globalAlpha=1,e.restore(),"function"==typeof i&&i()},b[o].errCallback=function(){e.globalAlpha=1,e.restore(),"function"==typeof i&&i()}):(e.globalAlpha=1,e.restore(),"function"==typeof i&&i())):(e.globalAlpha=1,e.restore(),"function"==typeof i&&i())},r.drawpath=function(t,e,a,r,o){var s,n,u,l,b=t.attributes.d.value.match(/[a-z][^a-z"]*/gi),c=[],f=0,h=0,p={};for(s in e.beginPath(),b)if(b.hasOwnProperty(s))switch(n=b[s].substring(0,1),u=i.getArgsAsArray(b[s].substring(1,b[s].length)),n){case"M":f=Number(u[0]),h=Number(u[1]),e.moveTo(f,h),p.cx=f,p.cy=h;break;case"m":f+=Number(u[0]),h+=Number(u[1]),e.moveTo(f,h),p.cx=f,p.cy=h;break;case"L":for(l=0;u[l];l+=2)i.bBoxFromPoint([f,u[l]],[h,u[l+1]],c),f=Number(u[l]),h=Number(u[l+1]),e.lineTo(f,h);break;case"l":for(l=0;u[l];l+=2)i.bBoxFromPoint([f,1*f+1*u[l]],[h,1*h+1*u[l+1]],c),f+=Number(u[l]),h+=Number(u[l+1]),e.lineTo(f,h);break;case"V":for(l=0;u[l];l+=1)i.bBoxFromPoint([f],[h,u[l]],c),h=Number(u[l]),e.lineTo(f,h);break;case"v":for(l=0;u[l];l+=1)i.bBoxFromPoint([f],[h,1*h+1*u[l]],c),h+=Number(u[l]),e.lineTo(f,h);break;case"H":for(l=0;u[l];l+=1)i.bBoxFromPoint([f,u[l]],[h],c),f=Number(u[l]),e.lineTo(f,h);break;case"h":for(l=0;u[l];l+=1)i.bBoxFromPoint([f,1*f+1*u[l]],[h],c),f+=Number(u[l]),e.lineTo(f,h);break;case"Q":for(l=0;u[l];l+=4)i.qBezierBBox(f,h,u[l],u[l+1],u[l+2],u[l+3],c),e.quadraticCurveTo(Number(u[l]),Number(u[l+1]),Number(u[l+2]),Number(u[l+3])),f=Number(u[l+2]),h=Number(u[l+3]);break;case"q":for(l=0;u[l];l+=4)i.qBezierBBox(f,h,f+1*u[l],h+1*u[l+1],1*f+1*u[l+2],1*h+1*u[l+3],c),e.quadraticCurveTo(f+1*u[l],h+1*u[l+1],f+=Number(u[l+2]),h+=Number(u[l+3]));break;case"C":for(l=0;u[l];l+=6)i.cBezierBBox(f,h,u[l],u[l+1],u[l+2],u[l+3],u[l+4],u[l+5],c),e.bezierCurveTo(u[l],u[l+1],u[l+2],u[l+3],u[l+4],u[l+5]),f=Number(u[l+4]),h=Number(u[l+5]);break;case"c":for(l=0;u[l];l+=6)i.cBezierBBox(f,h,f+1*u[l],1*h+1*u[l+1],f+1*u[l+2],1*h+1*u[l+3],f+1*u[l+4],1*h+1*u[l+5],c),e.bezierCurveTo(f+Number(u[l]),h+Number(u[l+1]),f+Number(u[l+2]),h+Number(u[l+3]),f+=Number(u[l+4]),h+=Number(u[l+5]));break;case"a":case"A":for(l=0;u[l];l+=7){var m,M,x,y,v,d,g,w,N,k,P,S,T,B,A,C,I,V,E=Number(u[l]),F=Number(u[l+1]);if(m=Number(u[l+2])*(Math.PI/180),M=Number(u[l+3]),x=Number(u[l+4]),y=Number(u[l+5]),v=Number(u[l+6]),d=Math.cos(m)*(f-y)/2+Math.sin(m)*(h-v)/2,g=-Math.sin(m)*(f-y)/2+Math.cos(m)*(h-v)/2,E=E<0?-E:E,F=F<0?-F:F,(A=Math.pow(d,2)/Math.pow(E,2)+Math.pow(g,2)/Math.pow(F,2))>1&&(E*=Math.sqrt(A),F*=Math.sqrt(A)),C=E>F?E:F,I=E>F?1:E/F,V=E>F?F/E:1,w=(M===x?-1:1)*Math.sqrt((Math.pow(E,2)*Math.pow(F,2)-Math.pow(E,2)*Math.pow(g,2)-Math.pow(F,2)*Math.pow(d,2))/(Math.pow(E,2)*Math.pow(g,2)+Math.pow(F,2)*Math.pow(d,2))),isNaN(w)&&(w=0),k=F*d*-w/E,P=(N=w*(E*g)/F)*Math.cos(m)-k*Math.sin(m)+(f+y)/2,S=N*Math.sin(m)+k*Math.cos(m)+(h+v)/2,T=i.angleBetweenVectors(1,0,(d-N)/E,(g-k)/F),B=i.angleBetweenVectors((d-N)/E,(g-k)/F,(-d-N)/E,(-g-k)/F),0===x&&B>0&&(B-=Math.PI/180*360),1===x&&B<0&&(B+=Math.PI/180*360),0===E&&0===F){e.lineTo(y,v);break}e.save();var O=i.combineTransformMatrix([[1,0,P,0,1,S],[Math.cos(m),Math.sin(m),0,Math.sin(m),Math.cos(m),0],[I,0,0,0,V,0]]);e.transform(O[0],O[3],O[1],O[4],O[2],O[5]),e.arc(0,0,C,T,T+B,1-x),e.restore(),i.arcBBox(0,0,C,T,T+B,1-x,[O[0],O[3],O[1],O[4],O[2],O[5]],c),"A"===n?(f=Number(u[l+5]),h=Number(u[l+6])):(f+=Number(u[l+5]),h+=Number(u[l+6]))}break;case"Z":case"z":e.closePath(),f=p.cx,h=p.cy}"draw"===r&&((!t.attributes.fill||t.attributes.fill&&"none"!==t.attributes.fill.value)&&(i.applyFillEffect(t,e,a,c),e.fill(),i.endFillEffect(t,e)),(!t.attributes.stroke||t.attributes.stroke&&"none"!==t.attributes.stroke.value)&&(i.applyStrokeEffect(t,e,a,c),e.stroke(),i.endStrokeEffect(t,e)),o())},i.drawNodes=function(t,e,a,i,o){var s=t.length,n=-1,u=0,l=0,b=function(){var c;(n+=1)<s?((c=t[n]).tagName&&"defs"===c.tagName&&(c=t[n+=1]),c.attributes&&(c.attributes.dy&&(l=c.attributes.dy.value=1*c.attributes.dy.value+1*l),c.attributes.dx&&(u=c.attributes.dx.value=1*c.attributes.dx.value+1*u)),r.common(c,e,a,i,b)):o&&o()};b()},i.getSvgDimention=function(t){var e,a={width:0,height:0};return e=t.childNodes&&t.childNodes[0]&&t.childNodes[0].attributes,a.width=Number(e.width&&e.width.value||0),a.height=Number(e.height&&e.height.value||0),a},i.storeImagesInArr=function(t){var e,a,r,i,o=t.getSVG();for(i in r=t._getStore("imageArr"),e=o.getElementsByTagName("image"))e.hasOwnProperty(i)&&e[i].attributes&&e[i].attributes["xlink:href"]&&(a=e[i].attributes["xlink:href"].value,r[a]||(r[a]=[],r[a].status="progress",r[a].callback=null,r[a].obj=new Image,r[a].obj.onload=function(t){return function(){var e=r[t].callback;e?(r[t].status="complete",e()):r[t].status="complete"}}(a),r[a].obj.onerror=function(t){return function(){var e=r[t].errCallback;e?(r[t].status="error",e()):r[t].status="error"}}(a),r[a].obj.src=a))},i.startTransform=function(t,e){var a,r,o=t.match(/[^\s][a-z,0-9.\-(\s]+\)/gi);for(r in o)o.hasOwnProperty(r)&&(o[r].indexOf("matrix")>-1&&(a=i.stringToArgs(o[r]),e.transform(a[0],a[1],a[2],a[3],a[4],a[5])),o[r].indexOf("translate")>-1&&(a=i.stringToArgs(o[r]),e.translate(a[0]||0,a[1]||0)),o[r].indexOf("rotate")>-1&&(3===(a=i.stringToArgs(o[r])).length?(e.translate(a[1],a[2]),e.rotate(a[0]*(Math.PI/180)),e.translate(-a[1],-a[2])):e.rotate(a[0]*(Math.PI/180))),o[r].indexOf("scale")>-1&&(1===(a=i.stringToArgs(o[r])).length?e.scale(a[0]||1,a[0]||1):e.scale(a[0]||1,a[1]||1)),o[r].indexOf("skewX")>-1&&(a=i.stringToArgs(o[r]),e.transform(1,0,Math.tan(a[0]*(Math.PI/180)),1,0,0)),o[r].indexOf("skewY")>-1&&(a=i.stringToArgs(o[r]),e.transform(1,Math.tan(a[0]*(Math.PI/180)),0,1,0,0)))},i.resetTransform=function(t){t.setTransform(1,0,0,1,0,0)},i.stringToArgs=function(t){var e=/\(([^)]+)/.exec(t)[1];return i.getArgsAsArray(e)},i.getArgsAsArray=function(t){var e;for(t=t.trim().split(/[\s,]+/),e=0;e<t.length;e++)t[e].trim(),0===t[e].length&&t.splice(e,1);return t},i.applyFillEffect=function(t,e,a,r){var o;t.attributes["fill-opacity"]&&"none"!==t.attributes["fill-opacity"].value?e.globalAlpha=t.attributes["fill-opacity"].value:e.globalAlpha=1,t.attributes.fill&&t.attributes.fill.value.indexOf("url(")>-1?(o=i.getFillStyleById(/url\(.*#([^)'"]+)/.exec(t.attributes.fill.value)[1],e,a,r),e.fillStyle=o):t.attributes.fill?e.fillStyle=t.attributes.fill.value:e.fillStyle="#000000"},i.endFillEffect=function(t,e){e.globalAlpha=1},i.applyStrokeEffect=function(t,e,a,r){t.attributes["stroke-opacity"]&&"none"!==t.attributes["stroke-opacity"].value&&(e.globalAlpha=t.attributes["stroke-opacity"].value),t.attributes["stroke-width"]&&(e.lineWidth=t.attributes["stroke-width"].value,"0"===t.attributes["stroke-width"].value&&(e.globalAlpha=0)),t.attributes["stroke-linecap"]&&"none"!==t.attributes["stroke-linecap"].value&&(e.lineCap=t.attributes["stroke-linecap"].value),t.attributes["stroke-linejoin"]&&"none"!==t.attributes["stroke-linejoin"].value&&(e.lineJoin=t.attributes["stroke-linejoin"].value),t.attributes["stroke-dasharray"]&&"none"!==t.attributes["stroke-dasharray"].value&&e.setLineDash&&e.setLineDash(i.getArgsAsArray(t.attributes["stroke-dasharray"].value)),t.attributes.stroke?e.strokeStyle=t.attributes.stroke.value:e.strokeStyle="#000000"},i.endStrokeEffect=function(t,e){t.attributes["stroke-opacity"]&&"none"!==t.attributes["stroke-opacity"].value&&(e.globalAlpha=1,e.setLineDash&&e.setLineDash([]),e.lineWidth=1),e.globalAlpha=1},i.applyClip=function(t,e,a){var o,s,n,u,l,b=a.getSVG();if(-1!==t.indexOf("url(")){for(u in o=/url\(.*#([^)'"]+)/.exec(t)[1],(s=b.getElementById(o)).attributes&&(e.save(),s.attributes.transform&&i.startTransform(s.attributes.transform.value,e)),n=s.childNodes)n.hasOwnProperty(u)&&n[u].tagName&&n[u].constructor!==Array&&(l="draw"+n[u].tagName,n[u].attributes&&(e.save(),n[u].attributes.transform&&i.startTransform(n[u].attributes.transform.value,e)),r[l]&&(r[l](n[u],e,a,"clip"),e.closePath()),n[u].attributes&&e.restore());s.attributes&&e.restore(),e.clip()}},i.getFillStyleById=function(t,e,a,r){var o=a.getSVG().getElementById(t);return"linearGradient"===o.tagName?i.getLinearGradient(o,e,r):"radialGradient"===o.tagName?i.getRadialGradient(o,e,r):"#FFFFFF"},i.getLinearGradient=function(t,e,a){var r,o,s,n,u,l=t.attributes.x1?i.getPercentValue(t.attributes.x1.value,a.xMax-a.xMin,a.xMin):0,b=t.attributes.y1?i.getPercentValue(t.attributes.y1.value,a.yMax-a.yMin,a.yMin):0,c=t.attributes.x2?i.getPercentValue(t.attributes.x2.value,a.xMax-a.xMin,a.xMin):0,f=t.attributes.y2?i.getPercentValue(t.attributes.y2.value,a.yMax-a.yMin,a.yMin):0;for(s in r=e.createLinearGradient(l,b,c,f),o=t.childNodes)o.hasOwnProperty(s)&&o[s].attributes&&o[s].attributes["stop-color"]&&(n=i.toRGB(o[s].attributes["stop-color"].value),u=o[s].attributes["stop-opacity"]?o[s].attributes["stop-opacity"].value:1,n.status?r.addColorStop(i.getPercentValue(o[s].attributes.offset.value,1,0),"rgba("+n.r+","+n.g+","+n.b+","+Number(u)+")"):r.addColorStop(i.getPercentValue(o[s].attributes.offset.value,1,0),o[s].attributes["stop-color"].value));return r},i.getRadialGradient=function(t,e,a){var r,o,s,n,u,l=t.attributes.cx?i.getPercentValue(t.attributes.cx.value,a.xMax-a.xMin,a.xMin):a.xMin+.5*(a.xMax-a.xMin),b=t.attributes.cy?i.getPercentValue(t.attributes.cy.value,a.yMax-a.yMin,a.yMin):a.yMin+.5*(a.yMax-a.yMin),c=t.attributes.fx?i.getPercentValue(t.attributes.fx.value,a.xMax-a.xMin,a.xMin):a.xMin+.5*(a.xMax-a.xMin),f=t.attributes.fy?i.getPercentValue(t.attributes.fy.value,a.yMax-a.yMin,a.yMin):a.yMin+.5*(a.yMax-a.yMin),h=t.attributes.r?i.getPercentValue(t.attributes.r.value,(a.yMax-a.yMin+a.xMax-a.xMin)/2,0):i.getPercentValue("50%",(a.yMax-a.yMin+a.xMax-a.xMin)/2,0);for(s in r=e.createRadialGradient(c,f,0,l,b,h),o=t.childNodes)o.hasOwnProperty(s)&&o[s].attributes&&o[s].attributes["stop-color"]&&(n=i.toRGB(o[s].attributes["stop-color"].value),u=o[s].attributes["stop-opacity"]?o[s].attributes["stop-opacity"].value:1,n.status?r.addColorStop(i.getPercentValue(o[s].attributes.offset.value,1,0),"rgba("+n.r+","+n.g+","+n.b+","+Number(u)+")"):r.addColorStop(i.getPercentValue(o[s].attributes.offset.value,1,0),o[s].attributes["stop-color"].value));return r},i.getPercentValue=function(t,e,a){var r;return-1!==t.indexOf("%")?((r=/(\d.*)%/.exec(t)[1])>100&&(r=100),r*e/100+1*a):t>1?t:t*e+1*a},i.bBoxFromPoint=function(t,e,a){void 0!==a.xMin&&(t.push(a.xMin,a.xMax),e.push(a.yMin,a.yMax)),a.xMin=Math.min.apply(this,t),a.xMax=Math.max.apply(this,t),a.yMin=Math.min.apply(this,e),a.yMax=Math.max.apply(this,e)},i.arcBBox=function(t,e,a,r,i,o,s,n){var u,l,b,c,f,h,p,m,M,x,y;s instanceof Array&&(t=t*s[0]+t*s[2]+s[4],e=e*s[1]+e*s[3]+s[5]),y=function(t,e,a){return(t=(t+2*Math.PI)%(2*Math.PI))<=(e=(e+2*Math.PI)%(2*Math.PI))?t<=a&&a<=e:t>=e?!(t>=a&&a>=e):void 0},u=r%(2*Math.PI),l=i%(2*Math.PI),o&&(u=i%(2*Math.PI),l=r%(2*Math.PI)),b=t+a*Math.cos(u),c=e+a*Math.sin(u),M=[b,t+a*Math.cos(l)],x=[c,e+a*Math.sin(l)],y(u,l,0)&&(M.push(1*t+1*a),x.push(e)),y(u,l,.5*Math.PI)&&(M.push(t),x.push(1*e+1*a)),y(u,l,Math.PI)&&(M.push(t-1*a),x.push(e)),y(u,l,1.5*Math.PI)&&(M.push(t),x.push(e-1*a)),p=Math.max.apply(this,M),f=Math.min.apply(this,M),m=Math.max.apply(this,x),h=Math.min.apply(this,x),void 0!==n.xMin?(n.xMin=Math.min(f,n.xMin),n.xMax=Math.max(p,n.xMax),n.yMin=Math.min(h,n.yMin),n.yMax=Math.max(m,n.yMax)):(n.xMin=f,n.xMax=p,n.yMin=h,n.yMax=m)},i.qBezierBBox=function(t,e,a,r,i,o,s){var n,u,l,b,c,f,h,p,m=1*t-2*a+1*i,M=1*e-2*r+1*o;0===m||0===M?(c=Math.max(t,i),l=Math.min(t,i),f=Math.max(e,o),b=Math.min(e,o)):(n=(t-a)/m,u=(e-r)/M,h=t*Math.pow(1-n,2)+2*a*(1-n)*n+i*Math.pow(n,2),p=e*Math.pow(1-u,2)+2*r*(1-u)*u+o*Math.pow(u,2),c=Math.max(t,i,h),l=Math.min(t,i,h),f=Math.max(e,o,p),b=Math.min(e,o,p)),void 0!==s.xMin?(s.xMin=Math.min(l,s.xMin),s.xMax=Math.max(c,s.xMax),s.yMin=Math.min(b,s.yMin),s.yMax=Math.max(f,s.yMax)):(s.xMin=l,s.xMax=c,s.yMin=b,s.yMax=f)},i.cBezierBBox=function(t,e,a,r,i,o,s,n,u){var l,b,c,f,h,p,m,M,x,y,v,d,g;null===i&&null===o&&(i=e+2/3*(r-e),r=(a=t+2/3*(a-t))+1/3*(s-t),o=i+1/3*(n-e)),v=function(t,e,a,r,i){return t*Math.pow(1-i,3)+3*e*i*Math.pow(1-i,2)+3*a*i*i*(1-i)+r*i*i*i},h=3*s-9*i+9*a-3*t,p=6*t-12*a+6*i,m=3*a-3*t,M=Math.pow(p,2)-4*h*m,b=t,s<(l=t)&&(l=s),s>b&&(b=s),M>=0&&((x=(-p+Math.sqrt(M))/(2*h))>0&&x<1&&((d=v(t,a,i,s,x))<l&&(l=d),d>b&&(b=d)),(y=(-p-Math.sqrt(M))/(2*h))>0&&y<1&&((d=v(t,a,i,s,y))<l&&(l=d),d>b&&(b=d))),h=3*n-9*o+9*r-3*e,p=6*e-12*r+6*o,m=3*r-3*e,M=Math.pow(p,2)-4*h*m,f=e,n<(c=e)&&(c=n),n>f&&(f=n),M>=0&&((x=(-p+Math.sqrt(M))/(2*h))>0&&x<1&&((g=v(e,r,o,n,x))<c&&(c=g),g>f&&(f=g)),(y=(-p-Math.sqrt(M))/(2*h))>0&&y<1&&((g=v(e,r,o,n,y))<c&&(c=g),g>f&&(f=g))),void 0!==u.xMin?(u.xMin=Math.min(l,u.xMin),u.xMax=Math.max(b,u.xMax),u.yMin=Math.min(c,u.yMin),u.yMax=Math.max(f,u.yMax)):(u.xMin=l,u.xMax=b,u.yMin=c,u.yMax=f)},i.combineTransformMatrix=function(t){var e,a,r=t.length-1;if(r<=0)return t[0];for(a=t[0],e=1;e<=r;e++)a[0]=a[0]*t[e][0]+a[1]*t[e][3],a[1]=a[0]*t[e][1]+a[1]*t[e][4],a[2]=a[0]*t[e][2]+a[1]*t[e][5]+1*a[2],a[3]=a[3]*t[e][0]+a[4]*t[e][3],a[4]=a[3]*t[e][1]+a[4]*t[e][4],a[5]=a[3]*t[e][2]+a[4]*t[e][5]+1*a[5];return a},i.angleBetweenVectors=function(t,e,a,r){var i=t*r<e*a?-1:1,o=t*a+e*r,s=Math.sqrt(Math.pow(t,2)+Math.pow(e,2)),n=Math.sqrt(Math.pow(a,2)+Math.pow(r,2));return i*Math.acos(o/(s*n))},i.toRGB=function(t){var e,a,r,i={r:0,g:0,b:0,status:0};return a=function(t){for(r in t)t.hasOwnProperty(r)&&(t[r]<0||isNaN(t[r])?t[r]=0:t[r]>255&&(t[r]=255));return i={r:t[0],g:t[1],b:t[2],status:1}},(t=t.trim()).match(/^rgb\(|^rgba\(/i)?(e=/\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})/.exec(t),a([parseInt(e[1]),parseInt(e[2]),parseInt(e[3])])):t.match(/^#/)&&(e=/(\w{2})(\w{2})(\w{2})/.exec(t),a([parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)])),i},i.StrToDom=function(t){var a;return e.DOMParser?a=(new DOMParser).parseFromString(t,"text/xml"):((a=new e.ActiveXObject("Microsoft.XMLDOM")).async=!1,a.loadXML(t)),a},t});
