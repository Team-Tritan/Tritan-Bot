"use strict";

const { WillYouPressTheButton } = require("weky");

module.exports = {
  name: "willyou",
  description: "Will you press the button?",
  category: "Interactive",
  async execute(message, args, client) {
    await WillYouPressTheButton({
      message: message,
      embed: {
        title: "Will you press the button? | Tritan Bot",
        description: "```{{statement1}}```\n**but**\n\n```{{statement2}}```",
        color: message.client.config.embeds.embed_color,
        footer: `Requested by: ${message.author.tag}`,
        timestamp: true
      },
      button: { yes: "Yes", no: "No" },
      thinkMessage: "Thinking...",
      othersMessage: "Only <@{{author}}> can use the buttons!"
    });
  }
};
