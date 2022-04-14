"use strict";

const superagent = require("snekfetch"),
  { MessageEmbed } = require("discord.js");

module.exports = {
  name: "changemymind",
  premium: true,
  description: "Returns an meme saying text.",
  usage: "(Prefix)changemymind <text>",
  category: "Image/Gifs",
  async execute(message, args) {
    if (!args) {
      return message.reply(`You need to add some text to meme-ify.`);
    }
    const text = args.join(" ");
    const m = await message.channel.send(
      `${message.client.config.helpers.check_mark} Please wait, fetching from the API.`
    );
    superagent.get(`https://nekobot.xyz/api/imagegen?type=changemymind&text=${text}`).end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setImage(response.body.message)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.embeds.embed_color);
      m.edit({ content: null, embeds: [lewdembed] });
    });
  }
};
