"use strict";

const { Trivia } = require("weky");

module.exports = {
  name: "trivia2",
  description: "Play a game of trivia!",
  category: "Interactive",
  async execute(message, args, client) {
    await Trivia({
      message: message,
      embed: {
        title: "Trivia | Tritan Bot",
        description: "You only have **{{time}}** to guess the answer!",
        color: message.client.config.embeds.embed_color,
        footer: `Requested by: ${message.author.tag}`,
        timestamp: true
      },
      difficulty: "hard",
      thinkMessage: "Thinking...",
      winMessage: "GG, It was **{{answer}}**. You gave the correct answer in **{{time}}**.",
      loseMessage: "Better luck next time! The correct answer was **{{answer}}**.",
      emojis: {
        one: "1️⃣",
        two: "2️⃣",
        three: "3️⃣",
        four: "4️⃣"
      },
      othersMessage: "Only <@{{author}}> can use the buttons!",
      returnWinner: false
    });
  }
};
