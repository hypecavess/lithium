import { Message } from 'discord.js';

module.exports = {
    name: 'ping',
    description: 'Shows the bot\'s ping',
    
    async execute(message: Message, args: string[]) {
        const ping = message.client.ws.ping;
        await message.reply(`Pong! ${ping}ms`);
    },
};