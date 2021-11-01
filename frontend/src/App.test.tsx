import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(
    <div>
      <h1>HELLO</h1>
    </div>
  );
  const linkElement = screen.getByText(/HELLO/i);
  expect(linkElement).toBeTruthy();
});
