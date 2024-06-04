const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('askgemini')
        .setDescription('Integração com a Gemini')
        .addStringOption((option: any) => 
            option.setName('question')
                .setDescription('Insira sua pergunta')
                .setRequired(true)),
    async execute(interaction: any) {
        const question = interaction.options.getString('question');
        
        await interaction.deferReply();
        
        try {
            const gemini = new GoogleGenerativeAI(process.env.GEMINI_TOKEN);
            const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash"});
            const prompt = question;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            const embed = new EmbedBuilder()
                .setColor('#563AF5')
                .setTitle('AI Response')
                .setDescription(`Here's the answer to your question: ${text}`);
            
            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error fetching AI response:', error);
            await interaction.editReply('An error occurred while processing your question.');
        }
    }
};
