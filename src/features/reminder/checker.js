// src/features/reminder/checker.js 前日のものをチェック
const path = require('path');
const { channelId} = require('../../config.json');

const { loadJSON } = require('../../utils/jsonUtils');  

const filterEndEvents = async (filepath) => {
    const tomorrow = getTomorrowStr(); // 'YYYY-MM-DDの形式で明日の日本の日付を取得'

    try{
        const events = await loadJSON(filepath);
        // 終了日が明日のイベントをフィルタリング, filterがeventsから要素eventを取り出し比較
        const endEvents = events.filter(event => {
            endDate = formatDate(event.end); // 'YYYY-MM-DDの形式で終了日時を取得'
            return endDate === tomorrow; //tureを返すものだけフィルタリングして格納
        });

        return endEvents;
    } catch (error) {
        console.error('イベントリストの読み取り中にエラー: ',error);
        return [];
    }
};

const sendRemind = async (client, endEvents) => {
    const channel = client.channels.cache.get(channelId); //チャンネルIDの設定
    if (!channel){
        console.error('チャンネルIDが見つからない', err);
        return;
    }

    if(endEvents.length === 0){
        console.log('明日期限のライブはない');
        return;
    }

    for (const event of endEvents){
        try {
            await channel.send(
                `${event.title}の${event.form}の期限が明日
                \n申し込みはこちらのリンクより: https://asobiticket2.asobistore.jp/`
            );
            console.log(`リマインド通知を送信->公演タイトル：${event.title}`);
        }
        catch (err){
            console.error(`リマインダ通知の送信に失敗->公演タイトル：${event.title}`,err);
        }
    }
};

const checkReminders = async (client) =>{
    console.log('リマインダチェックの開始');
    const filepath = path.resolve(__dirname, '../../data', 'events.json');

    const endEvents = await filterEndEvents(filepath);
    await sendRemind(client, endEvents);

    console.log('リマインダチェックの終了');
};

module.exports = { checkReminders };