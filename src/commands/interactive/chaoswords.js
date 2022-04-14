"use strict";

const { ChaosWords } = require("weky"),
  randomWords = require("random-words");

module.exports = {
  name: "chaoswords",
  description: "A game where you find a random word with a random length!",
  category: "Interactive",
  async execute(message, args, client) {
    const words = randomWords(3); // generating 2 words
    await ChaosWords({
      message: message,
      embed: {
        title: "ChaosWords | Tritan Bot",
        description: "You have **{{time}}** to find the hidden words in the below sentence.",
        color: message.client.config.embeds.embed_color,
        field1: "Sentence:",
        field2: "Words Found/Remaining Words:",
        field3: "Words found:",
        field4: "Words:",
        footer: `Requested by: ${message.author.tag}`,
        timestamp: true
      },
      winMessage: "GG, You won! You made it in **{{time}}**.",
      loseMessage: "Better luck next time!",
      wrongWordMessage: "Wrong Guess! You have **{{remaining_tries}}** tries left.",
      correctWordMessage: "GG, **{{word}}** was correct! You have to find **{{remaining}}** more word(s).",
      time: 60000,
      words: words,
      charGenerated: 17,
      maxTries: 10,
      buttonText: "Cancel",
      othersMessage: "Only <@{{author}}> can use the buttons!"
    });
  }
};
