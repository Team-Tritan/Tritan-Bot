const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
  name: "wasted",
  category: "Image/Gifs",
  description: "Get a wasted image with your pfp in it!",
  usage: "(Prefix)wasted <optional ID or mention>",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;

    let link = `https://some-random-api.ml/canvas/wasted/?avatar=${user.displayAvatarURL({
      format: "png"
    })}`;

    let attachment = new MessageAttachment(link, "wasted.png");

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`${user.username} just got wasted!`)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.embeds.embed_color);
    message.channel.send({ embeds: [embed], files: [attachment] });
  }
};
