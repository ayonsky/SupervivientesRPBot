const crypto = require('crypto');
const fetch = require('node-fetch');
const parser = require('xml2json');
const config = require('../config.json');
const { blue_dark, red_dark } = require('../colours.json');

module.exports = {
	name: 'uid',
	description: 'Comando para generar la Bohemia Interactive UID del usuario!',
	async execute(message, args, MessageEmbed) {
        if (args.length <= 0) return;

        if(args[0].startsWith('http')){
            await fetch(args[0] + '?xml=1').then(response => response.text()).then(profile => {
                let parsedProfile = JSON.parse(parser.toJson(profile, {reversible: true}));
                let steamID64FromProfile = parsedProfile.profile.steamID64.$t;
                if(validSteam64ID(steamID64FromProfile)) {
                    replyBUID(steamID64FromProfile);
                } else {
                    errorMessage();
                }
            }).catch(err => {
                console.log(err);
            });
        } else if(validSteam64ID(args[0])) {
            replyBUID(args[0]);
        }else {
            errorMessage();
        }

        function replyBUID(steadID64) {
            let hash = crypto.createHash('sha256').update(steadID64).digest('base64');
            let BUID = hash.replace(/[+]/g,'-').replace(/[\/]/g,'_');

            const BUIDChannel = message.guild.channels.cache.get(message.channel.id);

            const newEmbed = new MessageEmbed()
            .setColor(blue_dark)
            .setTitle('BOHEMIA INTERACTIVE UID')
            .setThumbnail('https://i.imgur.com/A3WYVlK.png')
            .setDescription(` Se ha generado tu **UID**, para finalizar el proceso, cópiala y pégala en tu historia para que un miembro del Staff pueda registrarla en el servidor \n\n UID: \`${BUID}\``)
            .setFooter('2020 © SupervivientesRP | SupervivientesRP Discord Bot | by Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
        
            BUIDChannel.send(`<@${message.author.id}>`).then(msg =>{
                msg.reply(newEmbed);
            });
        }

        function errorMessage(){
            const newEmbed = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                .setColor(red_dark)
                .setTitle('PARÁMETRO INCORRECTO')
                .setDescription(`<@${message.author.id}>, Has ingresado un parámetro incorrecto. Si sigues teniendo problemas, no dudes en contactar a un miembro del staff utilizando los canales de soporte.`)
                .addField("Ejemplo SteamID", "**!uid** 76561198078654572")
                .addField("Ejemplo SteamLink", "**!uid** https://steamcommunity.com/id/ayonsky/")
                .setFooter('2020 © SupervivientesRP | SupervivientesRP Discord Bot | by Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
            message.reply(newEmbed).then(msg => {
                msg.delete({ timeout: 30000 });
            });
        }
        
        function validSteam64ID(steam64ID) {
            var regex = /^[0-9]+$/;
            return (steam64ID.match(regex) && steam64ID.length == 17) ? true :  false;
        } 
	},
};