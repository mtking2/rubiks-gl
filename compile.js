var fs = require('fs');
var sass = require('node-sass');

var sassSrc = 'styles/main.sass'
sass.render({
  file: sassSrc,
  outFile: "main.css",
}, function(error, result) { // node-style callback from v3.0.0 onwards
  if(!error){
    // No errors during the compilation, write this result on the disk
    fs.writeFile("main.css", result.css, function(err){
      if(!err){
        console.log('CREATE FILE: MAIN.CSS')
      }
    });
  }
});
