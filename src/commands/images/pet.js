"use strict";

const { MessageAttachment } = require("discord.js"),
  petPetGif = require("pet-pet-gif");

module.exports = {
  name: "pet",
  description: "Allows you to pet another user with a gif of their avatar.",
  usage: "(Prefix)pat <mention or ID>",
  category: "Image/Gifs",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]);
    if (!user) return message.reply("You need to mention or provide a user id.");

    let animatedGif = await petPetGif(user.displayAvatarURL({ format: "png" }), {
      resolution: 90
    });

    const m = await message.channel.send(`${message.client.config.helpers.birb} Generating...`);

    const attachment = new MessageAttachment(animatedGif, "petpet.gif");

    m.edit({ content: null, files: [attachment] });
  }
};
