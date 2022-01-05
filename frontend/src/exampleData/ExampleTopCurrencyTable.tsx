import { tableRep } from "../components/TopCurrencyTable";

const exampleData: tableRep = {
  " ": {
    name: "Bitcoin",
    price: 54292.42,
    change24h: 5.34,
    change7d: 13.49,
    marketCap: 938284280,
  },
  "": {
    name: "Etheruem",
    price: 4294.28,
    change24h: 2.49,
    change7d: 10.31,
    marketCap: 488238480,
  },
  "	": {
    name: "Cardano",
    price: 1.49,
    change24h: 4.93,
    change7d: 16.42,
    marketCap: 48293820,
  },
  "­": {
    name: "Solana",
    price: 194.58,
    change24h: -6.29,
    change7d: 9.3,
    marketCap: 60291049,
  },
  "͏": {
    name: "Dogecoin",
    price: 0.19,
    change24h: -1.92,
    change7d: 3.54,
    marketCap: 25389483,
  },
};

export default exampleData;
