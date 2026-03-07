function test() {
  // const tsuchiura = '080020';
  // const forecast = new Forecast(tsuchiura);
  
  console.log(generateMessage());
  
}

function test02() {
  const symbols = SlackSymbols.load();
  const lf         = symbols.linefeed;
  const bold       = symbols.bold;
  const quate      = symbols.quote;
  const blockQuate = symbols.blockQuote;

  console.log(blockQuate);
}