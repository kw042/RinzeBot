// src/index.js botの基本
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { initCheck } = require('./features/reminder/initcheck');
const { scheduleReminder } = require('./features/reminder/scheduler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions
    ]
});

client.once(Events.ClientReady, c => {
    console.log(`ログイン完了: ${c.user.tag}`);
    initCheck(client);
    scheduleReminder(client);
});

client.login(token).catch(error =>{
    console.error(`Login failed: ${error}`);
});