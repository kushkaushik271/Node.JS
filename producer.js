const amqp = require("amqplib");
require('dotenv').config()

async function sendMessageToQueue(messagePayload) {
  try {
    const connection = await amqp.connect(process.env.REDIS_URL);

    const channel = await connection.createChannel();
    const queue = "task_queue";

    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(messageData)), {
      persistent: true,
      messageId: messageData.id.toString(),
      headers: { userId: messageData.userId },
    });

    setTimeout(() => connection.close(), 500);
  } catch (error) {
    console.log(error.message);
    console.error("RabbitMQ Error:", error);
  }
}

module.exports = sendMessageToQueue;
