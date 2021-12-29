import React, { useState } from "react";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasTitle,
  Image,
} from "react-bootstrap";
import "./SideBar.css";

interface propsType {
  addr: string;
}

const addList = ["overview", "detailed Analysis", "arbitrarge"];

const links = (addr: string, label: string) => {
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
      <h4>{label}</h4>
    </div>
  );
};

const SideBar = (props: propsType) => {
  const [show, setShow] = useState(false);
  const { addr } = props;
  return (
    <div>
      <button onClick={() => setShow(true)}></button>
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
        </div>
      </Offcanvas>
    </div>
  );
};

export default SideBar;
