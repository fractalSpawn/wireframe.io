module.exports = function(grunt){

    // load NPM tasks from all grunt dependencies
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // to avoid having our tasks in two different places, 
    // this task list is used by both watch and default.
    var taskList = [
        "prepModules",  // adds module specific subtasks to tasks that require module support
        "sass",         // compiles .scss files into .css files
        "ngtemplates",  // compiles .html partials into $templateCache files for better template loading
        "concat",       // combines files from multiple sources into easily resourced single files
        "uglify",       // minifies .js files for production
        "cssmin",       // minifies .css files for production
        "copy"          // copies files that do not need minification into prod/ directory
    ];

    grunt.initConfig({
        // this will make properties in the package.json file
        // available to this script as pkg.<property name>
        pkg: grunt.file.readJSON("package.json"),

        //////////////////////////////////////////////////////////////
        //   .---.  .----. .-.   .-..----. .-..-.   .-..-. .-. .---. 
        //  /  ___}/  {}  \|  `.'  || {}  }| || |   | ||  `| |/   __}
        //  \     }\      /| |\ /| || .--' | || `--.| || |\  |\  {_ }
        //   `---'  `----' `-' ` `-'`-'    `-'`----'`-'`-' `-' `---' 
        //////////////////////////////////////////////////////////////
        // Compiles our files into their final or near final states.
        //////////////////////////////////////////////////////////////
        sass: {
            options: {
                loadPath: 'src/scss'
            },
            core: {
                files: [{
                    expand: true,
                    cwd: 'src/scss/',
                    src: ['*.scss'],
                    dest: 'src/css/',
                    ext: '.css'
                }]
            }
            // module specific sass rules are dynamically
            // built with the prepModules task.
        },
        ngtemplates: {
            options: {
                "module": "wireframeIO",
                "htmlmin": {
                    "collapseWhitespace": true,
                    "removeComments": true,
                    "removeEmptyAttributes": true,
                    "removeRedundantAttributes": true
                }
            }
            // module specific concatenation rules are 
            // dynamically built with the prepModules task.
        },

        /////////////////////////////////////////////////////////
        //  .----. .-. .-..-. .-..----. .-.   .-..-. .-. .---. 
        //  | {}  }| { } ||  `| || {}  \| |   | ||  `| |/   __}
        //  | {}  }| {_} || |\  ||     /| `--.| || |\  |\  {_ }
        //  `----' `-----'`-' `-'`----' `----'`-'`-' `-' `---' 
        /////////////////////////////////////////////////////////
        //  Bundles many files into one easier to reference file.
        /////////////////////////////////////////////////////////
        concat: {
            vendor: {
                files: [{
                    "dev/css/vendor.min.css": [
                        "src/vendor/bootstrap/dist/css/bootstrap.min.css"
                    ],
                    "dev/js/vendor.min.js": [
                        "src/vendor/angular/angular.min.js",
                        "src/vendor/angular-animate/angular-animate.min.js",
                        "src/vendor/angular-route/angular-route.min.js",
                        "src/vendor/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js",
                        "src/vendor/d3/d3.min.js"
                    ]
                }]
            },
            core: {
                files: [{
                    // as part of running sass, our compiled css was placed into src/css/
                    // we will concat our css files, not our scss files.
                    "dev/css/core.min.css": [
                        "src/css/default.css",
                        "src/css/overrides.css",
                        "src/css/modal.css"
                    ],
                    // theoretically this could be core.min.js and include app.js as well
                    // as any other core scripts (routing, etc) that are in separate files
                    // for code organization.
                    "dev/js/core.min.js": [
                        "src/js/app.js"
                    ]
                }]
            }
            // module specific concatenation rules are 
            // dynamically built with the prepModules task.
        },

        //////////////////////////////////////////////////////////
        //  .-.   .-..-..-. .-..-..----..-.  .-..-..-. .-. .---. 
        //  |  `.'  || ||  `| || || {_   \ \/ / | ||  `| |/   __}
        //  | |\ /| || || |\  || || |     }  {  | || |\  |\  {_ }
        //  `-' ` `-'`-'`-' `-'`-'`-'     `--'  `-'`-' `-' `---' 
        //////////////////////////////////////////////////////////
        // Minifies to reduce file size. Begins migration to prod.
        //////////////////////////////////////////////////////////
        uglify: {
            core: {    
                src: "dev/js/core.min.js",
                dest: "prod/js/core.min.js"
            },
            modules: {
                files: [{
                    expand: true,
                    cwd: "dev/modules",
                    src: "**/*.js",
                    dest: "prod/modules"
                }]
            }
        },
        cssmin: {
            core: {
                expand: true,
                cwd: "dev/css",
                src: "*.css",
                dest: "prod/css"
            },
            modules: {
                expand: true,
                cwd: "dev/modules",
                src: "**/*.css",
                dest: "prod/modules"
            }
        },

        // There are a couple of items that have no further processing
        // after they are in dev. One is the vendor JS file, which is already
        // minified so does not go through uglification into prod. is the 
        // bootstrap glyphicon fonts. These files simply need to be copied
        // into the approprate directory(s). All other files get
        // moved to prod as part of their minification process.
        copy: {
            vendor: {
                src: "dev/js/vendor.min.js",
                dest: "prod/js/vendor.min.js"
            },
            devFonts: {
                files: [{
                    expand: true,
                    cwd: "src/vendor/bootstrap/dist/fonts",
                    src: ['*.*'],
                    dest: "dev/fonts"
                }]
            },
            prodFonts: {
                files: [{
                    expand: true,
                    cwd: "src/vendor/bootstrap/dist/fonts",
                    src: ['*.*'],
                    dest: "prod/fonts"
                }]
            }
        },

        ///////////////////////////////////////////////////////////
        //  .-. . .-.  .--.  .---.  .---. .-. .-..-..-. .-. .---. 
        //  | |/ \| | / {} \{_   _}/  ___}| {_} || ||  `| |/   __}
        //  |  .'.  |/  /\  \ | |  \     }| { } || || |\  |\  {_ }
        //  `-'   `-'`-'  `-' `-'   `---' `-' `-'`-'`-' `-' `---' 
        ///////////////////////////////////////////////////////////
        // Set up the watcher so we can build in real time.
        ///////////////////////////////////////////////////////////
        watch: {
            js: {
                files: [
                    "gruntfile.js",
                    "src/js/app.js",
                    // any change to core scss triggers a build
                    "src/scss/*.scss",
                    "src/scss/**/*.scss",
                    // any change to any module .js, .html or .scss triggers a build
                    "src/js/modules/**/*.js",
                    "src/js/modules/**/*.html",
                    "src/js/modules/**/*.scss"
                ],
                tasks: taskList
            }
        }
    });

    // This task basically finds all our modules and creates concat subtasks
    // for each one. Turns the many files of a module into a single js file
    // that we later minify down and put into prod/.
    grunt.registerTask("prepModules", "Finds and prepares modules for concatenation.", function() {

        // get the current tasks we want to add module support to
        var sass = grunt.config.get('sass') || {};
        var ngtemplates = grunt.config.get('ngtemplates') || {};
        var concat = grunt.config.get('concat') || {};

        // loop through our modules directory and create subtasks
        // for each module within each build task requiring module support.
        grunt.file.expand("src/js/modules/*").forEach(function (dir) {

            // get the module name by looking at the directory we're in
            var moduleName = dir.substr(dir.lastIndexOf('/')+1);

            // add sass subtasks for each module, turning all module
            // scss into module css, which can be processed further;
            // like merging into a single module css file in dev and prod
            sass[moduleName] = {
                files: [{
                    expand: true,
                    cwd: dir + '/scss',
                    src: ['*.scss'],
                    dest: dir + '/css',
                    ext: '.css'
                }]
            };
            grunt.config.set('sass', sass);

            // add ngtemplate subtasks for each module, turning
            // all module partials into $templateCache objects
            ngtemplates[moduleName] = {
                src: dir + "/partials/**/*.html",
                dest: 'dev/modules/' + moduleName + '/' + moduleName + '.tpls.min.js'
            };
            grunt.config.set('ngtemplates', ngtemplates);

            // add a concat subtasks for each module we have
            // turning controllers, directives, etc into a single file.
            concat[moduleName + '_js'] = {
                src: [dir+"/*.js", dir+'/**/*.js'],
                dest: 'dev/modules/' + moduleName + '/' + moduleName + '.min.js'
            };
            concat[moduleName + '_css'] = {
                src: [dir + "/css/*.css", dir+'/css/**/*.css'],
                dest: 'dev/modules/' + moduleName + '/' + moduleName + '.min.css' 
            };
            grunt.config.set('concat', concat);
        });
    });

    // the default task
    grunt.registerTask("default", taskList);    
};