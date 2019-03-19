import {  daily, dailyAdjusted,  forexDaily, forexExchangeRate, intraday, MACD, quote, toCamelCase } from "./avc";

test("toCamelCase()", () => {
  expect(toCamelCase("2. MACD_Hist")).toEqual("MACDHist")
})


test("quote() works with async await()", async () => {
  const res = await quote("AAPL");
  expect(res).toEqual(
    expect.objectContaining({
      symbol: expect.any(String),
      open: expect.any(Number),
      high: expect.any(Number),
      low: expect.any(Number),
      price: expect.any(Number),
      volume: expect.any(Number),
      latestTradingDay: expect.any(String),
      previousClose: expect.any(Number),
      change: expect.any(Number),
      changePercent: expect.any(Number)
    })
  );
},18000);

test("intraday() works with async await()", async () => {
  const res = await intraday("AAPL");
  expect(res).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        dateTime: expect.any(String),
        open: expect.any(Number),
        high: expect.any(Number),
        low: expect.any(Number),
        close: expect.any(Number),
        volume: expect.any(Number)
      })
    ])
  );
},18000);

test("daily() works with async await()", async () => {
  const res = await daily("AAPL");
  expect(res).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        dateTime: expect.any(String),
        open: expect.any(Number),
        high: expect.any(Number),
        low: expect.any(Number),
        close: expect.any(Number),
        volume: expect.any(Number)
      })
    ])
  );
},18000);

test("dailyAdjusted() works with async await()", async () => {
  const res = await dailyAdjusted("AAPL");
  // console.log(res.slice(0,3))
  expect(res).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        dateTime: expect.any(String),
        open: expect.any(Number),
        high: expect.any(Number),
        low: expect.any(Number),
        close: expect.any(Number),
        adjustedClose: expect.any(Number),
        volume: expect.any(Number),
        dividendAmount: expect.any(Number),
        splitCoefficient: expect.any(Number)
      })
    ])
  );
},18000);

test("forexDaily() works with async await()", async () => {
  const res = await forexDaily("EUR","USD");
  expect(res).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        dateTime: expect.any(String),
        open: expect.any(Number),
        high: expect.any(Number),
        low: expect.any(Number),
        close: expect.any(Number),
      })
    ])
  );
},18000);

test("forexExchangeRate() works with async await()", async () => {
  const res = await forexExchangeRate("EUR","USD");
  expect(res).toEqual(
      expect.objectContaining({
        "fromCurrencyCode": expect.any(String),
        "fromCurrencyName": expect.any(String),
        "toCurrencyCode": expect.any(String),
        "toCurrencyName": expect.any(String),
        "exchangeRate": expect.any(Number),
        "lastRefreshed": expect.any(String),
        "timeZone": expect.any(String)
    })
  );
},18000);

test("MACD() works with async await()", async () => {
  const res = await MACD("AAPL");
  expect(res).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        "dateTime": expect.any(String),
        "MACDSignal": expect.any(Number),
        "MACDHist": expect.any(Number),
        "MACD": expect.any(Number)
    })
    ])
  );
},18000);