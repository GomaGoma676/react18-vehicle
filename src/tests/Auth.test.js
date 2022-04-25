import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import Auth from "../components/Auth";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const handlers = [
  rest.post("http://localhost:8000/api/auth/", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ token: "abc123" }));
  }),
  rest.post("http://localhost:8000/api/create/", (req, res, ctx) => {
    return res(ctx.status(201));
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

describe("Auth Component Test Cases", () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });
  it("1 :Should render all the elements correctly", async () => {
    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );
    // screen.debug();
    expect(screen.getByTestId("label-username")).toBeTruthy();
    expect(screen.getByTestId("label-password")).toBeTruthy();
    expect(screen.getByTestId("input-username")).toBeTruthy();
    expect(screen.getByTestId("input-password")).toBeTruthy();
    expect(screen.getByRole("button")).toBeTruthy();
    expect(screen.getByTestId("toggle-icon")).toBeTruthy();
  });
  it("2 :Should change button name by icon click", async () => {
    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );
    expect(screen.getByRole("button")).toHaveTextContent("Login");
    await userEvent.click(screen.getByTestId("toggle-icon"));
    expect(screen.getByRole("button")).toHaveTextContent("Register");
  });
  it("3 :Should route to MainPage when login is successful", async () => {
    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );
    await userEvent.click(screen.getByText("Login"));
    expect(
      await screen.findByText("Successfully logged in!")
    ).toBeInTheDocument();
    expect(mockHistoryPush).toBeCalledWith("/vehicle");
    expect(mockHistoryPush).toHaveBeenCalledTimes(1);
  });
  it("4 :Should not route to MainPage when login is failed", async () => {
    server.use(
      rest.post("http://localhost:8000/api/auth/", (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );
    await userEvent.click(screen.getByText("Login"));
    expect(await screen.findByText("Login error!")).toBeInTheDocument();
    expect(mockHistoryPush).toHaveBeenCalledTimes(0);
  });
  it("5 :Should output success msg when registration succeeded", async () => {
    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );
    await userEvent.click(screen.getByTestId("toggle-icon"));
    expect(screen.getByRole("button")).toHaveTextContent("Register");
    await userEvent.click(screen.getByText("Register"));
    expect(
      await screen.findByText("Successfully logged in!")
    ).toBeInTheDocument();
    expect(mockHistoryPush).toBeCalledWith("/vehicle");
    expect(mockHistoryPush).toHaveBeenCalledTimes(1);
  });
  it("6 :Should output error msg when registration failed", async () => {
    server.use(
      rest.post("http://localhost:8000/api/create/", (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );
    await userEvent.click(screen.getByTestId("toggle-icon"));
    expect(screen.getByRole("button")).toHaveTextContent("Register");
    await userEvent.click(screen.getByText("Register"));
    expect(await screen.findByText("Registration error!")).toBeInTheDocument();
    expect(mockHistoryPush).toHaveBeenCalledTimes(0);
  });
  it("7 :Should output login error msg when regisration success but login failed", async () => {
    server.use(
      rest.post("http://localhost:8000/api/auth/", (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );
    await userEvent.click(screen.getByTestId("toggle-icon"));
    expect(screen.getByRole("button")).toHaveTextContent("Register");
    await userEvent.click(screen.getByText("Register"));
    expect(await screen.findByText("Login error!")).toBeInTheDocument();
    expect(mockHistoryPush).toHaveBeenCalledTimes(0);
  });
});
