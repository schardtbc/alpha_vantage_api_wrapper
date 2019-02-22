import axios from "axios";

import Bottleneck from "bottleneck"

import * as dotenv from "dotenv";

dotenv.config();

const av_api_key = process.env.ALPHA_VANTAGE_API_KEY;

const apiKey = `&apikey=${av_api_key}`;

const baseURL = "https://www.alphavantage.co/query?function=";

interface KVP {
  [k: string]: any;
}

const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 17 * 1000,
    reservoir: 500, // initial value
    reservoirRefreshAmount: 500,
    reservoirRefreshInterval: 24 * 60 * 60 * 1000 + 10000// must be divisible by 250
})

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
  const result = Object.keys(objIn).reduce<[any]>(
    (acc, key) => {
      acc.push({ dateTime: key, ...objIn[key] });
      return acc;
    }, Array[0]
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
  return data.slice(1,data.length-1);
};

export const dailyAdjusted = async (symbol: string, outputsize: string = 'compact') => {
  const endpoint = `TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=${outputsize}`;
  let data = await limiter.schedule( () => axios.get(baseURL + endpoint + apiKey).then(res => res.data));
  data = reshapeDataOn(data,"Time Series (Daily)");
  data = data.map( (o: KVP) => {o.symbol = symbol; return o;})
  return data.slice(1,data.length-1);
};

export const intraday = async (symbol: string, interval: string = "1min", outputsize: string = 'compact') => {
  const endpoint = `TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&outputsize=${outputsize}`;
  let data = await limiter.schedule( () => axios.get(baseURL + endpoint + apiKey).then(res => res.data));
  data = reshapeDataOn(data,`Time Series (${interval})`);
  return data.slice(1,data.length-1);
};

export const MACD = async (symbol: string, interval: string = "daily", series: string = "close") => {
  const endpoint = `MACD&symbol=${symbol}&interval=${interval}&series_type=${series}`;
  let data = await limiter.schedule( () => axios.get(baseURL + endpoint + apiKey).then(res => res.data));
  data = reshapeDataOn(data,"Technical Analysis: MACD");
  return data.slice(1,data.length-1);
};

export const forexDaily = async (fromSymbol: string, toSymbol: string) => {
  const endpoint = `FX_DAILY&from_symbol=${fromSymbol}&to_symbol=${toSymbol}&interval=1min`;
  let data = await limiter.schedule( () => axios.get(baseURL + endpoint + apiKey).then(res => res.data));
  data = reshapeDataOn(data,"Time Series FX (Daily)");
  return data.slice(1,data.length-1);
};

export const forexExchangeRate = async (fromSymbol: string, toSymbol: string) => {
  const endpoint = `CURRENCY_EXCHANGE_RATE&from_currency=${fromSymbol}&to_currency=${toSymbol}`;
  let data = await limiter.schedule( () => axios.get(baseURL + endpoint + apiKey).then(res => res.data));
  data = reshapeForexExchangeRateData(data);
  return data.slice(1,data.length-1);
};