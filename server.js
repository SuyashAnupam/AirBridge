const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files (HTML, JS, CSS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io signalling logic
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  // Forward any signalling data (offer, answer, ICE candidates) to all other peers
  socket.on('signal', (data) => {
    // Broadcast to every socket except the sender
    socket.broadcast.emit('signal', {
      from: socket.id,
      ...data,
    });
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Signalling server running at http://localhost:${PORT}`);
});
