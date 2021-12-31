import React from "react";
import SideBar from "../components/SideBar";
import TopCurrencyGraph from "../components/TopCurrencyGraph";
import "./Overview.css";

const Overview = () => {
  return (
    <div className="page-box">
      <div className="title-box">
        <SideBar addr="overview" />
        <h2 className="page-title">Market Overview</h2>
      </div>
      <div className="content-box">
        <div className="left-box">
          <div className="graph">
            <TopCurrencyGraph />
          </div>
          <div className="table"></div>
        </div>
        <div className="right-box">
          <div className="news-box"></div>
          <div className="indicator-box"></div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
