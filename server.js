var fs = require('fs');
var http = require('http');

const server = http.createServer(handleRequest);

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


function handleRequest(req, res) {
  if(req.url === '/' && req.method === 'GET') {
    fs.createReadStream('./index.html').pipe(res);
  } else {
    res.end('Page Not Found')
  }
}

fs.watchFile('text.txt', {persistent:true, interval:1000}, (_data) => { 
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