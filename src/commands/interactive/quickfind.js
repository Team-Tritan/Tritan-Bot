"use strict";

const { QuickFind } = require("weky");

module.exports = {
  name: "quickfind",
  description: "How fast can you find the thing?",
  category: "Interactive",
  async execute(message, args, client) {
    await QuickFind({
      message: message,
      embed: {
        title: "Quick Find | Tritan Bot",
        color: message.client.config.embeds.embed_color,
        footer: `Requested by: ${message.author.tag}`,
        timestamp: true
      },
      backgroundhex: "f5f5f5", // Without "#"
      texthex: "5865F2", // Without "#"
      textlength: 7,
      time: 60000,
      waitMessage: "The buttons may appear anytime now!",
      startMessage: "First person to press the correct button will win. You have **{{time}}**!",
      winMessage: "GG, <@{{winner}}> pressed the button in **{{time}} seconds**.",
      loseMessage: "No one pressed the button in time. So, I dropped the game!",
      ongoingMessage: "A game is already runnning in <#{{channel}}>. You can't start a new one!"
    });
  }
};
