//Modified from https://stackoverflow.com/questions/47317747/handlebars-precompiled-to-plain-html
// Get a Handlebars instance
const hb = require('handlebars');
const fs = require('fs');
const path = require('path');
const layouts = require('handlebars-layouts');
const minify = require('html-minifier').minify;

// Register helpers
hb.registerHelper(layouts(hb));

//Get all existing templates
templates = getTemplatesRecursive('templates/');

function getTemplatesRecursive(filepath, templates) {
	templates = templates || [];
	if (!fs.existsSync(filepath)) return templates;
	if (fs.statSync(filepath).isDirectory()) {
		fs.readdirSync(filepath).filter(function(file) {
			getTemplatesRecursive(path.join(filepath, file), templates);
		});
	} else if (
		filepath.indexOf('.hbs') > -1 &&
		filepath.indexOf('partials') < 0
	) {
		templates.push(filepath);
	}
	return templates;
}

let tmplNames;

if (process.argv.length > 3) {
	console.error('Too much arguments');
	process.exit(1);
} else {
	if (process.argv[2] && templates.indexOf(process.argv[2]) != -1) {
		tmplNames = [process.argv[2]];
	} else {
		tmplNames = templates;
	}
}

//Register partials
var partialsDir = 'templates/partials';
var filenames = fs.readdirSync(partialsDir);

filenames.forEach(function(filename) {
	var matches = /^([^.]+).hbs$/.exec(filename);
	if (!matches) {
		return;
	}
	var name = matches[1];
	var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
	hb.registerPartial(name, template);
});

// Register helpers
hb.registerHelper('ifeq', function(a, b, opts) {
	if (a == b) return opts.fn(this);
	else return opts.inverse(this);
});

hb.registerHelper('each_upto', function(ary, max, options) {
	if (!ary || ary.length == 0) return options.inverse(this);

	var result = [];
	for (var i = 0; i < max && i < ary.length; ++i)
		result.push(options.fn(ary[i]));
	return result.join('');
});

for (tmplName of tmplNames) {
	// Load a template
	var template = fs.readFileSync(`${tmplName}`, 'utf8');

	// Get data
	const data = JSON.parse(fs.readFileSync('templates/data.json'));
	// Compile template
	var compiled = hb.compile(template);
	var html = compiled(data);
	var minified = minify(html, {
		removeEmptyAttributes: true,
		collapseWhitespace: true,
		removeComments: true,
	});

	// Write HTML file
	fs.writeFileSync(`dist/${path.basename(tmplName, '.hbs')}.html`, minified);
}
