const config = require('../config.json');
const fs = require("fs");
const { blue_dark, red_dark, green_light } = require('../colours.json');

module.exports = {
	name: 'upload-uid',
	description: 'obtiene la uid enviada y la guarda en el fichero provicional para subir al servidor!',
	execute(message, args, MessageEmbed) {

        if (args.length == 0) {
            const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                .setColor(red_dark)
                .setTitle('Registro fallido')
                .setDescription(`<@${message.author.id}>, No has especificado la UID ni el nombre del personaje a agregar.`)
                .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
            message.reply(embedDMMessage).then(msg => {
                msg.delete({ timeout: 15000 });
            });
            return;
        }

        if (args.length == 1) {
            const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                .setColor(red_dark)
                .setTitle('Registro fallido')
                .setDescription(`<@${message.author.id}>, Debes especificar el nombre del personaje de dicho usuario como se explica en el mensaje fijado en el canal.`)
                .addField("Ejemplo", `${args[0]} Fulanito de tal`)
                .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
            message.reply(embedDMMessage).then(msg => {
                msg.delete({ timeout: 15000 });
            });
            return;
        }

        let whitelist_path = __dirname + `/../store/whitelist.txt`;
        let UIDUser = "";
        
        for(let i = 1; i < args.length; i++){
            UIDUser += `${args[i]} `;
        };
        
        let newUID = `${args[0]}    // ${UIDUser} \n`;

        if (fs.existsSync(whitelist_path)) { 
            fs.appendFile(whitelist_path, newUID, function (err) {
                if (err){
                    const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                        .setColor(red_dark)
                        .setTitle('Registro fallido')
                        .setDescription(`<@${message.author.id}>, Ha ocurrido un error al intentar guardar el registro en el fichero **${whitelist_path}**, contacta con un Programador.`)
                        .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                    message.reply(embedDMMessage).then(msg => {
                        msg.delete({ timeout: 10000 });
                    });
                    return;
                } 
                const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                        .setColor(green_light)
                        .setTitle('Registro exitoso!')
                        .setDescription(`<@${message.author.id}>, Se ha guardado correctamente el siguiente registro en el fichero de **whitelist.txt** el cambio tendrá vigencia a partir del próximo restart del servidor.`)
                        .addField("UID Registrada", newUID)
                        .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                message.reply(embedDMMessage).then(msg => {
                    msg.delete({ timeout: 20000 });
                });
            })
        } else {
            const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                .setColor(red_dark)
                .setTitle('Registro fallido')
                .setDescription(`<@${message.author.id}>, El fichero **whitelist.txt** temporal no está creado, contacta con un Programador.`)
                .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
            message.reply(embedDMMessage).then(msg => {
                msg.delete({ timeout: 10000 });
            });
        }
	},
};