/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-magic-numbers */
import React, { useState, useEffect } from "react";
import { exampleBasisTable } from "../exampleData/ExampleBasisTable";
import BasisTableCell from "./BasisTableCell";
import { Table } from "react-bootstrap";
import "./BasisTable.css";

type basisTableData = {
  basisAdditions: basisAddition[];
};

type basisAddition = {
  spotExchange: string;
  futureExchange: string;
  sym: string;
  basisValue: number;
};

export type spotMap = {
  [spotKey: string]: string;
};

export type futureMap = {
  [futureKey: string]: spotMap;
};

const supportedSpot = ["BINANCE", "BITFINEX", "COINBASE"];
const supportedFutures = ["DERIBIT", "KRAKEN_FUTURES", "OKEX"];

const rowGenerator = (map: spotMap, index: number) => {
  return (
    <tr key={index}>
      <td className="table-cell">{supportedFutures[index]}</td>
      {supportedSpot.map((x, i) => {
        return (
          <BasisTableCell
            key={i}
            value={map[x]}
            future={supportedFutures[index]}
            spot={x}
          />
        );
      })}
    </tr>
  );
};

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

  const [basisTable, setBasisTable] = useState<futureMap>(exampleBasisTable);

  const wsAddr = `ws://${window.location.hostname}:8000/ws/data/basis/`;

  useEffect(() => {
    const socket = new WebSocket(wsAddr);

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          futures_exchanges: ["DERIBIT", "OKEX", "KRAKEN_FUTURES"],
          spot_exchanges: ["BINANCE", "BITFINEX", "COINBASE"],
          futures_pairs: ["BTC-USD-PERP"],
          spot_pairs: ["BTC-USDT"],
        })
      );
    };

    socket.addEventListener("message", (ev) => {
      const res: basisTableData = JSON.parse(ev.data);

      const update = { ...basisTable };

      res.basisAdditions?.forEach((mapping: basisAddition) => {
        update[mapping.futureExchange][mapping.spotExchange] =
          mapping.basisValue.toFixed(3);
      });

      setBasisTable(update);
    });
  }, []);

  return (
    <div className="basis-component">
      <h3
        className="table-title"
        style={{
          width: "100%",
          fontSize: "xx-large",
          borderBottom: "1px solid rgba(0, 0, 0, 0.4)",
        }}
      >
        BTC Basis Table
      </h3>
      <h4 className="table-title" style={{ fontSize: "large" }}>
        Spot
      </h4>
      <div className="table-horizontal-elems">
        <h4 className="table-title" style={{ fontSize: "large" }}>
          Futures
        </h4>
        <Table className="basis-table">
          <thead>
            <tr>
              <th className="table-cell"></th>
              {supportedSpot.map((x, i) => (
                <td key={i} className="table-cell">
                  {x}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {supportedFutures.map((item, i) =>
              rowGenerator(basisTable[item], i)
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default BasisTable;
