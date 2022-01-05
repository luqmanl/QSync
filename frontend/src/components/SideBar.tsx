import React, { useState } from "react";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasTitle,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./SideBar.css";

interface propsType {
  addr: string;
}

const addList = ["overview", "detailed Analysis", "arbitrage"];

const links = (addr: string, label: string) => {
  const endPoint = label === addList[1] ? "analysis" : label;
  const disable = addr === label;
  if (disable) {
    return (
      <div key={label} className="disabled-link">
        <h4>{label}</h4>
      </div>
    );
  }
  return (
    <div key={label} className="link">
      <Link
        to={`/${endPoint}`}
        style={{ textDecoration: "none", color: "black" }}
      >
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
      <div className="button-container" onClick={() => setShow(true)}>
        <FontAwesomeIcon icon={faBars} size="2x" />
      </div>
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
