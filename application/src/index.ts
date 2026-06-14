import { Client, GatewayIntentBits } from 'discord.js';
import { config } from './config';
import { loadCommands } from './handlers/commandHandler';
import { loadEvents } from './handlers/eventHandler';
import { BotClient } from './types';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
}) as BotClient;

(async () => {
    await loadEvents(client);
    
    await loadCommands(client);
    
    await client.login(config.token);
})().catch(error => {
}); 