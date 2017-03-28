var SvgDeCanvo = require('../../lib/svgdecanvo');

describe("window", function () {
	it("should have SvgDeCanvo exposed", function () {
		expect(SvgDeCanvo).toBeDefined();
	});
});



describe('SvgDeCanvo', function () {
	var svgString = '<svg height="400" version="1.1" width="600" xmlns="http://www.w3.org/2000/svg" id="raphael-paper-0" style="overflow: hidden; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); user-select: none; cursor: default; vertical-align: middle; left: 10px; top: 10px;"><desc></desc><defs></defs><rect x="0" y="0" width="500" height="200" rx="0" ry="0" fill="#ff0000" stroke="#000000" style="fill: rgb(255, 0, 0); stroke: rgb(0, 0, 0);"></rect><text x="10" y="20" fill="#ffffff" text-anchor="left" stroke="none" style="fill: rgb(255, 255, 255); stroke: none;"><tspan dy="11" x="10">Use index.html as a template to work on temporary workspace!</tspan><tspan dy="12" x="10" xml:space="preserve"> </tspan><tspan dy="12" x="10">Ensure that your test files are named spec-&lt;somename&gt;.html</tspan></text></svg>',
		// canvasEle;
		canvasEle = document.createElement('canvas');


	it('must be able to convert', function () {
		SVG = new SvgDeCanvo(svgString, canvasEle, function (canvas) {console.log(canvas)});
		
		expect(SVG.getContext()).toBeDefined();
	});



});

