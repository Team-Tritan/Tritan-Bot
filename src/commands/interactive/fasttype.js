"use strict";

const { FastType } = require("weky");

module.exports = {
  name: "fasttype",
  description: "See how fast you can type a message!",
  category: "Interactive",
  async execute(message, args, client) {
    await FastType({
      message: message,
      embed: {
        title: "FastType | Tritan Bot",
        description: "You have **{{time}}** to type the below sentence.",
        color: message.client.config.embeds.embed_color,
        footer: `Requested by: ${message.author.tag}`,
        timestamp: true
      },
      sentence: "This is a sentence!",
      winMessage: "GG, you have a wpm of **{{wpm}}** and You made it in **{{time}}**.",
      loseMessage: "Better luck next time!",
      cancelMessage: "You ended the game!",
      time: 60000,
      buttonText: "Cancel",
      othersMessage: "Only <@{{author}}> can use the buttons!"
    });
  }
};
