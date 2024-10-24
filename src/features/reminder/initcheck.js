const {executePythonScript } = require('../../utils/pyScriptExer');
const { checkReminders } = require('./checker');
const path = require('path');

async function initCheck(client){
    const pypath = path.resolve(__dirname, '../scraping', 'scraper.py');

    try {
        console.log('初回リマインダーを実行');
        await executePythonScript(pypath);
        await checkReminders(client);
    } catch (error){
        console.error(`初回リマインダー実行中にエラーが発生: ${error}`);
    }
}

module.exports = { initCheck };