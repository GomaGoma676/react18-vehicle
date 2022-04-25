import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import vehicleReducer from "../features/vehicleSlice";
import MainPage from "../components/MainPage";

const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
const handlers = [
  rest.get("http://localhost:8000/api/profile/", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 1, username: "test user" }));
  }),
  rest.get("http://localhost:8000/api/segments/", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
  rest.get("http://localhost:8000/api/brands/", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
  rest.get("http://localhost:8000/api/vehicles/", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
];
const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  server.close();
});

describe("MainPage Component Test Cases", () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        vehicle: vehicleReducer,
      },
    });
  });
  it("1 :Should render all the elements correctly", async () => {
    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );
    expect(screen.getByTestId("span-title")).toBeTruthy();
    expect(screen.getByTestId("btn-logout")).toBeTruthy();
  });
  it("2 :Should route to Auth page when logout button pressed", async () => {
    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );
    await userEvent.click(screen.getByTestId("btn-logout"));
    expect(mockHistoryPush).toBeCalledWith("/");
    expect(mockHistoryPush).toHaveBeenCalledTimes(1);
  });
  it("3 :Should render logged in user name", async () => {
    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );
    expect(screen.queryByText("test user")).toBeNull();
    expect(await screen.findByText("test user")).toBeInTheDocument();
  });
});
