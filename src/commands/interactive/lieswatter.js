"use strict";

const { LieSwatter } = require("weky");

module.exports = {
  name: "lieswatter",
  description: "Guess the lie!",
  category: "Interactive",
  async execute(message, args, client) {
    await LieSwatter({
      message: message,
      embed: {
        title: "Lie Swatter | Tritan Bot",
        color: message.client.config.embeds.embed_color,
        footer: `Requested by: ${message.author.tag}`,
        timestamp: true
      },
      thinkMessage: "One second...",
      winMessage: "GG, It was a **{{answer}}**. You got it correct in **{{time}}**.",
      loseMessage: "Better luck next time! It was a **{{answer}}**.",
      othersMessage: "Only <@{{author}}> can use the buttons!",
      buttons: { true: "Truth", lie: "Lie" }
    });
  }
};
