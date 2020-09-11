const config = require('../config.json');
const fs = require("fs");
const { blue_dark, green_light } = require('../colours.json');

module.exports = {
	name: 'new-member',
	description: 'Comando que asignará el rol de Miembro a los nuevos usuarios!que reaccionen al emoji!',
	async execute(message, user, MessageEmbed) {
        const newMember = message.guild.members.cache.find(u => u.id === user.id);
        const MemberRole = message.guild.roles.cache.find(role => role.name === "Miembro");

        if(!MemberRole) return;
        if(!newMember) return;
        if(newMember.roles.cache.has(MemberRole.id)) return;

        newMember.roles.add(MemberRole.id).then(() =>{
            const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                .setColor(green_light)
                .addField('BIENVENIDO!', "Te damos la bienvenida a la comunidad de **SupervivientesRP**. \n\n En nuestro Discord encontrarás toda la normativa y la información necesaria para que puedas entrar a nuestro servidor. \n\n Si tienes alguna duda o problema, no dudes en utilizar los canales de soporte al usuario.📩")
                .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                
                newMember.send(embedDMMessage);
        });
	},
};