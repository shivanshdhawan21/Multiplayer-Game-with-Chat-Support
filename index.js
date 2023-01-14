const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }
});
const users={};
io.on('connection',socket =>{
    socket.on('new-user-joined',name=>{
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    });
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,name:users[socket.id]});
    });
    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
    socket.on('emojiInp',message=>{
        socket.broadcast.emit('emojiInp',{message:message,name:users[socket.id]})
    });
    socket.on('chance',(id,turn,turn_number)=>{
        socket.broadcast.emit('your_chance',{id,turn,turn_number});
    });
    socket.on('reset',()=>{
        socket.broadcast.emit("reset_game");
    })
})