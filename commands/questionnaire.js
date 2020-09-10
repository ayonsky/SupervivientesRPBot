const config = require('../config.json');
const { orange } = require('../colours.json');
let cont = 2;
module.exports = {
	name: 'questionnarie',
	description: 'Batería de preguntas para Whitelist!',
	async execute(message, MessageEmbed) {
        const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
        try {
            for (const reaction of userReactions.values()) {
                await reaction.users.remove(user.id);
            }
        } catch (error) {
            console.error('Failed to remove reactions.');
        }

        const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
            .setColor(orange)
            .addField(`Pregunta Nro.${cont}`, "¿Será esto una pregunta?")
            .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
            
            message.reply(embedDMMessage);
        cont++;
	},
};