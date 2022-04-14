"use strict";

const { Snake } = require("weky");

module.exports = {
  name: "snake",
  description: "Play snake with your friends!",
  category: "Interactive",
  async execute(message, args, client) {
    await Snake({
      message: message,
      embed: {
        title: "Snake | Tritan Bot",
        description: "GG, you scored **{{score}}** points!",
        color: message.client.config.embeds.embed_color,
        footer: `Requested by: ${message.author.tag}`,
        timestamp: true
      },
      emojis: {
        empty: "⬛",
        snakeBody: "🟩",
        food: "🍎",
        up: "⬆️",
        right: "⬅️",
        down: "⬇️",
        left: "➡️"
      },
      othersMessage: "Only <@{{author}}> can use the buttons!",
      buttonText: "Cancel"
    });
  }
};
