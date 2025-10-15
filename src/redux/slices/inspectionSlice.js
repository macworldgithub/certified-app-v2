// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   _id: "",
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

//   // 🔹 New Inspection Wizard fields
//   odometer: "",
//   fuelType: "",
//   driveTrain: "",
//   transmission: "",
//   bodyType: "",
// };

// const inspectionSlice = createSlice({
//   name: "inspection",
//   initialState,
//   reducers: {
//     // 🔹 Existing reducers (from old slice)
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

//     // 🔹 New universal field updater for Wizard steps
//     setInspectionData: (state, action) => {
//       const { field, value } = action.payload;
//       state[field] = value;
//     },

//     // 🔹 Merge full inspection data object (useful for bulk updates)
//     setInspection: (state, action) => {
//       return { ...state, ...action.payload };
//     },

//     // 🔹 Reset inspection data
//     resetInspection: () => initialState,

//     // 🔹 Reset only wizard fields if needed
//     resetInspectionData: (state) => {
//       state.odometer = "";
//       state.fuelType = "";
//       state.driveTrain = "";
//       state.transmission = "";
//       state.bodyType = "";
//     },
//   },
// });

// export const {
//   setInspectionDetails,
//   setEngineDetails,
//   setOverallRating,
//   setImages,
//   setInspectionData,
//   resetInspection,
//   resetInspectionData,
//   setInspection,
// } = inspectionSlice.actions;

// export default inspectionSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vinChassisNumber: "", // From InspectionWizardStepOne
  year: "", // From InspectionWizardStepOne
  make: "", // From InspectionWizardStepOne
  model: "", // From InspectionWizardStepOne
  registrationPlate: "", // From InspectionWizardStepOne
  registrationExpiry: "", // From InspectionWizardStepOne
  buildDate: "", // From InspectionWizardStepOne
  complianceDate: "", // From InspectionWizardStepOne
  images: {
    front: null, // Image upload after StepOne
    rear: null,
    left: null,
    right: null,
  },
  odometer: "", // From InspectionWizardStepTwo
  fuelType: "", // From InspectionWizardStepTwo
  driveTrain: "", // From InspectionWizardStepTwo
  transmission: "", // From InspectionWizardStepTwo
  bodyType: "", // From InspectionWizardStepTwo
  color: "", // From InspectionWizardStepThree
  frontWheelDiameter: "", // From InspectionWizardStepThree
  rearWheelDiameter: "", // From InspectionWizardStepThree
  keysPresent: "", // From InspectionWizardStepThree
  serviceBookPresent: "", // From InspectionWizardStepFour
  serviceHistoryPresent: "", // From InspectionWizardStepFour
  tyreConditionFrontLeft: "", // From InspectionWizardStepFive
  tyreConditionFrontRight: "", // From InspectionWizardStepFive
  tyreConditionRearRight: "", // From InspectionWizardStepFive
  tyreConditionRearLeft: "", // From InspectionWizardStepFive
  damagePresent: "", // From InspectionWizardStepSix
  roadTest: "", // From InspectionWizardStepSix
  roadTestComments: "", // From InspectionWizardStepSix
  generalComments: "", // From InspectionWizardStepSix
};

const inspectionSlice = createSlice({
  name: "inspection",
  initialState,
  reducers: {
    // Universal field updater for all Wizard steps
    setInspectionData: (state, action) => {
      const { field, value } = action.payload;
      if (field in state || (field in state.images && value !== null)) {
        if (field in state.images) {
          state.images[field] = value;
        } else {
          state[field] = value;
        }
      }
    },

    setEngineDetails: (state, action) => {
      state.engineNumber = action.payload.engineNumber;
      state.mileAge = action.payload.mileAge;
    },

    setInspectionDetails: (state, action) => {
      state.vin = action.payload.vin;
      state.make = action.payload.make;
      state.model = action.payload.carModel;
      state.year = action.payload.year;
    },

    // Update images specifically
    setImages: (state, action) => {
      state.images = { ...state.images, ...action.payload };
    },

    // Merge full inspection data object
    setInspection: (state, action) => {
      return { ...state, ...action.payload };
    },

    // Reset all inspection data
    resetInspection: () => initialState,

    // Reset only specific wizard fields
    resetInspectionData: (state) => {
      state.vinChassisNumber = "";
      state.year = "";
      state.make = "";
      state.model = "";
      state.registrationPlate = "";
      state.registrationExpiry = "";
      state.buildDate = "";
      state.complianceDate = "";
      state.images = { front: null, rear: null, left: null, right: null };
      state.odometer = "";
      state.fuelType = "";
      state.driveTrain = "";
      state.transmission = "";
      state.bodyType = "";
      state.color = "";
      state.frontWheelDiameter = "";
      state.rearWheelDiameter = "";
      state.keysPresent = "";
      state.serviceBookPresent = "";
      state.serviceHistoryPresent = "";
      state.tyreConditionFrontLeft = "";
      state.tyreConditionFrontRight = "";
      state.tyreConditionRearRight = "";
      state.tyreConditionRearLeft = "";
      state.damagePresent = "";
      state.roadTest = "";
      state.roadTestComments = "";
      state.generalComments = "";
    },
  },
});

export const {
  setInspectionData,
  setImages,
  setInspection,
  resetInspection,
  resetInspectionData,
  setInspectionDetails,
  setEngineDetails,
} = inspectionSlice.actions;

export default inspectionSlice.reducer;
