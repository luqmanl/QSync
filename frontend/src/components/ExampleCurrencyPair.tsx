import { CurrencyPairType } from "./CurrencyPair";

const defaultData: CurrencyPairType[] = [
  {
    pairName: "BTC/ETH",
    highestBid: "6.71",
    lowestAsk: "6.7",
    volumeLhr: "1.029",
    orderImbalance: "0.59",
  },
  {
    pairName: "BTC/DOGE",
    highestBid: "93.0",
    lowestAsk: "93.02",
    volumeLhr: "0.053",
    orderImbalance: "0.25",
  },
  {
      pairName:"BTC/ADA",
      highestBid:"74.2",
      lowestAsk:"74.5",
      volumeLhr:"0.43",
      orderImbalance:"0.45"
  },
  {
      pairName:"BTC/SHIB",
      highestBid:"93.0",
      lowestAsk:"74.5",
      volumeLhr:"0.93",
      orderImbalance:"0.55"
  },
  {
      pairName:"BTC/XRP",
      highestBid:"63.2",
      lowestAsk:"63.2",
      volumeLhr:"13.2",
      orderImbalance:"0.89"
  }
];

export default defaultData;