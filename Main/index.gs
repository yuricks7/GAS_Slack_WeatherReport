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
  const b  = symbols.bold;
  const codeBlock  = symbols.codeBlock;
  const blockQuate = symbols.blockQuote;

  const tsuchiura = '080020';
  const forecast = new Forecast(tsuchiura);
  const props = new Props();
  // const slack = SlackApp.load(props.apiToken, props.channelId_test);
  const slack = SlackApp.load(props.apiToken, props.channelId);

  let m = '';
  const dateFormat = DateFormat.load();
  m += '----------------------------------\n';
  m += `${b}${dateFormat.ja_JP(new Date())}${b}${lf}`;
  m += '----------------------------------\n';
  m += `${b}${forecast.title}${b}${lf}`;
  m += `< おはよう！今日の天気だよ。${lf}${lf}`;
  const parentPost = slack.post(m);

  // 日ごとの天気
  post(forecast, slack, 'today', parentPost.ts);
  post(forecast, slack, 'tommorow', parentPost.ts);
  post(forecast, slack, 'theDayAfterTomorrow', parentPost.ts);

  // 概要文
  m  = `${codeBlock}`;
  m += `${forecast.description}${lf}`
  m += `${codeBlock}`;
  m += lf;

  // コピーライト
  m += `${blockQuate}${lf}`;
  m += `公開: ${new Date(forecast.dataTime).toLocaleString('ja-JP')}${lf}`;
  m += `Source: ${forecast.url}${lf}`;
  m += `発表: ${forecast.privider}${lf}`;
  m += `HP: ${forecast.prividerUrl}${lf}`;

  slack.post(m, parentPost.ts);
}

/**
 * 天気を投稿する
 * 
 * @param {Forecast} forecast
 * @param {SlackApp} slack
 * @param {string}   dateStr
 * @param {number}   timeStamp
 */
const post = (forecast, slack, dateStr, timeStamp) => {
  const symbols = SlackSymbols.load();
  const lf      = symbols.linefeed;

  let m = '';
  m = `${forecast.generateMessage(dateStr)}`;
  m += lf;
  slack.post(m, timeStamp);
  slack.postImage(forecast[dateStr].icon.blob, forecast[dateStr].telop, timeStamp);
}