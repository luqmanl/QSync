import { tableRep } from "../components/ArbitrageLiveTable";

export const exampleData: tableRep = {
  "BTC-USDT": {
    currency: "BTC-USDT",
    maxArbitrage: 0.0064,
    bidExchange: "dyDx",
    askExchange: "Bitmex",
    lowestAsk: 56234,
    highestBid: 56235,
    price: 132,
  },
};

// maxArbitrage : number, // percentage
//     highestBid : number,
//     bidExchange : string,
//     askExchange : string,
//     lowestAsk : number,
//     price : number
