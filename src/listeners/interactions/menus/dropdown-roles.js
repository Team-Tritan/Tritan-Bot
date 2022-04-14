"use strict";

module.exports = (interaction, client) => {
  if (interaction.isSelectMenu()) {
    const { customId, values, member } = interaction;

    if (customId === "auto-roles") {
      const component = interaction.component;
      const removed = component.options.filter((option) => {
        return !values.includes(option.value);
      });

      for (const id of values) {
        member.roles.add(id);
      }

      for (const id of removed) {
        member.roles.remove(id.value);
      }

      interaction.reply({
        content: `${client.config.helpers.check_mark} | Your roles have been successfully edited.`,
        ephemeral: true
      });
    }
  }
};
