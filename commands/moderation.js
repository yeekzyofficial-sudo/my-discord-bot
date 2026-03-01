module.exports = [
    {
        name: 'kick',
        description: 'Kick a member with a reason',

        prefixExecute: async (message, args) => {
            if (!message.member.permissions.has('KickMembers'))
                return message.reply("You don't have permission to kick members.");

            const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!target) return message.reply('You must mention a valid member or provide their ID.');

            const reason = args.slice(1).join(' ');
            if (!reason) return message.reply('You must provide a reason for the kick.');
            if (!target.kickable) return message.reply("I cannot kick this user.");

            await target.kick(reason)
                .then(() => message.channel.send(`${target.user.tag} was kicked. Reason: ${reason}`))
                .catch(() => message.reply('Failed to kick the user.'));
        },

        slashData: require('@discordjs/builders').SlashCommandBuilder()
            .setName('kick')
            .setDescription('Kick a member')
            .addUserOption(opt => opt.setName('user').setDescription('User to kick').setRequired(true))
            .addStringOption(opt => opt.setName('reason').setDescription('Reason for kick').setRequired(true)),

        slashExecute: async (interaction) => {
            if (!interaction.member.permissions.has('KickMembers'))
                return interaction.reply({ content: "You don't have permission to kick members.", ephemeral: true });

            const target = interaction.options.getMember('user');
            const reason = interaction.options.getString('reason');

            if (!target.kickable) return interaction.reply({ content: "I cannot kick this user.", ephemeral: true });

            await target.kick(reason)
                .then(() => interaction.reply(`${target.user.tag} was kicked. Reason: ${reason}`))
                .catch(() => interaction.reply({ content: 'Failed to kick the user.', ephemeral: true }));
        }
    },
    {
        name: 'ban',
        description: 'Ban a member temporarily',

        prefixExecute: async (message, args) => {
            if (!message.member.permissions.has('BanMembers'))
                return message.reply("You don't have permission to ban members.");

            const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!target) return message.reply('You must mention a valid member or provide their ID.');

            const time = parseInt(args[1]);
            if (isNaN(time)) return message.reply('You must provide a valid time in days.');

            const reason = args.slice(2).join(' ');
            if (!reason) return message.reply('You must provide a reason for the ban.');
            if (!target.bannable) return message.reply("I cannot ban this user.");

            await target.ban({ reason })
                .then(() => {
                    message.channel.send(`${target.user.tag} was banned for ${time} day(s). Reason: ${reason}`);
                    setTimeout(() => { message.guild.members.unban(target.id).catch(() => {}); }, time * 24*60*60*1000);
                })
                .catch(() => message.reply('Failed to ban the user.'));
        },

        slashData: require('@discordjs/builders').SlashCommandBuilder()
            .setName('ban')
            .setDescription('Ban a member temporarily')
            .addUserOption(opt => opt.setName('user').setDescription('User to ban').setRequired(true))
            .addIntegerOption(opt => opt.setName('days').setDescription('Duration in days').setRequired(true))
            .addStringOption(opt => opt.setName('reason').setDescription('Reason for ban').setRequired(true)),

        slashExecute: async (interaction) => {
            if (!interaction.member.permissions.has('BanMembers'))
                return interaction.reply({ content: "You don't have permission to ban members.", ephemeral: true });

            const target = interaction.options.getMember('user');
            const time = interaction.options.getInteger('days');
            const reason = interaction.options.getString('reason');

            if (!target.bannable) return interaction.reply({ content: "I cannot ban this user.", ephemeral: true });

            await target.ban({ reason })
                .then(() => {
                    interaction.reply(`${target.user.tag} was banned for ${time} day(s). Reason: ${reason}`);
                    setTimeout(() => { interaction.guild.members.unban(target.id).catch(() => {}); }, time * 24*60*60*1000);
                })
                .catch(() => interaction.reply({ content: 'Failed to ban the user.', ephemeral: true }));
        }
    },
    {
        name: 'permban',
        description: 'Permanently ban a member',

        prefixExecute: async (message, args) => {
            if (!message.member.permissions.has('BanMembers'))
                return message.reply("You don't have permission to ban members.");

            const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!target) return message.reply('You must mention a valid member or provide their ID.');

            const reason = args.slice(1).join(' ');
            if (!reason) return message.reply('You must provide a reason for the permanent ban.');
            if (!target.bannable) return message.reply("I cannot ban this user.");

            await target.ban({ reason })
                .then(() => message.channel.send(`${target.user.tag} was permanently banned. Reason: ${reason}`))
                .catch(() => message.reply('Failed to ban the user.'));
        },

        slashData: require('@discordjs/builders').SlashCommandBuilder()
            .setName('permban')
            .setDescription('Permanently ban a member')
            .addUserOption(opt => opt.setName('user').setDescription('User to ban').setRequired(true))
            .addStringOption(opt => opt.setName('reason').setDescription('Reason for permban').setRequired(true)),

        slashExecute: async (interaction) => {
            if (!interaction.member.permissions.has('BanMembers'))
                return interaction.reply({ content: "You don't have permission to ban members.", ephemeral: true });

            const target = interaction.options.getMember('user');
            const reason = interaction.options.getString('reason');

            if (!target.bannable) return interaction.reply({ content: "I cannot ban this user.", ephemeral: true });

            await target.ban({ reason })
                .then(() => interaction.reply(`${target.user.tag} was permanently banned. Reason: ${reason}`))
                .catch(() => interaction.reply({ content: 'Failed to ban the user.', ephemeral: true }));
        }
    }
];
