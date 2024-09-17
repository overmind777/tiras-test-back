const dgram = require("dgram");
const admin = require("firebase-admin");
const { createServer } = require("http");

// Ініціалізація Firebase Admin SDK
const serviceAccount = require("./tiras-test-firebase-adminsdk-j7ysu-38a52e03b6.json"); // Замість цього вкажіть шлях до вашого файлу ключа
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const messaging = admin.messaging();
const udpServer = dgram.createSocket("udp4");

// Функція для відправлення повідомлення через FCM
async function sendFCMMessage(data) {
  console.log(data);
  const message = {
    notification: {
      title: data.title,
      body: data.text,
    },
    // Вкажіть токен або підписку, на яку потрібно надіслати повідомлення
    token: data.token, // Замініть на реальний токен або використовуйте підписку
  };

  try {
    console.log('message: ', message);
    await messaging.send(message);
    console.log('FCM повідомлення відправлено');
  } catch (error) {
    console.error('Помилка при відправці FCM повідомлення:', error);
  }
}

// Обробка отриманого UDP повідомлення
udpServer.on("message", (message, remote) => {
  console.log(`Отримано повідомлення з ${remote.address}:${remote.port} - ${message}`);
  const data = JSON.parse(message.toString());

  // Відправка повідомлення через FCM
  sendFCMMessage(data);
});

// Запуск UDP сервера
udpServer.bind(3001, () => {
  console.log("UDP сервер на сервер2 запущений на порту 3001");
});
