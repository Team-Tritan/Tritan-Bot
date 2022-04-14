"use strict";

const { MessageEmbed } = require("discord.js"),
  rps = ["scissors", "rock", "paper"],
  res = ["Scissors :v:", "Rock :fist:", "Paper :raised_hand:"];

module.exports = {
  name: "rockpapersissors",
  aliases: ["rps"],
  usage: "(Prefix)rockpapersissors <rock | paper | scissors>",
  description: "Play a game of rock–paper–scissors against Tritan!",
  category: "Fun",
  async execute(message, args) {
    let userChoice;
    if (args.length) userChoice = args[0].toLowerCase();
    if (!args[0]) return message.reply("Please enter `rock`, `paper`, or `scissors` as an argument.");
    userChoice = rps.indexOf(userChoice);
    const botChoice = Math.floor(Math.random() * 3);
    let result;
    if (userChoice === botChoice) result = "It's a draw!";
    else if (botChoice > userChoice || (botChoice === 0 && userChoice === 2)) result = "**Tritan** wins!";
    else result = `**${message.member.displayName}** wins!`;
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`${message.member.displayName} vs. Tritan`)
      .addField("Your Choice", res[userChoice], true)
      .addField("Tritan's Choice", res[botChoice], true)
      .addField("Result", result, true)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.embeds.embed_color);
    return message.channel.send({ embeds: [embed] });
  }
};
