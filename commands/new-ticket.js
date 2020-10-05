const config = require('../config.json');
const fs = require("fs");
const { red_dark, green_light, pink, blue_dark } = require('../colours.json');

module.exports = {
	name: 'new-ticket',
	description: 'Creación de un canal exclusivo para brindar soporte a un usuario',
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
        if (server.channels.cache.some(channel => channel.name == `ticket-${user.id}`)) {
            const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
            .setColor(red_dark)
            .addField('Centro de Soporte', "Has intentado crear un nuevo **Ticket de soporte** pero ya tienes uno en curso. *Si tienes algún problema con el bot, no dudes en contactar a un miembro del staff.*\n")
            .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
            
            user.send(embedDMMessage);
            return;
       }
        server.channels.create(`ticket-${user.id}`, {type: "text"})
        .then(channel => {
            channel.setParent(config.ticketCategory).then(channel => {
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
                        id: server.id, // shortcut for @everyone role ID
                        deny: 'VIEW_CHANNEL'
                    }
                ]).then(channel => {
                    const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                    .setColor(blue_dark)
                    .setTitle('TICKET')
                    .setDescription(`<@${user.id}> Has creado un ticket de soporte. `)
                    .addField('INDICACIONES', 'A continuación, explica brevemente lo que necesites y uno de los miembros del Staff te atenderá lo antes posible.\n\n Si deseas dar por finalizado el soporte o eliminar el ticket puedes reaccionar al emote 🗑 de este mensaje.')
                    .addField('RECUERDA', 'Si vas a realizar un reporte acerca de un rol, deberás tener a la mano una grabación de lo sucedido, ya que lo más probable es que el Staff te lo solicite.')
                    .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                    
                    channel.send(embedDMMessage).then( async sentMessage => {
                        try {
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