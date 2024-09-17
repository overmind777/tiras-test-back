const {
  initializeApp,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const { Server } = require("socket.io");
const { createServer } = require("http");
const serviceAccount = require("./tiras-test-firebase-adminsdk-j7ysu-8c3da97472.json")

const dgram = require("dgram");
const udpClient = dgram.createSocket("udp4");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*"
  },
});

const sendMessage = (message, port, host) => {
  const messageBuffer = Buffer.from(message);

  udpClient.send(messageBuffer, port, host, (err) => {
    if (err) {
      console.error("Помилка при відправці повідомлення:", err);
    } else {
      console.log("Повідомлення відправлено:", message);
    }
  });
}

io.on("connection", (socket) => {
  console.log("Клієнт підключений:", socket.id);

  // Обробляємо повідомлення від клієнта
  socket.on("sendMessage", async (data) => {
    console.log("Отримано повідомлення:", data);
    // Записуємо повідомлення в Firestore
    const dbRef = await db.collection("messages").add({
      title: data.title,
      text: data.text,
    });

    const message = JSON.stringify(data);
    sendMessage(message, 3001, "127.0.0.1");
  });
});

server.listen(3000, () => {
  console.log("Socket.io сервер на сервер1 запущений 3000");
});

exports.socketServer1 = functions.https.onRequest(server);
