const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

let score = 0;

const onRequest = (req, res) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if(err){
      throw err;
    }
    console.log(data);
    
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
};

//create main server
const app = http.createServer(onRequest);
app.listen(PORT);

const io = socketio(app); // pass server to socket io

//.on event 'connection' whenever someone connects to socket
//kind of like singleton, but not really; its persistant, but can make more than one
//because of this memory management becomes more important with scale
io.on('connection', (socket) =>{
  //room is hardcoded now but can be dynamic
  socket.join('room1'); //socket.io pattern for adding user to collection, an array of socket connections
  
  //custom name *just avoid built in names
  socket.on('updateScore', (data) => { //when this user sends message
    score += data; //security flaw
    
    io.sockets.in('room1').emit('updated', score); //send message to all users in room1
    
  });
  
  socket.on('disconnect', ()=> { //does not remove socket 
    socket.leave('room1'); //remove user from room
  });
});

console.log(`Listening on port ${PORT}`);