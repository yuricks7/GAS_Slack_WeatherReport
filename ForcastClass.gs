var Weather = function (cityId) {
  this.baseUrl = 'http://weather.livedoor.com/forecast/webservice/json/v1?';
  this.cityId  = cityId;
  this.url     = this.baseUrl + 'city=' + this.cityId;

  // API呼び出し
  var response    = UrlFetchApp.fetch(this.url);
  this.textParsed = JSON.parse(response.getContentText());
  
  // 一旦まとめて格納
  var text      = this.textParsed;

  /* 概要 */
  this.dataTime = text.publicTime;

  var provider     = text.copyright.provider[0];
  this.provider    = provider.name;
  this.providerUrl = provider.link;
  
  var location = text.location;
  this.city = location.city + ' in ' + location.prefecture + ' of ' + location.area;

  this.title = text.title;

  /* 予報 */
  var forecasts   = text.forecasts;

  var description  = text.description;
  this.commentTime = description.publicTime;
  this.comment     = description.text;

  // 今日
  var todayForcastParsed = forecasts[0];
  this.today            = todayForcastParsed.date;
  this.todayForcast     = replaceToKana(todayForcastParsed.telop);
  this.todayForcastIcon = todayForcastParsed.image.url;
  
  var todayTemps = todayForcastParsed.temperature;
  this.todayMinTemp = isNull(todayTemps.min).celsius;
  this.todayMaxTemp = isNull(todayTemps.max).celsius;

  // 明日
  var tommorowForcastParsed = forecasts[1];
  this.tommorow            = tommorowForcastParsed.date;
  this.tommorowForcast     = replaceToKana(tommorowForcastParsed.telop);
  this.tommorowForcastIcon = tommorowForcastParsed.image.url;
  
  var tommorowTemps = tommorowForcastParsed.temperature;
  this.tommorowMinTemp = isNull(tommorowTemps.min).celsius;
  this.tommorowMaxTemp = isNull(tommorowTemps.max).celsius;
}

var replaceToKana = function (value) {
  var str = String(value);
  if (value.indexOf('時々') != -1) {
    str.replace('時々', 'ときどき');
  }

  return str
}


/**
 * nullなら置き換える
 * 
 * @param (string)
 */
var isNull = function (value) {
  var ret = '';
  if (value !== 0) {
    if(!value) {
      ret = '■■';
      return ret;
    }
  }
  
  ret = value;
  return ret;
}