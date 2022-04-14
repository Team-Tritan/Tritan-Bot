"use strict";

const { readdirSync } = require("fs");

module.exports = (client) => {
  readdirSync("./commands/").forEach((dir) => {
    const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));

    for (let file of commands) {
      let command = require(`../commands/${dir}/${file}`);
      client.commands.set(command.name, command);
      if (command.slash) {
        client.slashcommands.set(command.slash.name, command.slash);
        client.slashDiscordData.push(command.slash);
      }
    }
  });
};
