"use strict";

const fetch = require("node-fetch"),
  { MessageAttachment } = require("discord.js");

module.exports = {
  name: "trumptweet",
  description: "API does things.",
  usage: "(Prefix)trumptweet <message>",
  category: "Image/Gifs",
  async execute(message, args) {
    const text = args.join(" ");
    if (!text) {
      return message.reply("please send some text for the tweet.");
    }
    const m = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching from the API.`
    );
    const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=trumptweet&text=${text}`));
    const json = await res.json();
    const attachment = new MessageAttachment(json.message, "trumptweet.png");
    message.channel.send({ files: [attachment] });
    m.delete();
  }
};
