const config = require('../config.json');
const fs = require("fs");
const { red_dark } = require('../colours.json');

module.exports = {
	name: 'delete-channel',
	description: 'Comando que eliminará el canal creado para cierto usuario!',
	async execute(message, user, MessageEmbed) {
        message.reactions.removeAll();
        const channelToBeDeleted = message.guild.channels.cache.get(message.channel.id);
        const newEmbed = new MessageEmbed()
        .setColor(red_dark)
        .setDescription('El canal se borrará en 5 segundos...')
        .setFooter('2020 © SupervivientesRP | SupervivientesRP Discord Bot | by Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
    
        channelToBeDeleted.send(newEmbed).then(() => {
            setTimeout(() =>  {
                channelToBeDeleted.delete();
            }, 5000);
        });
	},
};