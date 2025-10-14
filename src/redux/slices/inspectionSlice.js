// import { createSlice } from "@reduxjs/toolkit";
// const initialState = {
//   _id:"",
//   vin: "",
//   make: "",
//   carModel: "",
//   year: "",
//   engineNumber: "",
//   mileAge: "",
//   overallRating: "",
//   images: {
//     front: null,
//     rear: null,
//     left: null,
//     right: null,
//   },
//   body: {},
//   electrical: {},
//   engineFluids: {},
//   operational: {},
//   analysis: null,
// };

// const inspectionSlice = createSlice({
//   name: "inspection",
//   initialState,
//   reducers: {
//     setInspectionDetails: (state, action) => {
//       state.vin = action.payload.vin;
//       state.make = action.payload.make;
//       state.carModel = action.payload.carModel;
//       state.year = action.payload.year;
//     },
//     setEngineDetails: (state, action) => {
//       state.engineNumber = action.payload.engineNumber;
//       state.mileAge = action.payload.mileAge;
//     },
//     setOverallRating: (state, action) => {
//       state.overallRating = action.payload;
//     },
//     setImages: (state, action) => {
//       state.images = { ...state.images, ...action.payload };
//     },
//     setBody: (state, action) => {
//       state.body = action.payload;
//     },
//     setElectrical: (state, action) => {
//       state.electrical = action.payload;
//     },
//     setFluids: (state, action) => {
//       state.fluids = action.payload;
//     },
//     setOperational: (state, action) => {
//       state.operational = action.payload;
//     },
//     setAnalysisData: (state, action) => {
//       state.analysis = action.payload;
//     },
//       setInspection(state, action) {
//       return { ...state, ...action.payload };
//     },
//     resetInspection: () => initialState,
//   },
// });

// export const {
//   setInspectionDetails,
//   setEngineDetails,
//   setImages,
//   setBody,
//   setElectrical,
//   setFluids,
//   setOperational,
//   resetInspection,
//   setInspection
// } = inspectionSlice.actions;

// export default inspectionSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
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

  // 🔹 New Inspection Wizard fields
  odometer: "",
  fuelType: "",
  driveTrain: "",
  transmission: "",
  bodyType: "",
};

const inspectionSlice = createSlice({
  name: "inspection",
  initialState,
  reducers: {
    // 🔹 Existing reducers (from old slice)
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

    // 🔹 New universal field updater for Wizard steps
    setInspectionData: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    // 🔹 Merge full inspection data object (useful for bulk updates)
    setInspection: (state, action) => {
      return { ...state, ...action.payload };
    },

    // 🔹 Reset inspection data
    resetInspection: () => initialState,

    // 🔹 Reset only wizard fields if needed
    resetInspectionData: (state) => {
      state.odometer = "";
      state.fuelType = "";
      state.driveTrain = "";
      state.transmission = "";
      state.bodyType = "";
    },
  },
});

export const {
  setInspectionDetails,
  setEngineDetails,
  setOverallRating,
  setImages,
  setInspectionData,
  resetInspection,
  resetInspectionData,
  setInspection,
} = inspectionSlice.actions;

export default inspectionSlice.reducer;
