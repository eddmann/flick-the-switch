var express = require('express'),
    stylus  = require('stylus'),
    minj    = require('minj');
    
var app = express.createServer();

function compile (str, path) {
  return stylus (str)
    .set('filename', path)
    .set('compress', true)
}

app.configure(function () {
  app.use(stylus.middleware({ src: __dirname, compile: compile }));
  app.use(minj.middleware({ src: __dirname }));
  app.use(express.static(__dirname));
});

app.listen(3000);
