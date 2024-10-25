// src/feature/commands/interaction.js interactionCreateイベントの設定
const { Events } = require('discord.js');
const eventCommands = require('./events');

module.exports = {
    name: Events.InteractionCreate,
    execute: async function(interaction){
        // ｽﾗｯｼｭｺﾏﾝﾄﾞ以外は無視
        if(!interaction.isChatInputCommand()){
            return;
        }
        // コマンド名が'events'のとき処理を実行
        if(interaction.commandName === eventCommands.data.name){
            try {
                await eventCommands.execute(interaction);
            } catch (error) {
                console.error(`Error in events command: ${error}`);
                await interaction.reply({
                    content: 'コマンドの実行中にエラーが発生',
                    ephemeral: false
                });
            }
        }
        else {
            console.log(`Unknown command: ${interaction.commandName}`);
        }
    }
};