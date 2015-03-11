module.exports = function(grunt) {
    // Project config.
    grunt.initConfig({
        wiredep: {
            task: {
                src: [
                'public/index.html'
                ]
            }
        }

    });

    // Register tasks
    grunt.loadNpmTasks('grunt-wiredep');

    // Default tasks
    grunt.registerTask('default', ['wiredep'])
};
