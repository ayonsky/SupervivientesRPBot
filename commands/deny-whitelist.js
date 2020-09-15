const config = require('../config.json');
const { red_dark, green_light } = require('../colours.json');
const fs = require("fs");

module.exports = {
	name: 'deny-whitelist',
	description: 'Comando para rechazar whitelist al usuario!',
	async execute(message, user, MessageEmbed) {
        const staffUser = message.guild.members.cache.find(u => u.id === user.id);
        if(staffUser.roles.cache.some(r=>["Fundadores", "Administrador", "Lore Admin", "Moderador"].includes(r.name)) ) {
            const tmpJson = fs.readFileSync(__dirname + `/../store/users/${user.id}.json`);
            let storedData = JSON.parse(tmpJson);

            storedData.whitelist.approved = false;
            fs.writeFile(__dirname + `/../store/users/${user.id}.json`, JSON.stringify(storedData, null, 4), err => {
                if (err) throw err;
                console.log("registro actualizado con éxito");
                const userApplicantID = message.channel.name.substring(10);
                const userApplicant = message.guild.members.cache.find(user => user.id === userApplicantID);
                const whitelistedRole = message.guild.roles.cache.find(role => role.name === "Whitelisted");

                if(!whitelistedRole) return;
                if(!userApplicant) return;

                userApplicant.roles.remove(whitelistedRole.id).then(() =>{
                    const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                    .setColor(red_dark)
                    .addField('¡Lo sentimos!', "Has recibido ** NO APTO** en tu formulario de Whitelist luego de que un miembro de nuestro staff lo revisase rigurosamente.\n\n Deberás realizar un nuevo proceso de solicitud.")
                    .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                    
                    userApplicant.send(embedDMMessage);
                }); 

                message.reactions.removeAll();                 

                const channelToBeDeleted = message.guild.channels.cache.get(message.channel.id);
                const newEmbed = new MessageEmbed()
                    .setColor(red_dark)
                    .setDescription('El canal se borrará en 5 segundos...')
                    .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                    
                channelToBeDeleted.send(newEmbed).then(() => {
                    setTimeout(() =>  {channelToBeDeleted.delete()}, 5000);
                });
            });   
        } else {
            const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
            try {
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(user.id);
                }
            } catch (error) {
                console.error('Failed to remove reactions.');
            }
            const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                .setColor(red_dark)
                .setDescription("Estás tratando de hacer algo que está fuera de tus capacidades!💀")
                .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
            message.reply(embedDMMessage).then(msg => {
                msg.delete({ timeout: 5000 });
            });
        }
	},
};