import { MemoryRouter } from "react-router-dom";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App/App";
import { Provider } from "react-redux";
import { store } from "../../App/store";
import Login from "./Login";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("App", () => {
  it("renders App component", async () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>,
      { wrapper: MemoryRouter }
    );
    const text = await screen.findByText("Please Log In");
  });
});
