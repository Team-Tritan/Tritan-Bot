"use strict";

module.exports = {
  name: "8ball",
  description: "Returns an 8ball answer for your question.",
  usage: "(Prefix)8ball",
  category: "Fun",
  execute(message, args, client) {
    let stuff = args.join(" ") || "";

    message.client.functions.doMagic8BallVoodoo();

    var msg1 = Array(5);
    msg1[1] = "Yes";
    msg1[2] = "No";
    msg1[3] = "Maybe";
    msg1[4] = "Without a doubt.";
    msg1[5] = "I don't care";
    msg1[6] = ":)";
    var x = message.client.functions.getRandomInt(0, 20);
    if (x < 5) {
      if (x < 3) {
        message.channel.send(`**${stuff}:** ` + msg1[1]);
      } else {
        message.channel.send(`**${stuff}:** ` + msg1[3]);
      }
    } else if (x <= 9) {
      if (x >= 7) {
        message.channel.send(`**${stuff}:** ` + msg1[2]);
      } else {
        message.channel.send(`**${stuff}:** ` + msg1[4]);
      }
    } else if (x <= 12) {
      message.channel.send(`**${stuff}:** ` + msg1[5]);
    } else {
      message.channel.send(`**${stuff}:** ` + msg1[6]);
    }
  }
};

module.exports.slash = {
  name: "8ball",
  description: "Tells you a fortune",
  options: [
    {
      name: "question",
      description: "The question you want to ask the magic 8ball",
      type: "STRING"
    }
  ],
  async execute(client, interaction, args) {
    await interaction.deferReply();

    var fortunes = [
      "Yes.",
      "It is certain.",
      "It is decidedly so.",
      "Without a doubt.",
      "Yes definelty.",
      "You may rely on it.",
      "As I see it, yes.",
      "Most likely.",
      "Outlook good.",
      "Signs point to yes.",
      "Reply hazy, try again.",
      "Ask again later.",
      "Better not tell you now...",
      "Cannot predict now.",
      "Concentrate and ask again.",
      "Don't count on it.",
      "My reply is no.",
      "My sources say no.",
      "Outlook not so good...",
      "Very doubtful."
    ];
    await interaction.followUp(fortunes[Math.floor(Math.random() * fortunes.length)]);
  }
};
