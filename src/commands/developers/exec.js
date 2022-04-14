"use strict";

const { exec } = require("child_process");

module.exports = {
  name: "dev.exec",
  category: "Developer",
  devOnly: true,
  async execute(message, args, client) {
    if (!args.length) return message.channel.send("You must provide something to execute.");
    exec(args.join(" "), (error, stdout) => {
      const response = stdout || error;
      message.channel.send(response, { split: true, code: true });
    });
  }
};
