const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('askblackbox')
        .setDescription('Integração com a blackbox')
        .addStringOption((option: any) => 
            option.setName('question')
                .setDescription('Insira sua pergunta')
                .setRequired(true)),
    async execute(interaction: any) {
        const question = interaction.options.getString('question');
        await interaction.deferReply();

        try {
            const response = await axios.post('https://www.blackbox.ai/api/chat', {
                id: 'pgK5Du2', 
                previewToken: null,
                userId: 'a369da6d-f18c-4c69-b99b-6a59c41466f1',
                codeModelMode: true,
                agentMode: {},
                trendingAgentMode: {},
                isMicMode: false,
                isChromeExt: false,
                githubToken: null,
                clickedAnswer2: false,
                clickedAnswer3: false,
                visitFromURL: null,
                messages: [{ content: question, role: 'user' }],
            });

            let message = response.data;
            message = message.replace(/\$~~~\$(.*?)\$~~~\$/, '');

            const embed = new EmbedBuilder()
                .setColor('#563AF5')
                .setTitle('AI Response')
                .setDescription(`Here's the answer to your question: ${message}`);

            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error fetching AI response:', error);
            await interaction.editReply('An error occurred while processing your question.');
        }
    }
};
