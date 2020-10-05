const config = require('../config.json');
const { blue_dark } = require('../colours.json');

module.exports = {
	name: 'info-soporte',
	description: 'Mensaje inicial para canal de soporte (creación de tickets)',
	execute(client, MessageEmbed) {
        const supportChannel = client.channels.cache.get(config.supportChannel);
        // inside a command, event listener, etc.
        const newEmbed = new MessageEmbed()
        .setColor(blue_dark)
        .setTitle('Centro de Soporte')
        .setURL('')
        .setDescription('Bienvenido al Centro de Soporte de **SupervivientesRP**.\n\n Para abrir un ticket y poder iniciar una conversación con algún miembro del Staff, deberás reaccionar al emote 📩 de este mensaje.')
        .setThumbnail('https://i.imgur.com/A3WYVlK.png')
        .addFields(
            { name: 'Recuerda', value: 'En la mayoría de los casos de asistencia **on-rol**, necesitaremos de una grabación de lo sucedido para agilizar el soporte.' },
        )
        // .setImage('https://i.imgur.com/A3WYVlK.png')
        .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
    
        supportChannel.send(newEmbed).then(sentMessage => {
            sentMessage.react('📩');
        });
	},
};