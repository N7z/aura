const { SlashCommandBuilder, Embed, EmbedBuilder, MessageActionRow, MessageButton  } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile-scrapper')
        .setDescription('Recive a member and replies his profile picture')
        .addUserOption((option:any) =>
            option.setName('membro')
                .setDescription('Mencione o membro, exemplo: @membro')
                .setRequired(true)),
        async execute(interaction:any) {
            const member = interaction.options.getMember('membro');

            if (!member) {
                await interaction.reply('Você deve fornecer um membro válido.');
                return;
            }

            const avatarURL = member.user.displayAvatarURL({ dynamic: true });

            const embed = new EmbedBuilder()
                .setColor('563AF5')
                .setTitle('Foto de Perfil')
                .setDescription(`Aqui está a foto de perfil de ${member.user.tag}:`)
                .setImage(avatarURL);
            
            await interaction.reply({ embeds: [embed] }); 
        }
}