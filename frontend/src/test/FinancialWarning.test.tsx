/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-magic-numbers */
import React from "react";
import { render, screen } from "@testing-library/react";
import FinancialWarning from "../components/FinancialWarning";
import { debug } from "console";

const text = `The Content is for informational purposes only, you should not
construe any such information or other material as legal, tax,
investment, financial, or other advice. Please seek advice for any
investments`;

test("Successfully displays financial warning if the user has visited the site for the first time", () => {
  const fw = render(<FinancialWarning first={true} />);
  const paragraph = screen.getByTestId("financial-warning");
  expect(paragraph).toBeDefined();
});
