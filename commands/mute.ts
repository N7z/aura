const { PermissionsBitField, SlashCommandBuilder, TextChannel } = require('discord.js');

export const data = new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Silencia um usuário.')
    .addUserOption((option: any) => 
        option.setName('user')
            .setDescription('O usuário a ser silenciado')
            .setRequired(true))
    .addStringOption((option: any) =>
        option.setName('reason')
            .setDescription('A razão do mute')
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

    let muteRole = interaction.guild.roles.cache.find((role: any) => role.name === 'muted');
    
    if (!muteRole) {
        try {
            muteRole = await interaction.guild.roles.create({
                name: 'Muted',
                color: '#808080',
                permissions: []
            });

            interaction.guild.channels.cache.forEach(async (channel: any) => {
                if (channel instanceof TextChannel) {
                    await channel.permissionOverwrites.create(muteRole!, {
                        SendMessages: false,
                        Speak: false,
                        Connect: false,
                        AddReactions: false,
                    });
                }
            });
        } catch (error) {
            console.error('Erro ao criar a role Muted:', error);
            await interaction.reply('Ocorreu um erro ao tentar criar a role Muted.');
            return;
        }
    }

    try {
        await target.roles.add(muteRole, reason);
        const reply = await interaction.reply(`${target.user.tag} foi silenciado por: ${reason}`);
        setTimeout(() => reply.delete(), 4000);
    } catch (error) {
        console.error('Erro ao silenciar o usuário:', error);
        const reply = await interaction.reply('Ocorreu um erro ao tentar silenciar o usuário.');
        setTimeout(() => reply.delete(), 4000);
    }
}
