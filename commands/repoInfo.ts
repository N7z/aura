import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('repo-info')
		.setDescription('Provides information about the repository.'),
	async execute(interaction: any) {
		try {
			const commitsResponse = await axios.get(`https://api.github.com/repos/${process.env.OWNER}/${process.env.REPO}/commits`, {
				headers: {
					'Authorization': `token ${process.env.GITHUB_TOKEN}`
				}
			});
			const totalCommits = commitsResponse.data.length;
			const lastCommit = commitsResponse.data[0];
			const lastCommitDate = lastCommit.commit.author.date;
			const lastCommitAuthor = lastCommit.commit.author.name;

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

			await interaction.reply({ embeds: [embed] });
		} catch (error) {
			console.error('Erro ao obter informações do repositório:', error);
			await interaction.reply({ content: 'Ocorreu um erro ao obter informações do repositório.', ephemeral: true });
		}
	},
};
