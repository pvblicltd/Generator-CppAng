/*global describe, beforeEach, it*/
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;


describe('cpp.ui generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('bbcweb:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      // add files you expect to exist here.
      '.jshintrc',
      '.editorconfig'
    ];

    helpers.mockPrompt(this.app, {
      'appname': 'testBBC'
    });
    this.app.options['skip-install'] = false;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
