import React from "react";
import { Navbar } from "react-bootstrap";
import "./NvBar.css";

const NvBar = () => {
  return (
    <div className="navbar">
      <Navbar sticky="top">
        <Navbar.Brand>
          {" "}
          <b> Welcome to QSYNC! </b>{" "}
        </Navbar.Brand>
      </Navbar>
    </div>
  );
};

export default NvBar;
