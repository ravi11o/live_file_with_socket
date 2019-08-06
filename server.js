var express = require('express');
var fs = require('fs');
var app = express();


const server = require('http').createServer(app);

const io = require('socket.io')(server);

var lines = 10;

io.on('connection', (socket) => {
  var newdata = readFileContent();
  socket.emit('changed', newdata);

  socket.on('lines', (line) => {
    lines = line || 10;
    var newdata = readFileContent();
    socket.emit('changed', newdata);
  })
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

fs.watchFile('text.txt',{persistent:true, interval:1000}, (data) => { 
  var newdata = readFileContent();
  io.sockets.emit('changed', newdata);
});



function readFileContent() {
  var fileData = fs.readFileSync('text.txt', 'utf8');
  fileData = fileData.trim().split('\n');
  return fileData.length > lines ?
    fileData.slice(fileData.length - lines)
  :
    fileData
}

server.listen(3000, () => {
  console.log('listening on port 3000');
})