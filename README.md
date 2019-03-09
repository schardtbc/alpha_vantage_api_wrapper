# alpha_vantage_api_wrapper

[![CircleCI](https://circleci.com/gh/schardtbc/alpha_vantage_api_wrapper.svg?style=svg)](https://circleci.com/gh/schardtbc/alpha_vantage_api_wrapper)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest) 
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Note: one of 12 test @CircleCI. I believe this is due to rate limiting at the target. I need to understand a work arround for this issue... That specific test passes when run locally.

https://www.alphavantage.co/documentation/

My particular interest in this API is that it can provide OHLCV data going back to 1998, twenty years

# API KEY

You will need an API Key from Alpha Vantage, which you can obtain here: https://www.alphavantage.co/support/#api-key

You'll need to add the key to your .env file under the name: ALPHA_VANTAGE_API_KEY
Reminder not to include the .env file in your public repositories.

# Rate limiting

Alpha Advantage is rate limited. The free tier of serivce is limited to 5 requests per minute and 500 total requests per day. Paid tiers are rate limited to 30 || 120 || 300 || 600 || 1200 requests per minute with no maximum on requests per day. 

They enforce these limits.
Inside the wrapper the rate limiting is enforced by the Bottleneck package.

Two environment keys allow you to control the rate limiter.

```
# rate == max requests/min
# limit == max requests/day
ALPHA_VANTAGE_RATE
ALPHA_VANTAGE_LIMIT
```

```
// free tier rate limiter
const limiter = new Bottleneck({
    maxConcurrent: 4,
    minTime: 17 * 1000,
    reservoir: 500, // initial value
    reservoirRefreshAmount: 500,
    reservoirRefreshInterval: 24 * 60 * 60 * 1000 + 10000// must be divisible by 250
})

// 120 requests/min tier rate limiter
const limiter = new Bottleneck({
    maxConcurrent: 4,
    minTime: 505,
})
```
# Restructured Data

The raw data being returned by Alpha Advantage is messy

```
{
    "Meta Data": {
        "1. Information": "Daily Time Series with Splits and Dividend Events",
        "2. Symbol": "MSFT",
        "3. Last Refreshed": "2019-01-09 16:00:01",
        "4. Output Size": "Compact",
        "5. Time Zone": "US/Eastern"
    },
    "Time Series (Daily)": {
        "2019-01-09": {
            "1. open": "103.8600",
            "2. high": "104.8800",
            "3. low": "103.2445",
            "4. close": "104.2700",
            "5. adjusted close": "104.2700",
            "6. volume": "32271049",
            "7. dividend amount": "0.0000",
            "8. split coefficient": "1.0000"
        },...
    }
}
```

The choice of key names and the return of numberic data as strings are both problematic at least for me.
so I have converted the data streams to be modeled like

```
[ {dateTime: "2019-01-09",
    "open": 103.86,        
    "high": 104.88",
    "low": 103.2445,
    "close": 104.27,
    "adjusted close": 104.27,
    "volume": 32271049,
    "dividendAmount": 0.0000,
    "splitCoefficient": 1.0000
    },
    ...
]
```

# Installation

``` 
npm install git+https://git@github.com/schardtbc/alpha_vantage_api_wrapper.git
```

# Usage

```javascript
import { AlphaAdvantage } from alpha_vantage_api_wrapper

yourCallbackFnc =  async (symbol) => {
    try {
    let avData = await AlphaVantage.historical(symbol);
    #do something with avData
    } catch(err) {
        # handle the error
    } 
}

```

# Declaration of the AlphaVantage Class

```javascript
export declare class AlphaVantage {
    static intraday: (symbol: string, interval?: string, outputsize?: string) => Promise<any>;
    static daily: (symbol: string, outputsize?: string) => Promise<any>;
    static dailyAdjusted: (symbol: string, outputsize?: string) => Promise<any>;
    static quote: (symbol: string) => Promise<any>;
    static macd: (symbol: string, interval?: string, series?: string) => Promise<any>;
    static forexDaily: (fromSymbol: string, toSymbol: string) => Promise<any>;
    static forexExchangeRate: (fromSymbol: string, toSymbol: string) => Promise<any>;
}
``` 
