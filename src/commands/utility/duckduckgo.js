"use strict";

const search = require("node-ddg").default;

module.exports = {
  name: "duckduckgo",
  description: "Search for something on the internet owo",
  usage: "(Prefix)duckduckgo <search query>",
  category: "Utility",
  async execute(message, args) {
    if (!args[0]) return message.channel.send("You must imput something for me to search!");

    let options = {
      count: 0,
      offset: 0,
      lang: "en-US,en;q=0.9",
      debug: false,
      show: false,
      screenshot: false,
      wait: 0
    };

    let string = "";

    search({ query: args.join("+"), maxResults: 3 })
      .then((results) => {
        for (let i = 0; i < 10; i++) {
          if (i > results.length - 1) {
            break;
          }

          string = string + `\n**${results[i].title}** \n${results[i].body} \n${results[i].url}\n\n`;
        }
        message.channel.send(string);
      })
      .catch((error) => {
        message.channel.send("There was an error!\n" + error);
        return console.error("oups", error);
      });
  }
};
