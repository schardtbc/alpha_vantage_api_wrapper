import * as avc from "./avc";

export class AlphaVantage {
  public static intraday = avc.avIntraday;

  public static historical = avc.avHistory;

  public static historicalAdj = avc.avHistoryAdj;

  public static quote = avc.avQuote;

  public static macd = avc.avMACD

  public static forexDaily = avc.avForexDaily

  public static forexExchangeRate = avc.avForexExchangeRate
}
