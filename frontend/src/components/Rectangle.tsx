import React from "react";
import "./Rectangle.css";
import Dropdown from "react-bootstrap/Dropdown";
const Rectangle = () => {
  return (
    <div className="rectangle-container">
      <div className="dropdown-button">
        <Dropdown className="dropdown">
          <Dropdown.Toggle
            className="dropdown-toggle"
            style={{ background: "black", borderColor: "black" }}
            variant="primary"
          />
          <Dropdown.Menu>
            <Dropdown.Item href="#">Options</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default Rectangle;
