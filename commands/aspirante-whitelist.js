const config = require('../config.json');
const fs = require("fs");
const { blue_dark, red_dark } = require('../colours.json');

module.exports = {
	name: 'aspirante-whitelist',
	description: 'Comando que otorga permiso temporal para hacer la whitelist!',
	execute(oldMember, newMember, MessageEmbed) {
        const userApplicant = oldMember.guild.members.cache.find(user => user.id === oldMember.id);
        const aspiranteRole = oldMember.guild.roles.cache.find(role => role.name === "Aspirante");
        const channel = oldMember.guild.channels.cache.get(config.whitelistFinalizadaVoiceChannel);
        const tmpJson = null;
        let storedData = null;

        try{
            const tmpJson = fs.readFileSync(__dirname + `/../store/users/${oldMember.id}.json`);
            storedData = JSON.parse(tmpJson);
        } catch(err){
            console.log(err)
        }

        if(newMember.channelID === config.presentarWhitelistVoiceChannel) { // FUNCION QUE CONTROLA CUANDO CONECTA UN USUARIO AL CANAL DE VOZ
            // User Joins a voice channel
            setTimeout(() =>  {
                try {
                    userApplicant.voice.setChannel(channel)
                } catch(err) {
                    console.log("error al mover usuario: ", err);
                }
            }, 900000); //Set to 900000 for 15min wait until kick
            console.log("Se ha unido un usuario para presentar su whitelist");
            
            if (oldMember.guild.channels.cache.some(channel => channel.name == `whitelist-${oldMember.id}`) || (storedData && storedData.whitelist.approved)) {
                const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                .setColor(red_dark)
                .addField('WHITELIST', "Has intentado iniciar un nuevo proceso de **Whitelist** pero ya tienes uno en curso. *Si tienes algún problema, no dudes en utilizar los canales de soporte.*\n")
                .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                
                userApplicant.send(embedDMMessage).then(() => {
                    try {
                        userApplicant.voice.setChannel(channel)
                    } catch(err) {
                        console.log("error al mover usuario: ", err);
                    }
                });
                return;
           }

            if(!aspiranteRole) return;
            if(!userApplicant) return;
    
            userApplicant.roles.add(aspiranteRole.id).then(() =>{
                const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                .setColor(blue_dark)
                .addField('¡Bienvenido!', "Has iniciado un proceso de Whitelist para entrar a nuestro servidor. \n\nDeberás permanecer conectado al canal de voz en todo momento, una vez te desconectes del canal, el bot automáticamente dará por finalizada la whitelist. \n\nA partir de ahora, tienes 10min para finalizar el proceso, sigue las instrucciones que encontrarás en el canal **📃instrucciones📃**. NOTA: transcurridos los 10min, el bot finalizará el proceso y te moverá al canal **Whitelist Finalizada** y podrás desconectarte del canal.")
                .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                
                userApplicant.send(embedDMMessage);
            }); 
        } 
        
        if(oldMember.channelID === config.presentarWhitelistVoiceChannel){ // FUNCION QUE CONTROLA CUANDO UN USUARIO DEJA EL CANAL DE VOZ
            // User leaves a voice channel
            console.log("Se ha desconectado un usuario que presentaba la Whitelist")
            
            if(storedData) {
                const whitelistChannel = oldMember.guild.channels.cache.get(storedData.whitelist.id);
                whitelistChannel.updateOverwrite(oldMember.id, { SEND_MESSAGES: false});
            }           


            if(!aspiranteRole) return;
            if(!userApplicant) return;

            userApplicant.roles.remove(aspiranteRole.id).then(() =>{
                const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                .setColor(blue_dark)
                .addField('¡Proceso de Whitelist finalizado!', "Si estás viendo este mensaje es porque o has intentado iniciar un nuevo proceso teniendo ya uno abierto, o se ha terminado el tiempo reglamentario.\n\n Deberás esperar a que un miembro del Staff revise tu cuestionario, una vez revisado, se te notificará el resultado por mensaje privado.")
                .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                
                userApplicant.send(embedDMMessage);
            }); 
        }
	},
};