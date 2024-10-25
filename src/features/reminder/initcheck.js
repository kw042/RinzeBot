// src/features/reminder/initcheck.js 初回実行用のpython実行+リマインダチェック
const {executePythonScript } = require('../../utils/pyScriptExer');
const { checkReminders } = require('./checker');
const path = require('path');

// 初回リマインダーを実行
async function initCheck(client){
    const pypath = path.resolve(__dirname, '../scraping', 'scraper.py');

    try {
        console.log('初回リマインダーを実行');
        await executePythonScript(pypath); // pythonスクリプトの実行
        await checkReminders(client); // リマインダーのチェック
        console.log('初回リマインダーの終了, スケジュールまで待機');
    } catch (error){
        console.error(`初回リマインダー実行中にエラーが発生: ${error}`);
    }
}

module.exports = { initCheck };