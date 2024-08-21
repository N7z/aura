import { SlashCommandBuilder, CommandInteraction, PermissionsBitField, ChannelType, TextChannel } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Permite que o cargo @everyone envie mensagens no canal atual'),

  async execute(interaction: CommandInteraction) {
    if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
    }

    const channel = interaction.channel;

    if (!channel || channel.type !== ChannelType.GuildText) {
      return interaction.reply({ content: 'Este comando só pode ser usado em canais de texto.', ephemeral: true });
    }

    try {
      const everyoneRole = interaction.guild?.roles.everyone;

      if (!everyoneRole) {
        return interaction.reply({ content: 'Cargo @everyone não encontrado.', ephemeral: true });
      }

      await (channel as TextChannel).permissionOverwrites.edit(everyoneRole, {
        SendMessages: true,
      });

      await interaction.reply({ content: `🔒 O canal ${channel.name} foi desbloqueado com sucesso.`, ephemeral: false });
    } catch (error) {
      console.error('Erro ao bloquear o canal:', error);
      await interaction.reply({ content: 'Houve um erro ao tentar desbloquear o canal.', ephemeral: true });
    }
  },
};
