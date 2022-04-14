"use strict";

module.exports = {
  name: "topcommands",
  description: "Displays the most used commands.",
  usage: "(Prefix)topcommands",
  category: "Info",
  async execute(message, client) {
    const msg = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, pulling stats from the server.`
    );

    message.client.models.commands
      .find()
      .sort([["timesUsed", "descending"]])
      .exec(async (err, res) => {
        if (err) client.log(err);
        const commandsArr = [];

        for (let i = 0; i < 25; i++) {
          try {
            commandsArr.push(`${i + 1}.) ${res[i].timesUsed.toLocaleString()} | ${res[i].commandName}`);
          } catch (e) {
            console.log(message.client.logger.yellow("[ERROR: 'Top Commands' Command]"), `${e}`);
            return message.channel.send(`An error has occured: ${e}`);
          }
        }

        await msg.edit(`**Top Commands**\n\`\`\`${commandsArr.join("\n")}\`\`\``);
      });
  }
};
