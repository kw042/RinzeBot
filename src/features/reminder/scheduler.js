// src/features/reminder/scheduler.js スケジューリングされたリマインダのチェック

const path = require('path');
const cron = require('node-cron');
const { executePythonScript } = require('../../utils/pythonUtils');
const { checkReminders } = require('./checker');

const {channelId} = require('../../config.json');

async function scheduleReminders(client){
    const pypath = path.resolve(__dirname, '../scraping', 'scraper.py');

    cron.schedule('0 12 * * *', async () => {
        console.log('スケジュールされたタスクの開始');

        try {
            console.log('Pythonスクリプトの開始');
            await executePythonScript(pypath);

            console.log('リマインダのチェック');
            await checkReminders(client);

        } catch (error){
            console.error('スケジュールされたタスクの実行中にエラーが発生', error);
            const channel = client.channels.cache.get(channelId);
            if (channel) {
                await channel.send(`タスクの実行中にエラーが発生しました:\n\`\`\`\n${error.message}\n\`\`\``);
            }
        }
    }, {
        timezone: "Asia/Tokyo"
    });
}

module.exports = { scheduleReminders };