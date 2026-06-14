import { Events, Interaction } from 'discord.js';
import { handleSlashCommand } from '../handlers/slashCommandHandler';

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        await handleSlashCommand(interaction);
    },
};