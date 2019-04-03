import axios from "axios";

import Bottleneck from "bottleneck"

import * as dotenv from "dotenv";

dotenv.config();

const avApiKey = process.env.ALPHA_VANTAGE_API_KEY;
const avRateS = process.env.ALPHA_VANTAGE_RATE;
const avRate = avRateS?parseInt(avRateS,10):5
const avMinTime = 60000/avRate +5;
const avLimitS = process.env.ALPHA_VANTAGE_LIMIT;
const avLimit = avLimitS?parseInt(avLimitS,10):500
const apiKey = `&apikey=${avApiKey}`;

const baseURL = "https://www.alphavantage.co/query?function=";

interface KVP {
  [k: string]: any;
}

const makeLimiter = (mt: number, lmt: number=0) => {
  if (lmt === 0) {
    return new Bottleneck({
      maxConcurrent: 4,
      minTime: mt
  })
  } else {
    return new Bottleneck({
      maxConcurrent: 4,
      minTime: mt,
      reservoir: lmt, // initial value
      reservoirRefreshAmount: lmt,
      reservoirRefreshInterval: 24*60*60 * 1000, // mu
  })   
  }
}

const limiter = makeLimiter(avMinTime,avLimit)

export const toCamelCase = (str: string) => {
  let tmp = str
    .replace(/[^A-Za-z ]/g, "")
    .replace(/^\s/, "")
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) =>
      idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()
    )
    .replace(/[^A-Za-z]/g, "");
    if (/[A-Z]/.test(tmp.charAt(1))) {
      tmp = tmp.charAt(0).toUpperCase() + tmp.slice(1);
    }
  return tmp  
};

export const renameKeysWith = (
  objIn: any,
  namingFcn: (k: string) => string,
  level: number = 1,
  tgtLevel: number = 1
): any => {
  let result;
  if (typeof objIn === "object") {
    result = Object.keys(objIn).reduce(
      (acc, key) => ({
        ...acc,
        ...{
          [level === tgtLevel ? namingFcn(key) : key]: renameKeysWith(
            objIn[key],
            namingFcn,
            level + 1,
            tgtLevel
          )
        }
      }),
      {}
    );
  } else {
    result = /^[+-]?(?=.)(?:\d+,)*\d*(?:\.\d+)?[%]?$/.test(objIn)
      ? parseFloat(objIn)
      : objIn;
  }
  return result;
};

export const permuteToArray = (objIn: { [k: string]: any }) => {
  const result = Object.keys(objIn).reduce<any[]>(
    (acc, key) => {
      acc.push({ dateTime: key, ...objIn[key] });
      return acc;
    }, Array(0)
  );
  return result;
};

export const reshapeQuoteData = (data: { [k: string]: any }) => {
  let tmp = data["Global Quote"];
  tmp = renameKeysWith(tmp, toCamelCase);
  return tmp;
};

export const reshapeForexExchangeRateData = (data: { [k: string]: any }) => {
  let tmp = data["Realtime Currency Exchange Rate"];
  tmp = renameKeysWith(tmp, toCamelCase, 1, 1);
  return tmp;
};

export const reshapeDataOn = (data: { [k: string]: any }, field: string) => {
  let tmp = data[field];
  tmp = renameKeysWith(tmp, toCamelCase, 1, 2);
  tmp = permuteToArray(tmp);
return tmp;
}

export const quote = async (symbol: string) => {
  const endpoint = `GLOBAL_QUOTE&symbol=${symbol}`;
  let data = await limiter.schedule( () => axios.get(baseURL + endpoint + apiKey).then(res => res.data));
  data = reshapeQuoteData(data);
  return data
};

export const daily = async (symbol: string, outputsize: string = 'compact') => {
  const endpoint = `TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputsize}`;
  let data = await limiter.schedule( () => axios.get(baseURL + endpoint + apiKey).then(res => res.data));
  data = reshapeDataOn(data,"Time Series (Daily)");
  data = data.map( (o: KVP) => {o.symbol = symbol; return o;})
  return data.slice(0,data.length-1);
};

export const dailyAdjusted = async (symbol: string, outputsize: string = 'compact') => {
  const endpoint = `TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=${outputsize}`;
  let data = await limiter.schedule( () => axios.get(baseURL + endpoint + apiKey).then(res => res.data));
  data = reshapeDataOn(data,"Time Series (Daily)");
  data = data.map( (o: KVP) => {o.symbol = symbol; return o;})
  return data.slice(0,data.length-1);
};

export const intraday = async (symbol: string, interval: string = "1min", outputsize: string = 'compact') => {
  const endpoint = `TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&outputsize=${outputsize}`;
  let data = await limiter.schedule( () => axios.get(baseURL + endpoint + apiKey).then(res => res.data));
  data = reshapeDataOn(data,`Time Series (${interval})`);
  data = data.map( (o: KVP) => {o.symbol = symbol; return o;})
  return data.slice(0,data.length-1);
};

export const MACD = async (symbol: string, interval: string = "daily", series: string = "close") => {
  const endpoint = `MACD&symbol=${symbol}&interval=${interval}&series_type=${series}`;
  let data = await limiter.schedule( () => axios.get(baseURL + endpoint + apiKey).then(res => res.data));
  data = reshapeDataOn(data,"Technical Analysis: MACD");
  return data
};

export const forexDaily = async (fromSymbol: string, toSymbol: string) => {
  const endpoint = `FX_DAILY&from_symbol=${fromSymbol}&to_symbol=${toSymbol}&interval=1min`;
  let data = await limiter.schedule( () => axios.get(baseURL + endpoint + apiKey).then(res => res.data));
  data = reshapeDataOn(data,"Time Series FX (Daily)");
  return data;
};

export const forexExchangeRate = async (fromSymbol: string, toSymbol: string) => {
  const endpoint = `CURRENCY_EXCHANGE_RATE&from_currency=${fromSymbol}&to_currency=${toSymbol}`;
  let data = await limiter.schedule( () => axios.get(baseURL + endpoint + apiKey).then(res => res.data));
  data = reshapeForexExchangeRateData(data);
  return data
};