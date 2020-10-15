const config = require('../config.json');
const fs = require("fs");
const { blue_dark, green_light } = require('../colours.json');

module.exports = {
	name: 'new-member',
	description: 'Comando que asignará el rol de Miembro a los nuevos usuarios!que reaccionen al emoji!',
	async execute(member, MessageEmbed) {
                try {
                        console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
                        
                        const newbieRole = member.guild.roles.cache.find(role => role.name === "Nuevo");
                        const newUser = member.guild.members.cache.find(user => user.id === member.user.id);
                        
                        if(!newbieRole) return;
                        if(!newUser) return;
                        if(newUser.roles.cache.has(newbieRole.id)) return;

                        newUser.roles.add(newbieRole.id).then(() => {
                                const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                                        .setColor(green_light)
                                        .addField('BIENVENIDO!', "Te damos la bienvenida a la comunidad de **SupervivientesRP**. \n\n En nuestro Discord encontrarás toda la normativa y la información necesaria para que puedas entrar a nuestro servidor. \n\n Para iniciar el proceso de **Whitelist** o **Presentar tu historia** deberás seguir las instrucciones que conseguirás en las categorías correspondientes. \n\n Si tienes alguna duda o problema, no dudes en utilizar los canales de soporte al usuario.📩")
                                        .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');        
                                newUser.send(embedDMMessage);
                        });
                } catch(e) {
                        console.log(`Hubo un error intentando asignar el rol Nuevos a un nuevo miembro: ${e}`)
                }
	},
};