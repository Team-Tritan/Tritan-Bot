"use strict";

module.exports = {
  name: "roulette",
  description: "Are you safe?",
  usage: "(Prefix)roulette",
  category: "Fun",
  execute(message, client) {
    const answer = [
      "🚬🔫 You're safe... for now.",
      "🚬🔫 You're safe... for now.",
      "🚬🔫 You're safe... for now.",
      "🚬🔫 You're safe... for now.",
      "🚬🔫 You're safe... for now.",
      "🔥🔫 You died."
    ];
    return message.channel.send(answer[Math.floor(Math.random() * answer.length)]);
  }
};
