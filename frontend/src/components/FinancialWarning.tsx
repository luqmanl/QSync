import React, { useState } from "react";
import { Modal } from "react-bootstrap";

interface propType {
  first: boolean;
}

const FinancialWarning = (props: propType) => {
  const [show, setShow] = useState(true);
  const { first } = props;
  const handleClose = () => {
    setShow(false);
  };

  return (
    <div>
      <Modal
        show={first && show}
        onHide={() => {
          handleClose();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Financial Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p data-testid="financial-warning">
            The Content is for informational purposes only, you should not
            construe any such information or other material as legal, tax,
            investment, financial, or other advice. Please seek advice for any
            investments
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FinancialWarning;
