import { Collection, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { SlashCommand, PrefixCommand, BotClient } from '../types';
import { config } from '../config';

export async function loadCommands(client: BotClient) {
    const slashCommands = [];
    client.slashCommands = new Collection<string, SlashCommand>();
    client.prefixCommands = new Collection<string, PrefixCommand>();

    const slashCommandsPath = join(__dirname, '..', 'commands', 'slash').replace('dist', 'src');
    const slashCommandFiles = readdirSync(slashCommandsPath).filter(file => file.endsWith('.ts'));

    for (const file of slashCommandFiles) {
        const filePath = join(slashCommandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.slashCommands.set(command.data.name, command);
            slashCommands.push(command.data.toJSON());
        }
    }

    const prefixCommandsPath = join(__dirname, '..', 'commands', 'prefix').replace('dist', 'src');
    const prefixCommandFiles = readdirSync(prefixCommandsPath).filter(file => file.endsWith('.ts'));

    for (const file of prefixCommandFiles) {
        const filePath = join(prefixCommandsPath, file);
        const command = require(filePath);

        if ('name' in command && 'execute' in command) {
            client.prefixCommands.set(command.name, command);
        }
    }

    const rest = new REST({ version: '10' }).setToken(config.token);

    try {
        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: slashCommands }
        );
    } catch (error) {
    }
} 