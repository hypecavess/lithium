import { Events, Message } from 'discord.js';
import { BotClient } from '../types';
import { config } from '../config';

module.exports = {
    name: Events.MessageCreate,
    async execute(message: Message) {
        if (message.author.bot) return;
        if (!message.content.startsWith(config.prefix)) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;

        const client = message.client as BotClient;
        const command = client.prefixCommands.get(commandName);

        if (!command) return;

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            await message.reply('An error occurred while executing this command');
        }
    },
};