"use strict";

const { Fight } = require("weky");

module.exports = {
  name: "fight",
  description: "Fight someone!",
  category: "Interactive",
  async execute(message, args, client) {
    const opponent = message.mentions.users.first();
    if (!opponent) return message.channel.send(`Please mention who you want to fight.`);

    await Fight({
      message: message,
      opponent: message.mentions.users.first(),
      embed: {
        title: "Fight | Tritan Bot",
        color: message.client.config.embeds.embed_color,
        footer: `Requested by: ${message.author.tag}`,
        timestamp: true
      },
      buttons: {
        hit: "Hit",
        heal: "Heal",
        cancel: "Stop",
        accept: "Accept",
        deny: "Deny"
      },
      acceptMessage: "<@{{challenger}}> has challenged <@{{opponent}}> for a fight!",
      winMessage: "GG, <@{{winner}}> won the fight!",
      endMessage: "<@{{opponent}}> didn't answer in time. So, I dropped the game!",
      cancelMessage: "<@{{opponent}}> refused to have a fight with you!",
      fightMessage: "{{player}} you go first!",
      opponentsTurnMessage: "Please wait for your opponents move!",
      highHealthMessage: "You cannot heal if your HP is above 80!",
      lowHealthMessage: "You cannot cancel the fight if your HP is below 50!",
      returnWinner: false,
      othersMessage: "Only {{author}} can use the buttons!"
    });
  }
};
