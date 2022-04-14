"use strict";

const { NeverHaveIEver } = require("weky");

module.exports = {
  name: "neverhaveiever",
  description: "Play never have I ever with your friends!",
  category: "Interactive",
  async execute(message, args, client) {
    await NeverHaveIEver({
      message: message,
      embed: {
        title: "Never Have I Ever | Tritan Bot",
        color: message.client.config.embeds.embed_color,
        footer: `Requested by: ${message.author.tag}`,
        timestamp: true
      },
      thinkMessage: "One second...",
      othersMessage: "Only <@{{author}}> can use the buttons!",
      buttons: { optionA: "Yes", optionB: "No" }
    });
  }
};
