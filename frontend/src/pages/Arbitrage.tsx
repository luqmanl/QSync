import React from "react";
import "./Arbitrage.css";
import SideBar from "../components/SideBar";
import BasisTable from "../components/BasisTable";
import ArbitrageLiveTable from "../components/ArbitrageLiveTable";

const Arbitrage = () => {
  return (
    <div className="page-box">
      <div className="arbitrage-title-box">
        <SideBar addr="arbitrage" />
        <h2 className="arbitrage-title">Arbitrage</h2>
      </div>
      <div className="arbitrage-container">
        <div className="arbitrage-column">
          <BasisTable />
        </div>
        <div className="arbitrage-column">
          <div className="analysis-summary">
            <h3 className="arbitrage-sub-title">Arbitrage Explained</h3>
            <p>
              Arbitrage is exploting the difference between prices of tradeable
              assets, such that executing a set of trades simultaneously can
              almost guarantee a profit. Typically, these profit percentages are
              very small and disappear over time as the difference in prices
              converge. This causes the markets to become more efficient. There
              are two main types of arbitrage, which are explained below:
              Cross-Exchange Arbitrage - This is a type of arbitrage can be
              exploted when the highest bid on some exchange is larger than the
              lowest ask on some other exchange. When this occurs, we can send
              limit orders to both exchanges and make a profit p (highest bid -
              lowest ask - exchange costs). Triangular Arbitrage - This type of
              arbitrage exploits the differences in price between tickers on an
              exchange, and is explotable when a sequence of trades from some
              currency back to the same currency leaves the trader with more of
              that currency after the trades than the start. For now, we will
              only display Cross-Exchange arbitrage opportunities in the table
              below. Note that these opportunities often disappear very quickly.
            </p>
          </div>
          <ArbitrageLiveTable />
        </div>
      </div>
    </div>
  );
};

export default Arbitrage;
