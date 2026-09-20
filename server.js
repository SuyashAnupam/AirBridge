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

// Keep a simple list of connected sockets
let peers = [];

io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);
  peers.push(socket.id);

  // If there is already another peer, tell both that they can start signalling
  if (peers.length > 1) {
    // Notify the newly connected client about the existing peer(s)
    socket.emit('ready', { peers: peers.filter(id => id !== socket.id) });
    // Notify existing peers about the new client
    socket.broadcast.emit('ready', { peers: [socket.id] });
  } else {
    // First client – just wait for another peer
    socket.emit('ready', { peers: [] });
  }

  // Forward signalling messages to the intended recipient (if provided)
  socket.on('signal', (data) => {
    const targetId = data.to;
    if (targetId) {
      // Send only to the specified peer
      io.to(targetId).emit('signal', {
        from: socket.id,
        type: data.type,
        payload: data.payload,
      });
    } else {
      // Fallback: broadcast to everyone except sender
      socket.broadcast.emit('signal', {
        from: socket.id,
        type: data.type,
        payload: data.payload,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
    peers = peers.filter(id => id !== socket.id);
    // Inform remaining peers that this one left
    socket.broadcast.emit('peer-left', { id: socket.id });
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Signalling server running at http://localhost:${PORT}`);
});
