import React from "react";
import { Item } from "../App";
import { Table } from "react-bootstrap";

// time     tickersymbol     bid/ask     price      quantity

const OrderBookTableDivision = (props: { data: string | number }) => {
  return (
    <td
      style={{
        padding: "20px",
        border: "1px solid black",
      }}
    >
      {props.data}
    </td>
  );
};

type rowPropType = {
  data: Item;
  index: number;
};

const numDPs = 2;

const OrderBookTableRow = (props: rowPropType) => {
  return (
    <tr>
      <OrderBookTableDivision data={props.data.bookData.sym} />
      <OrderBookTableDivision data={props.data.bookData.asks[props.index]} />
      <OrderBookTableDivision
        data={props.data.bookData.askSizes[props.index]}
      />
      <OrderBookTableDivision
        data={(
          props.data.bookData.askSizes[props.index] *
          props.data.bookData.asks[props.index]
        ).toFixed(numDPs)}
      />
      <OrderBookTableDivision data={props.data.bookData.sym} />
      <OrderBookTableDivision data={props.data.bookData.bids[props.index]} />
      <OrderBookTableDivision
        data={props.data.bookData.bidSizes[props.index]}
      />
      <OrderBookTableDivision
        data={(
          props.data.bookData.bidSizes[props.index] *
          props.data.bookData.bids[props.index]
        ).toFixed(numDPs)}
      />
    </tr>
  );
};

const OrderBookTable = (data: { data: Item }) => {
  return (
    <div>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th colSpan={4} style={{ border: "1px solid black" }}>
              bids
            </th>
            <th colSpan={4} style={{ border: "1px solid black" }}>
              asks
            </th>
          </tr>
          <tr>
            <OrderBookTableDivision data="ticker" />
            <OrderBookTableDivision data="price ($)" />
            <OrderBookTableDivision data="quantity" />
            <OrderBookTableDivision data="order total ($)" />
            <OrderBookTableDivision data="ticker" />
            <OrderBookTableDivision data="price ($)" />
            <OrderBookTableDivision data="quantity" />
            <OrderBookTableDivision data="order total ($)" />
          </tr>
        </thead>
        <tbody>
          {data.data.bookData.asks.map((item, i) => {
            return <OrderBookTableRow key={i} data={data.data} index={i} />;
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderBookTable;
