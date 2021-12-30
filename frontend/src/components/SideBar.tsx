import React, { useState } from "react";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasTitle,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./SideBar.css";

interface propsType {
  addr: string;
}

const addList = ["overview", "detailed Analysis", "arbitrarge"];

const links = (addr: string, label: string) => {
  const endPoint = label === addList[1] ? "analysis" : label;
  const linkAddr =
    `${process.env.PUBLIC_URL}/${endPoint}` || `localhost:3000/${endPoint}`;
  const disable = addr === label;
  if (disable) {
    return (
      <div className="disabled-link">
        <h4>{label}</h4>
      </div>
    );
  }
  return (
    <div className="link">
      <Link to={linkAddr} style={{ textDecoration: "none", color: "black" }}>
        <h4>{label}</h4>
      </Link>
    </div>
  );
};

const SideBar = (props: propsType) => {
  const [show, setShow] = useState(false);
  const { addr } = props;
  return (
    <div>
      {show ? null : <button onClick={() => setShow(true)}>Find 3 line button</button>}
      <Offcanvas show={show} onHide={() => setShow(false)}>
        <OffcanvasHeader closeButton={true}>
          <div className="logo-container">
            <Image fluid src="/qsync_logo.png" alt="" />
          </div>
          <OffcanvasTitle></OffcanvasTitle>
        </OffcanvasHeader>
        <div className="canvas-body">
          <div className="link-container">
            {addList.map((a) => links(addr, a))}
          </div>
          <div className="info-box">
            <h5 className="info-text">Current Exchange : Binance</h5>
            <h5 className="info-text">Latency : 150ms</h5>
          </div>
        </div>
      </Offcanvas>
    </div>
  );
};

export default SideBar;
