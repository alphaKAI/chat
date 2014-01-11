/*
  chat.js
*/
var app     = require('http').createServer(handler)
  , io      = require('socket.io').listen(app).set('log level', 1)
  , fs      = require('fs')
  , mime    = require('mime')
  , crypto  = require('crypto')
  , mysql   = require('mysql')

app.listen(3000);

var connection = mysql.createConnection({
  host: '',
  database: '',
  user: '',
  password: ''
});

function handler(req, res) {
  // Check File Path
  var path;
  if(req.url == '/') {
    path = './www/index.html';
  }
  else {
    path = './www' + req.url;
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
  return hmac.digest('hex').slice(0,6);
};

function getOnlineUser(member) {
  var res = '';
  for(var key in member) {
    res += key.slice(0,6) + ' ';
  }
  return res;
}

io.sockets.on('connection', function (socket) {
  // Connect User
  console.log(socket.handshake.address.address + ' : connect');

  // Read DB.
  var query = connection.query('select * from chat_logs', function(err, results) {
    if(err) {
      console.log(err);
    }

    // Emit archives
    var cnt;
    if(results.length < 51) {
      for(cnt = 0; cnt < results.length; cnt++) {
        socket.emit('post', { id: results[cnt].id, date: results[cnt].date, ip: createId(results[cnt].ip), name: results[cnt].name, text: results[cnt].text });
      }
    }
    else {
      for(cnt = results.length - 51; cnt < results.length; cnt++) {
        socket.emit('post', { id: results[cnt].id, date: results[cnt].date, ip: createId(results[cnt].ip), name: results[cnt].name, text: results[cnt].text });
      }
    }
    io.sockets.emit('join', { state: 1, ip: createId(socket.handshake.address.address), online: getOnlineUser(socket.manager.open)});
  });

  // Handling the post.
  socket.on('post', function (data) {
    // Write to the DB.
    var date = new Date();
    var query = connection.query("insert into chat_logs (date,ip,name,text) value('" + date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "','" + socket.handshake.address.address + "','" + data.name + "','" + data.text + "')", function(err) {
      if(err) {
        console.log(err);
      }
    });

    // Read DB.
    var query = connection.query('select * from chat_logs', function(err, results) {
      if(err) {
        console.log(err);
      }

      // Write to the Log.
      console.log(results[results.length - 1].ip + '(' + results[results.length - 1].name + ') : ' + results[results.length - 1].text);

      // Emit the post.
      io.sockets.emit('post', { id: results[results.length - 1].id, date: results[results.length - 1].date, ip: createId(results[results.length - 1].ip), name: results[results.length - 1].name, text: results[results.length - 1].text });
    });

  });

  // Disconnect User
  socket.on('disconnect', function(){
    console.log(socket.handshake.address.address + ' : disconnect');
    io.sockets.emit('join', { status: 0, ip: createId(socket.handshake.address.address), online: getOnlineUser(socket.manager.open)});
  });
});
