import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  _id:"",
  vin: "",
  make: "",
  carModel: "",
  year: "",
  engineNumber: "",
  mileAge: "",
  overallRating: "",
  images: {
    front: null,
    rear: null,
    left: null,
    right: null,
  },
  body: {},
  electrical: {},
  engineFluids: {},
  operational: {},
  analysis: null,
};

const inspectionSlice = createSlice({
  name: "inspection",
  initialState,
  reducers: {
    setInspectionDetails: (state, action) => {
      state.vin = action.payload.vin;
      state.make = action.payload.make;
      state.carModel = action.payload.carModel;
      state.year = action.payload.year;
    },
    setEngineDetails: (state, action) => {
      state.engineNumber = action.payload.engineNumber;
      state.mileAge = action.payload.mileAge;
    },
    setOverallRating: (state, action) => {
      state.overallRating = action.payload;
    },
    setImages: (state, action) => {
      state.images = { ...state.images, ...action.payload };
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
    setAnalysisData: (state, action) => {
      state.analysis = action.payload;
    },
      setInspection(state, action) {
      return { ...state, ...action.payload };
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
  setInspection
} = inspectionSlice.actions;

export default inspectionSlice.reducer;
