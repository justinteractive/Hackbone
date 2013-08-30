module.exports = function (grunt) {
    var indent = require('./node_modules/indent/indent');
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkg,

        concat: {
            options: {
                separator: '\n\n',
                process: function (content, file) {
                    return indent(pkg, content, file);
                }
            },
            dist: {
                src: [
                    'src/ext/intro',
                    'src/js/hackbone.js',
                    "src/js/events/Events.js",
                    "src/js/base/*.js",
                    "src/js/state/*.js",
                    "src/js/model/*.js",
                    "src/js/view/BaseView.js",
                    "src/js/view/View.js",
                    'src/js/*.js',
                    'src/js/**/*.js',
                    'src/ext/outro'
                ],
                dest: 'build/hackbone-<%= pkg.version %>.js'
            }
        },

        watch: {
            files: ['src/js/**/*.js'],
            tasks: ['concat']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('dev', ['concat', 'watch']);
};