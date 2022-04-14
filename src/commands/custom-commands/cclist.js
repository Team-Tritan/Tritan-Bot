"use strict";

const discord = require("discord.js");

module.exports = {
  name: "cclist",
  description: "List a guild's custom commands",
  usage: "(Prefix)cclist",
  category: "Custom Commands",
  async execute(message, args) {
    const client = message.client;

    let array = [];
    const interval = 5;

    let tagsModel = await client.models.cc.find({
      guildID: message.guild.id
    });

    tagsModel.forEach(async (i) => {
      array.push(`ID: \`${i.id}\`\nName: \`${i.name}\`\nResponse: \`${i.response}\`\n\n`);
    });

    let uwu = array.join("\n");
    let string = await message.client.functions.shorten(uwu).toString();

    const embed = new discord.MessageEmbed()
      .setAuthor(`Tritan Bot`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
      .setTitle(`Custom Commands Search`)
      .setDescription(string || "No Custom Commands Found")
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter("Requested by: " + message.author.tag, message.author.displayAvatarURL({ dynamic: true }));

    message.channel.send({
      embeds: [embed.setTitle(`Custom Commands Search`).setDescription(array.join("\n\n"))]
    });
  }
};
