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
        .setDescription('Bienvenido al sistema automatizado para presentación de Whitelist de **SupervivientesRP**.\n\n El Bot te hará algunas preguntas relacionadas con **la normativa y el Lore**. Deberás reaccionar con el emote correspondiente a cada respuesta.')
        .setThumbnail('https://i.imgur.com/A3WYVlK.png')
        .addFields(
            { name: 'INDICACIONES', value: 'Tendrás 1 minuto para responder cada pregunta, transcurrido el minuto, el bot dará por incorrecta la respuesta y pasará a la siguiente pregunta.\n\n Solo podrás realizar el test **una vez al día**, por lo que si no apruebas, tendrás que esperar **24 horas** para volver a intentarlo. Te recomiendo leerte bien la normativa antes de empezar.\n\n Para iniciar el proceso debes reaccionar al emote 📩' },
        )
        // .setImage('https://i.imgur.com/A3WYVlK.png')
        .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
    
        whitelistlChannel.send(newEmbed).then(sentMessage => {
            sentMessage.react('📩');
        });
	},
};