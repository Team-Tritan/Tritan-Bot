"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = async (queue, client) => {
  queue.metadata.send({
    embeds: [
      new MessageEmbed()
        .setAuthor({ name: client.config.embeds.authorName, iconURL: client.config.embeds.authorIcon })
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setThumbnail(queue.metadata.guild.iconURL())
        .setDescription(`❌ | I was manually disconnected from the voice channel, clearing the queue.`)
    ]
  });
};
