"use strict";

const { GuessThePokemon } = require("weky");

module.exports = {
  name: "guessthepokemon",
  description: "Guess the pokemon!",
  category: "Interactive",
  async execute(message, args, client) {
    await GuessThePokemon({
      message: message,
      embed: {
        title: "Guess The Pokémon | Tritan Bot",
        description:
          "**Type:**\n{{type}}\n\n**Abilities:**\n{{abilities}}\n\nYou only have **{{time}}** to guess the pokémon.",
        color: message.client.config.embeds.embed_color,
        footer: `Requested by: ${message.author.tag}`,
        timestamp: true
      },
      thinkMessage: "One second...",
      othersMessage: "Only <@{{author}}> can use the buttons!",
      winMessage: "GG, It was a **{{answer}}**. You got it correct in **{{time}}**.",
      loseMessage: "Better luck next time! It was a **{{answer}}**.",
      time: 60000,
      incorrectMessage: "No {{author}}! The pokémon isn't `{{answer}}`",
      buttonText: "Cancel"
    });
  }
};
