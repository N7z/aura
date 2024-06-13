import { CommandInteraction } from 'discord.js';

module.exports = {
  data: {
    name: 'latency',
    description: 'Retorna a latência do bot.'
  },
  async execute(interaction: CommandInteraction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    interaction.editReply(`A latencia do bot é ${sent.createdTimestamp - interaction.createdTimestamp}ms. A latencia da api é ${Math.round(interaction.client.ws.ping)}ms.`);
  },
};
