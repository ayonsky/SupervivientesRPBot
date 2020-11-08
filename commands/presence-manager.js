const config = require('../config.json');
const { blue_dark } = require('../colours.json');

module.exports = {
	name: 'presence-manager',
	description: 'Comando que gestiona los cambios de estado de un usuario!',
	async execute(oldPresence, newPresence, MessageEmbed) {
        try {
            const twitchStreamChannel = newPresence.guild.channels.cache.get(config.twichStreamChannel);
            const streamingRole = newPresence.guild.roles.cache.find(role => role.name === "Streaming");
            const survivorRole = newPresence.guild.roles.cache.find(role => role.name === "Superviviente");
            const user = newPresence.guild.members.cache.find(user => user.id === newPresence.user.id);
    
            if(!user.roles.cache.has(survivorRole.id)) return;
    
            let streamOFF = true;
            let wasStreaming = false;
    
            newPresence.activities.forEach(activity => {
                if (activity.name == "Twitch") {
                    streamOFF = false;
                   
                    oldPresence.activities.forEach(oldActivity => {
                        if (oldActivity.name == "Twitch") wasStreaming = true;
                    });

                    if(wasStreaming) return;
                    if(!streamingRole) return;
                    if(!user) return;
                    if(user.roles.cache.has(streamingRole.id)) return;
                   
                    const imageURL = activity.assets.largeImageURL() || activity.assets.smallImageURL();
    
                    user.roles.add(streamingRole.id).then(() => {
                        twitchStreamChannel.send(`<@${newPresence.user.id}> está en directo`).then(() => {
                            const embedDMMessage = new MessageEmbed()                                                                                   // Embed message to DM the user a message with the error and the correct way to use the channel
                                .setColor(blue_dark)
                                .setTitle(`🔴 Pincha aquí para ver el directo en Twitch!`)
                                .setURL(activity.url)
                                .setThumbnail(imageURL)
                                .addFields(
                                    { name: 'Título', value: activity.details, inline: true },
                                    { name: 'Juego', value: activity.state, inline: true },
                                )
                                .setImage(imageURL)
                                .setFooter('2020 © SupervivientesRP | SupervivientesRP Discord Bot | by Ayonsky', 'https://i.imgur.com/A3WYVlK.png'); 
                            twitchStreamChannel.send(embedDMMessage);
                        });
                    });
                }
            });
            (streamOFF) ? user.roles.remove(streamingRole.id) : null;
        } catch (err) {
            console.log("Error al intentar anunciar un directo de Twitch | Error:", err);
        }
	},
};