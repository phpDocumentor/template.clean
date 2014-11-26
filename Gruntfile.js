module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dependencies: {
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/jquery.cookie/jquery.cookie.js',
                    'bower_components/fastclick/lib/fastclick.js',
                    'bower_components/foundation/js/foundation/foundation.js',
                    'bower_components/foundation/js/foundation/dropdown.js',
                    'bower_components/prism/prism.js',
                    'bower_components/velocity/velocity.js',
                    'bower_components/velocity/velocity.ui.js',
                    'bower_components/showdown/compressed/showdown.js',
                    'bower_components/angular/angular.min.js',
                    'bower_components/angular-route/angular-route.min.js',
                    'bower_components/angular-sanitize/angular-sanitize.min.js',
                    'bower_components/angular-markdown-filter/markdown.js',
                    'js/jquery.mtree.js'
                ],
                dest: 'js/dependencies.js'
            },
            app: {
                src: [
                    'js/foundation.js',
                    'app/app.module.js',
                    'app/app.routes.js',
                    'app/app.filters.js',
                    'app/elements/*.js',
                    'app/classes/*.js'
                ],
                dest: 'js/app.js'
            }
        },
        uglify: {
            modernizr: {
                options: { report: 'min' },
                files: { 'js/modernizr.min.js': [ 'bower_components/modernizr/modernizr.js' ] }
            },
            dependencies: {
                options: { report: 'min' },
                files: { 'js/dependencies.min.js': [ 'js/dependencies.js' ] }
            },
            js: {
                options: { report: 'min' },
                files: { 'js/app.min.js': [ 'js/app.js' ] }
            }
        },
        compass: {
            default: { options: { config: 'config.rb' } }
        },
        cssmin: {
            default: {
                options: { report: 'min' },
                src: [ 'css/app.css' ],
                dest: 'css/app.min.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.registerTask('default', [
        'concat:dependencies',
        'concat:app',
        'uglify:modernizr',
        'uglify:dependencies',
        'uglify:js',
        'compass',
        'cssmin'
    ]);

    grunt.registerTask('sass', [
        'compass:compile',
        'cssmin'
    ]);
};
