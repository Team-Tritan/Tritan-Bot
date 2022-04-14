"use strict";

module.exports = {
  name: "randompassword",
  aliases: ["pass"],
  description: "Get a random string of text to use as a password (dm'd to you).",
  usage: "(Prefix)password",
  category: "Utility",
  async execute(message, args) {
    const waiting = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, hashing a random password for you.`
    );

    message.author.send(
      `:detective: Here's your requested password: ${message.client.functions.generatePassword()}`
    );

    waiting.edit(`The random hashed password has been DM'd to you.`);
  }
};
