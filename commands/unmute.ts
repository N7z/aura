import { PermissionsBitField, SlashCommandBuilder, TextChannel } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove o mute de um usuário.')
    .addUserOption(option => 
        option.setName('user')
            .setDescription('O usuário a ser desmutado')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('reason')
            .setDescription('A razão do unmute')
            .setRequired(false));

export async function execute(interaction: any) {
    if (!interaction.guild) return;

    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (!member?.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        await interaction.reply('Você não tem permissão para usar este comando.');
        return;
    }

    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'Nenhuma razão fornecida';

    if (!target) {
        await interaction.reply('Usuário não encontrado.');
        return;
    }

    const muteRole = interaction.guild.roles.cache.find((role: any) => role.name === 'muted');

    if (!muteRole) {
        await interaction.reply('Role Muted não encontrada.');
        return;
    }

    try {
        await target.roles.remove(muteRole, reason);
        const reply = await interaction.reply(`${target.user.tag} foi desmutado.`);
        setTimeout(() => { reply.delete(); }, 5000);
    } catch (error) {
        console.error('Erro ao desmutar o usuário:', error);
        const reply = await interaction.reply('Ocorreu um erro ao tentar desmutar o usuário.');
        setTimeout(() => { reply.delete(); }, 5000);
    }
}
