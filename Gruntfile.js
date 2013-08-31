module.exports = function (grunt) {
    var indent = require('indent');
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkg,

        concat: {
            options: {
                separator: '\n\n',
                process: function (content, file) {
                    //indent any JS files
                    if (/\.js$/.test(file)) {
                        return indent(pkg, content, file);
                    }

                    return content;
                }
            },
            dist: {
                src: [
                    'src/ext/intro',

                    'src/js/core/*.js',
                    'src/js/core/**/*.js',

                    'src/js/modules/*.js',
                    'src/js/modules/**/*.js',

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