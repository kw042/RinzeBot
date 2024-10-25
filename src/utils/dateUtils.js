// src/utils/dateUtils.js 日付関連のユーティリティ関数を定義
// 日本時間を取得する関数
const getJapanDateTime = () => {
    const now = new Date();
    return new Date(now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
};

// 日付を日本時間でフォーマットする関数
const formatDateForJapan = (date, format = 'YYYY-MM-DD') => {
    // 'YYYY-MM-DD' フォーマットで日付を整形
    const jpDate = new Date(date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
    if (format === 'YYYY-MM-DD') {
        const year = jpDate.getFullYear();
        const month = ('0' + (jpDate.getMonth() + 1)).slice(-2);  // 月は0から始まるので+1
        const day = ('0' + jpDate.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }
    return jpDate.toLocaleString('ja-JP');
};

// 明日の日付を日本時間で取得する関数
const getTomorrowJapan = () => {
    const now = getJapanDateTime();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return tomorrow;
};

// 明日の日付を'YYYY-MM-DD'形式で取得する関数
const getTomorrowStr = () => {
    const tomorrow = getTomorrowJapan();
    return formatDateForJapan(tomorrow);
}

// 与えられた日付文字列（'YYYY-MM-DD-HHmm'形式）をパースし、日本時間に変換する関数
const parseEventDate = (eventDateStr) => {
    const [datePart, timePart] = eventDateStr.split('-');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.match(/(\d{2})(\d{2})/).slice(1).map(Number);

    const eventDate = new Date(year, month - 1, day, hours, minutes);
    return eventDate;
};

const formatDate = (end) => {
    return end.slice(0, 10);  // 'YYYY-MM-DD'部分を抽出
};

module.exports = {
    getTomorrowStr,
    formatDate
};
