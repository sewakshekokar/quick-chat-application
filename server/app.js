const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();

const authRouter = require('./controllers/authController');
const userRouter = require('./controllers/userController');
const chatRouter = require('./controllers/chatController');
const messageRouter = require('./controllers/messageController');

// Allow both local and deployed frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://quick-chat-frontend.onrender.com"  // change to your actual frontend domain
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));

const server = require('http').createServer(app);

// Socket.io setup with same CORS
const io = require('socket.io')(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

const onlineUser = [];

// SOCKET EVENTS
io.on('connection', socket => {
  socket.on('join-room', userid => {
    socket.join(userid);
  });

  socket.on('send-message', (message) => {
    io.to(message.members[0])
      .to(message.members[1])
      .emit('receive-message', message);

    io.to(message.members[0])
      .to(message.members[1])
      .emit('set-message-count', message);
  });

  socket.on('clear-unread-messages', data => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit('message-count-cleared', data);
  });

  socket.on('user-typing', (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit('started-typing', data);
  });

  socket.on('user-login', userId => {
    if (!onlineUser.includes(userId)) {
      onlineUser.push(userId);
    }
    socket.emit('online-users', onlineUser);
  });

  socket.on('user-offline', userId => {
    onlineUser.splice(onlineUser.indexOf(userId), 1);
    io.emit('online-users-updated', onlineUser);
  });
});

// Serve React client build (if deployed as single service)
try {
  const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
  if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  }
} catch (err) {
  console.error('Error while trying to set up static client serving:', err);
}

module.exports = server;
