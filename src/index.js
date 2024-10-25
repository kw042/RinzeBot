// src/index.js botの基本処理
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { initCheck } = require('./features/reminder/initcheck');
const { scheduleReminder } = require('./features/reminder/scheduler');
const { myInteractionCreate } = require('./features/commands/interaction');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions
    ]
});

// 起動時の処理
client.once(Events.ClientReady, c => {
    console.log(`ログイン完了: ${c.user.tag}`);
    initCheck(client);
    scheduleReminder(client);
});

// 常時実行-> ｽﾗｯｼｭｺﾏﾝﾄﾞの受付
client.on(myInteractionCreate.name, myInteractionCreate.execute);

// ログインを試みる
client.login(token).catch(error =>{
    console.error(`Login failed: ${error}`);
});