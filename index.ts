import { Client, Collection, GatewayIntentBits, Events } from 'discord.js';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const { TOKEN } = process.env;

interface CustomClient extends Client {
  commands: Collection<string, any>;
}

// Estender a classe Client
class MyClient extends Client implements CustomClient {
  commands: Collection<string, any>;

  constructor() {
    super({
      intents: [],
    });
    this.commands = new Collection();
  }
}

const client = new MyClient() as CustomClient;

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`Command in ${filePath} doesn't have "data" or "execute".`);
    }
}

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(TOKEN);

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command:any = client.commands.get(interaction.commandName);
    if(!command) {
        console.error('Cannot find this command.');
        return;
    }
    try {
        await command.execute(interaction);
    } catch(e) {
        console.error(e);
        await interaction.reply('Got an error.');
    }
});
