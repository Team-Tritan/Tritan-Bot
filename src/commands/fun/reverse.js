"use strict";

module.exports = {
  name: "reverse",
  description: "Reverse your desired words",
  usage: "(Prefix)reverse <word>",
  category: "Fun",
  async execute(message, args, client) {
    const text = args.join();
    if (!text) return message.channel.send("Please provide a word.");
    if (text.length < 1) return message.channel.send("I can't reverse only one letter!");
    const converted = text.split("").reverse().join("");
    return message.channel.send(`\u180E${converted}`);
  }
};
