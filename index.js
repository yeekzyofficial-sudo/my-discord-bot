const fs = require('fs');
const path = require('path');
const express = require('express');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

// ---------- EXPRESS SERVER ----------
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// ---------- DISCORD BOT ----------
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
});

const PREFIX = 'k.';
client.commands = new Collection();
const slashCommands = [];

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // optional

// ---------- SAFE COG LOADER ----------
function loadCommands(dir) {
    if (!fs.existsSync(dir)) {
        console.warn(`Commands folder not found: ${dir}`);
        return;
    }

    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        try {
            if (file.isDirectory()) {
                loadCommands(fullPath);
            } else if (file.name.endsWith('.js')) {
                const exported = require(fullPath);

                if (Array.isArray(exported)) {
                    exported.forEach(cmd => {
                        if (!cmd.name) {
                            console.warn(`Command in ${file.name} has no name, skipping.`);
                            return;
                        }
                        client.commands.set(cmd.name, cmd);
                        if (cmd.slashData) slashCommands.push(cmd.slashData.toJSON());
                        console.log(`Loaded command: ${cmd.name}`);
                    });
                } else {
                    if (!exported.name) {
                        console.warn(`Command in ${file.name} has no name, skipping.`);
                        continue;
                    }
                    client.commands.set(exported.name, exported);
                    if (exported.slashData) slashCommands.push(exported.slashData.toJSON());
                    console.log(`Loaded command: ${exported.name}`);
                }
            }
        } catch (err) {
            console.error(`Failed to load command file ${file.name}:`, err);
        }
    }
}

loadCommands(path.join(__dirname, 'commands'));

// ---------- REGISTER SLASH COMMANDS ----------
(async () => {
    if (slashCommands.length === 0) return;

    const rest = new REST({ version: '10' }).setToken(token);
    try {
        console.log('Registering slash commands...');
        if (guildId) {
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashCommands });
        } else {
            await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });
        }
        console.log('Slash commands registered!');
    } catch (err) {
        console.error('Error registering slash commands:', err);
    }
})();

// ---------- READY EVENT ----------
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// ---------- PREFIX HANDLER ----------
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command || !command.prefixExecute) return;

    try {
        await command.prefixExecute(message, args);
    } catch (err) {
        console.error(`Error executing prefix command ${commandName}:`, err);
        message.reply('There was an error executing that command.');
    }
});

// ---------- SLASH HANDLER ----------
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command || !command.slashExecute) return;

    try {
        await command.slashExecute(interaction);
    } catch (err) {
        console.error(`Error executing slash command ${interaction.commandName}:`, err);
        interaction.reply({ content: 'There was an error executing that command.', ephemeral: true });
    }
});

client.login(token);
