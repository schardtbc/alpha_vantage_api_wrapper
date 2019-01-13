import { AlphaVantage } from "./index"

test("quote() works with async await()", async () =>{
    const res  = await AlphaVantage.quote("AAPL");
    expect(res).toEqual(expect.objectContaining({
        "symbol": expect.any(String),
        "open": expect.any(Number),
        "high": expect.any(Number),
        "low": expect.any(Number),
        "price": expect.any(Number),
        "volume": expect.any(Number),
        "latestTradingDay": expect.any(String),
        "previousClose": expect.any(Number),
        "change": expect.any(Number),
        "changePercent": expect.any(Number)
})
);
},18000);


test("intraday() works with async await()", async () =>{
    const res  = await AlphaVantage.intraday("AAPL");
    expect(res).toEqual(expect.arrayContaining([
        expect.objectContaining({
        "dateTime": expect.any(String),      
        "open": expect.any(Number),
        "high": expect.any(Number),
        "low": expect.any(Number),
        "close": expect.any(Number),
        "volume": expect.any(Number),
        })
    ])

    )
},18000);

test("daily() works with async await()", async () =>{
    const res  = await AlphaVantage.daily("AAPL");
    expect(res).toEqual(expect.arrayContaining([
        expect.objectContaining({
        "dateTime": expect.any(String),
        "open": expect.any(Number),
        "high": expect.any(Number),
        "low": expect.any(Number),
        "close": expect.any(Number),
        "volume": expect.any(Number),
        })
    ])

    )
},18000);

test("dailyAdjusted() works with async await()", async () =>{
    const res  = await AlphaVantage.dailyAdjusted("AAPL");
        expect(res).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    "dateTime": expect.any(String),
                    "open": expect.any(Number),
                    "high": expect.any(Number),
                    "low": expect.any(Number),
                    "close": expect.any(Number),
                    "adjustedClose": expect.any(Number),
                    "volume": expect.any(Number),
                    "dividendAmount": expect.any(Number),
                    "splitCoefficient": expect.any(Number),
                })
            ])
    )
},18000);