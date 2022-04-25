import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import vehicleReducer from "../features/vehicleSlice";
import Segment from "../components/Segment";

const handlers = [
  rest.get("http://localhost:8000/api/segments/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, segment_name: "K-CAR" },
        { id: 2, segment_name: "EV" },
      ])
    );
  }),
  rest.post("http://localhost:8000/api/segments/", (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ id: 3, segment_name: "Large SUV" }));
  }),
  rest.put("http://localhost:8000/api/segments/1/", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 1, segment_name: "new K-CAR" }));
  }),
  rest.put("http://localhost:8000/api/segments/2/", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 2, segment_name: "new EV" }));
  }),
  rest.delete("http://localhost:8000/api/segments/1/", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.delete("http://localhost:8000/api/segments/2/", (req, res, ctx) => {
    return res(ctx.status(200));
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

describe("Segment Component Test Cases", () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        vehicle: vehicleReducer,
      },
    });
  });
  it("1 :Should render all the elements correctly", async () => {
    render(
      <Provider store={store}>
        <Segment />
      </Provider>
    );
    expect(screen.getByTestId("h3-segment")).toBeTruthy();
    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.getByTestId("btn-post")).toBeTruthy();
    expect(await screen.findByText("K-CAR")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")[0]).toBeTruthy();
    expect(screen.getAllByRole("listitem")[1]).toBeTruthy();
    expect(screen.getByTestId("delete-seg-1")).toBeTruthy();
    expect(screen.getByTestId("delete-seg-2")).toBeTruthy();
    expect(screen.getByTestId("edit-seg-1")).toBeTruthy();
    expect(screen.getByTestId("edit-seg-2")).toBeTruthy();
  });
  it("2 :Should render list of segments from REST API", async () => {
    render(
      <Provider store={store}>
        <Segment />
      </Provider>
    );
    expect(screen.queryByText("K-CAR")).toBeNull();
    expect(screen.queryByText("EV")).toBeNull();
    expect(await screen.findByText("K-CAR")).toBeInTheDocument();
    expect(screen.getByTestId("list-2").textContent).toBe("EV");
  });
  it("3 :Should not render list of segments from REST API when rejected", async () => {
    server.use(
      rest.get("http://localhost:8000/api/segments/", (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    render(
      <Provider store={store}>
        <Segment />
      </Provider>
    );
    expect(screen.queryByText("K-CAR")).toBeNull();
    expect(screen.queryByText("EV")).toBeNull();
    expect(await screen.findByText("Get error!")).toBeInTheDocument();
    expect(screen.queryByText("K-CAR")).toBeNull();
    expect(screen.queryByText("EV")).toBeNull();
  });
  it("4 :Should add new segment and also to the list", async () => {
    render(
      <Provider store={store}>
        <Segment />
      </Provider>
    );
    expect(screen.queryByText("Large SUV")).toBeNull();
    const inputValue = screen.getByPlaceholderText("new segment name");
    await userEvent.type(inputValue, "Large SUV");
    await userEvent.click(screen.getByTestId("btn-post"));
    expect(await screen.findByText("Large SUV")).toBeInTheDocument();
  });
  it("5 :Should delete segement(id 1) and also from list", async () => {
    render(
      <Provider store={store}>
        <Segment />
      </Provider>
    );
    expect(screen.queryByText("K-CAR")).toBeNull();
    expect(screen.queryByText("EV")).toBeNull();
    expect(await screen.findByText("K-CAR")).toBeInTheDocument();
    expect(screen.getByTestId("list-2").textContent).toBe("EV");
    await userEvent.click(screen.getByTestId("delete-seg-1"));
    expect(await screen.findByText("Deleted in segment!")).toBeInTheDocument();
    expect(screen.queryByText("K-CAR")).toBeNull();
  });
  it("6 :Should delete segement(id 2) and also from list", async () => {
    render(
      <Provider store={store}>
        <Segment />
      </Provider>
    );
    expect(screen.queryByText("K-CAR")).toBeNull();
    expect(screen.queryByText("EV")).toBeNull();
    expect(await screen.findByText("K-CAR")).toBeInTheDocument();
    expect(screen.getByTestId("list-2").textContent).toBe("EV");
    await userEvent.click(screen.getByTestId("delete-seg-2"));
    expect(await screen.findByText("Deleted in segment!")).toBeInTheDocument();
    expect(screen.queryByText("EV")).toBeNull();
  });
  it("7 :Should update segement(id 1) and also in the list", async () => {
    render(
      <Provider store={store}>
        <Segment />
      </Provider>
    );
    expect(screen.queryByText("K-CAR")).toBeNull();
    expect(screen.queryByText("EV")).toBeNull();
    expect(await screen.findByText("K-CAR")).toBeInTheDocument();
    expect(screen.getByTestId("list-2").textContent).toBe("EV");
    await userEvent.click(screen.getByTestId("edit-seg-1"));
    const inputValue = screen.getByPlaceholderText("new segment name");
    await userEvent.type(inputValue, "new K-CAR");
    await userEvent.click(screen.getByTestId("btn-post"));
    expect(await screen.findByText("Updated in segment!")).toBeInTheDocument();
    expect(screen.getByTestId("list-1").textContent).toBe("new K-CAR");
  });
  it("8 :Should update segement(id 2) and also in the list", async () => {
    render(
      <Provider store={store}>
        <Segment />
      </Provider>
    );
    expect(screen.queryByText("K-CAR")).toBeNull();
    expect(screen.queryByText("EV")).toBeNull();
    expect(await screen.findByText("K-CAR")).toBeInTheDocument();
    expect(screen.getByTestId("list-2").textContent).toBe("EV");
    await userEvent.click(screen.getByTestId("edit-seg-2"));
    const inputValue = screen.getByPlaceholderText("new segment name");
    await userEvent.type(inputValue, "new EV");
    await userEvent.click(screen.getByTestId("btn-post"));
    expect(await screen.findByText("Updated in segment!")).toBeInTheDocument();
    expect(screen.getByTestId("list-2").textContent).toBe("new EV");
  });
});
