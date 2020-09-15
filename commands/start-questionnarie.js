const config = require('../config.json');
const fs = require("fs");
const { blue_dark, orange } = require('../colours.json');

module.exports = {
	name: 'start-questionnarie',
	description: 'Inicializa el contador para realizar la whitelist!',
	async execute(message, user, MessageEmbed) {
        const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
        const actualWhitelistChannel = message.guild.channels.cache.get(message.channel.id);
        message.reactions.removeAll();
        
        actualWhitelistChannel.overwritePermissions([
            {
                id: user.id,
                allow: ['VIEW_CHANNEL','SEND_MESSAGES'],
                deny: ['ADD_REACTIONS',]
            },
            {
               id: message.author.id,
                allow: 'VIEW_CHANNEL'
            },
            {
                id: message.guild.id, // shortcut for @everyone role ID
                deny: 'VIEW_CHANNEL'
            }
        ])
        setTimeout(() =>  {
            actualWhitelistChannel.overwritePermissions([
                {
                    id: user.id,
                    allow: ['VIEW_CHANNEL',],
                    deny: ['ADD_REACTIONS','SEND_MESSAGES']
                },
                {
                   id: message.author.id,
                    allow: 'VIEW_CHANNEL'
                },
                {
                    id: message.guild.id, // shortcut for @everyone role ID
                    deny: 'VIEW_CHANNEL'
                }
            ]).then(() => {
                const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                .setColor(blue_dark)
                .setTitle('WHITELIST FINALIZADA')
                .setDescription(`<@${user.id}> Ha finalizado el tiempo reglamentario. \n\n Un miembro del Staff corregirá tu presentación lo antes posible. *(El Staff Reaccionará en los siguientes emotes para indicar si la whitelist es **APTA** o no).*`)
                .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                
                actualWhitelistChannel.send(embedDMMessage).then( async sentMessage => {
                    try {
                        await sentMessage.react('✅');
                        await sentMessage.react('🚫');

                    } catch (error) {
                        console.error('One of the emojis failed to react.');
                    }
                });
            });
        }, 600000); //600000 for 10min wait

        const tmpJson = fs.readFileSync(__dirname + `/../store/users/${user.id}.json`);
        const questionsFile = fs.readFileSync(__dirname + "/../store/questions.json");
        const questionsFileParsed = JSON.parse(questionsFile);
        const questions = questionsFileParsed.questions;
        let userData = JSON.parse(tmpJson);
        let userRandomQuestions = shuffle(questions).slice(0,10); 
        
        userRandomQuestions.forEach(async (question, index) => {
            userData.whitelist.questions[index] = {
                question: question,
                answer: ""
            }
            await fs.writeFile(__dirname + `/../store/users/${user.id}.json`, JSON.stringify(userData, null, 4), err => {
                if (err) throw err;
                console.log("registro actualizado con éxito");
                
            });
        });

        const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
            .setColor(orange)
            .addField(`Pregunta Nro.${userData.whitelist.actualCont + 1}`, userData.whitelist.questions[0].question)
            .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
        message.reply(embedDMMessage);

        function shuffle(a) {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        }
	},
};