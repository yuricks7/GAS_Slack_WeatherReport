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

    /** 概要 */
    this.dataTime = data.publicTime;

    const provider = data.copyright.provider[0];
    this.privider    = provider.name;
    this.prividerUrl = provider.link;

    const location = data.location;
    this.city = `${location.city} in ${location.prefecture} of ${location.area}`;

    this.title = data.title;

    /** 予報 */
    const description = data.description;
    this.descriptionTime = description.publicTime;
    this.description     = description.text;

    // 今日
    const forecasts      = data.forecasts;
    const todaysForecast = forecasts[0];
    const todaysTemp = todaysForecast.temperature;
    this.today = {
      date:     todaysForecast.date,
      forecast: this.replaceToKana(todaysForecast.telop),
      icon:     todaysForecast.image.url,
      temp: {
        min: this.isNull(todaysTemp.min).celsius,
        max: this.isNull(todaysTemp.max).celsius
      }
    }

    // 明日
    const tommorowsForecast = forecasts[1];
    const tommorowsTemp = todaysForecast.temperature;
    this.tommorow = {
      date:     tommorowsForecast.date,
      forecast: this.replaceToKana(tommorowsForecast.telop),
      icon:     tommorowsForecast.image.url,
      temp: {
        min: this.isNull(tommorowsTemp.min).celsius,
        max: this.isNull(tommorowsTemp.max).celsius
      }
    }
  }

  /**
   * 漢字を平仮名に変換する
   * 
   * @param {string} value - 変換前の文字列
   * 
   * @return {string} - 変換後の文字列
   */
  replaceToKana(value) {
    var str = String(value);
    if (value.indexOf('時々') != -1) {
      str.replace('時々', 'ときどき');
    }

    return str
  }

  /**
   * 空欄を埋める
   * 
   * @param (string) - 変換前の文字列
   * 
   * @return {string | boolean} - nullなら置き換える
   */
  isNull(value) {
    if (value == null) {
      if (value === 0) return value;

      return '■■';
    }

    return value;
  }
}