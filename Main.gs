function sendWeatherForcast() {
  MySlack = new Slack('10_天気予報', '天記予保子');
  
  var message = '<!channel>' + '\n'; // チャンネル全体にメンション飛ばす
  message += 'おはよう！今日の天気だよ。' + '\n\n';
  message += getWeatherForcast();
  
  MySlack.post(message);
}

function getWeatherForcast() {
  const SENDAI_ID = '040010';
  var sendaiWeather = new Weather(SENDAI_ID);
  
  const BR = '\n';
  const BOLD = '*';
  const QUATE = '> ';
  const BLOCK_QUATE = '```';
  var ret = BOLD + sendaiWeather.title + BOLD + BR;
  ret += BOLD + '▼' + sendaiWeather.today + BOLD + BR;
  ret += sendaiWeather.todayForcastIcon + BR;
  ret += QUATE + sendaiWeather.todayForcast + BR;
  ret += QUATE + '最低気温：' + sendaiWeather.todayMinTemp + ' ℃' + BR;
  ret += QUATE + '最高気温：' + sendaiWeather.todayMaxTemp + ' ℃' + BR;

  ret += BOLD +  '▼' + sendaiWeather.tommorow + BOLD + BR;
  ret += sendaiWeather.tommorowForcastIcon + BR;
  ret += QUATE + sendaiWeather.tommorowForcast + BR;
  ret += QUATE + '最低気温：' + sendaiWeather.tommorowMinTemp + ' ℃' + BR;
  ret += QUATE + '最高気温：' + sendaiWeather.tommorowMaxTemp + ' ℃' + BR;

//  var comments = splitComments(sendaiWeather.comment);

  ret += BLOCK_QUATE + BR;
  ret += 'ここに説明が入るよ。' + BR;
//  ret += shortDesc + BR;
//  ret += comments + BR;
  ret += BLOCK_QUATE + BR;
  ret += BLOCK_QUATE + BR;
  ret += '公開：' + sendaiWeather.dataTime + BR;
  ret += 'Source：' + sendaiWeather.url + BR;
  ret += '発表：' + sendaiWeather.provider + BR;
  ret += 'HP：' + sendaiWeather.providerUrl + BR;
  ret += BLOCK_QUATE + '\n';

  const AOBA_KU = '仙台市青葉区';
  const pinPointForecastUrl = 'http://weather.livedoor.com/area/forecast/';
  const aobaWardId          = '960034101';
  const AOBA_KU_URL         = pinPointForecastUrl + aobaWardId;

  ret += '詳しい天気は↓こっち↓で見てね。' + BR;
  ret += QUATE + AOBA_KU + BR;
  ret += QUATE + AOBA_KU_URL;

//Logger.log(ret);
  return ret;
}

// いい感じに分割できない…
var splitComments = function(string) {
  var arr = string.split('\n');

  var ret = [];
  var i = 0;

  ret[i] = [];
  for (var j = 0; j < arr.length; j++) {
    var currentArr = arr[j];
    if (currentArr === '') {
      continue;
      
    } else if (currentArr.indexOf('【') !== -1) {
      currentArr = String(currentArr).replace('】', '】```')
      i += 1;
      ret[i] = [];
      
//    } else if (j = arr.length - 1) {
//      currentArr += '```';
    }
    
    ret[i].push(currentArr + '\n');
  }

  for (i = 0; i < ret.length; i++) {
    ret[i].join();
  }

  Logger.log(ret);

  return ret;
}