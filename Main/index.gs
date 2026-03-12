/**
 * livedoor天気のWebAPIを活用して、Slackに天気予報を送信する
 * →「2020年7月31日（金）14:00」にAPI停止につき、このスクリプトも更新停止。
 * →「2026年3月7日（土）」、代替APIを発見したので、こちらに変更
 *
 * 【参考】
 *   - 天気予報 API（livedoor 天気互換）
 *     https://weather.tsukumijima.net/
 */
function PostToSlack() {
  const symbols = SlackSymbols.load();
  const lf = symbols.linefeed;
  let message = `< おはよう！今日の天気だよ。${lf}${lf}`;
  message += generateMessage_();
  
  const props = new Props();
  const slack = SlackApp.load(props.apiToken, props.channelId);
  slack.post(message);
}

/**
 * 天気予報を作成
 * 
 * @return {string} - 生成した天気予報文
 */
function generateMessage_() {
  const tsuchiura = '080020';
  const forecast = new Forecast(tsuchiura);

  const symbols = SlackSymbols.load();
  const lf         = symbols.linefeed;
  const bold       = symbols.bold;
  const quate      = symbols.quote;
  const codeBlock  = symbols.codeBlock;
  const blockQuate = symbols.blockQuote;
  
  let m = '';
  m += `${bold}${forecast.title}${bold}${lf}`;  
  m += lf;

  m += `${bold}▼${forecast.today.date}${bold}${lf}`;  
  m += `${forecast.today.icon}${lf}`;
  m += `${quate}${forecast.today.forecast}${lf}`;
  m += `${quate}最低気温： ${forecast.today.temp.min} ℃${lf}`;
  m += `${quate}最高気温： ${forecast.today.temp.max} ℃${lf}`;
  m += lf;
  
  m += `${bold}▼${forecast.tommorow.date}${bold}${lf}`;
  m += `${forecast.tommorow.icon}${lf}`;
  m += `${quate}${forecast.tommorow.forecast}${lf}`;
  m += `${quate}最低気温：${forecast.tommorow.temp.min} ℃${lf}`;
  m += `${quate}最高気温：${forecast.tommorow.temp.max} ℃${lf}`;
  m += lf;

  m += `${bold}▼${forecast.theDayAfterTomorrow.date}${bold}${lf}`;
  m += `${forecast.theDayAfterTomorrow.icon}${lf}`;
  m += `${quate}${forecast.theDayAfterTomorrow.forecast}${lf}`;
  m += `${quate}最低気温：${forecast.theDayAfterTomorrow.temp.min} ℃${lf}`;
  m += `${quate}最高気温：${forecast.theDayAfterTomorrow.temp.max} ℃${lf}`;

  m += lf;
  m += `${codeBlock}`;
  m += `${splitDescription_(forecast.description)}${lf}`
  m += `${codeBlock}`;

  m += lf;
  m += `${blockQuate}${lf}`;
  m += `公開: ${forecast.dataTime}${lf}`;
  m += `Source: ${forecast.url}${lf}`;
  m += `発表: ${forecast.privider}${lf}`;
  m += `HP: ${forecast.prividerUrl}${lf}`;

  return m;
}

/**
 * 概要文を整形する
 *
 * 【参考】
 * - 特定の文字列を全て置換する[Javascript] #JavaScript - Qiita
 *   https://qiita.com/DecoratedKnight/items/103ab57431b6c448e535
 * 
 * @param {string} str - 整形前の文字列
 * 
 * @return {string} - 整形後の文字列
 */
const splitDescription_ = (str) => {
  let m = str.split('　').join('');
  m = m.replace(/\n\n/g, '\n');

  return m;
}