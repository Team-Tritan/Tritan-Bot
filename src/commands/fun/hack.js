"use strict";

const ms = module.require("ms");

module.exports.slash = {
  name: "hack",
  description: "heck someone account [J4F]",
  options: [
    {
      name: "user",
      description: "who you want to be hecked",
      type: "MENTIONABLE"
    }
  ],
  async execute(client, interaction, args) {
    if (!args[0]) {
      return interaction.reply("Woah, slow down!! Who are we hacking?");
    }
    const tohack = interaction.options.getMentionable("user");
    let msg = await interaction.reply(`Hacking ${tohack.displayName}...`);

    let time = "1s";
    setTimeout(function () {
      interaction.editReply(`Finding ${tohack.displayName}'s email and password.`);
    }, ms(time));

    let time1 = "6s";
    setTimeout(function () {
      interaction.editReply(`E-Mail: ${tohack.displayName}_is_megagay@gmail.com \nPassword: ********`);
    }, ms(time1));

    let time2 = "9s";
    setTimeout(function () {
      interaction.editReply("Finding other accounts.");
    }, ms(time2));

    let time3 = "15s";
    setTimeout(function () {
      interaction.editReply("Collecting data for the NSA.");
    }, ms(time3));

    let time4 = "21s";
    setTimeout(function () {
      interaction.editReply("Exposing their last taken photo.");
    }, ms(time4));

    let time5 = "28s";
    setTimeout(function () {
      interaction.editReply("Discord account located...");
    }, ms(time5));

    let time6 = "31s";
    setTimeout(function () {
      interaction.editReply("Discord account exposed to irls.");
    }, ms(time6));

    let time7 = "38s";
    setTimeout(function () {
      interaction.editReply("Selling data to FBI....");
    }, ms(time7));

    let time8 = "41s";
    setTimeout(function () {
      interaction.editReply(`Finished hacking ${tohack.displayName}.`);
    }, ms(time8));
  }
};
