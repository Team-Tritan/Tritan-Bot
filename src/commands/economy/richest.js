"use strict";

const AsciiTable = require("ascii-table"),
  { MessageEmbed } = require("discord.js");

module.exports = {
  name: "richest",
  category: "Economy",
  description: "Gets the top 10 people in your guild.",
  usage: "(Prefix)richest",
  async execute(message, args, client) {
    await message.guild.members.fetch();

    const members = await client.models.economy.find({}).lean(),
      membersLeaderboard = members
        .map((m) => {
          return {
            id: m.userId,
            value: m.balance
          };
        })
        .sort((a, b) => b.value - a.value);
    const table = new AsciiTable("Economy Guild Leaderboard");
    table.setHeading("#", "User", "Coins");
    if (membersLeaderboard.length > 20) membersLeaderboard.length = 20;
    const newTable = await fetchUsers(membersLeaderboard, table, this.client);

    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
      .setTitle("Economy Leaderboard")
      .setDescription("```\n" + newTable.toString() + "```")
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send({ embeds: [embed] });

    async function fetchUsers(array, table, client) {
      return new Promise((resolve) => {
        let index = 0;
        array.forEach((element) => {
          message.client.users.fetch(element.id).then((user) => {
            const regEx =
              /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/gu;
            let username = user.username.replace(regEx, "");
            if (username.length > 20) {
              username = username.substr(0, 20);
            }
            table.addRow(index++, username, element.value);
          });
        });
        resolve(table);
      });
    }
  }
};
