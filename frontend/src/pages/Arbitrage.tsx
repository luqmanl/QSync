import React from "react";
import "./Arbitrage.css";
import SideBar from "../components/SideBar";

const Arbitrage = () => {
  return (
    <div className="page-box">
      <div className="arbitrage-title-box">
        <SideBar addr="arbitrage" />
        <h2 className="arbitrage-title">Arbitrage</h2>
      </div>
      <div className="arbitrage-container">
        <div className="arbitrage-column"></div>
        <div className="arbitrage-column"></div>
      </div>
    </div>
  );
};

export default Arbitrage;
