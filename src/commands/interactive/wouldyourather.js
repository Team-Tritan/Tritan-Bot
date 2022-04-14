"use strict";

const { WouldYouRather } = require("weky");

module.exports = {
  name: "willyou",
  description: "Will you press the button?",
  category: "Interactive",
  async execute(message, args, client) {
    await WouldYouRather({
      message: message,
      embed: {
        title: "Would you rather... | Tritan Bot",
        color: message.client.config.embeds.embed_color,
        footer: `Requested by: ${message.author.tag}`,
        timestamp: true
      },
      thinkMessage: "One second...",
      othersMessage: "Only <@{{author}}> can use the buttons!",
      buttons: { optionA: "Option A", optionB: "Option B" }
    });
  }
};
