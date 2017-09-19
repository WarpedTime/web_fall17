const http = require('http');
const socketio = require('socket.io');

const fs = require('fs');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const square = {
  lastUpdate: new Date().getTime(),
  x: 0,
  y: 0,
  height: 100,
  width: 100,
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
  
  socket.on('movementUpdate', (data)=>{
    square.x += data.xUpdate; //should validate data
    square.y += data.yUpdate;
    square.lastUpdate = new Date().getTime();
    
    if(square.x > 500) square.x =0;
    if(square.y > 500) square.y =0;
    
    io.sockets.in('room1').emit('updatedMovement', square); //sent to all in room (including user). other is broadcast -> sent to all but user
  });
  
  socket.on('disconnect', ()=>{
    socket.leave('room1');
  });
});