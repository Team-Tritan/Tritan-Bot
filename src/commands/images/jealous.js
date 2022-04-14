const fetch = require("node-fetch"),
  { MessageAttachment } = require("discord.js");

module.exports = {
  name: "jealous",
  description: "API does things.",
  usage: "(Prefix)jealous <user id or mention>",
  category: "Image/Gifs",
  async execute(message, args) {
    const user1 = message.mentions.users.first() || message.client.users.cache.get(args[0]);
    const user2 = message.client.users.cache.get(args[1] || message.author.id);

    if (!user1) return message.reply("Please mention a user or send a user ID.");

    const m = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching from the API. `
    );
    const res = await fetch(
      encodeURI(
        `https://nekobot.xyz/api/imagegen?type=ship&user1=${user1.displayAvatarURL({
          format: "png",
          size: 512
        })}&user2=${user2.displayAvatarURL({ format: "png", size: 512 })}`
      )
    );
    const json = await res.json();
    const attachment = new MessageAttachment(json.message, "tweet.png");
    message.channel.send({ files: [attachment] });
    m.delete();
  }
};
