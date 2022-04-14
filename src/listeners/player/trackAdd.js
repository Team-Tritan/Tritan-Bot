"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = async (queue, track, client) => {
  queue.metadata.send({
    embeds: [
      new MessageEmbed()
        .setAuthor({ name: client.config.embeds.authorName, iconURL: client.config.embeds.authorIcon })
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setTitle("Track Added")
        .setDescription(`**[${track.title}](${track.url})** has been added to the queue.`)
        .setFooter(`Queued by ${track.requestedBy.tag}`, track.requestedBy.displayAvatarURL())
    ]
  });
};
