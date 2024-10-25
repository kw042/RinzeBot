// src/features/reminder/checker.js 前日のものをチェックしてリマインダを送信
const path = require('path');
const { channelId} = require('../../config.json');

const { loadJSON } = require('../../utils/jsonUtils');
const { formatDate, getTomorrowStr } = require('../../utils/dateUtils');

// 終了日が明日のイベントをフィルタリングして辞書で返す
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

// 受け取った公演のリマインダを送信
const sendReminder = async (client, endEvents) => {
    const channel = client.channels.cache.get(channelId); //チャンネルIDの設定
    // チャンネルが見つからないとき
    if (!channel){
        console.error('チャンネルIDが見つからない', err);
        return;
    }

    // 終了日が明日の公演はない
    if(endEvents.length === 0){
        console.log('明日期限の公演はない');
        return;
    }

    // 終了日が明日の公演にリマインダを送信
    for (const event of endEvents){
        try {
            await channel.send(
                `${event.title}の${event.form}の期限が明日
                \n申し込みはこちらのリンクより: https://asobiticket2.asobistore.jp/\n`
            );
            console.log(`リマインド通知を送信->公演タイトル：${event.title}`);
        }
        catch (err){
            console.error(`リマインダ通知の送信に失敗->公演タイトル：${event.title}`,err);
        }
    }
};

// 上の関数を実行
const checkReminders = async (client) =>{
    console.log('リマインダチェックの開始');
    const filepath = path.resolve(__dirname, '../../data', 'events.json');

    const endEvents = await filterEndEvents(filepath);
    await sendReminder(client, endEvents);

    console.log('リマインダチェックの終了');
};

module.exports = { checkReminders };