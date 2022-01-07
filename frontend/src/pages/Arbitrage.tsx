import React from "react";
import "./Arbitrage.css";
import SideBar from "../components/SideBar";
import BasisTable from "../components/BasisTable";

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
              Exercitation sunt officia sunt dolor magna non Lorem eiusmod ea
              tempor. Irure incididunt sit id exercitation aliqua sunt nostrud
              ex. Nulla Lorem enim nisi mollit. Occaecat Lorem consectetur velit
              ut duis sunt. Nisi nostrud adipisicing adipisicing occaecat
              commodo magna ipsum aliqua deserunt. Magna ipsum nisi exercitation
              enim aliqua reprehenderit cupidatat dolor cupidatat nostrud nulla.
              Velit mollit ad sunt proident dolore nostrud nostrud. Cupidatat
              nostrud non qui sint ad. Eiusmod eu consequat aliquip ex. Velit
              ipsum adipisicing magna non culpa duis commodo ad amet officia
              proident esse commodo. Lorem non et exercitation sint occaecat
              reprehenderit qui minim ut tempor aliquip deserunt aute. Laborum
              aliqua qui reprehenderit laborum enim mollit non eiusmod ea. Irure
              in laboris tempor eiusmod est magna et Lorem nostrud excepteur
              sunt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Arbitrage;
