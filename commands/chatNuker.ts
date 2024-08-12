import { TextChannel, SlashCommandBuilder } from 'discord.js';

module.exports = {
   data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Nuka o chat atual, recriando-o com as mesmas permissões.'),
        
    async execute(interaction: any) {
        if (!interaction.guild) return;

    const channel = interaction.channel;
    if (!(channel instanceof TextChannel)) {
        await interaction.reply('Este comando só pode ser usado em canais de texto.');
        return;
    }

    try {
        const channelPosition = channel.position;
        const newChannel = await channel.clone();

        await channel.delete('Nuked the channel');
        await newChannel.setPosition(channelPosition);
        await newChannel.send('Este canal foi nukado!');
    } catch (error) {
            console.error('Erro ao nukar o canal:', error);
            await interaction.reply('Ocorreu um erro ao tentar nukar o canal.');
        }
    }
};
