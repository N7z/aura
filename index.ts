// const { Client, Collection, Events } = require('discord.js');
import { Client, Collection, GatewayIntentBits, Events } from 'discord.js';
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';

const { TOKEN } = process.env;

// Definição da interface CustomClient extendendo Client
interface CustomClient extends Client {
  commands: Collection<string, any>;
  login(token?: string): Promise<string>;
  once(event: string | symbol, listener: (...args: any[]) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;
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

  // Implementação dos métodos da interface CustomClient
  login(token?: string): Promise<string> {
    return super.login(token);
  }

  once(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }

  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }
}

const client = new MyClient();

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

client.once(Events.ClientReady, (c: any) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(TOKEN);

client.on(Events.InteractionCreate, async (interaction: any) => {
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

