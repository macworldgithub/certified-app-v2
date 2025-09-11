import { configureStore } from "@reduxjs/toolkit";
import inspectionReducer from "./slices/inspectionSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    inspection: inspectionReducer,
    auth: authReducer,
  },
});
