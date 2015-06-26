/*jslint node: true */
'use strict';

var pkg = require('./package.json');
var os = require('os');
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
var path = require('path');

//Using exclusion patterns slows down Grunt significantly
//instead of creating a set of patterns like '**/*.js' and '!**/node_modules/**'
//this method is used to create a set of inclusive patterns for all subdirectories
//skipping node_modules, bower_components, dist, and any .dirs
//This enables users to create any directory structure they desire.
var createFolderGlobs = function (fileTypePatterns) {
  fileTypePatterns = Array.isArray(fileTypePatterns) ? fileTypePatterns : [fileTypePatterns];
  var ignore = ['node_modules', 'bower_components', 'dist', 'temp', 'assets'];
  var fs = require('fs');
  return fs.readdirSync(process.cwd())
    .map(function (file) {
      if (ignore.indexOf(file) !== -1 ||
        file.indexOf('.') === 0 || !fs.lstatSync(file).isDirectory()) {
        return null;
      } else {
        return fileTypePatterns.map(function (pattern) {
          return file + '/**/' + pattern;
        });
      }
    })
    .filter(function (patterns) {
      return patterns;
    })
    .concat(fileTypePatterns);
};

module.exports = function (grunt) {

  var seleniumPath;
  seleniumPath = path.resolve('./node_modules/protractor/selenium');

  var devURL = 'localhost';
  var devApiURL = '';

  var stagingURL = '';
  var stagingApiURL = '';

  var productionURL = '';
  var productionApiURL = '';

  var supportEmail = 'jbg@pvblic.co';

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('./package.json'),

    pvBanner: {
      html: '<!--\n' +
      '  Pvblic Ltd\n' +
      '  ------------------------\n' +
      '  Project     : <%= pkg.name %>\n' +
      '  Version     : <%= pkg.version %>\n' +
      '  Description : <%= pkg.description %>\n' +
      '  Author      : <%= pkg.author %>\n' +
      '  Homepage    : <%= pkg.homepage %>\n' +
      '  Updated     : <%= grunt.template.today("dd-mm-yyyy @ HH:MM") %>\n' +
      '-->',
      jscss: '/**\n' +
      ' *  Pvblic Ltd\n' +
      ' *  ------------------------\n' +
      ' *  Project     : <%= pkg.name %>\n' +
      ' *  Version     : <%= pkg.version %>\n' +
      ' *  Description : <%= pkg.description %>\n' +
      ' *  Author      : <%= pkg.author %>\n' +
      ' *  Homepage    : <%= pkg.homepage %>\n' +
      ' *  Updated     : <%= grunt.template.today("dd-mm-yyyy @ HH:MM") %>\n' +
      ' */\n',
    },

    env: {
      test: {
        PATH: seleniumPath + ":process.env.PATH"
      }
    },

    connect: {
      options: {
        hostname: devURL,
        port: 9001
      },
      livereload: {
        options: {
          hostname: devURL,
          port: 9001,
          open: true
        }
      },
      test: {
        options: {
          hostname: devURL,
          port: 9001
        }
      }
    },

    ngconstant: {
      options: {
        space: '',
        wrap: '{%= __ngModule %}',
        name: 'config',
        constants: {
          siteConfig: {
            title: '',
            supportEmail: supportEmail
          }
        }
      },
      development: {
        options: {
          dest: 'config.js'
        },
        constants: {
          ENV: {
            name: 'development',
            baseURL: devURL,
            apiEndpoint: devApiURL
          }
        }
      },
      staging: {
        options: {
          dest: 'config.js'
        },
        constants: {
          ENV: {
            name: 'staging',
            baseURL: stagingURL,
            apiEndpoint: stagingApiURL
          }
        }
      },
      production: {
        options: {
          dest: 'config.js'
        },
        constants: {
          ENV: {
            name: 'production',
            baseURL: productionURL,
            apiEndpoint: productionApiURL
          }
        }
      }
    },

    watch: {
      main: {
        options: {
          livereload: true,
          livereloadOnError: false,
          spawn: false
        },
        files: [createFolderGlobs(['*.js', '*.less', '*.html']), '!_SpecRunner.html', '!.grunt'],
        tasks: [] //all the tasks are run dynamically during the watch event handler
      }
    },

    jshint: {
      main: {

        options: {
          jshintrc: '.jshintrc',
          reporter: require('jshint-stylish')
        },
        src: createFolderGlobs('*.js'),
        ignores: [
          'test-out/*'
        ]
      }
    },

    clean: {
      before: {
        src: ['dist', 'temp']
      },
      after: {
        src: ['temp']
      }
    },

    less: {
      production: {
        options: {},
        files: {
          'temp/app.css': 'app.less'
        }
      }
    },

    ngtemplates: {
      main: {
        options: {
          module: pkg.name,
          htmlmin: '<%= htmlmin.main.options %>'
        },
        src: [createFolderGlobs('*.html'), '!index.html', '!_SpecRunner.html', 'bower_components/angular-utils-pagination/dirPagination.tpl.html'],
        dest: 'temp/templates.js'
      }
    },

    copy: {
      main: {
        files: [
          {src: ['assets/**'], dest: 'dist/'},
          {src: ['bower_components/html5shiv/**'], dest: 'dist/'},
          {src: ['bower_components/respond/**'], dest: 'dist/'},
          {src: ['bower_components/es5-shim/**'], dest: 'dist/'},
          {src: ['bower_components/font-awesome/fonts/**'], dest: 'dist/', filter: 'isFile', expand: true},
          {src: ['bower_components/bootstrap/fonts/**'], dest: 'dist/', filter: 'isFile', expand: true},
          {src: ['bower_components/angular-ui-utils/ui-utils-ieshiv.min.js'], dest: 'dist/'},
          {src: ['bower_components/es5-shim/es5-shim.js'], dest: 'dist/'},
          {src: ['bower_components/json3/lib/json3.min.js'], dest: 'dist/'},
          {src: ['favicon.ico'], dest: 'dist/'}
          //{src: ['app/bower_components/select2/*.png','bower_components/select2/*.gif'], dest:'dist/css/',flatten:true,expand:true},
          //{src: ['app/bower_components/angular-mocks/angular-mocks.js'], dest: 'dist/'}
        ]
      }
    },

    dom_munger: {
      read: {
        options: {
          read: [
            {selector: 'script[data-concat!="false"]', attribute: 'src', writeto: 'appjs'},
            {selector: 'link[rel="stylesheet"][data-concat!="false"]', attribute: 'href', writeto: 'appcss'}
          ]
        },
        src: 'index.html'
      },
      update: {
        options: {
          remove: ['script[data-remove!="false"]', 'link[data-remove!="false"]'],
          append: [
            {selector: 'body', html: '<script src="app.full.min.js"></script>'},
            {selector: 'head', html: '<link rel="stylesheet" href="app.full.min.css">'}
          ]
        },
        src: 'index.html',
        dest: 'dist/index.html'
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0,
        banner: '<%= pvBanner.jscss %>'
      },
      main: {
        src: ['temp/app.css', '<%= dom_munger.data.appcss %>'],
        dest: 'dist/app.full.min.css'
      }
    },

    concat: {
      main: {
        src: ['<%= dom_munger.data.appjs %>', '<%= ngtemplates.main.dest %>'],
        dest: 'temp/app.full.js'
      }
    },

    ngAnnotate: {
      main: {
        src: 'temp/app.full.js',
        dest: 'temp/app.full.js'
      }
    },

    uglify: {
      main: {
        options: {
          banner: '<%= pvBanner.jscss %>',
          compress: false,
          sourceMap: false,
          sourceMapName: 'dist/app.full.min.js.map'
        },
        files: {
          'dist/app.full.min.js': ['temp/app.full.js']
        }
      }
    },

    htmlmin: {
      main: {
        options: {
          banner: '/*!\n *Last Updated: <%= grunt.template.today("dd-mm-yyyy @ HH:MM") %>\n */\n',
          collapseBooleanAttributes: false,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          removeComments: true,
          removeEmptyAttributes: false,
          removeScriptTypeAttributes: false,
          removeStyleLinkTypeAttributes: false
        },
        files: {
          'dist/index.html': 'dist/index.html'
        }
      }
    },

    karma: {
      options: {
        frameworks: ['jasmine'],
        reporters: ['junit', 'progress', 'coverage'],
        files: [  //this files data is also updated in the watch handler, if updated change there too
          '<%= dom_munger.data.appjs %>',
          'bower_components/angular-mocks/angular-mocks.js',
          createFolderGlobs('*-spec.js')
        ],
        preprocessors: {
          '{/,/!(node_modules|bower_components|dist|temp|assets|features|test-out)/**}/!(*-spec|app|config).js':['coverage']
        },
        logLevel: 'ERROR',
        autoWatch: false, //watching is handled by grunt-contrib-watch
        singleRun: true,
        plugins : [
          'karma-chrome-launcher',
          'karma-firefox-launcher',
          'karma-jasmine',
          'karma-junit-reporter',
          'karma-coverage'
        ],
        junitReporter : {
          outputFile: 'test-out/junit/junit.xml',
        },
        coverageReporter: {
          type: 'cobertura',
          dir: 'test-out/coverage',
          file: 'cobertura.txt'
        }
      },
      all_tests: {
        browsers: ['Chrome']
      },
      during_watch: {
        browsers: ['Chrome']
      }
    },

    cucumberjs: {
      files: 'e2e-tests/*.feature'
    },

    shell: {
      selenium: {
        command: './node_modules/protractor/bin/webdriver-manager start',
        options: {
          stdout: true
        }
      }
    },

    usebanner: {
      dist: {
        options: {
          position: 'top',
          process: function ( filepath ) {
            return grunt.template.process('<!--\n' +
            '  BBC Mobile Delivery Team\n' +
            '  ------------------------\n' +
            '  Project     : <%= pkg.name %>\n' +
            '  Version     : <%= pkg.version %>\n' +
            '  Description : <%= pkg.description %>\n' +
            '  Author      : <%= pkg.author %>\n' +
            '  Homepage    : <%= pkg.homepage %>\n' +
            '  Updated     : <%= grunt.template.today("dd-mm-yyyy @ HH:MM") %>\n' +
            '-->', { data: { pkg: pkg } });
          }
        },
        files: {
          src: [ 'dist/index.html' ]
        }
      }
    }
  });


  grunt.registerTask('serve', [
    'ngconstant:development',
    'dom_munger:read',
    'jshint',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('stage', [
    'ngconstant:staging',
    'jshint',
    'clean:before',
    'less',
    'dom_munger',
    'ngtemplates',
    'cssmin',
    'concat',
    'ngAnnotate',
    'uglify',
    'copy',
    'htmlmin',
    'clean:after'
  ]);

  grunt.registerTask('build', [
    'ngconstant:production',
    'jshint',
    'clean:before',
    'less',
    'dom_munger',
    'ngtemplates',
    'cssmin',
    'concat',
    'ngAnnotate',
    'uglify',
    'copy',
    'htmlmin',
    'clean:after'
  ]);

  grunt.registerTask('test', [
    'ngconstant:development',
    'connect:test',
    'dom_munger:read',
    'karma:all_tests'
  ]);

  grunt.registerTask('ftp', [
    'ftpscript'
  ]);

  grunt.event.on('watch', function (action, filepath) {
    //https://github.com/gruntjs/grunt-contrib-watch/issues/156

    var tasksToRun = [];

    if (filepath.lastIndexOf('.js') !== -1 && filepath.lastIndexOf('.js') === filepath.length - 3) {

      //lint the changed js file
      grunt.config('jshint.main.src', filepath);
      tasksToRun.push('jshint');

      //find the appropriate unit test for the changed file
      var spec = filepath;
      if (filepath.lastIndexOf('-spec.js') === -1 || filepath.lastIndexOf('-spec.js') !== filepath.length - 8) {
        spec = filepath.substring(0, filepath.length - 3) + '-spec.js';
      }

      //if the spec exists then lets run it
      if (grunt.file.exists(spec)) {
        var files = [].concat(grunt.config('dom_munger.data.appjs'));
        files.push('bower_components/angular-mocks/angular-mocks.js');
        files.push(spec);
        grunt.config('karma.options.files', files);
        tasksToRun.push('karma:during_watch');
      }
    }

    //if index.html changed, we need to reread the <script> tags so our next run of karma
    //will have the correct environment
    if (filepath === 'index.html') {
      tasksToRun.push('dom_munger:read');
    }

    grunt.config('watch.main.tasks', tasksToRun);

  });
};
