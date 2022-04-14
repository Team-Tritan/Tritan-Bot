"use strict";

const { ShuffleGuess } = require("weky"),
  randomWords = require("random-words"),
  word = randomWords();

module.exports = {
  name: "shuffleguess",
  description: "Guess a shuffled word!",
  category: "Interactive",
  async execute(message, args, client) {
    await ShuffleGuess({
      message: message,
      embed: {
        title: "Shuffle Guess | Tritan Bot",
        color: message.client.embeds.embed_color,
        footer: `Requested by: ${message.author.tag}`,
        timestamp: true
      },
      word: ["voice"],
      button: { cancel: "Cancel", reshuffle: "Reshuffle" },
      startMessage: "I shuffled a word it is **`{{word}}`**. You have **{{time}}** to find the correct word!",
      winMessage: "GG, It was **{{word}}**! You gave the correct answer in **{{time}}.**",
      loseMessage: "Better luck next time! The correct answer was **{{answer}}**.",
      incorrectMessage: "No {{author}}! The word isn't `{{answer}}`",
      othersMessage: "Only <@{{author}}> can use the buttons!",
      time: 60000
    });
  }
};
