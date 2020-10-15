const config = require('../config.json');
const { blue_dark } = require('../colours.json');

module.exports = {
	name: 'info-whitelist',
	description: 'Mensaje inicial de Whitelist para los usuarios!',
	execute(client, MessageEmbed) {
        const whitelistlChannel = client.channels.cache.get(config.whitelistChannel);
        // inside a command, event listener, etc.
        const newEmbed = new MessageEmbed()
        .setColor(blue_dark)
        .setTitle('WHITELIST')
        .setURL('')
        .setDescription('Bienvenido al sistema automatizado para presentación de Whitelist de **SupervivientesRP**.\n\n El Bot generará una serie de preguntas aleatorias relacionadas con **la normativa y el Lore**.')
        .setThumbnail('https://i.imgur.com/A3WYVlK.png')
        .addFields(
            { name: 'INDICACIONES', value: 'Tendrás 30 minutos para responder el cuestionario, transcurrido el tiempo, el bot finalizará el proceso y no te permitirá escribir en el ticket de la whitelist.\n\n Deberás esperar a que un miembro del Staff revise tu resultado para recibir o no el **APTO**. Te recomiendo leer bien la normativa antes de empezar.\n\n Para iniciar el proceso debes reaccionar al emote 📋' },
        )
        // .setImage('https://i.imgur.com/A3WYVlK.png')
        .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
    
        whitelistlChannel.send(newEmbed).then(sentMessage => {
            sentMessage.react('📋');
        });
	},
};