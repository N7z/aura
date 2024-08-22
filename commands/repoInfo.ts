import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repo-info')
        .setDescription('Mostra informações do repositório do bot.'),
    async execute(interaction: any) {
        try {
            await interaction.deferReply();

            const perPage = 100;
            let page = 1;
            let totalCommits = 0;
            let lastCommitDate = '';
            let lastCommitAuthor = '';
            let firstIteration = true;

            while (true) {
                const commitsResponse = await axios.get(`https://api.github.com/repos/${process.env.OWNER}/${process.env.REPO}/commits`, {
                    headers: {
                        'Authorization': `token ${process.env.GITHUB_TOKEN}`
                    },
                    params: {
                        per_page: perPage,
                        page: page,
                    }
                });

                const commits = commitsResponse.data;

                if (commits.length === 0) break;

                if (firstIteration && commits.length > 0) {
                    lastCommitDate = commits[0].commit.author.date;
                    lastCommitAuthor = commits[0].commit.author.name;
                    firstIteration = false;
                }

                totalCommits += commits.length;
                page++;
            }

            const ownerResponse = await axios.get(`https://api.github.com/users/${process.env.OWNER}`, {
                headers: {
                    'Authorization': `token ${process.env.GITHUB_TOKEN}`
                }
            });
            const ownerProfile = ownerResponse.data;

            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`Informações do Repositório: ${process.env.REPO}`)
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .addFields(
                    { name: 'Total de Commits', value: `${totalCommits}`, inline: true },
                    { name: 'Última Commit', value: `${lastCommitDate}`, inline: true },
                    { name: 'Autor da Última Commit', value: `${lastCommitAuthor}`, inline: true },
                    { name: 'Proprietário do Repositório', value: `${ownerProfile.login}`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao obter informações do repositório:', error);
            await interaction.editReply({ content: 'Ocorreu um erro ao obter informações do repositório.', ephemeral: true });
        }
    },
};
