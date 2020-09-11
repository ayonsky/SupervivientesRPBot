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
    client.commands.get('info').execute(client, MessageEmbed);
});

client.on('messageReactionAdd', (messageReaction, user) => {
    const { message, emoji } = messageReaction;

    if(emoji.name == '📩' && message.channel.id == config.whitelistChannel && message.author != user.id) {
        client.commands.get('whitelist').execute(message, user, MessageEmbed);
    }

    if(emoji.name == '🕑' && message.channel.name.startsWith('whitelist-') && message.author != user.id) {
        client.commands.get('start-questionnarie').execute(message, user, MessageEmbed);
    }

    if(emoji.name == '🗑' && message.channel.name.startsWith('whitelist-') && message.author != user.id) {
        client.commands.get('delete-whitelist').execute(message, user, MessageEmbed);
    }

    if(emoji.name == '✅' && message.channel.name.startsWith('whitelist-') && message.author != user.id) {
        client.commands.get('approve-whitelist').execute(message, user, MessageEmbed);
    }

    if(emoji.name == '✅' && message.id ==="712590416209248298"){
        client.commands.get('new-member').execute(message, user, MessageEmbed);
    }

    if(emoji.name == '🚫' && message.channel.name.startsWith('whitelist-') && message.author != user.id) {
        client.commands.get('deny-whitelist').execute(message, user, MessageEmbed);
    }
});

client.on('message', message => {
    if (message.author.id != client.user.id && message.channel.name.startsWith('whitelist-', 0)){   
        client.commands.get('questionnarie').execute(message, message.author.id, MessageEmbed);
    }
});

client.login(config.token);