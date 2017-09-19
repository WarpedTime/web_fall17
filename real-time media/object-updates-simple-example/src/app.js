const http = require('http');
const socketio = require('socket.io');

const fs = require('fs');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const square = {
  lastUpdate: new Date().getTime(),
  x: 0,
  y: 0,
  height: 10,
  width: 10,
}

const handler = (req, res) => {
  
  fs.readFile(`${__dirname}/../client/index.html`,(err, data) =>{
    
    if(err){
      throw err;
    }
    
    res.writeHead(200);
    res.write(data);
    res.end();
  })
};

const app = http.createServer(handler);
const io = socketio(app);

app.listen(PORT);

//circular reference: socket contains reference to io server

io.on('connection', (socket) => {
  socket.join('room1');
  
  socket.on('move')
  
  socket.on('disconnect', ()=>{
    socket.leave('room1');
  });
});