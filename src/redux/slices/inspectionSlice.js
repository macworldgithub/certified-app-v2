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
  fuelType: "", // Added: missing from initialState based on usage in setInspection
  odometerReading: "", // Added: used in resetInspectionData (alias/inconsistency with odometer?)
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
      } else if (field === "bookImages") {
        const raw = Array.isArray(value) ? value : [];
        state.bookImages = raw
          .map((item) => (typeof item === "string" ? { key: item } : item))
          .filter((img) => img && img.key);
      } else if (field === "damages") {
        if (Array.isArray(value)) {
          state.damages = value.map((d) => ({
            _id: d._id || null,
            key: d.damageImage || d.key,
            description: d.damageDescription || d.description || "",
            severity: (d.damageSeverity || d.severity || "minor").toLowerCase(),
            repairRequired:
              d.repairRequired === "Yes" || d.repairRequired === true,
          }));
        } else {
          state.damages = [];
        }
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
      if (otherPayload.mileage != null) {
        state.mileAge = String(otherPayload.mileage);
        delete otherPayload.mileage;
      }
      // Handle damages transformation
      if (Array.isArray(payload.damages)) {
        state.damages = payload.damages.map((d) => ({
          key: d.damageImage || d.key,
          description: d.damageDescription,
          severity: d.damageSeverity?.toLowerCase() || "minor",
          repairRequired: d.repairRequired === "Yes",
          _id: d._id,
        }));
        delete otherPayload.damages;
      }

      // Handle bookImages transformation
      if (payload.bookImages) {
        const raw = Array.isArray(payload.bookImages) ? payload.bookImages : [];
        state.bookImages = raw
          .map((item) => (typeof item === "string" ? { key: item } : item))
          .filter((img) => img && img.key);
        delete otherPayload.bookImages;
      }

      if (otherPayload.fuelType) {
        state.fuelType = otherPayload.fuelType;
        delete otherPayload.fuelType; // Avoid double-assign if it exists elsewhere
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
      state.odometer = "";
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
      state.bookImages = [];
      state.lastServiceDate = "";
      state.serviceCenterName = "";
      state.odometerAtLastService = 0;
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
