"use strict";

const weather = require("weather-js"),
  Discord = require("discord.js");

module.exports = {
  name: "weather",
  aliases: ["climate"],
  usage: "(Prefix)weather <location>",
  description: "Checks a weather forecast",
  category: "Utility",
  async execute(message, args) {
    let place = args.join(" ");
    if (!place) return message.channel.send(":x: Please specify a location.");
    weather.find({ search: place, degreeType: "F" }, function (error, result) {
      if (result === undefined || result.length === 0) return message.channel.send("**Invalid** location");

      var current = result[0].current;
      var location = result[0].location;

      const weatherinfo = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail("http://icons.iconarchive.com/icons/papirus-team/papirus-apps/512/weather-icon.png")
        .setColor(message.client.config.embeds.embed_color)
        .setTitle(`${current.observationpoint} - **${current.skytext}**`)
        .addField("Timezone", `UTC${location.timezone}`, true)
        .addField("Temperature", `${current.temperature}°`, true)
        .addField("Feels Like", `${current.feelslike}°`, true)
        .addField("Wind", current.winddisplay, true)
        .addField("Humidity", `${current.humidity}%`, true)
        .addField("Degree Type", "F", true)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

      return message.channel.send({ embeds: [weatherinfo] });
    });
  }
};
