const fs = require('fs').promises;

async function loadJSON(filepath){
    try {
        const data = await fs.readFile(filepath, 'utf-8');
        const jsonData = JSON.parse(data);
        return jsonData[key] || [];
    } catch (error){
        if (error.code === 'ENOENT'){
            return [];
        }
        throw new Error(`JOSNファイルの読み取りに失敗: ${error.message}`);
    }
}

async function saveJSON(filepath, data){
    try {
        const jsonData = { [key]: data};
        await fs.writeFile(filepath, JSON.stringify(jsonData, null, 2));
    } catch (err) {
        throw new Error(`JSONファイルの保存に失敗: ${err.message}`);
    }
}

async function updateJSON(filepath, updateFn, key = 'reminders'){
    try {
        const data = await loadJSON(filepath);
        const updatadData = await updateFn(data);
        await saveJSON(filepath, updatadData, key);
    } catch (error){
        throw new Error(`JSONファイルの更新に失敗: ${error.message}`);
    }
}

module.exports = {
    loadJSON,
    saveJSON,
    updateJSON
}