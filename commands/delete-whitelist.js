const config = require('../config.json');
const { red_dark } = require('../colours.json');

module.exports = {
	name: 'delete-whitelist',
	description: 'Comando que eliminará el canal de whitelist creado para cierto usuario!',
	async execute(message, user, MessageEmbed) {
        const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
        try {
            for (const reaction of userReactions.values()) {
                await reaction.users.remove(user.id);
            }
        } catch (error) {
            console.error('Failed to remove reactions.');
        }
        const channelToBeDeleted = message.guild.channels.cache.get(message.channel.id);
        const newEmbed = new MessageEmbed()
        .setColor(red_dark)
        .setDescription('El canal se borrará en 5 segundos...')
        .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
    
        channelToBeDeleted.send(newEmbed).then(() => {
            setTimeout(() =>  {channelToBeDeleted.delete()}, 5000);
        });
	},
};