"use strict";

module.exports.slash = {
  name: "emoji",
  description: "Get ID of emojis",
  options: [
    {
      name: "name",
      description: "Emoji to get ID of",
      type: "STRING",
      required: true
    }
  ],
  async execute(client, interaction, args) {
    await interaction.deferReply();

    if (interaction.options.getString("name") === undefined) {
      return interaction.followUp("Please specify an emoji to get the ID of.");
    }
    const emojiName = interaction.options.getString("name");
    const emoji = client.emojis.cache.find((emoji) => emoji.name === emojiName);
    if (!emoji) {
      return interaction.followUp(
        "I couldn't find the Emojis with the provided name. Please make sure the Emoji name is correct."
      );
    }
    interaction.followUp(`\`\`\`${emoji}\`\`\``);
  }
};
