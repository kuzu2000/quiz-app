const { Server } = require('socket.io');

let io;
const users = {};

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
          origin: 'http://localhost:5173',
          methods: ['GET', 'POST'], 
          credentials: true,
        },
      });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    
    socket.on('registerUser', (userId) => {
        console.log(`Registering user with ID: ${userId}, socket ID: ${socket.id}`);
      users[userId] = socket.id; 
    });


    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          break;
        }
      }
    });
  });
};


const updateUserLevel = (userId, newLevel) => {
  const userSocketId = users[userId];
  if (userSocketId) {
    console.log(userSocketId + ' ' + newLevel)
    io.to(userSocketId).emit('levelUp', { newLevel });
  }
};

module.exports = { initSocket, updateUserLevel };