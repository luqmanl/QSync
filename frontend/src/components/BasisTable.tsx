/* eslint-disable camelcase */
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
  sym: string;
  basisValue: number;
};

type spotMap = {
  [spotKey: string]: any;
};

type futureMap = {
  [futureKey: string]: spotMap;
};

const supportedSpot = ["BINANCE", "BITFINEX", "COINBASE"];
const supportedFutures = ["DERIBIT", "HUOBIDM", "OKEX"];

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

  const [basisTable, setBasisTable] = useState<futureMap>(initialTable);

  // TODO change this
  const wsAddr = `ws://localhost:8000/ws/data/basis/`;

  useEffect(() => {
    const socket = new WebSocket(wsAddr);

    socket.onopen = () =>
        socket.send(
        JSON.stringify({
          futures_exchanges: ["BINANCE", "BITFINEX"],
          spot_exchanges: ["DERIBIT", "OKEX"],
          futures_pairs: ["BTC-USD-21Z31"],
          spot_pairs: ["BTC-USDT"],
        })
      );

    socket.addEventListener("message", (ev) => {
      const res: basisTableData = JSON.parse(ev.data);
      console.log(res);

      const update = { ...basisTable };

      res.basisAdditions?.forEach((mapping: basisAddition) => {
        update[mapping.futureExchange][mapping.spotExchange] =
          mapping.basisValue.toFixed(3);
      });

      setBasisTable(update);

      supportedFutures.forEach((x) => {
        supportedSpot.forEach((y) => {
          console.log(`future: ${x}, spot: ${y}, basis: ${basisTable[x][y]}`);
        });
      });
    });
  }, []);

  const rowGenerator = (map: spotMap, index: number) => {
    return (
      <tr key={index}>
        <td className="table-cell">{supportedFutures[index]}</td>
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
      <p className="table-title">Spot</p>
      <div className="table-horizontal-elems">
        <p className="table-title">Futures</p>
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
