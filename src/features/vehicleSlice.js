import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = "http://localhost:8000/";

export const fetchAsyncGetSegments = createAsyncThunk(
  "segment/get",
  async () => {
    const res = await axios.get(`${apiUrl}api/segments/`, {
      headers: {
        Authorization: `token ${localStorage.token}`,
      },
    });
    return res.data;
  }
);
export const fetchAsyncCreateSegment = createAsyncThunk(
  "segment/post",
  async (segment) => {
    const res = await axios.post(`${apiUrl}api/segments/`, segment, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${localStorage.token}`,
      },
    });
    return res.data;
  }
);
export const fetchAsyncUpdateSegment = createAsyncThunk(
  "segment/put",
  async (segment) => {
    const res = await axios.put(
      `${apiUrl}api/segments/${segment.id}/`,
      segment,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${localStorage.token}`,
        },
      }
    );
    return res.data;
  }
);
export const fetchAsyncDeleteSegment = createAsyncThunk(
  "segment/delete",
  async (id) => {
    await axios.delete(`${apiUrl}api/segments/${id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${localStorage.token}`,
      },
    });
    return id;
  }
);
export const fetchAsyncGetBrands = createAsyncThunk("brand/get", async () => {
  const res = await axios.get(`${apiUrl}api/brands/`, {
    headers: {
      Authorization: `token ${localStorage.token}`,
    },
  });
  return res.data;
});
export const fetchAsyncCreateBrand = createAsyncThunk(
  "brand/post",
  async (brand) => {
    const res = await axios.post(`${apiUrl}api/brands/`, brand, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${localStorage.token}`,
      },
    });
    return res.data;
  }
);
export const fetchAsyncUpdateBrand = createAsyncThunk(
  "brand/put",
  async (brand) => {
    const res = await axios.put(`${apiUrl}api/brands/${brand.id}/`, brand, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${localStorage.token}`,
      },
    });
    return res.data;
  }
);
export const fetchAsyncDeleteBrand = createAsyncThunk(
  "brand/delete",
  async (id) => {
    await axios.delete(`${apiUrl}api/brands/${id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${localStorage.token}`,
      },
    });
    return id;
  }
);
export const fetchAsyncGetVehicles = createAsyncThunk(
  "vehicle/get",
  async () => {
    const res = await axios.get(`${apiUrl}api/vehicles/`, {
      headers: {
        Authorization: `token ${localStorage.token}`,
      },
    });
    return res.data;
  }
);
export const fetchAsyncCreateVehicle = createAsyncThunk(
  "vehicle/post",
  async (vehicle) => {
    const res = await axios.post(`${apiUrl}api/vehicles/`, vehicle, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${localStorage.token}`,
      },
    });
    return res.data;
  }
);
export const fetchAsyncUpdateVehicle = createAsyncThunk(
  "vehicle/put",
  async (vehicle) => {
    const res = await axios.put(
      `${apiUrl}api/vehicles/${vehicle.id}/`,
      vehicle,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${localStorage.token}`,
        },
      }
    );
    return res.data;
  }
);
export const fetchAsyncDeleteVehicle = createAsyncThunk(
  "vehicle/delete",
  async (id) => {
    await axios.delete(`${apiUrl}api/vehicles/${id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${localStorage.token}`,
      },
    });
    return id;
  }
);
export const vehicleSlice = createSlice({
  name: "vehicle",
  initialState: {
    segments: [
      {
        id: 0,
        segment_name: "",
      },
    ],
    brands: [
      {
        id: 0,
        brand_name: "",
      },
    ],
    vehicles: [
      {
        id: 0,
        vehicle_name: "",
        release_year: 2020,
        price: 0.0,
        segment: 0,
        brand: 0,
        segment_name: "",
        brand_name: "",
      },
    ],
    editedSegment: {
      id: 0,
      segment_name: "",
    },
    editedBrand: {
      id: 0,
      brand_name: "",
    },
    editedVehicle: {
      id: 0,
      vehicle_name: "",
      release_year: 2020,
      price: 0.0,
      segment: 0,
      brand: 0,
    },
  },
  reducers: {
    editSegment(state, action) {
      state.editedSegment = action.payload;
    },
    editBrand(state, action) {
      state.editedBrand = action.payload;
    },
    editVehicle(state, action) {
      state.editedVehicle = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetSegments.fulfilled, (state, action) => {
      return {
        ...state,
        segments: action.payload,
      };
    });
    builder.addCase(fetchAsyncCreateSegment.fulfilled, (state, action) => {
      return {
        ...state,
        segments: [...state.segments, action.payload],
      };
    });
    builder.addCase(fetchAsyncUpdateSegment.fulfilled, (state, action) => {
      return {
        ...state,
        segments: state.segments.map((seg) =>
          seg.id === action.payload.id ? action.payload : seg
        ),
      };
    });
    builder.addCase(fetchAsyncDeleteSegment.fulfilled, (state, action) => {
      return {
        ...state,
        segments: state.segments.filter((seg) => seg.id !== action.payload),
        vehicles: state.vehicles.filter(
          (veh) => veh.segment !== action.payload
        ),
      };
    });
    builder.addCase(fetchAsyncGetBrands.fulfilled, (state, action) => {
      return {
        ...state,
        brands: action.payload,
      };
    });
    builder.addCase(fetchAsyncCreateBrand.fulfilled, (state, action) => {
      return {
        ...state,
        brands: [...state.brands, action.payload],
      };
    });
    builder.addCase(fetchAsyncUpdateBrand.fulfilled, (state, action) => {
      return {
        ...state,
        brands: state.brands.map((brand) =>
          brand.id === action.payload.id ? action.payload : brand
        ),
      };
    });
    builder.addCase(fetchAsyncDeleteBrand.fulfilled, (state, action) => {
      return {
        ...state,
        brands: state.brands.filter((brand) => brand.id !== action.payload),
        vehicles: state.vehicles.filter((veh) => veh.brand !== action.payload),
      };
    });
    builder.addCase(fetchAsyncGetVehicles.fulfilled, (state, action) => {
      return {
        ...state,
        vehicles: action.payload,
      };
    });
    builder.addCase(fetchAsyncCreateVehicle.fulfilled, (state, action) => {
      return {
        ...state,
        vehicles: [...state.vehicles, action.payload],
      };
    });
    builder.addCase(fetchAsyncUpdateVehicle.fulfilled, (state, action) => {
      return {
        ...state,
        vehicles: state.vehicles.map((vehicle) =>
          vehicle.id === action.payload.id ? action.payload : vehicle
        ),
      };
    });
    builder.addCase(fetchAsyncDeleteVehicle.fulfilled, (state, action) => {
      return {
        ...state,
        vehicles: state.vehicles.filter(
          (vehicle) => vehicle.id !== action.payload
        ),
      };
    });
  },
});

export const { editSegment, editBrand, editVehicle } = vehicleSlice.actions;

export const selectSegments = (state) => state.vehicle.segments;
export const selectEditedSegment = (state) => state.vehicle.editedSegment;
export const selectBrands = (state) => state.vehicle.brands;
export const selectEditedBrand = (state) => state.vehicle.editedBrand;
export const selectVehicles = (state) => state.vehicle.vehicles;
export const selectEditedVehicle = (state) => state.vehicle.editedVehicle;

export default vehicleSlice.reducer;
