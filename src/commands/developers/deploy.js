"use strict";

const { post } = require("snekfetch");

module.exports = {
  name: "dev.deploy",
  description: "Deploys global slash commands.",
  devOnly: true,
  category: "Developer",
  async execute(message, client) {
    try {
      await message.client.application.commands.set(message.client.slashDiscordData);
    } catch (error) {
      console.log(error);
      return message.reply(`Error deplying global slash commands\n\n${error}`);
    }

    const { body } = await post("https://bin.tritan.gg/documents").send(message.client.slashDiscordData);
    return message.reply(`Global slash commands deployed.\nhttps://bin.tritan.gg/${body.key}.js`);
  }
};
