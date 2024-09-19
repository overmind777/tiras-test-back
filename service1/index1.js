import { Server } from "socket.io";
import { createServer } from "http";
import dgram from "dgram";

const udpClient = dgram.createSocket("udp4");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

function sendUdpMessage(msg) {
  udpClient.send(msg, 6005, "service2", (error) => {
    if (error) {
      console.error("Помилка при відправці UDP:", error);
    } else {
      console.log("UDP повідомлення відправлено");
    }
  });
}

io.on("connection", (socket) => {
  socket.on("sendMessage", (msg) => {
    const message = Buffer.from(JSON.stringify(msg));
    sendUdpMessage(message);
    
    socket.on("connection", () => {
      console.log("Клієнт підключився:", socket.id);

    });
  });

})
httpServer.listen(5005, () => {
  console.log("Socket.io сервер на сервер1 запущений 5005");
});