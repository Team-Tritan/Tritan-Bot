"use strict";

const Statcord = require("statcord.js");

module.exports = async (client, interaction) => {
  if (!interaction.inGuild()) {
    return void interaction.reply({
      content: "Slash and legacy commands are only available in guilds.",
      ephemeral: true
    });
  }

  if (interaction.isCommand()) {
    const command = client.slashcommands.get(interaction.commandName);
    if (!command) return interaction.reply({ content: "This command does not exist." });

    Statcord.ShardingClient.postCommand(interaction.commandName, interaction.user.id, client);

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }

    try {
      command.execute(client, interaction, args);
      console.log(
        client.logger.blue("[Slash Command Ran]"),
        `${interaction.commandName} was run by ${interaction.user.tag}.`
      );
    } catch (error) {
      client.sentry.captureException(error);
      return interaction.reply({ content: `Error: ${error.message}`, ephemeral: true });
    }
  }
};
