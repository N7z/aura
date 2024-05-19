import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
const dotenv = require('dotenv');

dotenv.config(); // don't touch
const { TOKEN, CLIENT_ID }: any = process.env;

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));

const commands: any[] = [];

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(`Resetting ${commands.length} commands globally.`);
        
        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log('Successfully registered application commands globally.');
    } catch (e) {
        console.error(e);
    }
})();
