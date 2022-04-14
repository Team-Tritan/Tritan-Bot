"use strict";

const { MessageEmbed } = require("discord.js"),
  https = require("https"),
  url = "https://www.reddit.com/r/meme/hot/.json?limit=100";

module.exports = {
  name: "meme",
  description: "Sends a dank meme",
  usage: "(Prefix)meme",
  category: "Fun",
  execute(message, args, client) {
    https.get(url, (result) => {
      var body = "";
      result.on("data", (chunk) => {
        body += chunk;
      });

      result
        .on("end", () => {
          var response = JSON.parse(body);
          var index = response.data.children[Math.floor(Math.random() * 99) + 1].data;

          if (index.post_hint !== "image") {
            var text = index.selftext;
            const textembed = new MessageEmbed()
              .setAuthor(
                `${message.client.config.embeds.authorName}`,
                `${message.client.config.embeds.authorIcon}`
              )
              .setTitle(subRedditName)
              .setColor(message.client.config.embeds.embed_color)
              .setDescription(`[${title}](${link})\n\n${text}`)
              .setURL(`https://reddit.com/${subRedditName}`)
              .setTimestamp();

            message.channel.send({ embeds: [textembed] });
          }

          var image = index.preview.images[0].source.url.replace("&amp;", "&");
          var title = index.title;
          var link = "https://reddit.com" + index.permalink;
          var subRedditName = index.subreddit_name_prefixed;

          if (index.post_hint !== "image") {
            const textembed = new MessageEmbed()
              .setAuthor(
                `${message.client.config.embeds.authorName}`,
                `${message.client.config.embeds.authorIcon}`
              )
              .setTitle(subRedditName)
              .setColor(message.client.config.embeds.embed_color)
              .setDescription(`[${title}](${link})\n\n${text}`)
              .setURL(`https://reddit.com/${subRedditName}`)
              .setTimestamp();

            message.channel.send({ embeds: [textembed] });
          }
          const imageembed = new MessageEmbed()
            .setAuthor({
              name: `${message.client.config.embeds.authorName}`,
              iconURL: `${message.client.config.embeds.authorIcon}`
            })

            .setTitle(subRedditName)
            .setImage(image)
            .setColor(message.client.config.embeds.embed_color)
            .setDescription(`[${title}](${link})`)
            .setURL(`https://reddit.com/${subRedditName}`)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp();
          message.channel.send({ embeds: [imageembed] });
        })
        .on("error", function (e) {
          console.log(message.client.logger.yellow("[ERROR: Meme Command]"), `${e}`);
        });
    });
  }
};
