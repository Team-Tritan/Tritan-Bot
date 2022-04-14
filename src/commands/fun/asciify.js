const figlet = require("figlet"),
  { MessageEmbed } = require("discord.js");

module.exports = {
  name: "asciify",
  description: "Asciify some text!",
  alias: ["ascii"],
  usage: "(prefix)asciify <test>",
  category: "Fun",
  execute(message, args, client) {
    var inputText = args.slice(0).join(" ");
    var reply;
    figlet.text(
      inputText,
      {
        font: "Big",
        horizontalLayout: "default",
        verticalLayout: "default"
      },
      function (err, data) {
        if (err) {
          message.channel.send("Something went wrong...");
          console.error(err);
        } else if (inputText.length > 0) {
          message.channel.send("```" + data + "```");
        } else {
          let finalEmbedMessage = new MessageEmbed()
            .setColor(message.client.config.embeds.embed_color)
            .addField("Syntax Error", "No Text Specified");
          message.channel.send({ embeds: [finalEmbedMessage] });
        }
      }
    );
  }
};
