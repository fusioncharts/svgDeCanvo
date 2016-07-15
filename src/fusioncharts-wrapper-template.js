/**
 * FusionCharts module for SvgDeCanvo integration
 * @private
 * @module fusioncharts.vendor.svgdecanvo
 * @requires fusioncharts.renderer.javascript.lib
 */
FusionCharts && FusionCharts.register('module', ['private', 'vendor.svgdecanvo', function () {
    var global = this,
        win = global.window,
        lib = global.hcLib;


        //SVGDECANVO_CODE


    // Restore old Raphael or remove it from global scope
    if (win.SvgDeCanvo) {
        lib.SvgDeCanvo = win.SvgDeCanvo;
        win.SvgDeCanvo = undefined;
    }

}]);
