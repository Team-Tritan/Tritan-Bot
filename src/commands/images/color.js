"use strict";

const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
  name: "color",
  aliases: ["hex"],
  category: "Image/Gifs",
  description: "Returns a hex code color",
  usage: "(Prefix)color <hex code w/o #>",
  async execute(message, args) {
    const color = args[0];
    if (!color) {
      return message.channel.send(
        "Please send a hex code without the hashtag. \n **Example:** `*color ff0000`"
      );
    }

    let link = `https://some-random-api.ml/canvas/colorviewer/?hex=${color}`;

    let attachment = new MessageAttachment(link, "color.png");

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`Hex Code: #${color}`)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.embeds.embed_color);
    message.channel.send({ embeds: [embed], files: [attachment] });
  }
};
