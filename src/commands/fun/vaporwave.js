"use strict";

module.exports = {
  name: "vaporwave",
  category: "Fun",
  description: "Vaporwave-ify a word!",
  usage: "(Prefix)vaporwave <word>",
  async execute(message, args, client) {
    if (!args[0]) return message.reply("What you want me to say?");

    let msgstring = args.join(" ");

    let msgstringVapor = msgstring.split("").join(" ");

    String.prototype.toFullWidth = function () {
      return this.replace(/[A-Za-z0-9]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) + 0xfee0);
      });
    };

    return message.channel.send(msgstringVapor.toFullWidth());
  }
};
