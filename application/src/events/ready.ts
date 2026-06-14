import { Client, Events } from 'discord.js';

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        if (!client.user) return;
        console.log(`Bot ${client.user.tag} has logged in!`);
    },
};