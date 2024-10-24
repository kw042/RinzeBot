// src/lib/utils/jsonHandler.js
const fs = require('fs').promises;

/**
 * JSONファイルからデータを読み込む
 * @param {string} filePath - JSONファイルのパス
 * @param {string} key - 読み込むデータのキー（デフォルト: 'reminders'）
 * @returns {Promise<Array>} 読み込んだデータの配列
 */
async function loadJSON(filePath, key = 'reminders') {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData[key] || [];
    } catch (err) {
        if (err.code === 'ENOENT') {
            return [];
        }
        throw new Error(`JSONファイルの読み込みに失敗: ${err.message}`);
    }
}

/**
 * データをJSONファイルに保存
 * @param {string} filePath - 保存先のファイルパス
 * @param {Array} data - 保存するデータ
 * @param {string} key - 保存するデータのキー（デフォルト: 'reminders'）
 */
async function saveJSON(filePath, data, key = 'reminders') {
    try {
        const jsonData = { [key]: data };
        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
    } catch (err) {
        throw new Error(`JSONファイルの保存に失敗: ${err.message}`);
    }
}

/**
 * JSONデータを更新
 * @param {string} filePath - JSONファイルのパス
 * @param {Function} updateFn - 更新ロジックを含む関数
 * @param {string} key - 更新するデータのキー（デフォルト: 'reminders'）
 */
async function updateJSON(filePath, updateFn, key = 'reminders') {
    try {
        const data = await loadJSON(filePath, key);
        const updatedData = await updateFn(data);
        await saveJSON(filePath, updatedData, key);
    } catch (err) {
        throw new Error(`JSONデータの更新に失敗: ${err.message}`);
    }
}

module.exports = {
    loadJSON,
    saveJSON,
    updateJSON
};