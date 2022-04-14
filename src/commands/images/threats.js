"use strict";

const fetch = require("node-fetch"),
  { MessageAttachment } = require("discord.js");

module.exports = {
  name: "threats",
  category: "Image/Gifs",
  description: "Shows the biggest threats to society",
  usage: "(Prefix)threats <optional ID or mention>",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    const m = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching from the API.`
    );
    const res = await fetch(
      encodeURI(
        `https://nekobot.xyz/api/imagegen?type=threats&url=${user.displayAvatarURL({
          format: "png",
          size: 512
        })}`
      )
    );
    const json = await res.json();
    const attachment = new MessageAttachment(json.message, "threats.png");
    message.channel.send({ files: [attachment] });
    m.delete();
  }
};
