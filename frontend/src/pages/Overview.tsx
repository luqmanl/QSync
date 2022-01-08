import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import TopCurrencyGraph from "../components/TopCurrencyGraph";
import TopCurrencyTable from "../components/TopCurrencyTable";
import NewsFeed from "../components/NewsFeed";
import KeyMetrics from "../components/KeyMetrics";
import FinancialWarning from "../components/FinancialWarning";
import "./Overview.css";
import { useCookies } from "react-cookie";

const Overview = () => {
  const [warning, setWarning] = useState(false);
  const [cookies, setCookies] = useCookies(["user"]);

  const addCookie = () => {
    setCookies("user", "yes");
  };

  useEffect(() => {
    if ("user" in cookies) {
      console.log("user is in cookies");
    } else {
      addCookie();
      setWarning(true);
    }
  }, []);

  return (
    <div className="page-box">
      <FinancialWarning first={warning} />
      <div className="title-box">
        <SideBar addr="overview" />
        <h1 className="page-title">Cryptocurrency Market Overview</h1>
      </div>
      <div className="content-box">
        <div className="left-box">
          <div className="graph">
            <TopCurrencyGraph />
          </div>
          <div className="table">
            <TopCurrencyTable />
          </div>
        </div>
        <div className="right-box">
          <div className="indicator-box">
            <KeyMetrics />
          </div>
          <div className="newsfeed-box">
            <NewsFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
