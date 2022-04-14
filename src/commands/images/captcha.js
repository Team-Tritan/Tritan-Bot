"use strict";

const fetch = require("node-fetch"),
  Discord = require("discord.js");

module.exports = {
  name: "captcha",
  description: "Returns an image of you in a captcha!",
  usage: "(Prefix)captcha",
  category: "Image/Gifs",
  async execute(message, args) {
    const text = args.join(" ");
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;

    const res = await fetch(
      encodeURI(
        `https://nekobot.xyz/api/imagegen?type=captcha&username=${user.username}&url=${user.displayAvatarURL({
          format: "png",
          size: 512
        })}`
      )
    );
    const json = await res.json();
    const attachment = new Discord.MessageAttachment(json.message, "image.png");
    return message.channel.send({ files: [attachment] });
  }
};
