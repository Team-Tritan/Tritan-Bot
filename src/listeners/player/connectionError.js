"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = async (queue, error, client) => {
  client.sentry.captureException(error);
  console.error(
    client.logger.red(`[PLAYER ERROR]`),
    `Error emitted from the queue in guild ${queue.guild.name}: ${error.message}`
  );

  queue.metadata.send({
    embeds: [
      new MessageEmbed()
        .setAuthor({ name: client.config.embeds.authorName, iconURL: client.config.embeds.authorIcon })
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setTitle("Player Error")
        .setTitle(`❌ | An error has occured while connecting to the voice channel.`)
        .setDescription(`**Error:** \`${error.message}\``)
    ]
  });
};
