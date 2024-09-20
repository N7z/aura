const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile-scrapper')
        .setDescription('Pega a foto de perfil de um membro.')
        .addStringOption((option: any) =>
            option.setName('user_id')
                .setDescription('ID do usuário ou @membro')
                .setRequired(true)),
    async execute(interaction: any) {
        let userId = interaction.options.getString('user_id');

        try {
            if (userId.includes('<@')) userId = userId.split('<@').join().split('>').join().split(',')[1];

            const user = await interaction.client.users.fetch(userId);
            const avatarURL = user.displayAvatarURL({ dynamic: true });

            const embed = new EmbedBuilder()
                .setColor('#563AF5')
                .setTitle('Foto de Perfil')
                .setDescription(`Aqui está a foto de perfil de ${user.tag}:`)
                .setImage(avatarURL);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('Não foi possível encontrar o usuário. Verifique se o ID está correto.');
        }
    }
};
