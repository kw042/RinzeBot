const { spawn } = require('child_process');
const path = require('path');  // { path } の誤りを修正

function executePythonScript(filepath, args = []) {
    console.log(`Pythonスクリプトの実行: ${filepath}`);
    
    return new Promise((resolve, reject) => {
        // ファイルパスを絶対パスに変換
        const fullPath = path.resolve(__dirname, filepath);

        // Pythonプロセスを spawn で実行
        const process = spawn('python', [fullPath, ...args]);

        // 標準エラー出力をキャッチ
        process.stderr.on('data', (data) => {
            console.error('Python error:', data.toString());
        });

        // 標準出力をキャッチ (必要なら)
        // process.stdout.on('data', (data) => {
        //     console.log(`Python stdout: ${data.toString()}`);
        // });

        // プロセス終了時に呼び出される
        process.on('close', (code) => {  // 'close' イベントに修正
            console.log(`Pythonスクリプトの実行終了: exit code ${code}`);
            if (code !== 0) {
                reject(new Error(`Pythonスクリプトの実行に失敗: exit code ${code}`));
            } else {
                resolve();
            }
        });

        // プロセス起動エラー
        process.on('error', (error) => {
            reject(new Error(`Failed to start Python process: ${error}`));
        });
    });
}

module.exports = { executePythonScript };
