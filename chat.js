/*
  chat.js
*/
var app = require('http').createServer(handler)
  , io  = require('socket.io').listen(app).set('log level', 1)
  , fs  = require('fs')
  , mime= require('mime')

app.listen(3000);

function handler(req, res) {
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

function getOnlineUser(member) {
  var res = '';
  for(var key in member) {
    res += key.slice(0,6) + ' ';
  }
  return res;
}

io.sockets.on('connection', function (socket) {
  // Connect User
  console.log(socket.id + ' : connect');
  io.sockets.emit('join', { state: 1, id: socket.id.slice(0,6), online: getOnlineUser(socket.manager.open)});

  // Handling the post.
  socket.on('post', function (data) {
    console.log(socket.id+ ' : ' + data.text);
    
    io.sockets.emit('post', { name: data.name + '(' + socket.id.slice(0,6) + ')', text: data.text});
  });

  // Disconnect User
  socket.on('disconnect', function(){
    console.log(socket.id + ' : disconnect');
    io.sockets.emit('join', { status: 0, id: socket.id.slice(0,6), online: getOnlineUser(socket.manager.open)});
  });
});
