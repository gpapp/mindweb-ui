module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    ;
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.initConfig(
        {
            clean: {
                gen: {
                    expand: true,
                    cwd: '.',
                    src: ['release/**']
                },
            },
            copy: {
                root: {
                    cwd: '.',
                    src: ['index.html'],
                    dest: "release/index.html"
                },
                dist: {
                    expand: true,
                    cwd: 'app',
                    src: ['**', '!**/*.html', '!**/*.css', '!**.js', "lib/**"],
                    dest: "release/app"
                }
            },
            cssmin: {
                release: {
                    options: {                                 // Target options
                        removeComments: true,
                        collapseWhitespace: true
                    },
                    files: {
                        "release/app/app.css": "app/app.css"
                    }
                }
            },
            htmlmin: {
                release: {
                    options: {                                 // Target options
                        removeComments: true,
                        collapseWhitespace: true,
                        processScripts:['text/ng-template'],
                        minifyCSS: true,
                        minifyJS: true
                    },
                    files: [{
                        expand: true,
                        cwd: '.',
                        src: ['**/*.html', "!lib/**", "!release/**"],
                        dest: "release"
                    }
                    ]
                }
            },
            uglify: {
                options: {
                    sourceMap: true,
                    mangle: false
                }
                ,
                dist: {
                    files: [
                        {
                            expand: true,
                            cwd: "app",
                            src: ["**/*.js", "!lib/**"],
                            dest: "release/app",
                            ext: ".js"
                        }
                    ]
                }
            }
        }
    )
    ;
    grunt.registerTask("default", ["clean", "copy", "htmlmin", "cssmin", "uglify"])
};