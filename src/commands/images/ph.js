"use strict";

const fetch = require("node-fetch"),
  Discord = require("discord.js");

module.exports = {
  name: "ph",
  premium: true,
  description: "Returns an image of a PH comment saying something.",
  usage: "(Prefix)ph <text>",
  category: "Image/Gifs",
  async execute(message, args) {
    const text = args.join(" ");
    const user = message.author;

    if (!text) {
      return message.reply("You need to provide some text for your comment.");
    }

    const m = await message.channel.send(`${message.client.config.helpers.birb} Generating...`);
    const res = await fetch(
      encodeURI(
        `https://nekobot.xyz/api/imagegen?type=phcomment&username=${
          user.username
        }&image=${user.displayAvatarURL({ format: "png", size: 512 })}&text=${text}`
      )
    );

    const json = await res.json();
    const attachment = new Discord.MessageAttachment(json.message, "phcomment.png");

    message.channel.send({ files: [attachment] });
    m.delete();
  }
};
