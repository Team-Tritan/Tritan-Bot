"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = async (queue, track, client) => {
  // have to do this to detect if lib is returning an empty string for the embed, gross
  let img;
  img =
    track.thumbnail.length == 0
      ? "https://png.pngtree.com/thumb_back/fw800/back_our/20190622/ourmid/pngtree-blue-geometric-flat-music-banner-background-image_210611.jpg"
      : track.thumbnail;

  queue.metadata.send({
    embeds: [
      new MessageEmbed()
        .setAuthor({ name: client.config.embeds.authorName, iconURL: client.config.embeds.authorIcon })
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setImage(img)
        .setTitle("Track Started")
        .setDescription(
          `**[${track.title}](${track.url})** from ${track.source} has started playing in \`${queue.connection.channel.name}\`.`
        )
        .setFooter(`Requested by ${track.requestedBy.tag}`, track.requestedBy.displayAvatarURL())
    ]
  });
};
