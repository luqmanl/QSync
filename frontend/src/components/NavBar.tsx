import React from "react";
import { Navbar } from "react-bootstrap";
import "./NavBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'


const NavBar = () => {
  return (
    <div className="navbar">
      <Navbar sticky="top">
        <Navbar.Brand>
          <img src="qsync_logo.png" width="180" height="150"></img>
        </Navbar.Brand>
      </Navbar>
      <FontAwesomeIcon className="bars" icon={faBars}/>
    </div>
  );
};

export default NavBar;
