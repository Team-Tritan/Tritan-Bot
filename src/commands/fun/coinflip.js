const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "coinflip",
  description: "Flip a coin, and it will land on either 'heads' or 'tails'",
  usage: "(Prefix)coinflip",
  category: "Fun",
  execute(message, args, client) {
    let embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Coin Flip")
      .setDescription(
        Math.floor(Math.random() * 2) === 0 ? "The result is: ||Heads||" : "The result is: ||Tails||"
      )
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send({ embeds: [embed] }).catch(console.error);
  }
};
