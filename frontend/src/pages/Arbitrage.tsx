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
          <div className="analysis-summary">
            <h3 className="arbitrage-sub-title">
              Spot-Future Arbitrage Explained
            </h3>
            <p>
              {
                "Spot-Future is an arbitrage on perpetual futures where we take a \
              futures position, as well as a hedging position in the associated spot \
              currency. This position essentially means that the trader is protected \
              against any price changes in the underlying spot or future, and can \
              focus on taking any profits from the funding rate.\n\n \
              Funding rates are calculated differently depending on each exchange, \
              however for all exchanges the funding rate is a function of the basis, \
              where the basis is the spot price - perpetual future price. Generally, \
              the basis tells us which direction the market believes the spot price \
              will go in the future.\n\n \
              Below we have a basis table for BTC-USD, which displays the basis for each exchange pair \
              that we support. Each cell in the basis table can also be clicked on to show the basis \
              history over time for that exchange pair.\n\n \
              Whilst this table is especially useful for the spot future arbitrage strategy \
              described above, it can also be used for a plethora of other trading strategies."
              }
            </p>
          </div>
          <BasisTable />
        </div>
        <div className="arbitrage-column">
          <div className="analysis-summary">
            <h3 className="arbitrage-sub-title">Arbitrage Explained</h3>
            <p>
              {
                "Arbitrage is exploting the difference between prices of tradeable \
              assets, such that executing a set of trades simultaneously can \
              almost guarantee a profit. Typically, these profit percentages are \
              very small and disappear over time as the difference in prices \
              converge. This causes the markets to become more efficient.\n\n There \
              are two main types of arbitrage, which are explained below:\n \
              Cross-Exchange Arbitrage - This is a type of arbitrage can be \
              exploted when the highest bid on some exchange is larger than the \
              lowest ask on some other exchange. When this occurs, we can send \
              limit orders to both exchanges and make a profit p (highest bid - \
              lowest ask - exchange costs).\n Triangular Arbitrage - This type of \
              arbitrage exploits the differences in price between tickers on an \
              exchange, and is explotable when a sequence of trades from some \
              currency back to the same currency leaves the trader with more of \
              that currency after the trades than the start.\n\n For now, we will \
              only display Cross-Exchange arbitrage opportunities in the table \
              below. Note that these opportunities often disappear very quickly."
              }
            </p>
          </div>
          <ArbitrageLiveTable />
        </div>
      </div>
    </div>
  );
};

export default Arbitrage;
