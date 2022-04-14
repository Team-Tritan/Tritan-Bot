"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "poll",
  description: "You can create an embedded poll with this command.",
  usage: '(Prefix)poll <question> "poll response 1" "poll response 2" "poll reasponse 3"',
  category: "Utility",
  async execute(message) {
    let question = [];
    const args = message.content.trim().split(/ +/g);

    for (let i = 1; i < args.length; i++) {
      if (args[i].startsWith('"')) break;
      else question.push(args[i]);
    }

    question = question.join(" ");

    const choices = [];

    const regex = /(["'])((?:\\\1|\1\1|(?!\1).)*)\1/g;
    let match;
    while ((match = regex.exec(args.join(" ")))) choices.push(match[2]);

    let content = [];
    for (let i = 0; i < choices.length; i++) content.push(`${options[i]} ${choices[i]}`);
    content = content.join("\n");

    let embed = new MessageEmbed()
      .setAuthor(message.author.tag + ` (${message.author.id})`, message.author.displayAvatarURL())
      .setTitle("Poll: " + question)
      .setDescription(content)
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Poll created by Tritan Bot`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp");

    message.channel.send({ embeds: [embed] }).then(async (m) => {
      for (let i = 0; i < choices.length; i++) await m.react(options[i]);
    });
  }
};

const options = [
  "🇦",
  "🇧",
  "🇨",
  "🇩",
  "🇪",
  "🇫",
  "🇬",
  "🇭",
  "🇮",
  "🇯",
  "🇰",
  "🇱",
  "🇲",
  "🇳",
  "🇴",
  "🇵",
  "🇶",
  "🇷",
  "🇸",
  "🇹",
  "🇺",
  "🇻",
  "🇼",
  "🇽",
  "🇾",
  "🇿"
];
