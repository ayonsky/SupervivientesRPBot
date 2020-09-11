const config = require('../config.json');
const fs = require("fs");
const { orange, green_dark, red_dark } = require('../colours.json');
let cont = 2;
module.exports = {
	name: 'questionnarie',
	description: 'Batería de preguntas para Whitelist!',
	execute(message, user, MessageEmbed) {
        // TODO: Prohibir que el usuario escriba hasta que el bot no le asigne una nueva preguna
        const author = message.author;
        message.channel.updateOverwrite(author, { SEND_MESSAGES: false }).then(async () =>{
            const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
            try {
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(user.id);
                }
            } catch (error) {
                console.error('Failed to remove reactions.');
            }
            
            const tmpJson = fs.readFileSync(__dirname + "/../store/data.json");
            let storedData = JSON.parse(tmpJson);
            let userData = storedData[user];
            let cont = userData.whitelist.actualCont + 1;
            if(storedData[user].whitelist.questions[userData.whitelist.actualCont]){
                storedData[user].whitelist.questions[userData.whitelist.actualCont].answer = message.content;
                storedData[user].whitelist.actualCont = cont;

                fs.writeFile(__dirname + "/../store/data.json", JSON.stringify(storedData, null, 4), err => {
                    if (err) throw err;
                    console.log("registro actualizado con éxito");
                    if(userData.whitelist.questions[cont]){
                        const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                        .setColor(orange)
                        .addField(`Pregunta Nro.${cont + 1}`, userData.whitelist.questions[cont].question)
                        .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                        message.reply(embedDMMessage).then(() =>{
                            message.channel.updateOverwrite(author, { SEND_MESSAGES: true });
                        });
                    } else {
                        const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                            .setColor(green_dark)
                            .addField("Cuestionario Finalizado", "Has respondido el 100% de las preguntas, cuando Administración revise tu cuestionario, se te avisará por Mensaje Privado del resultado para que puedas presentar tu historia.")
                            .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                        message.reply(embedDMMessage)
                    }
                });
            } else {
                const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                    .setColor(red_dark)
                    .setDescription("Estás tratando de hacer algo que está fuera de tus capacidades!💀")
                    .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                message.reply(embedDMMessage).then(msg => {
                    msg.delete({ timeout: 5000 });
                });
            }            
        });
	},
};