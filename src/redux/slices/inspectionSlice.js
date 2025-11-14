import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  vin: "", // From InspectionWizardStepOne
  year: "", // From InspectionWizardStepOne
  make: "", // From InspectionWizardStepOne
  model: "", // From InspectionWizardStepOne
  mileAge: "",

  registrationPlate: "", // From InspectionWizardStepOne
  registrationExpiry: "", // From InspectionWizardStepOne
  buildDate: "", // From InspectionWizardStepOne
  complianceDate: "", // From InspectionWizardStepOne
  images: {
    frontImage: null,
    engineImage: null,
    rightImage: null,
    rearImage: null,
    VINPlate: null,
    leftImage: null,
    InteriorFront: null,
    InteriorBack: null,
  },
  odometer: "", // From InspectionWizardStepTwo
  odometerImage: null, // From InspectionWizardStepTwo
  driveTrain: "", // From InspectionWizardStepTwo
  transmission: "", // From InspectionWizardStepTwo
  bodyType: "", // From InspectionWizardStepTwo
  color: "", // From InspectionWizardStepThree
  frontWheelDiameter: "", // From InspectionWizardStepThree
  rearWheelDiameter: "", // From InspectionWizardStepThree
  keysPresent: "", // From InspectionWizardStepThree
  serviceBookPresent: "", // From InspectionWizardStepFour
  serviceHistoryPresent: "", // From InspectionWizardStepFour
  serviceHistoryAvailable: false, // derived in StepFour
  bookImages: [],
  lastServiceDate: "",
  serviceCenterName: "",
  odometerAtLastService: 0,
  serviceRecordDocumentKey: "",
  tyreConditionFrontLeft: "", // From InspectionWizardStepFive
  tyreConditionFrontRight: "", // From InspectionWizardStepFive
  tyreConditionRearRight: "", // From InspectionWizardStepFive
  tyreConditionRearLeft: "", // From InspectionWizardStepFive
  damagePresent: "", // From InspectionWizardStepSix
  damages: [], // StepSix: list of recorded damages
  roadTest: "", // From InspectionWizardStepSix
  roadTestComments: "", // From InspectionWizardStepSix
  generalComments: "", // From InspectionWizardStepSix
  roadTestVoiceMemo: null, // StepSix: recorded memo path (mock)
};

const inspectionSlice = createSlice({
  name: "inspection",
  initialState,
  reducers: {
    // Universal field updater for all Wizard steps
    setInspectionData: (state, action) => {
      const { field, value } = action.payload;

      if (field in state) {
        state[field] = value;
      } else if (field in state.images && value !== null) {
        state.images[field] = value;
      }
      // ← YEH ADD KARO: bookImages ke liye
      // else if (field === "bookImages") {
      //   state.bookImages = value || []; // null nahi hoga kabhi
      // } else if (field === "damages") {
      //   state.damages = value || [];
      // }
      else if (field === "damages") {
        state.damages = Array.isArray(value) ? value : [];
      } else if (field === "bookImages") {
        state.bookImages = Array.isArray(value)
          ? value.filter((i) => i && i.key)
          : [];
      }
    },

    // setEngineDetails: (state, action) => {
    //   state.engineNumber = action.payload.engineNumber;
    //   state.mileAge = action.payload.mileAge;
    // },

    setInspectionDetails: (state, action) => {
      state.vin = action.payload.vin;
      state.make = action.payload.make;
      state.model = action.payload.carModel;
      state.year = action.payload.year;
      state.mileAge = action.payload.mileAge;
    },

    // Update images specifically
    setImages: (state, action) => {
      state.images = { ...state.images, ...action.payload };
    },

    // Merge full inspection data object
    setInspection: (state, action) => {
      const payload = action.payload;
      const imageFields = [
        "frontImage",
        "rearImage",
        "leftImage",
        "rightImage",
        "engineImage",
        "VINPlate",
        "InteriorFront",
        "InteriorBack",
      ];

      imageFields.forEach((field) => {
        if (payload[field]) {
          state.images[field] = payload[field];
        }
      });

      const otherPayload = { ...payload };
      imageFields.forEach((field) => {
        delete otherPayload[field];
      });

      // Handle carModel to model mapping
      if (otherPayload.carModel) {
        state.model = otherPayload.carModel;
        delete otherPayload.carModel;
      }

      if (otherPayload.fuelType) {
        state.fuelType = otherPayload.fuelType;
      }

      // ✅ Handle mileage to mileAge mapping
      if (otherPayload.mileage) {
        state.mileAge = otherPayload.mileage;
        delete otherPayload.mileage;
      }

      Object.assign(state, otherPayload);
    },

    // Reset all inspection data
    resetInspection: () => initialState,

    // Reset only specific wizard fields
    resetInspectionData: (state) => {
      state.vin = "";
      state.year = "";
      state.make = "";
      state.model = "";
      state.mileAge = "";
      state.registrationPlate = "";
      state.registrationExpiry = "";
      state.buildDate = "";
      state.complianceDate = "";
      state.images = {
        frontImage: null,
        rearImage: null,
        leftImage: null,
        rightImage: null,
        engineImage: null,
        VINPlate: null,
        InteriorFront: null,
        InteriorBack: null,
      };
      // state.odometer = "";
      state.odometerReading = "";
      state.odometerImage = null;
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
      state.serviceHistoryAvailable = false;
      state.bookImages = null;
      state.lastServiceDate = "";
      state.serviceCenterName = "";
      state.odometerAtLastService = "";
      state.serviceRecordDocumentKey = "";
      state.tyreConditionFrontLeft = "";
      state.tyreConditionFrontRight = "";
      state.tyreConditionRearRight = "";
      state.tyreConditionRearLeft = "";
      state.damagePresent = "";
      state.damages = [];
      state.roadTest = "";
      state.roadTestComments = "";
      state.generalComments = "";
      state.roadTestVoiceMemo = null;
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
} = inspectionSlice.actions;

export default inspectionSlice.reducer;
