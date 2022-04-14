"use strict";

const { QuickClick } = require("weky");

module.exports = {
  name: "quickclick",
  description: "How fact can you click it?",
  category: "Interactive",
  async execute(message, args, client) {
    await QuickClick({
      message: message,
      embed: {
        title: "Quick Click | Tritan Bot",
        color: message.client.config.embeds.embed_color,
        footer: `Requested by: ${message.author.tag}`,
        timestamp: true
      },
      time: 60000,
      waitMessage: "The buttons may appear anytime now!",
      startMessage: "First person to press the correct button will win. You have **{{time}}**!",
      winMessage: "GG, <@{{winner}}> pressed the button in **{{time}} seconds**.",
      loseMessage: "No one pressed the button in time. So, I dropped the game!",
      emoji: "👆",
      ongoingMessage: "A game is already runnning in <#{{channel}}>. You can't start a new one!"
    });
  }
};
