import { Client, Collection, GatewayIntentBits, Events, IntentsBitField } from 'discord.js';
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
  events: Collection<string, any>;
  
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds, 
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMessages, 
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildModeration,
        IntentsBitField.Flags.GuildMembers,
      ],
    });
    this.commands = new Collection();
    this.events = new Collection();
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

// criando novo client
const client = new MyClient();


//chamando comandos 
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


// chamando eventos
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file: string) => file.endsWith('.ts'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.name && event.execute) {
        client.on(event.name, event.execute);
    } else {
        console.log(`Event in ${filePath} doesn't have "name" or "execute".`);
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
