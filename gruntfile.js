module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks("grunt-package-modules");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.initConfig(
        {
            clean: {
                gen: {
                    expand: true,
                    cwd: '.',
                    src: ['release/**']
                }
            },
            ts: {
                default: {
                    tsconfig: true
                }
            },
            copy: {
                root: {
                    expand: true,
                    cwd: 'src',
                    src: ['index.html', 'images/**', '**', '!**/*.ts', '!tsconfig.json', '!**/*.html', '!css'],
                    dest: "release"
                }
            },
            packageModules: {
                default: {
                    src: 'package.json',
                    dest: 'release'
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
                        processScripts: ['text/ng-template'],
                        minifyCSS: true,
                        minifyJS: true
                    },
                    files: [{
                        expand: true,
                        cwd: '.',
                        src: ['**/*.html', "!node_modules/**", "!release/**"],
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
                            src: ["**/*.js", "!node_modules/**"],
                            dest: "release/app",
                            ext: ".js"
                        }
                    ]
                }
            }
        }
    );
    grunt.registerTask("default", ["clean", "ts", "copy", "packageModules"]);
    grunt.registerTask("release", ["clean", "ts", "copy", "packageModules", "htmlmin", "cssmin", "uglify"]);
};