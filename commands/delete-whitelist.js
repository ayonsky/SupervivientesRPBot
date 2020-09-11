const config = require('../config.json');
const fs = require("fs");
const { red_dark } = require('../colours.json');

module.exports = {
	name: 'delete-whitelist',
	description: 'Comando que eliminará el canal de whitelist creado para cierto usuario!',
	async execute(message, user, MessageEmbed) {
        message.reactions.removeAll();
        const channelToBeDeleted = message.guild.channels.cache.get(message.channel.id);
        const newEmbed = new MessageEmbed()
        .setColor(red_dark)
        .setDescription('El canal se borrará en 5 segundos...')
        .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
    
        channelToBeDeleted.send(newEmbed).then(() => {
            setTimeout(() =>  {channelToBeDeleted.delete().then(() => {
                const tmpJson = fs.readFileSync(__dirname + "/../store/data.json");
                let storedData = JSON.parse(tmpJson);
                delete storedData[user.id];
                fs.writeFile(__dirname + "/../store/data.json", JSON.stringify(storedData, null, 4), err => {
                    if (err) throw err;
                    console.log("registro eliminado con éxito");
                });
            })}, 5000);
        });
	},
};