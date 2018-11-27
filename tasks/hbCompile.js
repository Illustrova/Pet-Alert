//Modified from https://stackoverflow.com/questions/47317747/handlebars-precompiled-to-plain-html
// Get a Handlebars instance
const hb = require("handlebars");
const fs = require("fs");
const path = require("path");
var layouts = require("handlebars-layouts");

// Register helpers
hb.registerHelper(layouts(hb));

//Get all existing templates
templates = fs.readdirSync("templates").filter(function (file) {
    if (file.indexOf(".hbs") > -1) return file;
});

let tmplNames;

if (process.argv.length > 3) {
    console.error("Too much arguments");
    return;
}
else {
    if (process.argv[2] && (templates.indexOf(tmplName + ".hbs")) != -1) {
        tmplNames = [process.argv[2]];
    }
    else {
        tmplNames = templates;
    }
}

//Register partials
var partialsDir = 'templates/partials';
var filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
    var matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
        return;
    }
    var name = matches[1];
    var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
    hb.registerPartial(name, template);
});

// Register helpers

hb.registerHelper('ifeq', function (a, b, opts) {
    if (a == b)
        return opts.fn(this);
    else
        return opts.inverse(this);
});


hb.registerHelper('each_upto', function(ary, max, options) {
    if(!ary || ary.length == 0)
        return options.inverse(this);

    var result = [ ];
    for(var i = 0; i < max && i < ary.length; ++i)
        result.push(options.fn(ary[i]));
    return result.join('');
});

for (tmplName of tmplNames) {
    // Load a template
    var template = fs.readFileSync(`templates/${tmplName}`, 'utf8');

    // Get data
    const data = JSON.parse(fs.readFileSync("templates/data.json"));
    // Compile template
    var compiled = hb.compile(template);
    var html = compiled(data);

    // Write HTML file
    fs.writeFileSync(`dist/${path.basename(tmplName, ".hbs")}.html`, html);
}
