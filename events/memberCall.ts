import { Events, VoiceState, EmbedBuilder, TextChannel } from "discord.js";

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState: VoiceState, newState: VoiceState) {
    if (!oldState.channel && newState.channel) {
      const member = newState.member;
      const channel = newState.channel;

      if (!member) return;

      const logChannelId = '1250542002597269565'; // Substitua pelo ID do seu canal de log
      const logChannel = member.guild.channels.cache.get(logChannelId) as TextChannel;

      if (!logChannel) {
        console.error(`Channel with id ${logChannelId} not found.`);
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('Entrou em um canal de voz')
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
          { name: 'Usuário', value: member.user.tag, inline: true },
          { name: 'Horário', value: new Date().toLocaleTimeString(), inline: true },
          { name: 'Call', value: channel.name, inline: true }
        )
        .setColor(0x0099ff)
        .setTimestamp();

      try {
        await logChannel.send({ embeds: [embed] });
        console.log(`Embed enviada para o canal de log ${logChannel.name}.`);
      } catch (e) {
        console.error(e);
      }
    }

    if (oldState.channel && !newState.channel) {
      const member = oldState.member;
      const channel = oldState.channel;

      if (!member) return;

      const logChannelId = '1250542002597269565'; // Substitua pelo ID do seu canal de log
      const logChannel = member.guild.channels.cache.get(logChannelId) as TextChannel;

      if (!logChannel) {
        console.error(`Channel with id ${logChannelId} not found.`);
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('Saiu de um canal de voz')
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
          { name: 'Usuário', value: member.user.tag, inline: true },
          { name: 'Horário', value: new Date().toLocaleTimeString(), inline: true },
          { name: 'Call', value: channel.name, inline: true }
        )
        .setColor(0xff0000)
        .setTimestamp();

      try {
        await logChannel.send({ embeds: [embed] });
        console.log(`Embed enviada para o canal de log ${logChannel.name}.`);
      } catch (e) {
        console.error(e);
      }
    }
  },
};
