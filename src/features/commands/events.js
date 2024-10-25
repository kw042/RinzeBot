//src/features/commands/events.js ｽﾗｯｼｭｺﾏﾝﾄﾞの定義 アクティブな公演一覧を返す
const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const { loadJSON } = require('../../utils/jsonUtils');

// ｽﾗｯｼｭｺﾏﾝﾄﾞの定義
module.exports = {
    // key -> data value -> SlashCommandBuilder
    data: new SlashCommandBuilder()
        .setName('events')
        .setDescription('申込期間内の公演一覧を表示'),

    // key -> execute value -> function
    execute: async function(interaction){
        try {
            console.log('申し込み可能な公演を取得');
            const jsonPath = path.resolve(__dirname, '../../data','events.json');
            const eventsList = await loadJSON(jsonPath); // JSONファイルの読み込み
            const activeEvents = eventsList.filter(event => event.state === 'active'); // 期間内の公演を抽出

            if(activeEvents.length === 0){
                await interaction.reply({
                    content: '現在申込可能な公演はありません',
                    ephemeral: false //応答メッセージが全員に見える形で送信,trueだとコマンドを実行したユーザだけに表示
                });
                return;
            }
            
            // 申込可能な公演の一覧の作成
            let reply = 'こちらが申込可能な公演の一覧でございます.....\n';
            activeEvents.forEach(event => {
                reply += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
                reply += `**公演名**: ${event.title}\n`;
                reply += `**申込形式**: ${event.form}\n`;
                reply += `**申込期間**: ${event.start}〜${event.end}\n`;
            });
            
            // Discordの文字数制限に対応
            if(reply.length > 2000){
                reply = reply.substring(0, 1997) + '...';
            }

            // 返信の実行
            await interaction.reply({
                content: reply,
                ephemeral: false
            });
        } catch (error) {
            console.error(`Error in events command: ${error}`);
            await interaction.reply({
                content: 'コマンドの実行中にエラーが発生',
                ephemeral: false
            });
        }
    },
};