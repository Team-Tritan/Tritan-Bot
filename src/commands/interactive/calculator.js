"use strict";

const { Calculator } = require("weky");

module.exports = {
  name: "calculator",
  description: "Calculate something",
  category: "Interactive",
  async execute(message, args, client) {
    await Calculator({
      message: message,
      embed: {
        title: "Calculator | Tritan Bot",
        color: message.client.config.embeds.embed_color,
        footer: `Requested by: ${message.author.tag}`,
        timestamp: true
      },
      disabledQuery: "Calculator is disabled!",
      invalidQuery: "The provided equation is invalid!",
      othersMessage: "Only <@{{author}}> can use the buttons!"
    });
  }
};
