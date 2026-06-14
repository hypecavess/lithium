import { Client, Collection, CommandInteraction, Message, SlashCommandBuilder } from 'discord.js';

export interface SlashCommand {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction) => Promise<void>;
}

export interface PrefixCommand {
    name: string;
    description: string;
    execute: (message: Message, args: string[]) => Promise<void>;
}

export interface BotClient extends Client {
    slashCommands: Collection<string, SlashCommand>;
    prefixCommands: Collection<string, PrefixCommand>;
} 