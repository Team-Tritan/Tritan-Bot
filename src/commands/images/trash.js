"use strict";

const fetch = require("node-fetch"),
  { MessageAttachment } = require("discord.js");

module.exports = {
  name: "trash",
  category: "Image/Gifs",
  description: "Find out!",
  usage: "(Prefix)trash <optional ID or mention>",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    const m = await message.channel.send(
      `${message.client.config.embeds.embed_color} Please wait, fetching from the API.`
    );
    const res = await fetch(
      encodeURI(
        `https://nekobot.xyz/api/imagegen?type=trash&url=${user.displayAvatarURL({
          format: "png",
          size: 512
        })}`
      )
    );
    const json = await res.json();
    const attachment = new MessageAttachment(json.message, "tweet.png");
    message.channel.send({ files: [attachment] });
    m.delete();
  }
};
