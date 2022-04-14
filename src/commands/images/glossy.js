"use strict";

const { MessageAttachment } = require("discord.js");

module.exports = {
  name: "glossy",
  category: "Image/Gifs",
  description: "Find out!",
  usage: "(Prefix)glossy <optional mention or ID>",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;

    let link = `https://some-random-api.ml/canvas/glass/?avatar=${user.displayAvatarURL({
      format: "png"
    })}`;

    let attachment = new MessageAttachment(link, "glass.png");

    return message.channel.send({ files: [attachment] });
  }
};
