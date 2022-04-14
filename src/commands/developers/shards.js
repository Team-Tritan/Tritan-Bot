"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "dev.shards",
  aliases: ["shards"],
  category: "Developer",
  description: "Check's stats of a shard",
  async execute(message, client) {
    await message.client.shard
      .broadcastEval((client) => [
        client.shard.ids,
        client.ws.status,
        client.ws.ping,
        client.guilds.cache.size,
        client.users.cache.size
      ])
      .then(async (results) => {
        let embed = new MessageEmbed()
          .setAuthor({ name: client.config.embeds.authorName, iconURL: client.config.embeds.authorIcon })
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setTitle(`👨‍💻 Bot Shards (${client.shard.count})`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp();

        results.map((data) => {
          embed.addField(
            `📡 Shard ${data[0]}`,
            `**Status:** ${data[1]}\n**Ping:** ${data[2]}ms\n**Guilds:** ${data[3]}\n**Users: **${data[4]} `,
            false
          );
        });
        message.reply({ embeds: [embed] });
      })
      .catch((error) => {
        console.error(error);
        message.reply(`${error}`);
      });
  }
};
