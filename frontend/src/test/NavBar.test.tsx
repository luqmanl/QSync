/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-magic-numbers */
import React from "react";
import { render, screen } from "@testing-library/react";
import NavBar from "../components/NavBar";
import { mockComponent } from "react-dom/test-utils";

test("NavBar is correctly rendered on screen", () => {
  const nav = render(<NavBar />);
  expect(nav).toBeTruthy();
});

test("NavBar contains QSync logo", () => {
  render(<NavBar />);
  const logo = screen.getByRole("img");
  expect(logo).toHaveProperty("src", "http://localhost/qsync_logo.png");
});
