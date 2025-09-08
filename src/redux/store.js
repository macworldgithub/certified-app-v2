// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import inspectionReducer from "./slices/inspectionSlice";

export const store = configureStore({
  reducer: {
    inspection: inspectionReducer,
  },
});
