const config = require('../config.json');
const fs = require("fs");
const { red_dark, green_light, pink, blue_dark } = require('../colours.json');

module.exports = {
	name: 'ticket-whitelist',
	description: 'Creación de un canal exclusivo para la whitelist del usuario!',
	async execute(message, user, MessageEmbed) {
        const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
        try {
            for (const reaction of userReactions.values()) {
                await reaction.users.remove(user.id);
            }
        } catch (error) {
            console.error('Failed to remove reactions.');
        }
        
        let server = message.guild;
        if (server.channels.cache.some(channel => channel.name == `whitelist-${user.id}`)) {
            const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
            .setColor(red_dark)
            .addField('WHITELIST', "Has intentado iniciar un nuevo proceso de **Whitelist** pero ya tienes uno en curso. *Si tienes algún problema, no dudes en utilizar los canales de soporte.*\n")
            .setFooter('2020 © SupervivientesRP | SupervivientesRP Discord Bot | by Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
            
            user.send(embedDMMessage);
            return;
       }
        server.channels.create(`whitelist-${user.id}`, {type: "text"})
        .then(channel => {
            channel.setParent(config.whitelistCategory).then(channel => {
                channel.overwritePermissions([
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
                        id: config.moderatorRolID,
                        allow: ['VIEW_CHANNEL','SEND_MESSAGES'],
                        deny: ['ADD_REACTIONS']
                    },
                    {
                        id: server.id, // shortcut for @everyone role ID
                        deny: 'VIEW_CHANNEL'
                    }
                ]).then(channel => {
                    const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                    .setColor(blue_dark)
                    .setTitle('WHITELIST')
                    .setDescription(`<@${user.id}> Has iniciado un proceso de Whitelist.`)
                    .addField('RECUERDA', 'Tendrás **30 minutos** a partir de que el bot te envíe las preguntas para responderlas, enviando el documento con las respuestas. Transcurrido el tiempo, el bot finalizará el proceso y si no has enviado las respuestas tendrás que repetir el proceso.\n')
                    .addField('INDICACIONES', 'El bot escogerá 10 preguntas al azar que deberás copiar y responder en un documento de texto de tu preferencia (Word, Bloc de Notas, etc...) para luego adjuntarlo en este ticket **antes de que finalice el tiempo**. \n\n Si estás listo para comenzar, reacciona con el emote 🕑. De lo contrario, si quieres borrar la solicitud, reacciona con el emote 🗑')
                    .setFooter('2020 © SupervivientesRP | SupervivientesRP Discord Bot | by Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                    
                    channel.send(embedDMMessage).then( async sentMessage => {
                        try {
                            await sentMessage.react('🕑');
                            await sentMessage.react('🗑');
                        } catch (error) {
                            console.error('One of the emojis failed to react.');
                        }
                    });
                })
            });
        }).catch(console.error);
	},
};