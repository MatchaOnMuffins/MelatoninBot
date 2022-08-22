const {token, timeout, messages} = require('./auth/config.json');

const {Client} = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const client = new Client({intents: 3276799});

const db = new sqlite3.Database('./auth/db.sqlite3'); // create database

db.run(`CREATE TABLE IF NOT EXISTS users
        (
            guild_id   TEXT,
            channel_id TEXT,
            users_id   TEXT UNIQUE NOT NULL
        )`, (err) => {
    if (err) {
        console.log(err);
    }
})


function getCurrentTime() {
    let date = new Date();
    return date.getUTCHours() - 4;
}


async function mainLoop() {
    // query database for users
    db.all(`SELECT *
            FROM users`, (err, rows) => {
        if (rows.length === 0) {
            // do nothing
        } else {
            for (let user of rows) {
                if (getCurrentTime() > 1 && getCurrentTime() < 7) {
                    let status = "offline";
                    const guild = client.guilds.cache.get(user['guild_id']);
                    try {
                        status = guild.members.cache.get(user['users_id']).presence.status;
                    } catch (e) {
                        // do nothing
                    }
                    if (status === 'online' || status === 'idle' || status === 'dnd') {
                        client.channels.fetch(user['channel_id']).then(async channel => {
                            try {
                                await channel.send(`<@${user['users_id']}> ${messages[Math.floor(Math.random() * messages.length)]}`);
                            } catch (e) {
                                console.log(e);
                            }
                            console.log(`${user['users_id']} is online`);
                        }).catch(console.error);
                    } else {
                        console.log(`${user['users_id']} is not online`);
                    }
                } else {
                    // day time
                }
            }
        }
    })
}


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    mainLoop();
    setInterval(mainLoop, timeout);
});


client.on('messageCreate', async function (message) {
    if (message.author.id === client.user.id) return;
    // if bot is mentioned
    if (message.content.includes(client.user.toString())) {
        try {
            await message.channel.send(`Hello ${message.author.toString()}`);
            await message.react('👍');
            await message.react('👎');
            await message.react('🤔');
            await message.channel.send("Type '!help' for help");
        } catch (e) {
            console.log(e);
        }
    }

    if (message.content === '!help') {
        try {
            await message.channel.send('```\n!help - shows this message\n!add - adds you to the list of users to be notified\n!remove - removes you from the list of users to be notified```');
        } catch (e) {
            console.log(e);
        }
    }

    if (message.content === '!add') {
        // add user to database
        let guild_id = message.guild.id;
        let channel_id = message.channel.id;
        let user_id = message.author.id;
        db.run(`INSERT INTO users
                VALUES (?, ?, ?)`, [guild_id, channel_id, user_id], async (err) => {
            if (err) {
                console.log(err);
                if (err.code === 'SQLITE_CONSTRAINT') {
                    try {
                        await message.channel.send('User already added');
                    } catch (e) {
                        console.log(e);
                    }
                }
            } else {
                try {
                    await message.channel.send('added');
                } catch (e) {
                    console.log(e);
                }
            }
        })
    }

    if (message.content === '!remove') {
        // remove user from database
        let user_id = message.author.id;

        db.all(`SELECT *
                FROM users
                WHERE users_id = ?`, [user_id], async (err, row) => {
            if (err) {
                console.log(err);
            } else {
                if (row.length !== 0) {
                    db.run(`DELETE
                            FROM users
                            WHERE users_id = ?`, [user_id], async (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            try {
                                await message.channel.send('removed');
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    })
                } else {
                    try {
                        await message.channel.send('User not found');
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        })
    }


});

client.login(token);
