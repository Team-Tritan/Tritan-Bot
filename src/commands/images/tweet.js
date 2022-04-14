"use strict";

const fetch = require("node-fetch"),
  { MessageAttachment } = require("discord.js");

module.exports = {
  name: "tweet",
  description: "API does things.",
  premium: true,
  usage: "(Prefix)tweet {user} {message}",
  category: "Image/Gifs",
  async execute(message, args) {
    const user = args[0];
    const text = args.slice(1).join(" ");

    if (!user) {
      return message.reply("Please send a text username for this tweet.\n\n Example: *tweet pornhub hi!");
    }

    if (!text) {
      return message.reply("Please send the content for this tweet.\n\n Example: *tweet discord hi!");
    }
    const m = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching from the API.`
    );
    const res = await fetch(
      encodeURI(`https://nekobot.xyz/api/imagegen?type=tweet&username=${user}&text=${text}`)
    );
    const json = await res.json();
    const attachment = new MessageAttachment(json.message, "tweet.png");
    message.channel.send({ files: [attachment] });
    m.delete();
  }
};
