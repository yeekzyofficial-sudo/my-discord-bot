const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function getRandomFooter(list) { return list[randomInt(0, list.length - 1)]; }

module.exports = [
  {
    name: 'dihmeter',
    description: "Check someone's dih size in inches 🍆",
    prefixExecute: async (message, args) => {
      const target = message.mentions.users.first() || message.author;
      const inches = randomInt(1,25);
      const embed = new EmbedBuilder()
        .setColor('#ff4444')
        .setTitle('🍆 Dih Meter 🍆')
        .setDescription(`Checking the **Dih Inches** for ${target}...`)
        .addFields({ name: 'Result:', value: `**${inches} ${inches===1?'inch':'inches'}**` })
        .setThumbnail(target.displayAvatarURL({ size:256 }))
        .setFooter({ text: getRandomFooter(['Certified','God-tier monster 🐉🔥','Legendary proportions ⚡','Epic size detected 🚀','Handle with care 🛡️']) });
      await message.channel.send({ embeds: [embed] });
    },
    slashData: new SlashCommandBuilder()
      .setName('dihmeter').setDescription("Check someone's dih size 🍆")
      .addUserOption(o=>o.setName('user').setDescription('User to check').setRequired(false)),
    slashExecute: async (interaction) => {
      const target = interaction.options.getUser('user') || interaction.user;
      const inches = randomInt(1,25);
      const embed = new EmbedBuilder()
        .setColor('#ff4444')
        .setTitle('🍆 Dih Meter 🍆')
        .setDescription(`Checking the **Dih Inches** for ${target}...`)
        .addFields({ name: 'Result:', value: `**${inches} ${inches===1?'inch':'inches'}**` })
        .setThumbnail(target.displayAvatarURL({ size:256 }))
        .setFooter({ text: getRandomFooter(['Certified','God-tier monster 🐉🔥','Legendary proportions ⚡','Epic size detected 🚀','Handle with care 🛡️']) });
      await interaction.reply({ embeds: [embed] });
    }
  },
  {
    name: 'gaymeter',
    description: "Check someone's gay percentage 🌈",
    prefixExecute: async (message, args) => {
      const target = message.mentions.users.first() || message.author;
      const percent = randomInt(1,100);
      const comment = percent>=90?'Ultra certified rainbow 🌈✨':percent>=70?'Very flamboyant legend 🦄':percent>=40?'Fabulous! 💃🔥':percent>=20?'A little sparkle here and there ✨':'Straight vibes 🚬';
      const embed = new EmbedBuilder()
        .setColor('#ff69b4')
        .setTitle('🌈 Gay Meter 🌈')
        .setDescription(`Scanning ${target} for gay energy...`)
        .addFields({ name:'Result:', value:`**${percent}%** gay` },{ name:'Verdict:', value:comment })
        .setThumbnail(target.displayAvatarURL({ size:256 }))
        .setFooter({ text: getRandomFooter(['Fabulous era activated 💅','Rainbow mode 🌈','Slayyyyy 🔥','Extra sparkle ✨','Legendary vibes ⚡']) });
      await message.channel.send({ embeds: [embed] });
    },
    slashData: new SlashCommandBuilder()
      .setName('gaymeter').setDescription("Check someone's gay percentage 🌈")
      .addUserOption(o=>o.setName('user').setDescription('User to check').setRequired(false)),
    slashExecute: async (interaction) => {
      const target = interaction.options.getUser('user') || interaction.user;
      const percent = randomInt(1,100);
      const comment = percent>=90?'Ultra certified rainbow 🌈✨':percent>=70?'Very flamboyant legend 🦄':percent>=40?'Fabulous! 💃🔥':percent>=20?'A little sparkle here and there ✨':'Straight vibes 🚬';
      const embed = new EmbedBuilder()
        .setColor('#ff69b4')
        .setTitle('🌈 Gay Meter 🌈')
        .setDescription(`Scanning ${target} for gay energy...`)
        .addFields({ name:'Result:', value:`**${percent}%** gay` },{ name:'Verdict:', value:comment })
        .setThumbnail(target.displayAvatarURL({ size:256 }))
        .setFooter({ text: getRandomFooter(['Fabulous era activated 💅','Rainbow mode 🌈','Slayyyyy 🔥','Extra sparkle ✨','Legendary vibes ⚡']) });
      await interaction.reply({ embeds: [embed] });
    }
  }
];
