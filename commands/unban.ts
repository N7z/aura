import { CacheType, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, TextChannel, EmbedBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Desbane um usuário do servidor.')
    .addStringOption(option => 
      option.setName('userid')
        .setDescription('O ID do usuário a ser desbanido')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('A razão do desbanimento')
        .setRequired(false)),
  
  async execute(interaction: CommandInteraction) {
    if (!interaction.memberPermissions?.has('BanMembers')) {
      return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
    }

    const userId = (interaction.options as CommandInteractionOptionResolver<CacheType>).getString('userid')!;
    const reason = (interaction.options as CommandInteractionOptionResolver<CacheType>).getString('reason') || 'Sem razão especificada';

    try {
      const ban = await interaction.guild?.bans.fetch(userId);

      if (!ban) {
        return interaction.reply({ content: 'Este usuário não está banido.', ephemeral: true });
      }

      await interaction.guild?.members.unban(userId, reason);
      await interaction.reply({ content: `${ban.user.tag} foi desbanido. Razão: ${reason}` });

      const logChannelId = '1275323099482423360';
      const logChannel = interaction.guild?.channels.cache.get(logChannelId) as TextChannel;

      if (!logChannel) {
        console.error('Canal de log não encontrado');
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('Usuário Desbanido')
        .setColor('Green')
        .setThumbnail(ban.user.displayAvatarURL())
        .addFields([
          { name: 'Usuário Desbanido', value: `${ban.user.tag} (${ban.user.id})`, inline: false },
          { name: 'Servidor', value: interaction.guild?.name || 'Servidor Desconhecido', inline: false },
          { name: 'Autor do Desbanimento', value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
          { name: 'Motivo do Desbanimento', value: reason, inline: false },
        ])
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
      console.log(`Desbanimento registrado no canal de log: ${ban.user.tag}`);
    } catch (error) {
      console.error('Erro ao desbanir usuário:', error);
      return interaction.reply({ content: 'Houve um erro ao tentar desbanir este usuário.', ephemeral: true });
    }
  },
};
