/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-magic-numbers */
import React, { useState, useEffect } from "react";
import "./BasisTable.css";
import {Offcanvas, OffcanvasHeader, OffcanvasBody} from "react-bootstrap";
import axios from "axios"

type propType = { value: string; future: string; spot: string };
type dataPoint = {x : number, y : number}
type data = dataPoint[]

const BasisTableCell = (props: propType) => {
  const [showDetailed, setShowDetailed] = useState<boolean>(false);

  const handleClose = () => setShowDetailed(false);
  const handleOpen = () => setShowDetailed(true);

  return (
    <td className="table-cell" onClick={handleOpen}>
      <Offcanvas show={showDetailed} onHide={handleClose} placement="top" >
        <OffcanvasHeader closeVariant="white" closeLabel="true"></OffcanvasHeader>
        <OffcanvasBody></OffcanvasBody>
      </Offcanvas>
      {props.value}
    </td>
  );
};


const BasisHistoryGraph = (spot:string, future:string) => {
    const freqMap = ["SECOND","MINUTE","HOUR"]
    const periodMap = ["MONTH", "WEEK", "YEAR"]
    const [freq,setFreq] = useState<number>(2)
    const [period, setPeriod] = useState<number>(2)

    const url = `http://localhost:8000/api/basis/${spot}/${future}/${freqMap[freq]}/${periodMap[period]}`
    useEffect(()=>{
        axios.get(url).then((res) => {
            console.log(res)
        })
    },[])


}

export default BasisTableCell;
