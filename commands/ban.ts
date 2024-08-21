import { CacheType, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, TextChannel, EmbedBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bane um usuário do servidor.')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('O usuário a ser banido')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('A razão do banimento')
        .setRequired(false)),
  
  async execute(interaction: CommandInteraction) {
    if (!interaction.memberPermissions?.has('BanMembers')) {
      return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
    }

    const user = (interaction.options as CommandInteractionOptionResolver<CacheType>).getUser('user')!;
    const reason = (interaction.options as CommandInteractionOptionResolver<CacheType>).getString('reason') || 'Sem razão especificada';

    if (!user) {
      return interaction.reply({ content: 'Usuário não encontrado.', ephemeral: true });
    }

    const member = interaction.guild?.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: 'Membro não encontrado no servidor.', ephemeral: true });
    }

    if (!member.bannable) {
      return interaction.reply({ content: 'Eu não posso banir este usuário.', ephemeral: true });
    }

    try {
      await member.ban({ reason });
      await interaction.reply({ content: `${user.tag} foi banido. Razão: ${reason}` });

      const logChannelId = '1275323099482423360';
      const logChannel = interaction.guild?.channels.cache.get(logChannelId) as TextChannel;

      if (!logChannel) {
        console.error('Canal de log não encontrado');
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('Usuário Banido')
        .setColor('Red')
        .setThumbnail(user.displayAvatarURL())
        .addFields([
          { name: 'Usuário Banido', value: `${user.tag} (${user.id})`, inline: false },
          { name: 'Servidor', value: interaction.guild?.name || 'Servidor Desconhecido', inline: false },
          { name: 'Autor do Banimento', value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
          { name: 'Motivo', value: reason, inline: false },
        ])
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
      console.log(`Banimento registrado no canal de log: ${user.tag}`);
    } catch (error) {
      console.error('Erro ao banir usuário:', error);
      return interaction.reply({ content: 'Houve um erro ao tentar banir este usuário.', ephemeral: true });
    }
  },
};
