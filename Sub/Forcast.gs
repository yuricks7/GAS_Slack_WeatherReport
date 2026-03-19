/**
 * Forecastクラス
 *
 * 【参考】
 *   - 天気予報 API（livedoor 天気互換）
 *     https://weather.tsukumijima.net/
 */
class Forecast {

  /**
   * Forecastオブジェクトを生成する
   * 
   * @param {string} cityId - APIに使用するID
   */
  constructor(cityId) {
    this.baseUrl = 'https://weather.tsukumijima.net/api/forecast';
    this.cityId  = cityId;
    this.url     = this.baseUrl + '/city/' + this.cityId;

    // API呼び出し
    const apiHelper = RestApiHelper.load();
    this.jsonParsed = apiHelper.GET(this.url);
    
    // 一旦まとめて格納
    const data = this.jsonParsed;

// console.log(data);

    /** 概要 */
    this.dataTime = data.publicTime;

    const provider = data.copyright.provider[0];
    this.privider    = provider.name;
    this.prividerUrl = provider.link;

    const location = data.location;
    this.city = `${location.city} in ${location.prefecture} of ${location.area}`;

    this.title = data.title;

    /** 説明 */
    const description = data.description;
    this.descriptionTime = description.publicTime;
    this.description     = this.splitDescription_(description.text);

    /** 天気 */
    this.forecasts = data.forecasts;

    // 今日
    this.assignData('today', 0);

    // 明日
    this.assignData('tommorow', 1);

    // 明後日
    this.assignData('theDayAfterTomorrow', 2);
  }

  assignData(dateStr, i) {
    const forecast = this.forecasts[i];
    const temperature = forecast.temperature;
    this[dateStr] = {
      date:  forecast.date,
      telop: forecast.telop,
      icon: {
        url: forecast.image.url,
        blob: '',
      },
      temp: {
        min: temperature.min.celsius,
        max: temperature.max.celsius
      }
    }
    this[dateStr].icon.blob = this.getJmaPngBlob_(this[dateStr].icon.url);
  }

  /**
   * 天気の概要文を生成する
   * 
   * @param {string} dateStr - 相対日付を表す文字列
   * 
   * @return {string} 天気の概要
   */
  generateMessage(dateStr) {
    const symbols = SlackSymbols.load();
    const lf         = symbols.linefeed;
    const bold       = symbols.bold;
    const quate      = symbols.quote;

    const forecast = this[dateStr];
    let m = '';
    m += `${bold}▼${forecast.date}${bold}${lf}`;
    // m += `${forecast.icon.url}${lf}`;
    m += `${quate}${forecast.telop}${lf}`;
    m += `${quate}最低気温： ${forecast.temp.min} ℃${lf}`;
    m += `${quate}最高気温： ${forecast.temp.max} ℃${lf}`;
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
  splitDescription_(str) {
    let m = str.split('　').join('');
    m = m.replace(/\n\n/g, '\n');

    return m;
  }

  /**
   * 気象庁のSVG URLを渡すとPNG Blobを返す
   * 
   * @param {string} svgUrl - 元のURL
   * 
   * @return {Blob} SVGのURLから取得したPNG画像のBlobファイル
   */
  getJmaPngBlob_(svgUrl) {
    // SVGのURLからPNGのURLを生成
    const weatherCode = svgUrl.match(/(\d+)\.svg$/)[1]; // 画像の番号を抽出（212.svg → 212）
    const pngUrl      = svgUrl.replace(/(\d+)\.svg$/, `${weatherCode}.png`);

    // PNG を取得して Blob にする
    const pngBlob = UrlFetchApp.fetch(pngUrl).getBlob();
    pngBlob.setName(`${weatherCode}.png`);

    return pngBlob;
  }


  // /**
  //  * 漢字を平仮名に変換する
  //  * 
  //  * @param {string} value - 変換前の文字列
  //  * 
  //  * @return {string} - 変換後の文字列
  //  */
  // replaceToKana(value) {
  //   var str = String(value);
  //   if (value.indexOf('時々') != -1) {
  //     str.replace('時々', 'ときどき');
  //   }

  //   return str
  // }

  // /**
  //  * 空欄を埋める
  //  * 
  //  * @param (string) - 変換前の文字列
  //  * 
  //  * @return {string | boolean} - nullなら置き換える
  //  */
  // isNull(value) {
  //   if (value == null) {
  //     if (value === 0) return value;

  //     return '■■';
  //   }

  //   return value;
  // }
}