import { Events, Message, PartialMessage, TextChannel, EmbedBuilder } from "discord.js";

module.exports = {
    name: Events.MessageDelete,
    async execute(message: Message | PartialMessage) {
        if (message.partial) {
            try {
                await message.fetch();
            } catch (error) {
                console.error('Erro ao buscar a mensagem deletada:', error);
                return;
            }
        }

        const logChannelId = '1275319397283794944'; // Substitua pelo ID do seu canal de log
        const logChannel = message.guild?.channels.cache.get(logChannelId) as TextChannel;

        if (!logChannel) {
            console.error('Canal de log não encontrado');
            return;
        }

        const user = message.author ?? { tag: 'Desconhecido', displayAvatarURL: () => '', id: 'Desconhecido' };
        const messageContent = message.content
            ? message.content
            : message.embeds.length > 0
                ? 'Mensagem contém um embed.'
                : message.attachments.size > 0
                    ? 'Mensagem contém anexos.'
                    : 'Nenhum conteúdo';

        const embed = new EmbedBuilder()
            .setTitle('Mensagem Deletada')
            .setColor('Red')
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: 'Usuário', value: `${user.tag} (${user.id})`, inline: false },
                { name: 'Canal', value: `${(message.channel as TextChannel).name}`, inline: false },
                { name: 'Conteúdo da Mensagem', value: messageContent, inline: false }
            )
            .setTimestamp();

        try {
            await logChannel.send({ embeds: [embed] });
        } catch (e) {
            console.error('Erro ao enviar a embed no canal de log:', e);
        }
    },
};
