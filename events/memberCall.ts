import { Events, VoiceState, EmbedBuilder, TextChannel } from "discord.js";
import { format } from 'date-fns';
import { toDate } from 'date-fns-tz';

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState: VoiceState, newState: VoiceState) {
    const timeZone = 'America/Sao_Paulo';
    const logChannelId = '1250542002597269565'; // Substitua pelo ID do seu canal de log

    const logChannel = oldState.guild.channels.cache.get(logChannelId) as TextChannel || newState.guild.channels.cache.get(logChannelId) as TextChannel;

    if (!logChannel) {
      console.error(`Channel com id ${logChannelId} não encontrado.`);
      return;
    }

    const now = new Date();
    const zonedDate = toDate(now, { timeZone });
    const formattedTime = format(zonedDate, 'HH:mm:ss');

    // Usuário entrou em um canal de voz
    if (!oldState.channel && newState.channel) {
      const member = newState.member;
      const channel = newState.channel;

      if (!member) return;

      const embed = new EmbedBuilder()
        .setTitle('Entrou em um canal de voz')
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
          { name: 'Usuário', value: member.user.tag, inline: true },
          { name: 'Horário', value: formattedTime, inline: true },
          { name: 'Call', value: channel.name, inline: true }
        )
        .setColor(0x0099ff)
        .setTimestamp();

      try {
        await logChannel.send({ embeds: [embed] });
      } catch (e) {
        console.error(e);
      }
    }

    // Usuário saiu de um canal de voz
    if (oldState.channel && !newState.channel) {
      const member = oldState.member;
      const channel = oldState.channel;

      if (!member) return;

      const embed = new EmbedBuilder()
        .setTitle('Saiu de um canal de voz')
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
          { name: 'Usuário', value: member.user.tag, inline: true },
          { name: 'Horário', value: formattedTime, inline: true },
          { name: 'Call', value: channel.name, inline: true }
        )
        .setColor(0xff0000)
        .setTimestamp();

      try {
        await logChannel.send({ embeds: [embed] });
      } catch (e) {
        console.error(e);
      }
    }

    // Usuário trocou de canal de voz
    if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
      const member = newState.member;
      const oldChannel = oldState.channel;
      const newChannel = newState.channel;

      if (!member) return;

      const embed = new EmbedBuilder()
        .setTitle('Trocou de canal de voz')
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
          { name: 'Usuário', value: member.user.tag, inline: true },
          { name: 'Horário', value: formattedTime, inline: true },
          { name: 'De', value: oldChannel.name, inline: true },
          { name: 'Para', value: newChannel.name, inline: true }
        )
        .setColor(0xffff00)
        .setTimestamp();

      try {
        await logChannel.send({ embeds: [embed] });
      } catch (e) {
        console.error(e);
      }
    }
  },
};
