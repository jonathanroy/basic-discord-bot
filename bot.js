require('dotenv').config();
const Discord = require('discord.js');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});

const BOT_TOKEN = process.env.BOT_TOKEN;
const CMD_PREFIX = process.env.CMD_PREFIX;

bot.login(BOT_TOKEN);

bot.on('ready', () => {
    console.log(`Connected as ${bot.user.tag}`);
});

bot.on('message', msg => {
    if (msg.author.bot) return;

    if (msg.content.startsWith(CMD_PREFIX)) {
        const args = msg.content.split(/ +/);
        const command = args.shift().toLowerCase().substring(CMD_PREFIX.length);
        console.info(`Called command: ${command}`);

        if (!bot.commands.has(command)) return;

        try {
            bot.commands.get(command).execute(msg, args);
        } catch (error) {
            console.error(error);
            msg.reply('there was an error trying to execute that command!');
        }
    }
});
