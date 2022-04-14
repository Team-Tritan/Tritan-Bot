"use strict";

const fetch = require("node-fetch"),
  { MessageAttachment } = require("discord.js");

module.exports = {
  name: "deepfry",
  description: "API does things.",
  usage: "(Prefix)deepfry <user ID or mention> ",
  category: "Image/Gifs",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    const m = await message.channel.send(
      `${message.client.config.helpers.check_mark} Please wait, fetching from the API.`
    );
    const res = await fetch(
      encodeURI(
        `https://nekobot.xyz/api/imagegen?type=deepfry&image=${user.displayAvatarURL({
          format: "png",
          size: 512
        })}`
      )
    );
    const json = await res.json();
    const attachment = new MessageAttachment(json.message, "image.png");
    message.channel.send({ files: [attachment] });
    m.delete();
  }
};
