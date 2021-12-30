import React from "react";
import SideBar from "../components/SideBar";
import "./Overview.css";

const Overview = () => {
  return (
    <div className="page-box">
      <div className="title-box">
        <SideBar addr="overview" />
        <h2 className="page-title">Market Overview</h2>
      </div>
      <div className="content-box">
        <div className="graph-box">
          <div className="graph"></div>
          <div className="table"></div>
        </div>
        <div className="side-box"></div>
      </div>
    </div>
  );
};

export default Overview;
