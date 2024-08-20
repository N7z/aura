import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, Interaction, TextChannel, Message } from 'discord.js';
import fs from 'fs';
import path from 'path';
import config from '../config.json';
import { promises } from 'dns';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('painel')
        .setDescription('Mostra o painel de configuração do bot.'),
    async execute(interaction: any) {
        const sent = await interaction.reply({ content: 'Carregando painel...', fetchReply: true, ephemeral: true });

        const embed = new EmbedBuilder()
            .setColor('#563AF5')
            .setTitle('Aura Bot')
            .setDescription(`Boa tarde senhor(a) **${interaction.user.username}**, o que deseja fazer?`)
            .addFields(
                { name: 'Versão do bot', value: '1.0.0', inline: true },
                { name: 'Ping', value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
            );

        // Criação do Select Menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select_menu')
            .setPlaceholder('Escolha uma opção')
            .addOptions([
                { label: 'Loja', value: 'loja' },
                { label: 'Ticket', value: 'ticket' },
                { label: 'Boas vindas', value: 'boas_vindas' },
                { label: 'Ações Automáticas', value: 'acoes_automaticas' },
                { label: 'Definições', value: 'definicoes' },
                { label: 'Proteção', value: 'protecao' },
                { label: 'Personalização', value: 'personalizacao' },
            ]);

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(selectMenu);

        // Adicionando Botões
        const row2 = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('refresh')
                    .setLabel('Atualizar')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('help')
                    .setLabel('Ajuda')
                    .setStyle(ButtonStyle.Primary),
            );

        await interaction.editReply({ content: null, embeds: [embed], components: [row, row2] });

        const filter = (i: Interaction) => i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (i: any) => {
            if (i.isStringSelectMenu()) {
                const selectedOption = i.values[0];

                const descriptions: { [key: string]: string } = {
                    'protecao': 'Proteja seu servidor!',
                    'loja': 'Bem-vindo à loja!',
                    'acoes_automaticas': 'Configure as ações automáticas!',
                    'definicoes': 'Ajuste as definições do bot!',
                    'personalizacao': 'Personalize seu servidor!'
                };

                if (selectedOption === 'boas_vindas') {
                    await i.deferReply({ ephemeral: true });

                    await i.followUp('Por favor, envie o ID do cargo que deseja configurar para boas-vindas (20 segundos para confirmação).');
                    const channel = interaction.channel as TextChannel;

                    const messageFilter = (m: Message) => m.author.id === interaction.user.id;

                    try {
                        const collected = await channel.awaitMessages({
                            filter: messageFilter,
                            max: 1,
                            time: 20000,
                            errors: ['time']
                        });
                    
                        const messages = await channel.messages.fetch({ limit: 1 });
                        const lastMessage = messages.first();
                    
                        if (collected) {
                            console.log('Mensagem coletada.');
                        }
                    
                        if (lastMessage == null) {
                            await i.followUp({ content: 'Nenhuma mensagem encontrada.', ephemeral: true });
                            return;
                        }
                    
                        if (lastMessage) {
                            const messageContent = lastMessage.content.trim();
                            console.log('ID do cargo de boas-vindas recebido:', messageContent);
                    
                            config.welcomeRoleId = messageContent;
                            const configPath = path.resolve(__dirname, '../config.json');
                            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                            console.log('Arquivo de configuração atualizado com sucesso.');
                            
                            await i.followUp({ content: 'Cargo de boas-vindas configurado com sucesso.', ephemeral: true });
                        } else {
                            await i.followUp({ content: 'Nenhuma mensagem encontrada.', ephemeral: true });
                        }
                    } catch (e) {
                        console.error(e);
                        await i.followUp({ content: 'Ocorreu um erro ao processar sua solicitação.', ephemeral: true });
                    }
                } else if (descriptions[selectedOption]) {
                    embed.setDescription(descriptions[selectedOption]);
                    await i.update({ embeds: [embed], components: [row, row2] });
                } else {
                    await i.reply({ content: 'Opção não implementada.', ephemeral: true });
                }
            } else if (i.isButton()) {
                if (i.customId === 'refresh') {
                    await i.update({ content: 'Painel atualizado!', embeds: [embed], components: [row, row2], ephemeral: true });
                } else if (i.customId === 'help') {
                    await i.reply({ content: 'Aqui está a ajuda disponível para o painel.', ephemeral: true });
                } else {
                    await i.reply({ content: 'Botão não implementado.', ephemeral: true });
                }
            }
        });

        collector.on('end', (collected: any) => {
            if (collected.size === 0) {
                interaction.followUp('Tempo esgotado. Por favor, tente novamente.');
            }
        });
    }
};
