const config = require('../config.json');
const { red_dark, green_light, pink, blue_dark } = require('../colours.json');

module.exports = {
	name: 'whitelist',
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
            .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
            
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
                        id: server.id, // shortcut for @everyone role ID
                        deny: 'VIEW_CHANNEL'
                    }
                ]).then(channel => {
                    const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                    .setColor(blue_dark)
                    .setTitle('WHITELIST')
                    .setDescription(`<@${user.id}> Has iniciado un proceso de Whitelist.`)
                    .addField('RECUERDA', 'Tendrás **1 minuto** para responder cada pregunta, transcurrido el minuto, el bot dará por incorrecta la respuesta y pasará a la siguiente pregunta.\n')
                    .addField('INDICACIONES', 'Si estás listo para comenzar, reacciona con el emote 🕑. De lo contrario, si quieres borrar la solicitud, reacciona con el emote 🗑')
                    .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                    
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