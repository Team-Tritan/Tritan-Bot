const { MessageEmbed } = require("discord.js");

module.exports = async (queue, n, client) => {
  queue.metadata.send({
    embeds: [
      new MessageEmbed()
        .setAuthor({ name: client.config.embeds.authorName, iconURL: client.config.embeds.authorIcon })
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setTitle("Queue Ended")
        .setDescription(`✅ | The queue has ended, was the song fire?`)
    ]
  });
};
