const io = require("socket.io")(5000);
const dgram = require("dgram");
const udpClient = dgram.createSocket("udp4");

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("sendMessage", (data) => {
    console.log("Received message from web:", data);

    const message = Buffer.from(JSON.stringify(data));
    udpClient.send(message, 41234, "localhost", (err) => {
      if (err) console.error(err);
      console.log("Message sent via UDP");
    });
  });
});

// const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const messaging = admin.messaging();

server.on("message", (msg, rinfo) => {
  const data = JSON.parse(msg.toString());
  console.log("Received UDP message:", data);

  const message = {
    notification: {
      title: data.title,
      body: data.message,
    },
    token: "FCM_DEVICE_TOKEN", // Токен Web-застосунку
  };

  messaging
    .send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
});

server.bind(41234);
