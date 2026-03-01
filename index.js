const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

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
const clientId = process.env.CLIENT_ID; // Set in Render
const guildId = process.env.GUILD_ID;   // Optional: for testing slash commands per guild

// Load all cogs
function loadCommands(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            loadCommands(fullPath);
        } else if (file.name.endsWith('.js')) {
            const exported = require(fullPath);
            if (Array.isArray(exported)) {
                for (const cmd of exported) {
                    client.commands.set(cmd.name, cmd);
                    if (cmd.slashData) slashCommands.push(cmd.slashData.toJSON());
                }
            } else {
                client.commands.set(exported.name, exported);
                if (exported.slashData) slashCommands.push(exported.slashData.toJSON());
            }
        }
    }
}

// Load all commands
loadCommands('./commands');

// Register slash commands
const rest = new REST({ version: '10' }).setToken(token);
(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: slashCommands }
        );
        console.log('Slash commands registered!');
    } catch (err) {
        console.error(err);
    }
})();

// Ready event
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Message (prefix) handler
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
        console.error(err);
        message.reply('There was an error executing that command.');
    }
});

// Slash command handler
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command || !command.slashExecute) return;

    try {
        await command.slashExecute(interaction);
    } catch (err) {
        console.error(err);
        interaction.reply({ content: 'There was an error executing that command.', ephemeral: true });
    }
});

client.login(token);
