const config = require('../config.json');
const { blue_dark, orange } = require('../colours.json');

module.exports = {
	name: 'start-questionnarie',
	description: 'Inicializa el contador para realizar la whitelist!',
	async execute(message, user, MessageEmbed) {
        const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
        const actualWhitelistChannel = message.guild.channels.cache.get(message.channel.id);
        
        try {
            for (const reaction of userReactions.values()) {
                await reaction.users.remove(user.id);
            }
        } catch (error) {
            console.error('Failed to remove reactions.');
        }
        
        actualWhitelistChannel.overwritePermissions([
            {
                id: user.id,
                allow: ['VIEW_CHANNEL','SEND_MESSAGES'],
                deny: ['ADD_REACTIONS',]
            },
            {
               id: message.author.id,
                allow: 'VIEW_CHANNEL'
            },
            {
                id: message.guild.id, // shortcut for @everyone role ID
                deny: 'VIEW_CHANNEL'
            }
        ])
        setTimeout(() =>  {
            actualWhitelistChannel.overwritePermissions([
                {
                    id: user.id,
                    allow: ['VIEW_CHANNEL',],
                    deny: ['ADD_REACTIONS','SEND_MESSAGES']
                },
                {
                   id: message.author.id,
                    allow: 'VIEW_CHANNEL'
                },
                {
                    id: message.guild.id, // shortcut for @everyone role ID
                    deny: 'VIEW_CHANNEL'
                }
            ]).then(() => {
                const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                .setColor(blue_dark)
                .setTitle('WHITELIST FINALIZADA')
                .setDescription(`<@${user.id}> Ha finalizado el tiempo reglamentario. \n\n Un miembro del Staff corregirá tu presentación lo antes posible. *(Reaccionará en los siguientes emotes para indicar si la whitelist es **APTA** o no).*`)
                .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                
                actualWhitelistChannel.send(embedDMMessage).then( async sentMessage => {
                    try {
                        await sentMessage.react('✅');
                        await sentMessage.react('🚫');

                    } catch (error) {
                        console.error('One of the emojis failed to react.');
                    }
                });
            });
        }, 15000);
        const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
            .setColor(orange)
            .addField(`Pregunta Nro.1`, "¿Será esto una pregunta?")
            .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
            
            message.reply(embedDMMessage);
	},
};