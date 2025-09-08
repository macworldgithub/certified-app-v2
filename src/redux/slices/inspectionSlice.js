// redux/slices/inspectionSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vin: "",
  make: "",
  model: "",
  year: "",
  engineNumber: "",
  mileage: "",
  images: [],
  body: {},
  electrical: {},
  fluids: {},
  operational: {},
};

const inspectionSlice = createSlice({
  name: "inspection",
  initialState,
  reducers: {
    setInspectionDetails: (state, action) => {
      state.vin = action.payload.vin;
      state.make = action.payload.make;
      state.model = action.payload.model;
      state.year = action.payload.year;
    },
    setEngineDetails: (state, action) => {
      state.engineNumber = action.payload.engineNumber;
      state.mileage = action.payload.mileage;
    },
    setImages: (state, action) => {
      state.images = action.payload;
    },
    setBody: (state, action) => {
      state.body = action.payload;
    },
    setElectrical: (state, action) => {
      state.electrical = action.payload;
    },
    setFluids: (state, action) => {
      state.fluids = action.payload;
    },
    setOperational: (state, action) => {
      state.operational = action.payload;
    },
    resetInspection: () => initialState,
  },
});

export const {
  setInspectionDetails,
  setEngineDetails,
  setImages,
  setBody,
  setElectrical,
  setFluids,
  setOperational,
  resetInspection,
} = inspectionSlice.actions;

export default inspectionSlice.reducer;
