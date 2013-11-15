#!/usr/bin/env node

var async = require('async')
 , exec = require('child_process').exec	
 , fs = require('fs')
 , prompt = require('prompt')
 , PLUGIN_PREFIX = 'mediacenterjs-'
 , GIT_TEMPLATE_NAME = 'mediacenterjs-plugin-template'
 , GIT_TEMPLATE_URL = 'https://github.com/TerryMooreII/' +  GIT_TEMPLATE_NAME + '.git'
 //, basePath = __dirname + '/'
 , basePath = './'
 , answers;

var schema = {
    properties: {
		name: {
			description:'Plugin Name (Letters and Dashes only)',
			pattern: /^[a-zA-Z\-\s]+$/,
			message: 'Name must be only letters, spaces, or dashes',
			required: true
		},
		description: {
			description:'Short description of the plugin.',
			pattern: /^[a-zA-Z\-\s\.]+$/,
			message: 'Must be only letters, spaces, period or dashes',
			required: true
		},
		author: {
			description:'Author',
			required: true
		},
		keywords: {
			description:'Keywords (comma seperated)',
			required: true
		},
		repo: {
			description:'Plugins GitHub repo homepage (optional)',
			required: false
		},
    }
};

prompt.start();

async.waterfall([
	function(callback){
		prompt.get(schema, function(err, result){
			if (err)
				callback('Prompt error');
			else{
				console.log('Sit back and relex while we create your plug-in\'s skeleton...');
				callback(null, result);
				answers = result;
			}
		});
	},
	function(result, callback){
		var pluginName = formatPluginName(result.name);
		if (pluginName === null)
			callback('Unable to get the plugin name.');
		else
			callback(null, pluginName);
	},
	function(pluginName, callback){
		gitClonePluginTemplate(function(err, stdout, stderr){
			if (err){
				callback('Unable to download the plugin template. \n' + err);
				//process.exit(1);
			}else
				callback(null, pluginName)
		});
	},
	function(pluginName, callback){
		rename(basePath + GIT_TEMPLATE_NAME, basePath + '/' + pluginName, function(err){
			if (err){
				callback('Unable to rename plugin: ' + err);
				return;
			}

			callback(null, pluginName);
		})
	},
	function(pluginName, callback){
		var base = basePath + pluginName + '/views/';
		var oldFile = base + 'plugin-template.jade';
		var newFile = base + pluginName.replace(PLUGIN_PREFIX, '') + '.jade';
		rename(oldFile, newFile , function(err){
			if (err){
				callback('Unable to rename plugin: ' + err);
				return;
			}

			callback(null, pluginName);
		})
	},
	function(pluginName, callback){
		var base = basePath + pluginName + '/views/';
		var file = base + pluginName.replace(PLUGIN_PREFIX, '') + '.jade';

		findAndReplace(file, GIT_TEMPLATE_NAME, pluginName, function(err){
			if (err){
				callback(err);
				return;
			}
			callback(null, pluginName);
		})
	},
	function(pluginName, callback){
		var base = basePath + pluginName + '/';
		var file = base + 'index.js';

		findAndReplace(file, GIT_TEMPLATE_NAME.replace(PLUGIN_PREFIX, ''), pluginName.replace(PLUGIN_PREFIX, ''), function(err){
			if (err){
				callback(err);
				return;
			}
			callback(null, pluginName);
		})
	},
	function(pluginName, callback){
		var base = basePath + pluginName + '/';
		var oldFile = base + 'README.md';
		var newFile = base + 'INSTRUCTIONS.md';
		rename(oldFile, newFile , function(err){
			if (err){
				callback('Unable to rename README: ' + err);
				return;
			}

			callback(null, pluginName);
		})
	},
	function(pluginName, callback){
		createPackageJson(pluginName, function(err){
			if (err)
				return callback('Unable to create json file.')

			console.log('Plug-in created successfully.');
			console.log('Go forth and create something cool!');
			callback(null);
		})
	}
], function(err){
	if(err)
		console.log('Async error: ' + err);
});


var gitClonePluginTemplate = function(callback){
	exec('git clone ' + GIT_TEMPLATE_URL, callback);
};

var deleteItem = function(file, callback){
	fs.unlink(file, callback)
}

var rename = function(oldPath, newPath, callback){
	fs.rename(oldPath, newPath, callback);
};

var formatPluginName = function(pluginName){
	var name = pluginName.toLowerCase();
	name = name.replace(/ /g, '-');
	if (name.substr(0, PLUGIN_PREFIX.length) !== PLUGIN_PREFIX)
		name = PLUGIN_PREFIX + name;
	return name;
}


var findAndReplace = function(file, find, replace, callback){
	
	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			var msg = 'Unable to open file: ' + file + ' : ' + err;
			callback(msg);
			console.log(msg);
			return;
		}
		var findReplace = data.replace(new RegExp(find, 'g'), replace);

		fs.writeFile(file, findReplace, 'utf8', function (err) {
			if (err) {
				var msg = 'FindReplace: Unable to write file ' + err;
				callback(msg);
				console.log(msg)
				return;
			}
			callback();
		});
	});
}

var createPackageJson = function(pluginName, callback){
	var file = basePath + '/' + pluginName + '/package.json';
	var keywords;

	
	if (answers.keywords.indexOf('mediacenterjs') === -1){
	 	keywords = answers.keywords.split(',');
	 	keywords.push('mediacenterjs');
	}else{
		keywords = answers.keywords.split(',');
	}
	
	var json = {
	  "name": pluginName,
	  "version": "0.0.1",
	  "description": answers.description,
	  "keywords": keywords,
	  "homepage": answers.repo || "",
	  "bugs": {
	    "url": answers.repo ? answers.repo + "/issues" : ""
	  },
	  "author": {
	    "name": answers.author
	  },
	  "repository": {
	    "type": answers.repo ? "git" : "",
	    "url": answers.repo ? "git" + answers.repo.replace('https', "").replace('http', '') + ".git" : ""
	  },
	  "peerDependencies": {
	    "mediacenterjs": "*"
	  },
	  "licenses": [
	    {
	      "type": "MIT"
	    }
	  ]
	}

	fs.writeFile(file, JSON.stringify(json, null, 4), 'utf8', function (err) {
		if (err) {
			var msg = 'Package.json: Unable to write file ' + err;
			callback(msg);
			console.log(msg)
			return;
		}
		callback();
	});
	
}