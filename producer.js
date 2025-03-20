const amqp = require("amqplib");

async function sendMessageToQueue(messagePayload, groupId = "") {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");

    const channel = await connection.createChannel();
    const queue = "task_queue";

    await channel.assertQueue(queue, { durable: true });

    const messageData = {
      id: new Date().getTime(),
      userId: messagePayload.userId,
      email: messagePayload.email,
      content: messagePayload.content,
      groupId,
    };

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
