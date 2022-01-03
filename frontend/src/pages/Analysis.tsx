import React from "react";
import SideBar from "../components/SideBar";
import CurrencyGraph from "../components/CurrencyGraph";
import TopCurrencyTable from "../components/TopCurrencyTable";
import NewsFeed from "../components/NewsFeed";
import OrderBookTable from "../components/OrderBookTable";
import "./Analysis.css";

const Analysis = () => {
  const url = window.location.href.split('/');
  const pair = (url[url.length-1]).toUpperCase();
  return (
    <div className="page-box">
      <div className="title-box">
        <SideBar addr="detailed analyses" />
        <h2 className="page-title">{pair}</h2>
      </div>
      <div className="content-box">
        <div className="left-box">
          <div className="graph">
            <CurrencyGraph />
          </div>
        </div>
        <div className="right-box">
          <div className="orderbook">
            <OrderBookTable />
          </div>
        </div>
      </div>
      
      <div className="middle-box">
      </div>
      <div className="stats-box-3">
        <div className="left-box-3">
        </div>

        <div className="middle-box-3">
        </div>
  
        <div className="right-box-3">
        </div>
  
      </div>
    </div>
  );
};

export default Analysis;
