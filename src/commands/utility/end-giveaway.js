"use strict";

const { Permissions } = require("discord.js");

module.exports = {
  name: "end-giveaway",
  aliases: ["gend"],
  description: "End a reaction based giveaway.",
  usage: "(Prefix)end-giveaway <message id>",
  category: "Utility",
  async execute(message, args, client) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return message.channel.send(
        ":x: You need to have the manage messages permissions to reroll giveaways."
      );
    }

    if (!args[0]) {
      return message.channel.send(":x: You have to specify a valid message ID!");
    }

    let giveaway =
      (await message.client.giveawaysManager.giveaways.find((g) => g.prize === args.join(" "))) ||
      (await message.client.giveawaysManager.giveaways.find((g) => g.messageId === args[0]));

    if (!giveaway) {
      return message.channel.send("Unable to find a giveaway for `" + args.join(" ") + "`.");
    }

    message.client.giveawaysManager
      .edit(giveaway.messageId, {
        setEndTimestamp: Date.now()
      })
      .then(() => {
        message.channel.send(
          "Giveaway will end in less than " +
            message.client.giveawaysManager.options.updateCountdownEvery / 1000 +
            " seconds..."
        );
      })
      .catch((e) => {
        if (e.startsWith(`Giveaway with message ID ${giveaway.messageId} is already ended.`)) {
          message.channel.send("This giveaway is already ended!");
        } else {
          console.error(e);
          message.channel.send("An error occured...");
        }
      });
  }
};
