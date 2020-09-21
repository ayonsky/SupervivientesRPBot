'use strict';

const config = require('./config.json');
const fs = require('fs');
const { blue_dark, red_dark, green_light } = require('./colours.json');
const {Client, MessageEmbed, Collection} = require('discord.js');
const client = new Client();

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Bot is Ready!');
    client.channels.cache.get(config.normativaChannel).messages.fetch(config.normativaMessage);
});

client.on('messageReactionAdd', (messageReaction, user) => {
    const { message, emoji } = messageReaction;

    if(emoji.name == '✅' && message.id ==="712590416209248298"){
        client.commands.get('new-member').execute(message, user, MessageEmbed);
    }
});

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args, MessageEmbed);
    } catch (error) {
        console.error(error);
        message.reply('Hubo un error intentando ejecutar este comando!');
    }
});

client.login(config.token);