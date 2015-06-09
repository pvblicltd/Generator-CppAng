'use strict';
var util = require('util');
var path = require('path');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');
var cgUtils = require('../utils.js');

var BBCWebGenerator = module.exports = function BBCWebGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

  this.on('end', function () {
    this.config.set('partialDirectory', 'partial/');
    this.config.set('modalDirectory', 'partial/');
    this.config.set('directiveDirectory', 'directive/');
    this.config.set('filterDirectory', 'filter/');
    this.config.set('serviceDirectory', 'service/');
    this.config.set('generatorVersion', this.pkg.version);
    var inject = {
      js: {
        file: 'index.html',
        marker: cgUtils.JS_MARKER,
        template: '<script src="<%= filename %>"></script>'
      },
      less: {
        relativeToModule: true,
        file: '<%= module %>.less',
        marker: cgUtils.LESS_MARKER,
        template: '@import "<%= filename %>";'
      }
    };
    this.config.set('inject', inject);
    this.config.save();
    this.installDependencies({skipInstall: options['skip-install']});
  });

};

util.inherits(BBCWebGenerator, yeoman.generators.Base);

BBCWebGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [{
    name: 'appname',
    message: 'What would you like the angular app/module name to be?',
    default: path.basename(process.cwd())
  }];

  this.prompt(prompts, function (props) {
    this.appname = props.appname;
    cb();
  }.bind(this));
};

BBCWebGenerator.prototype.askForUiRouter = function askFor() {
  var cb = this.async();

  var prompts = [{
    name: 'router',
    type: 'list',
    message: 'Which router would you like to use?',
    default: 0,
    choices: ['Angular UI Router', 'Standard Angular Router']
  }];

  this.prompt(prompts, function (props) {
    if (props.router === 'Angular UI Router') {
      this.uirouter = true;
      this.routerJs = 'bower_components/angular-ui-router/release/angular-ui-router.min.js';
      this.routerModuleName = 'ui.router';
      this.routerViewDirective = 'ui-view';
    } else {
      this.uirouter = false;
      this.routerJs = 'bower_components/angular-route/angular-route.js';
      this.routerModuleName = 'ngRoute';
      this.routerViewDirective = 'ng-view';
    }
    this.config.set('uirouter', this.uirouter);
    cb();
  }.bind(this));
};


BBCWebGenerator.prototype.askForMaterial = function askFor() {
  var cb = this.async();

  var prompts = [{
    name: 'ngmaterial',
    type: 'confirm',
    message: 'Do you want to include Angular Material?',
    default: false
  }];

  this.prompt(prompts, function (props) {
    this.ngmaterial = props.ngmaterial;
    this.config.set('ngmaterial', this.ngmaterial);
    cb();
  }.bind(this));
};

BBCWebGenerator.prototype.app = function app() {
  this.directory('skeleton/', './');
};
