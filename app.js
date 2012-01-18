var http = require('http'),
  url = require('url'),
  path = require('path'),
  fs = require('fs');

var port = process.env.VCAP_APP_PORT || 8001;

var content_type = function(filename) {
  switch(path.extname(filename)) {
    case ".png": return "image/png";
    case ".html": return "text/html";
    case ".css": return "text/css";
    case ".js": return "application/javascript";
  }
  return "";
};

var serve_file = function(res,filename) {
  fs.readFile(filename, "binary", function(err, data) {
    if (err) {        
      res.writeHead(500, {"Content-Type": "text/plain"});
      res.end("500 Internal Error");
    } else {
      res.writeHead(200, { "Content-Type": content_type(filename)});
      res.write(data,"binary");
      res.end();
    }
  });
}

http.createServer(function (req, res) {

  var pathname  = url.parse(req.url).pathname;
  var filename = path.join(__dirname, "public", pathname);
  fs.stat(filename, function(err,stat) {
    if ( err ) {
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.end("404 Not Found");
    } else {
      if ( stat.isDirectory() ) {
        serve_file(res,path.join(filename,"index.html"));
      } else {
        serve_file(res,filename);
      }      
    }
  });

}).listen(port);

console.log("Server listening on port " + port);
