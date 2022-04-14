"use strict";

module.exports = {
  name: "copypasta",
  description: "Sends a funny nsfw copypasta",
  usage: "(Prefix)copypasta",
  category: "Fun",
  premium: true,
  nsfw: true,
  async execute(message, client) {
    return message.channel.send(
      `${message.client.copypastas[Math.floor(Math.random() * message.client.copypastas.length)]}`
    );
  }
};
