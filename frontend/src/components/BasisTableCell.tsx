/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-magic-numbers */
import React, { useState, useEffect } from "react";
import "./BasisTable.css";
import "./BasisTableCell.css";
import { Modal, Spinner } from "react-bootstrap";
import StandardLineChart from "./StandardLineChart";
import axios from "axios";
import { ExampleBasisHistory } from "./ExampleBasisHistory";
import Module from "module";

type propType = { value: string; future: string; spot: string };
type dataPoint = { x: number; y: number };
type data = dataPoint[];

const basisHistoryGraph = (spot: string, future: string) => {
  const freqMap = ["SECOND", "MINUTE", "HOUR"];
  const periodMap = ["MONTH", "WEEK", "YEAR"];
  const [freq, setFreq] = useState<number>(2);
  const [period, setPeriod] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<data>(ExampleBasisHistory);

  const url = `http://localhost:8000/api/basis/${spot}/${future}/${freqMap[freq]}/${periodMap[period]}`;
  useEffect(() => {
    // axios.get(url).then((res) => {
    //   console.log(res);
    //   const resp = JSON.parse(res.data);
    //   setData(resp);
    //   setLoading(false);
    // });
  }, []);

  return (
    <div>
      {/* {loading ? (
        <div className="spinner-container">
          <Spinner animation="border" variant="light" />
        </div>
      ) : (
        <StandardLineChart
          data={data}
          id="Basis History"
          graphTitle="Basis History"
          xAxis=""
          yAxis=""
        />
      )} */}
      <StandardLineChart
        data={data}
        id="Basis History"
        graphTitle="Basis History"
        xAxis=""
        yAxis=""
      />
    </div>
  );
};

const BasisTableCell = (props: propType) => {
  const [showDetailed, setShowDetailed] = useState<boolean>(false);

  const handleClose = () => setShowDetailed(false);
  const handleOpen = () => setShowDetailed(true);

  return (
    <td onClick={handleOpen}>
      <Modal show={showDetailed} onHide={handleClose} fullscreen>
        <Modal.Body>{basisHistoryGraph(props.spot, props.future)}</Modal.Body>
      </Modal>
      {props.value}
    </td>
  );
};

export default BasisTableCell;
