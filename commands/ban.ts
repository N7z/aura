import { CacheType, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder } from 'discord.js';

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
      return interaction.reply({ content: `${user.tag} foi banido. Razão: ${reason}` });
    } catch (error) {
      console.error('Erro ao banir usuário:', error);
      return interaction.reply({ content: 'Houve um erro ao tentar banir este usuário.', ephemeral: true });
    }
  },
};
