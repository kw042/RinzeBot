// src/features/reminder/scheduler.js スケジューリングされたリマインダのチェック

const path = require('path');
const cron = require('node-cron');
const { executePythonScript } = require('../../utils/pyScriptExer');
const { checkReminders } = require('./checker');

const {channelId} = require('../../config.json');

// 毎日12時に一連の処理を実行
async function scheduleReminder(client){
    const pypath = path.resolve(__dirname, '../scraping', 'scraper.py');

    cron.schedule('0 12 * * *', async () => {
        console.log('スケジュールされたタスクの開始');

        try {
            await executePythonScript(pypath); // Pythonスクリプトの実行
            await checkReminders(client);  // リマインダのチェック

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

module.exports = { scheduleReminder };