const { spawn } = require('child_process');
const { path } = require('path');

function executePythonScript(filepath, args = []){
    console.log(`Pythonスクリプトの実行: ${filepath}`);
    return new Promise((resolve, reject) => {
        const fullPath = path.resolve(__dirname, filepath);

        const process = spawn('python', [fullPath, ...args]);

        process.stderr.on('data', (data) => {
            console.error('Python error:', data.toString());
        });

        process.on('clone', (code) => {
            console.log(`Pythonスクリプトの実行終了: exit code ${code}`);
            if (code !== 0){
                reject(new Error(`Pythonスクリプトの実行に失敗: exit code ${code}`));
            } else{
                resolve();
            }
        });

        process.on('error', (error) => {
            reject(new Error(`Failed to start Python process: ${error}`));
        });
    });
}