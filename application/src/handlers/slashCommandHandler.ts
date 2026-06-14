import { Interaction } from 'discord.js';
import { BotClient } from '../types';

export async function handleSlashCommand(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const client = interaction.client as BotClient;
    const command = client.slashCommands.get(interaction.commandName);

    if (!command) {
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'An error occurred while executing the command',
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: 'An error occurred while executing the command',
                ephemeral: true
            });
        }
    }
} 