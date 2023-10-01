  const messageController = require("../controllers/messageController");
  const jwt = require("jsonwebtoken");
  require("dotenv").config();

  module.exports = (io) => {
    io.use((socket, next) => {
      const token = socket.handshake.query.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      jwt.verify(token, process.env.JWT_AUTH_KEY, (err, decoded) => {
        if (err) return next(new Error("Authentication error"));
        socket.decoded = decoded;
        next();
      });
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("joinGroup", (groupId) => {
        console.log(`User ${socket.id} joined group ${groupId}`);
        socket.join(groupId);
      });

      socket.on("sendMessage", async (data) => {
        try {
          console.log("send msg",data)
          const { groupId, message, file } = data;
          const user = socket.decoded;
          const newMessage = await messageController.postMessage(user, groupId, message, file);
          // console.log("file send message",file);
          io.to(groupId).emit('newMessage', newMessage);
        } catch (error) {
          console.error("Error handling sendMessage in socket:", error.message);
          socket.emit('messageError', { error: 'Failed to send the message.' });
        }
      });
      
      socket.on("sendFile", (data) => {
        io.to(data.groupId).emit('newMessage');
      });
      
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  };
