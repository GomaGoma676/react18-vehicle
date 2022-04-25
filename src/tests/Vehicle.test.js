import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import vehicleReducer from "../features/vehicleSlice";
import Vehicle from "../components/Vehicle";
import Brand from "../components/Brand";
import Segment from "../components/Segment";

const handlers = [
  rest.get("http://localhost:8000/api/segments/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, segment_name: "SUV" },
        { id: 2, segment_name: "EV" },
      ])
    );
  }),
  rest.get("http://localhost:8000/api/brands/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, brand_name: "Audi" },
        { id: 2, brand_name: "Tesla" },
      ])
    );
  }),
  rest.delete("http://localhost:8000/api/segments/1/", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.delete("http://localhost:8000/api/segments/2/", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.delete("http://localhost:8000/api/brands/1/", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.delete("http://localhost:8000/api/brands/2/", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("http://localhost:8000/api/vehicles/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          vehicle_name: "SQ7",
          release_year: 2019,
          price: 300.12,
          segment: 1,
          brand: 1,
          segment_name: "SUV",
          brand_name: "Audi",
        },
        {
          id: 2,
          vehicle_name: "MODEL S",
          release_year: 2020,
          price: 400.12,
          segment: 2,
          brand: 2,
          segment_name: "EV",
          brand_name: "Tesla",
        },
      ])
    );
  }),
  rest.post("http://localhost:8000/api/vehicles/", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        vehicle_name: "MODEL X",
        release_year: 2019,
        price: 350.12,
        segment: 2,
        brand: 2,
        segment_name: "EV",
        brand_name: "Tesla",
      })
    );
  }),
  rest.put("http://localhost:8000/api/vehicles/1/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        vehicle_name: "new SQ7",
        release_year: 2019,
        price: 300.12,
        segment: 1,
        brand: 1,
        segment_name: "SUV",
        brand_name: "Audi",
      })
    );
  }),
  rest.put("http://localhost:8000/api/vehicles/2/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 2,
        vehicle_name: "new MODEL S",
        release_year: 2020,
        price: 400.12,
        segment: 2,
        brand: 2,
        segment_name: "EV",
        brand_name: "Tesla",
      })
    );
  }),
  rest.delete("http://localhost:8000/api/vehicles/1/", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.delete("http://localhost:8000/api/vehicles/2/", (req, res, ctx) => {
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

describe("Vehicle Component Test Cases", () => {
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
        <Vehicle />
      </Provider>
    );
    expect(screen.getByTestId("h3-vehicle")).toBeTruthy();
    expect(screen.getByPlaceholderText("new vehicle name")).toBeTruthy();
    expect(screen.getByPlaceholderText("year of release")).toBeTruthy();
    expect(screen.getByPlaceholderText("price")).toBeTruthy();
    expect(screen.getByTestId("select-segment")).toBeTruthy();
    expect(screen.getByTestId("select-brand")).toBeTruthy();
    expect(screen.getByTestId("btn-vehicle-post")).toBeTruthy();
    expect(await screen.findByText("SQ7")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")[0]).toBeTruthy();
    expect(screen.getAllByRole("listitem")[1]).toBeTruthy();
    expect(screen.getByTestId("delete-veh-1")).toBeTruthy();
    expect(screen.getByTestId("delete-veh-2")).toBeTruthy();
    expect(screen.getByTestId("edit-veh-1")).toBeTruthy();
    expect(screen.getByTestId("edit-veh-2")).toBeTruthy();
  });
  it("2 :Should render list of vehicles from REST API", async () => {
    render(
      <Provider store={store}>
        <Vehicle />
      </Provider>
    );
    expect(screen.queryByText("SQ7")).toBeNull();
    expect(screen.queryByText("MODEL S")).toBeNull();
    expect(await screen.findByText("SQ7")).toBeInTheDocument();
    expect(screen.getByTestId("name-2").textContent).toBe("MODEL S");
  });
  it("3 :Should not render list of vehicles from REST API when rejected", async () => {
    server.use(
      rest.get("http://localhost:8000/api/vehicles/", (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    render(
      <Provider store={store}>
        <Vehicle />
      </Provider>
    );
    expect(screen.queryByText("SQ7")).toBeNull();
    expect(screen.queryByText("MODEL S")).toBeNull();
    expect(await screen.findByText("Get error!")).toBeInTheDocument();
    expect(screen.queryByText("SQ7")).toBeNull();
    expect(screen.queryByText("MODEL S")).toBeNull();
  });
  it("4 :Should add new vehicle and also to the list", async () => {
    render(
      <Provider store={store}>
        <Brand />
        <Segment />
        <Vehicle />
      </Provider>
    );
    expect(screen.queryByText("MODEL X")).toBeNull();
    expect(await screen.findByText("SQ7")).toBeInTheDocument();
    const inputValue = screen.getByPlaceholderText("new vehicle name");
    await userEvent.type(inputValue, "MODEL X");
    await  userEvent.selectOptions(screen.getByTestId("select-segment"), "2");
    await userEvent.selectOptions(screen.getByTestId("select-brand"), "2");
    await userEvent.click(screen.getByTestId("btn-vehicle-post"));
    expect(await screen.findByText("MODEL X")).toBeInTheDocument();
  });
  it("5 :Should delete segement(id 1) and also from list", async () => {
    render(
      <Provider store={store}>
        <Vehicle />
      </Provider>
    );
    expect(screen.queryByText("SQ7")).toBeNull();
    expect(screen.queryByText("MODEL S")).toBeNull();
    expect(await screen.findByText("SQ7")).toBeInTheDocument();
    expect(screen.getByTestId("name-2").textContent).toBe("MODEL S");
    await userEvent.click(screen.getByTestId("delete-veh-1"));
    expect(await screen.findByText("Deleted in vehicle!")).toBeInTheDocument();
    expect(screen.queryByText("SQ7")).toBeNull();
  });
  it("6 :Should delete segement(id 2) and also from list", async () => {
    render(
      <Provider store={store}>
        <Vehicle />
      </Provider>
    );
    expect(screen.queryByText("SQ7")).toBeNull();
    expect(screen.queryByText("MODEL S")).toBeNull();
    expect(await screen.findByText("SQ7")).toBeInTheDocument();
    expect(screen.getByTestId("name-2").textContent).toBe("MODEL S");
    await userEvent.click(screen.getByTestId("delete-veh-2"));
    expect(await screen.findByText("Deleted in vehicle!")).toBeInTheDocument();
    expect(screen.queryByText("MODEL S")).toBeNull();
  });
  it("7 :Should update segement(id 1) and also in the list", async () => {
    render(
      <Provider store={store}>
        <Vehicle />
      </Provider>
    );
    expect(screen.queryByText("SQ7")).toBeNull();
    expect(screen.queryByText("MODEL S")).toBeNull();
    expect(await screen.findByText("SQ7")).toBeInTheDocument();
    expect(screen.getByTestId("name-2").textContent).toBe("MODEL S");
    await userEvent.click(screen.getByTestId("edit-veh-1"));
    const inputValue = screen.getByPlaceholderText("new vehicle name");
    await userEvent.type(inputValue, "new SQ7");
    await userEvent.click(screen.getByTestId("btn-vehicle-post"));
    expect(await screen.findByText("Updated in vehicle!")).toBeInTheDocument();
    expect(screen.getByTestId("name-1").textContent).toBe("new SQ7");
  });
  it("8 :Should update segement(id 2) and also in the list", async () => {
    render(
      <Provider store={store}>
        <Vehicle />
      </Provider>
    );
    expect(screen.queryByText("SQ7")).toBeNull();
    expect(screen.queryByText("MODEL S")).toBeNull();
    expect(await screen.findByText("SQ7")).toBeInTheDocument();
    expect(screen.getByTestId("name-2").textContent).toBe("MODEL S");
    await userEvent.click(screen.getByTestId("edit-veh-2"));
    const inputValue = screen.getByPlaceholderText("new vehicle name");
    await userEvent.type(inputValue, "new MODEL S");
    await userEvent.click(screen.getByTestId("btn-vehicle-post"));
    expect(await screen.findByText("Updated in vehicle!")).toBeInTheDocument();
    expect(screen.getByTestId("name-2").textContent).toBe("new MODEL S");
  });
  it("9 :Should MODEL S(id 2) cascade deleted when EV(id 2) seg deleted", async () => {
    render(
      <Provider store={store}>
        <Segment />
        <Brand />
        <Vehicle />
      </Provider>
    );
    expect(screen.queryByText("SQ7")).toBeNull();
    expect(screen.queryByText("MODEL S")).toBeNull();
    expect(await screen.findByText("SQ7")).toBeInTheDocument();
    expect(screen.getByTestId("name-2").textContent).toBe("MODEL S");
    await userEvent.click(screen.getByTestId("delete-seg-2"));
    expect(await screen.findByText("Deleted in segment!")).toBeInTheDocument();
    expect(screen.queryByText("MODEL S")).toBeNull();
    expect(screen.getByTestId("name-1").textContent).toBe("SQ7");
  });
  it("10 :Should MODEL S(id 2) cascade deleted when Tesla(id 2) brand deleted", async () => {
    render(
      <Provider store={store}>
        <Segment />
        <Brand />
        <Vehicle />
      </Provider>
    );
    expect(screen.queryByText("SQ7")).toBeNull();
    expect(screen.queryByText("MODEL S")).toBeNull();
    expect(await screen.findByText("SQ7")).toBeInTheDocument();
    expect(screen.getByTestId("name-2").textContent).toBe("MODEL S");
    await userEvent.click(screen.getByTestId("delete-brand-2"));
    expect(await screen.findByText("Deleted in brand!")).toBeInTheDocument();
    expect(screen.queryByText("MODEL S")).toBeNull();
    expect(screen.getByTestId("name-1").textContent).toBe("SQ7");
  });
  it("11 :Should SQ7(id 1) cascade deleted when SUV(id 1) seg deleted", async () => {
    render(
      <Provider store={store}>
        <Segment />
        <Brand />
        <Vehicle />
      </Provider>
    );
    expect(screen.queryByText("SQ7")).toBeNull();
    expect(screen.queryByText("MODEL S")).toBeNull();
    expect(await screen.findByText("SQ7")).toBeInTheDocument();
    expect(screen.getByTestId("name-2").textContent).toBe("MODEL S");
    await userEvent.click(screen.getByTestId("delete-seg-1"));
    expect(await screen.findByText("Deleted in segment!")).toBeInTheDocument();
    expect(screen.queryByText("SQ7")).toBeNull();
    expect(screen.getByTestId("name-2").textContent).toBe("MODEL S");
  });
  it("12 :Should SQ7(id 1) cascade deleted when Audi(id 1) brand deleted", async () => {
    render(
      <Provider store={store}>
        <Segment />
        <Brand />
        <Vehicle />
      </Provider>
    );
    expect(screen.queryByText("SQ7")).toBeNull();
    expect(screen.queryByText("MODEL S")).toBeNull();
    expect(await screen.findByText("SQ7")).toBeInTheDocument();
    expect(screen.getByTestId("name-2").textContent).toBe("MODEL S");
    await userEvent.click(screen.getByTestId("delete-brand-1"));
    expect(await screen.findByText("Deleted in brand!")).toBeInTheDocument();
    expect(screen.queryByText("SQ7")).toBeNull();
    expect(screen.getByTestId("name-2").textContent).toBe("MODEL S");
  });
});
