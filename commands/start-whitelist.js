const config = require('../config.json');
const fs = require("fs");
const { blue_dark, orange } = require('../colours.json');

module.exports = {
	name: 'start-whitelist',
	description: 'Inicializa el contador para realizar la whitelist!',
	async execute(message, user, MessageEmbed) {
        const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
        const actualWhitelistChannel = message.guild.channels.cache.get(message.channel.id);
        message.reactions.removeAll();
        
        actualWhitelistChannel.overwritePermissions([
            {
                id: user.id,
                allow: ['VIEW_CHANNEL','SEND_MESSAGES', 'ATTACH_FILES'],
                deny: ['ADD_REACTIONS',]
            },
            {
               id: message.author.id,
                allow: 'VIEW_CHANNEL'
            },
            {
                id: config.moderatorRolID,
                allow: ['VIEW_CHANNEL','SEND_MESSAGES'],
                deny: ['ADD_REACTIONS']
            },
            {
                id: message.guild.id, // shortcut for @everyone role ID
                deny: 'VIEW_CHANNEL'
            }
        ])

        const questions = [
            "¿Qué significa **In Character (IC)**?",
            "¿Qué significa **Out of Character (OOC)**?",
            "¿Qué es el **Metagaming** y da un ejemplo?",
            "¿Qué es el **Combat Login**?",
            "¿Qué es un **Player Kill (PK)** y que sucede cuando un rol te lleva a ello?",
            "¿Qué es el **Revenge Kill (RK)**?",
            "¿Qué es un **Character Kill (CK)** y quien lo autoriza?",
            "¿Qué es el **Power Gaming (PG)** y da un ejemplo?",
            "¿De qué forma puedes entrar a una base ajena?",
            "¿Cuanto tiempo debes esperar para volver a tu cadaver si has sufrido un PK?",
            "¿De que forma puedes robar un vehículo?",
            "¿Cuál es la única protección permitida para tu vehículo?",
            "Imagina que estás haciendo un **control a vehículos** ¿En qué momento puedes iniciar un PVP?",
            "¿Qué significa cuando un jugador te da el alto y te dice: tienes **Cortadas las comunicaciones**?",
            "Durante un secuestro o robo, ¿Qué tiene que suceder para tu poder matar (hacerle un PK) al secuestrado?",
            "¿Quienes son los **únicos** que podrán reconocer **por la voz** a otro jugador?",
            "¿Puedes utilizar el canal de #📻radio-on-rol para mantener una conversación en binomio?",
            "¿Cuantos vehículos pueden tener los **campamenteos privados**?",
            "¿Cuál es el número máximo permitido para ir en grupo?",
            "**[LORE]** ¿De que forma se inició la terrible enfermedad reportada en todo el mundo?",
            "**[LORE]** ¿Cuál es la regla vital y de mayor importancia para un Cazador?",
            "**[LORE]** ¿Qué es **El Fuerte Drakon** y donde se encuentra?",
            "**[LORE]** ¿Cuanto tiempo duró la batalla de Drakon?",
            "**[LORE]** ¿Cuanto tiempo duró la oscuridad que trajo consigo la nube de gas y ceniza que oscureció el cielo en todo el mundo?"
        ];

        let userRandomQuestions = shuffle(questions).slice(0,10); 
        
        const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
            .setColor(orange)
            .setTitle('PREGUNTAS')
            .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');

        userRandomQuestions.forEach(async (question, index) => {
            embedDMMessage.addField(`Pregunta Nro.${index + 1}`, question);
        });

        message.reply(embedDMMessage).then(() => {
            setTimeout(() =>  {
                actualWhitelistChannel.overwritePermissions([
                    {
                        id: user.id,
                        allow: ['VIEW_CHANNEL',],
                        deny: ['ADD_REACTIONS','SEND_MESSAGES', 'ATTACH_FILES']
                    },
                    {
                       id: message.author.id,
                        allow: 'VIEW_CHANNEL'
                    },
                    {
                        id: config.moderatorRolID,
                        allow: ['VIEW_CHANNEL','SEND_MESSAGES'],
                        deny: ['ADD_REACTIONS']
                    },
                    {
                        id: message.guild.id, // shortcut for @everyone role ID
                        deny: 'VIEW_CHANNEL'
                    }
                ]).then(() => {
                    const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                    .setColor(blue_dark)
                    .setTitle('WHITELIST FINALIZADA')
                    .setDescription(`<@${user.id}> Ha finalizado el tiempo reglamentario. \n\n Un miembro del Staff revisará tu presentación lo antes posible y se pondrá en contacto contigo en este mismo ticket. \n\n Si quieres cancelar esta solicitud para iniciar una nueva, reacciona al emote 🗑 de este mensaje.`)
                    .setFooter('SupervivientesRPBot programado por Ayonsky', 'https://i.imgur.com/A3WYVlK.png');
                    
                    actualWhitelistChannel.send(embedDMMessage).then( async sentMessage => {
                        try {
                            await sentMessage.react('🗑');
                        } catch (error) {
                            console.error('One of the emojis failed to react.');
                        }
                    });
                });
            }, 1800000); //2700000 for 45min wait
        });

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