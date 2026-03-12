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


function test03() {

  const url = "https://www.jma.go.jp/bosai/forecast/img/200.svg"
  const blobUrl = svgToBlob(url);
  
  const props = new Props();
  const slack = SlackApp.load(props.apiToken, props.channelId_test);
  slack.post(blobUrl); // SVGだとドライブにアップしてもリンクのみ。

}

  /**
   * SVGのURLから画像を取得
   * 
   * 【参考】
   *   - GASでBlobファイルを外部からもってくる - Bye Bye Moore
   *     https://shuzo-kino.hateblo.jp/entry/2018/08/27/235741
   * 
   * @param {string} url - 画像のURL
   * 
   * @return {Blob} - 画像のBlobオブジェクト
   */
const svgToBlob = (url) => {
    const response = UrlFetchApp.fetch(url);
    const blob = response.getBlob();

    const props = new Props();
    const iconFolder = DriveApp.getFolderById(props.folderId);
    const svg = iconFolder.createFile(blob);

    return svg.getUrl();
  }