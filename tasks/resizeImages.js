const sharp = require("sharp");
var glob = require("glob");
const path = require("path");
const mkdirp = require('mkdirp');

if (process.argv.length > 4) {
    console.error("Too much arguments");
    return;
}
else if (process.argv < 1) {
    console.error("You have to specify file path");
    return;
}
else {
    globString = process.argv[2];
    files=globString;
    
    outputDir = process.argv[3] ? path.join(__dirname + "/../", process.argv[3]): "" ;
}

glob(files, function (err, files) {
    for (file of files) {
        relGlobPath = globString.substring(0, globString.indexOf("*"));
        newFile = path.join(outputDir, path.relative(relGlobPath, file));
            //Create directory
            mkdirp(path.dirname(newFile));
            sharp(path.normalize(file))
                .resize(600)
                .toFile(newFile, function (err) {
                    if (err) {
                        console.log(err)
                    }
                });
        }
});


