import React from "react";
import { render } from "@testing-library/react";
import App from "./app";
import { ApiService } from "../api";

test("renders Tickets header", () => {
  const apiService = new ApiService();
  const { getByText } = render(<App apiService={apiService} />);
  const header = getByText(/Tickets/i);
  expect(header).toBeInTheDocument();
});

