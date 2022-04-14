"use strict";

module.exports = {
  name: "dev.reload",
  category: "Developer",
  description: "Developer use only.",
  usage: "(Prefix)dev.reload",
  devOnly: true,
  async execute(message, args, client) {
    if (!args[1])
      return message.channel.send("Please provide a category and command.\nEx. `*dev.reload info help`");

    const commandName = args[1].toLowerCase();
    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
      return message.channel.send(
        `There is no command with name or alias \`${commandName}\`, ${message.author}!`
      );
    }

    delete require.cache[require.resolve(`../${args[0]}/${commandName}.js`)];

    try {
      const newCommand = require(`../${args[0]}/${commandName}.js`);
      message.client.commands.set(newCommand.name, newCommand);
    } catch (error) {
      return message.channel.send(
        `There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``
      );
    }
    message.channel.send(`Command \`${commandName}\` was reloaded!`);
  }
};
