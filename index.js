const {token, guild, channel, users, timeout, messages} = require('./auth/config.json');

const {Client} = require('discord.js');
const client = new Client({intents: 3276799});


function getCurrentTime() {
    let date = new Date();
    return date.getUTCHours() - 4;
}


/**
 * @param {string}guild_id
 * @param {string}channel_id
 * @param {[string]}users_id
 * @returns {Promise<void>}
 */
async function thing(guild_id, channel_id, users_id) {
    if (getCurrentTime() > 1 && getCurrentTime() < 7) {
        let status = "offline";
        for (let user of users_id) {
            const guild = client.guilds.cache.get(guild_id);
            try {
                status = guild.members.cache.get(user).presence.status;
            } catch (e) {
                // do nothing
            }
            if (status === 'online' || status === 'idle' || status === 'dnd') {
                client.channels.fetch(channel_id).then(async channel => {
                    await channel.send(`<@${user}> ${messages[Math.floor(Math.random() * messages.length)]}`);
                    console.log(`${user} is online`);
                }).catch(console.error);
            } else {
                console.log(`${user} is not online`);
            }
        }
    }
}


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    thing(guild, channel, users);
    setInterval(function () {
        thing(guild, channel, users);
    }, timeout);
});


client.on('messageCreate', async function (message) {
    // when the bot is mentioned
    if (message.content.startsWith(`<@${client.user.id}>`)) {
        // send a message to the channel the message was sent in
        await message.channel.send(`Hello, ${message.author.tag}!`);
    }
});

client.login(token);
