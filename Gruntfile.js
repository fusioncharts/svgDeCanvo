module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        buildFc: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: 'build/<%= pkg.name %>.js',
                fusioncharts: 'build/<%= pkg.name %>-fusioncharts.js',
                fusionchartsWrapper: 'src/fusioncharts-wrapper-template.js'
            }
        },
        concat: {
            dist: {
                src: '<%= pkg.buildOrder %>',
                dest: 'build/<%= pkg.name %>.js',
            },
        },
        jshint: {
            options: {
                browser: true,
                loopfunc: true,
                expr: true
            },
            all: ['Gruntfile.js', 'src/*.js']
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerMultiTask(
        "buildFc",
        "Concatenate source, remove individual closures, embed version",
        function() {
            var data = this.data,
                name = data.dest,
                fcName = data.fusioncharts,
                fcSrcName = data.fusionchartsWrapper,
                src = data.src,
                source;

            if (grunt.file.exists(data.src)) {
                source = grunt.file.read(data.src);
                grunt.file.write(fcName, grunt.file.read(fcSrcName).replace(/\/\/SVGDECANVO_CODE/, source));
            } else {
                grunt.log.writeln('***************************************************');
                grunt.log.writeln('execute build first');
            }
        }
    );
    // Default task(s).
    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'buildFc']);
    grunt.registerTask('build', ['jshint', 'concat', 'uglify']);

};
