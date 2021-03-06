"use strict";

var path = require('path');
var csso = require('csso');
var grunt = require('grunt');
var compileCSSFile = require('../tasks/lib/css').compileCSSFile;
var frontend = require('../tasks/lib/frontend').init(grunt);

function pathResolver(file, originalFile) {
	var dirname = originalFile ? path.dirname(originalFile) : __dirname;
	if (file.charAt(0) == '/') {
		// resolve absolute file include
		file = file.replace(/^\/+/, '');
		dirname = __dirname;
	}
	return path.resolve(dirname, file);
}

exports.cssCompiler = function(test) {
	var compiledCSS = compileCSSFile(pathResolver('css/test.css'), pathResolver);
	test.ok(compiledCSS.length > 0, 'Got compiled CSS');
	test.ok(!/@import/.test(compiledCSS), 'No imports');

	test.done();
};

var config = {
	webroot: path.join(__dirname, 'out'),
	srcWebroot: __dirname
};

exports.testGrunt = {
	css: function(test) {
		var payload = {
			src: pathResolver('css'),
			dest: pathResolver('out/css')
		};
		var catalog = frontend.compileCSS(payload, config);
		// var catalog = grunt.helper('frontend-css', payload, config);

		test.ok(catalog, 'CSS compiled successfully');
		test.ok('/css/test-utf.css' in catalog, 'Has test-utf.css');
		test.ok('/css/test.css' in catalog, 'Has test.css');

		test.done();
	},

	cssSingle: function(test) {
		var payload = {};
		payload[pathResolver('out/css/single.css')] = pathResolver('css/test-utf.css');

		var catalog = frontend.compileCSSFile(payload, config);
		// var catalog = grunt.helper('frontend-css-file', payload, config);

		test.ok(catalog, 'Single CSS compiled successfully');
		test.ok('/css/single.css' in catalog, 'Has single.css');

		test.done();	
	},

	js: function(test) {
		var payload = {
			files: {
				'test/out/js/f.js': [
					'test/js/file1.js',
					'test/js/file2.js'
				]
			}
		};

		var catalog = frontend.compileJS(payload, config);
		// var catalog = grunt.helper('frontend-js', payload, config);

		test.ok(catalog, 'JS compiled successfully');
		test.ok('/js/f.js' in catalog, 'Has f.js');
		
		test.done();
	}
};