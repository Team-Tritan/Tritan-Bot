"use-strict";

const { MessageEmbed } = require("discord.js"),
  client = require("nekos.life"),
  neko = new client();

module.exports = {
  name: "fact",
  description: "Displays a fun fact.",
  usage: "(Prefix)fact",
  category: "Fun",
  execute(message) {
    async function work() {
      let owo = await neko.sfw.fact();
      const embed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle(`Fun Fact`)
        .setDescription(owo.fact)
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      message.channel.send({ embeds: [embed] }).catch((error) => {
        console.error(error);
      });
    }

    work();
  }
};
