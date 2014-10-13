module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        distDir: "dist/",
        buildDir: "build",
        manifest: grunt.file.readJSON('elogio-chrome/manifest.json'),
        bower: {
            install: {
                options: {
                    targetDir: "elogio-commons/data/deps"
                }
            }
        },
        crx: {
            package: {
                "src": "build/chrome",
                "dest": "dist/chrome/elogio-chrome-<%= manifest.version %>.crx",
                "exclude": [ ".git", ".svn" ],
                "privateKey": "elogio-chrome/chrome.pem",
                "options": {
                    "maxBuffer": 3000 * 1024 //build extension with a weight up to 3MB
                }
            }
        },
        clean: {
            firefox: ["<%= buildDir%>/firefox" , "<%= distDir %>/firefox"],
            chrome: ["<%= buildDir%>/chrome" , "<%= distDir %>/chrome"]
        },

        less: {
            compile: {
                options: {
                    paths: ["elogio-firefox/data/less"]
                },
                files: {
                    "<%= buildDir%>/firefox/data/css/sidebar.css": "elogio-firefox/data/less/sidebar.less",
                    "<%= buildDir%>/firefox/data/css/highlight.css": "elogio-firefox/data/less/highlight.css"
                }
            }
        },

        concat: {
            options: {
                stripBanners: false,
                banner: '/*! <%= pkg.name %> modules - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            firefoxModules: {
                files: {
                    '<%= buildDir%>/firefox/data/js/common-lib.js': [
                        'elogio-commons/data/js/common.js',
                        'elogio-commons/data/js/config.js',
                        'elogio-commons/data/js-modules/*.js',
                        'elogio-commons/data/deps/png.js/zlib.js',
                        'elogio-commons/data/deps/png.js/png.js',
                        'elogio-commons/data/deps/jpgjs/jpg.js',
                        'elogio-commons/data/deps/blockhash-js/blockhash.js'
                    ],
                    '<%= buildDir%>/firefox/lib/common-chrome-lib.js': [
                        'elogio-commons/data/js/common.js',
                        'elogio-commons/data/js/config.js',
                        'elogio-commons/data/js-modules/*.js',
                        'elogio-firefox/data/private-modules/*.js',
                        'elogio-commons/data/js-modules/chrome/*.js'

                    ]
                }
            },
            chromeModules: {
                files: {
                    '<%= buildDir%>/chrome/data/js/common-lib.js': [
                        'elogio-commons/data/js/common.js',
                        'elogio-commons/data/js/config.js',
                        'elogio-commons/data/js-modules/*.js',
                        'elogio-commons/data/deps/png.js/zlib.js',
                        'elogio-commons/data/deps/png.js/png.js',
                        'elogio-commons/data/deps/jpgjs/jpg.js',
                        'elogio-commons/data/deps/blockhash-js/blockhash.js',
                        'elogio-chrome/data/modules/sidebar-module.js',
                        'elogio-chrome/data/modules/messaging.js'
                    ],
                    '<%= buildDir%>/chrome/main/common-chrome-lib.js': [
                        'elogio-commons/data/js/common.js',
                        'elogio-commons/data/js/config.js',
                        'elogio-commons/data/js-modules/*.js',
                        'elogio-chrome/data/modules/elogio-request.js',
                        'elogio-commons/data/js-modules/chrome/*.js',
                        'elogio-chrome/data/modules/messaging.js'
                    ]
                }
            }
        },

        "mozilla-addon-sdk": {
            "1_17": {
                options: {
                    revision: "1.17"
                }
            }
        },

        "mozilla-cfx": {
            "stable": {
                options: {
                    "mozilla-addon-sdk": "1_17",
                    extension_dir: "<%= buildDir%>/firefox",
                    command: "run"
                }
            }
        },

        "mozilla-cfx-xpi": {
            "stable": {
                options: {
                    "mozilla-addon-sdk": "1_17",
                    extension_dir: "<%=buildDir%>/firefox",
                    dist_dir: "dist/firefox"
                }
            }
        },

        "jshint": {
            firefoxContentScript: {
                files: [
                    {
                        src: [
                            'elogio-firefox/data/**/*.js'
                        ]
                    }
                ],
                options: {
                    jshintrc: './elogio-firefox/data/js/.jshintrc'
                }
            },
            commonLibs: {
                files: [
                    {
                        src: [
                            'elogio-commons/data/js/*.js',
                            'elogio-commons/data/js-modules/**'
                        ]
                    }
                ],
                options: {
                    jshintrc: './elogio-commons/data/js/.jshintrc'
                }
            },
            firefoxChrome: {
                src: [
                    './elogio-firefox/lib/**/*.js'
                ],
                options: {
                    jshintrc: './elogio-firefox/lib/.jshintrc'
                }
            },
            chromeContentScript: {
                files: [
                    {
                        src: [
                            'elogio-chrome/data/**/*.js'
                        ]
                    }
                ],
                options: {
                    jshintrc: './elogio-chrome/data/js/.jshintrc'
                }
            },

            chromeMain: {
                src: [
                    './elogio-chrome/main/**/*.js'
                ],
                options: {
                    jshintrc: './elogio-chrome/main/.jshintrc'
                }
            }
        },

        uglify: {
            minifyFirefox: {
                options: {
                    mangle: true,
                    compress: true,
                    preserveComments: false,
                    beautify: false},
                src: ["**/**.js"],
                cwd: "elogio-firefox/",
                dest: "<%= buildDir%>/firefox/",
                expand: true
            },
            beautifyFirefox: {
                options: {
                    mangle: false,
                    compress: false,
                    preserveComments: true,
                    beautify: true
                },
                src: ["**/*.js"],
                cwd: "elogio-firefox/",
                dest: "<%= buildDir%>/firefox/",
                expand: true
            },
            minifyChrome: {
                options: {
                    mangle: true,
                    compress: true,
                    preserveComments: false,
                    beautify: false},
                src: ["**/*.js", "!**/*.js/**"],
                cwd: "elogio-chrome/",
                dest: "<%= buildDir%>/chrome/",
                expand: true
            },
            beautifyChrome: {
                options: {
                    mangle: false,
                    compress: false,
                    preserveComments: true,
                    beautify: true
                },
                src: ["**/*.js", "!**/*.js/**"],
                cwd: "elogio-chrome/",
                dest: "<%= buildDir%>/chrome/",
                expand: true
            },
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            }
        },

        copy: {
            resourcesWithoutJSForFirefox: {
                src: ["**", "!**/*.js", "!**/deps/blockhash-js/**", "!**/deps/jpgjs/**", "!**/deps/png.js/**"],
                cwd: "elogio-firefox/",
                dest: "<%= buildDir%>/firefox/",
                expand: true
            },
            resourcesWithoutJSForChrome: {
                src: ["**", "!**/*.js", "!**/deps/blockhash-js/**", "!**/deps/jpgjs/**", "!**/deps/png.js/**", "!**.pem"],
                cwd: "elogio-chrome/",
                dest: "<%= buildDir%>/chrome/",
                expand: true
            },
            //we need to copy libs (like jquery,mustache etc.) into build folder
            chromeLibs: {
                src: ["**", "!blockhash-js/**", "!jpgjs/**", "!png.js/**"],
                cwd: "elogio-commons/data/deps/",
                dest: "<%= buildDir%>/chrome/data/deps/",
                expand: true
            },
            firefoxLibs: {
                src: ["**", "!blockhash-js/**", "!jpgjs/**", "!png.js/**", "!requirejs/**"],
                cwd: "elogio-commons/data/deps/",
                dest: "<%= buildDir%>/firefox/data/deps/",
                expand: true
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mozilla-addon-sdk');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-crx');

    /**
     * Helper tasks.
     */
    grunt.registerTask('lint-firefox', ['jshint:firefoxChrome', 'jshint:firefoxContentScript']);
    grunt.registerTask('lint-chrome', ['jshint:chromeMain', 'jshint:chromeContentScript']);
    grunt.registerTask('lint', ['jshint:firefoxChrome', 'jshint:firefoxContentScript', 'jshint:chromeMain', 'jshint:chromeContentScript']);
    /**
     * End-user tasks.
     *
     * These are used to build, run and test the product.
     */
    grunt.registerTask('default', function () {
        grunt.log.write('\n\nElog.io Mozilla plugin build system. Please use any of following: ');
        grunt.log.write('\n   grunt run -- runs the firefox with the extension in debug mode.');
        grunt.log.write('\n   grunt dist-debug -- makes an XPI packaged (see dist folder), with all the resources and sources unchanged ');
        grunt.log.write('\n   grunt dist-minified -- makes an XPI ready for production (uglified) ');
    });

    grunt.registerTask('build', 'Task with parameters ', function (parameter) {
        function buildFirefox() {
            grunt.task.run([
                'lint-firefox',
                'less',
                'copy:resourcesWithoutJSForFirefox',
                'uglify:beautifyFirefox',
                'copy:firefoxLibs',
                'concat:firefoxModules'
            ]);
        }

        function buildChrome() {
            grunt.task.run([
                'lint-chrome',
                'copy:resourcesWithoutJSForChrome',
                'uglify:beautifyChrome',
                'copy:chromeLibs',
                'concat:chromeModules'
            ]);
        }

        switch (parameter) {
            case 'firefox':
                buildFirefox();
                break;
            case 'chrome':
                buildChrome();
                break;
            default:
                buildFirefox();
                buildChrome();
        }

    });
    grunt.registerTask('run', 'Task with parameters ', function (parameter) {
        function runFirefox() {
            grunt.task.run([
                'lint-firefox',
                'less',
                'copy:resourcesWithoutJSForFirefox',
                'uglify:minifyFirefox',
                'copy:firefoxLibs',
                'concat:firefoxModules',
                'mozilla-addon-sdk',
                'mozilla-cfx'
            ]);
        }

        //how to run chrome?
        function runChrome() {
            grunt.task.run([
                'lint-chrome',
                'copy:resourcesWithoutJSForChrome',
                'uglify:beautifyChrome',
                'copy:chromeLibs',
                'concat:chromeModules'
            ]);
        }

        switch (parameter) {
            case 'firefox':
                runFirefox();
                break;
            case 'chrome':
                runChrome();
                break;
            default:
                runFirefox();
                runChrome();
        }

    });
    grunt.registerTask('dist', 'Task with parameters ', function (parameter) {
        function distFirefox() {
            grunt.task.run([
                'clean:firefox',
                'bower',
                'lint-firefox',
                'less',
                'copy:resourcesWithoutJSForFirefox',
                'uglify:minifyFirefox',
                'concat:firefoxModules',
                'mozilla-addon-sdk',
                'mozilla-cfx-xpi'
            ]);
        }

        //how to package chrome?
        function distChrome() {
            grunt.task.run([
                'clean:chrome',
                'bower',
                'lint-chrome',
                'copy:resourcesWithoutJSForChrome',
                'uglify:minifyChrome',
                'copy:chromeLibs',
                'concat:chromeModules',
                'crx'
            ]);
        }

        switch (parameter) {
            case 'firefox':
                distFirefox();
                break;
            case 'chrome':
                distChrome();
                break;
            default:
                distFirefox();
                distChrome();
        }

    });
};