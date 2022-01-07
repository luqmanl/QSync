import { data } from "../pages/Analysis";

export const exampleData: data = {
  generalInfoDescription: `Bitcoin is a decentralized cryptocurrency originally described in a 2008 whitepaper by a person, or group of people, using the alias Satoshi Nakamoto. It was launched soon after, in January 2009.

    Bitcoin is a peer-to-peer online currency, meaning that all transactions happen directly between equal, independent network participants, without the need for any intermediary to permit or facilitate them. Bitcoin was created, according to Nakamoto’s own words, to allow “online payments to be sent directly from one party to another without going through a financial institution.”
    
    Some concepts for a similar type of a decentralized electronic currency precede BTC, but Bitcoin holds the distinction of being the first-ever cryptocurrency to come into actual use.`,
  currencyCharacteristics: [
    ["Proof of work", "EXPLAIN"],
    ["Decentralised", "EXPLAIN"],
    ["Finite Supply", "EXPLAIN"],
    ["Blockchain", "EXPLAIN"],
  ],
  currencyInformation: {
    currentSupply: 18283102,
    totalSupply: 22493481,
    transactionsPerSecond: 8,
    totalTransactions: 20392103,
    marketDominancePercentage: 0.79,
    activeAddresses: 1284203,
    transactions24h: 723403,
    transactionFee24h: 1.29,
  },
  priceInformation: {
    high24h: 55372.49,
    low24h: 53492.04,
    high1y: 61394.39,
    low1y: 32493.5,
    change24h: 5.34,
    change1y: 304.39,
    volume24h: 19030650914,
    marketCap: 948.81,
  },
  futureInformation: {
    perpetualPrice: 54392.29,
    fundingRate: 0.034,
    basis: 1293,
    openInterest: 17.293,
  },
};

export const initalData: data = {
  generalInfoDescription: "-",
  currencyCharacteristics: [],
  currencyInformation: {
    currentSupply: 0,
    totalSupply: 0,
    transactionsPerSecond: 8,
    totalTransactions: 0,
    marketDominancePercentage: 0,
    activeAddresses: 0,
    transactions24h: 0,
    transactionFee24h: 0,
  },
  priceInformation: {
    high24h: 0,
    low24h: 0,
    high1y: 0,
    low1y: 0,
    change24h: 0,
    change1y: 0,
    volume24h: 0,
    marketCap: 0,
  },
  futureInformation: {
    perpetualPrice: 0,
    fundingRate: 0,
    basis: 0,
    openInterest: 0,
  },
};
