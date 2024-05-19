const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config(); // don't touch
const { TOKEN, CLIENT_ID }: any = process.env;


const rest = new REST().setToken(TOKEN);

rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);
