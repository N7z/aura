import { SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purger')
        .setDescription('Apagar mensagens.')
        .addIntegerOption((option:any) =>
            option.setName('number')
                .setDescription('Número de mensagens, exemplo: 100')
                .setRequired(true)),
        async execute(interaction:any) {
            const channel = interaction.channel;
            const amount = interaction.options.getInteger('number');
            
            const messages = await channel.messages.fetch({ limit: amount });
            await channel.bulkDelete(messages);

            const reply = await interaction.reply(`${amount} mensagens apagadas neste chat.`);

            setTimeout(async () => {
                await reply.delete()
            }, 5000);

        }
}