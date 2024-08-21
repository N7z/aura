const { PermissionsBitField, SlashCommandBuilder, TextChannel } = require('discord.js');

export const data = new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Aviso de infração.')
    .addUserOption((option: any) => 
        option.setName('user')
            .setDescription('O usuário a receber warn')
            .setRequired(true))
    .addStringOption((option: any) =>
        option.setName('reason')
            .setDescription('A razão do warn')
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

    let warnRole = interaction.guild.roles.cache.find((role: any) => role.name === 'Warned');
    
    if (!warnRole) {
        try {
            warnRole = await interaction.guild.roles.create({
                name: 'Warned',
                color: '#808080',
            });
        } catch (error) {
            console.error('Erro ao criar a role Warned:', error);
            await interaction.reply('Ocorreu um erro ao tentar criar a role Muted.');
            return;
        }
    }

    try {
        await target.roles.add(warnRole, reason);
        const reply = await interaction.reply(`${target.user.tag} tomou warn por: ${reason}`);
        setTimeout(() => reply.delete(), 4000);
    } catch (error) {
        console.error('Erro ao dar warn no usuário:', error);
        const reply = await interaction.reply('Ocorreu um erro ao tentar dar warn no usuário.');
        setTimeout(() => reply.delete(), 4000);
    }
}
