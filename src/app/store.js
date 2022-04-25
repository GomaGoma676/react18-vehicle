import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import vehicleReducer from "../features/vehicleSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    vehicle: vehicleReducer,
  },
});
