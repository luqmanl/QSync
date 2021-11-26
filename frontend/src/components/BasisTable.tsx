/* eslint-disable no-mixed-operators */
/* eslint-disable no-magic-numbers */
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import "./BasisTable.css";

type basisTableData = {
  basisAdditions: basisAddition[];
};

type basisAddition = {
  spotExchange: string;
  futureExchange: string;
  basisValue: number;
};

type spotMap = {
  [spotKey: string]: any;
};

type futureMap = {
  [futureKey: string]: spotMap;
};

const supportedSpot = ["Binance", "Bitfenix", "Coinbase"];
const supportedFutures = ["Deribit", "HuobiDM", "OKEx"];

const BasisTable = () => {
  const initialTable: any = {};

  // Initialise basis table map with data
  supportedFutures.map((x) => {
    const allSpots: any = {};

    supportedSpot.forEach((y) => {
      allSpots[y] = "-";
    });

    initialTable[x] = allSpots;
  });

  const [basisTableData, setBasisTableData] = useState<futureMap>(initialTable);

  // TODO change this
  const wsAddr = `ws://${location.hostname}/ws/data/<spot>-<future>/BTC-USDT/basis`;

  useEffect(() => {
    const socket = new WebSocket(wsAddr);

    socket.addEventListener("message", (ev) => {
      const res: basisTableData = JSON.parse(ev.data);

      res.basisAdditions.forEach((x: basisAddition) => {
        const toSet: futureMap = basisTableData;

        toSet[x.futureExchange][x.spotExchange] = x.basisValue;

        setBasisTableData(toSet);
      });
    });
  }, []);

  const rowGenerator = (map: spotMap, index: number) => {
    return (
      <tr key={index}>
        <td className="table-cell">{supportedSpot[index]}</td>
        {supportedSpot.map((x, i) => (
          <td key={i} className="table-cell">
            {map[x]}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div className="basis-component">
      <h2 className="table-title">Basis Table</h2>
      <p className="table-title">Futures</p>
      <div className="table-horizontal-elems">
        <p className="table-title">Spot</p>
        <Table className="basis-table">
          <thead>
            <tr>
              <th className="table-cell"></th>
              {supportedSpot.map((x, i) => (
                <th key={i} className="table-cell">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {supportedFutures.map((item, i) =>
              rowGenerator(basisTableData[item], i)
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default BasisTable;
