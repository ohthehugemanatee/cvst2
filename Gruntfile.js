module.exports = function(grunt) {
    // Project config.
    grunt.initConfig({
        bower_concat: {
            all: {
                dest: 'public/bower_components/_bower.js',
                cssDest: 'public/bower_components/_bower.css'
            }
        }
    });

    // Register tasks
    grunt.loadNpmTasks('grunt-bower-concat');

    // Default tasks
    grunt.registerTask('default', ['bower_concat']);
};
