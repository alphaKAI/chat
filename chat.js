/*
  chat.js
*/
var app = require('http').createServer(handler)
  , io  = require('socket.io').listen(app).set('log level', 1)
  , fs  = require('fs')
  , mime= require('mime')
  , crypto = require('crypto')

app.listen(3000);

function handler (req, res) {
  // Check File Path
  var path;
  if(req.url == '/') {
    path = './files/index.html';
  }
  else {
    path = './files' + req.url;
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

var createId = function(key) {
  var hmac = crypto.createHmac('sha256', 'Z7%nKu8&i9,2');
  hmac.update(key);
  return hmac.digest('hex').slice(0,12);
}; 

io.sockets.on('connection', function (socket) {

  console.log(socket.handshake.address.address);
  io.sockets.emit('join', { state: 1, id: createId(socket.handshake.address.address)});

  socket.on('post', function (data) {
    console.log(createId(socket.handshake.address.address) + ' : ' + data.text);
    io.sockets.emit('post', { name: data.name + '(' + createId(socket.handshake.address.address) + ')', text: data.text});
  });

  socket.on('disconnect', function(){
    io.sockets.emit('join', { status: 0, id: createId(socket.handshake.address.address)});
  });
});
