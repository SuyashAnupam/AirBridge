const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  // Reduce default ping interval to keep connection health tight (helps latency)
  pingInterval: 10000,
  pingTimeout: 5000,
});

const PORT = process.env.PORT || 3000;

// Serve static files (HTML, JS, CSS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io signalling logic
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  // Forward any signalling data (offer, answer, ICE candidates) to all other peers
  socket.on('signal', (data) => {
    console.log(`🔄 Signal (${data.type}) from ${socket.id}`);
    // Broadcast to every socket except the sender
    socket.broadcast.emit('signal', {
      from: socket.id,
      ...data,
    });
  });

  // Simple ping‑pong for latency measurement
  socket.on('ping', (payload) => {
    // Echo back the same timestamp
    socket.emit('pong', payload);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Signalling server running at http://localhost:${PORT}`);
});
