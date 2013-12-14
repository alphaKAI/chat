/*
  main.js
*/
var app = require('http').createServer(handler)
  , io  = require('socket.io').listen(app)
  , fs  = require('fs')
  , mime= require('mime')
app.listen(3000);

function handler (req, res) {
  // Check File Path
  var path;
  if(req.url == '/') {
    path = './index.html';
  }
  else {
    path = '.' + req.url;
  }
  // Read File and Write
  fs.readFile(path, function (err, data) {
    if(err) {
      res.writeHead(404, {"Content-Type": "text/plain"});
      return res.end(req.url + ' not found.');
    }
    var type = mime.lookup(path);
    res.writeHead(200, {"Content-Type": type});
    res.write(data);
    res.end();
  });
}

io.sockets.on('connection', function (socket) {
  socket.on('post', function (data) {
    console.log(data);
    io.sockets.emit('post', data);
  });
});
