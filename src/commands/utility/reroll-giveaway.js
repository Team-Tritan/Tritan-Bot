"use strict";

const { Permissions } = require("discord.js");

module.exports = {
  name: "reroll-giveaway",
  aliases: ["greroll"],
  description: "Reroll a reaction based giveaway.",
  usage: "(Prefix)reroll-giveaway <message id>",
  category: "Utility",
  execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return message.channel.send(
        ":x: You need to have the manage messages permissions to reroll giveaways."
      );
    }

    if (!args[0]) {
      return message.channel.send(":x: You have to specify a valid message ID!");
    }

    let giveaway =
      message.client.giveawaysManager.giveaways.find((g) => g.prize === args.join(" ")) ||
      message.client.giveawaysManager.giveaways.find((g) => g.messageId === args[0]);

    if (!giveaway) {
      return message.channel.send("Unable to find a giveaway for `" + args.join(" ") + "`.");
    }

    message.client.giveawaysManager
      .reroll(giveaway.messageId)
      .then(() => {
        message.channel.send("Giveaway rerolled!");
      })
      .catch((e) => {
        if (e.startsWith(`Giveaway with message ID ${giveaway.messageId} is not ended.`)) {
          message.channel.send("This giveaway is not ended!");
        } else {
          console.error(e);
          message.channel.send("An error occured...");
        }
      });
  }
};
