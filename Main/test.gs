function test() {
  // const tsuchiura = '080020';
  // const forecast = new Forecast(tsuchiura);
  // console.log(forecast.url);

  console.log(generateMessage_());
}

function test02() {
  const symbols = SlackSymbols.load();
  const lf         = symbols.linefeed;
  const bold       = symbols.bold;
  const quate      = symbols.quote;
  const blockQuate = symbols.blockQuote;

  console.log(blockQuate);
}

const test03 = () => {
  const url = 'https://www.jma.go.jp/bosai/forecast/img/212.svg';

  const pngBlob = getJmaPngBlob(url);

  const props = new Props();
  const slack = SlackApp.load(props.apiToken, props.channelId_test);
  slack.postImage(pngBlob, pngBlob.getName());

}

/**
 * 気象庁の SVG URL を渡すと PNG Blob を返す
 * 
 * @param {string} svgUrl - 元のURL
 * 
 * @return {Blob} SVGのURLから取得したPNG画像のBlobファイル
 */
function getJmaPngBlob(svgUrl) {
  // SVGのURLからPNGのURLを生成
  const weatherCode = svgUrl.match(/(\d+)\.svg$/)[1]; // 番号を抽出（212.svg → 212）
  const pngUrl      = svgUrl.replace(/(\d+)\.svg$/, `${weatherCode}.png`);

  // PNG を取得して Blob にする
  const pngBlob = UrlFetchApp.fetch(pngUrl).getBlob();
  pngBlob.setName(`${weatherCode}.png`);

  return pngBlob;
}
