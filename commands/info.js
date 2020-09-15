const config = require('../config.json');
const { blue_dark } = require('../colours.json');

module.exports = {
	name: 'info',
	description: 'Mensaje inicial de Whitelist para los usuarios!',
	execute(client, MessageEmbed) {
        const whitelistlChannel = client.channels.cache.get(config.whitelistChannel);
        // inside a command, event listener, etc.
        const newEmbed = new MessageEmbed()
        .setColor(blue_dark)
        .setTitle('WHITELIST')
        .setURL('')
        .setDescription('Bienvenido al sistema automatizado para presentación de Whitelist de **SupervivientesRP**.\n\n El Bot te hará algunas preguntas relacionadas con **la normativa y el Lore**.')
        .setThumbnail('https://i.imgur.com/A3WYVlK.png')
        .addFields(
            { name: 'INDICACIONES', value: 'Tienes 10 minutos para responder el cuestionario, transcurrido el tiempo, el bot finalizará el proceso registrando el total de preguntas respondidas.\n\n Deberás esperar a que un miembro del Staff revise tu resultado para recibir o no el **APTO** y poder continuar con la creación de la historia de tu personaje. Te recomiendo leerte bien la normativa antes de empezar.\n\n Para iniciar el proceso debes reaccionar al emote 📩' },
        )
        // .setImage('https://i.imgur.com/A3WYVlK.png')
        .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
    
        whitelistlChannel.send(newEmbed).then(sentMessage => {
            sentMessage.react('📩');
        });
	},
};