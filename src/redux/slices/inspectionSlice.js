import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  _id: "",
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
  frontLeftWheelCondition: "", // From InspectionWizardStepThree
  frontRightWheelCondition: "", // From InspectionWizardStepThree
  rearLeftWheelCondition: "", // From InspectionWizardStepThree
  rearRightWheelCondition: "", // From InspectionWizardStepThree
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
  spareWheelCondition: null,
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
        state.bookImages = Array.isArray(value) ? value : [];
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
        "LHFImage",
        "leftImage",
        "LHRImage",
        "rearImage",
        "RHRImage",
        "rightImage",
        "RHFImage",
        "RoofImage",
        "UnderbonnetImage",
        "InsideBonnetImage",
        "DriversSeatImage",
        "FrontPassengerSeatImage",
        "RearSeatImage",
        "compliancePlateImage",
        "OdoImage",
        "InfotainmentImage",
        "KeysImage",
        "engineImage",
        "VINPlate",
        "plateImage",
        "InteriorFront",
        "InteriorBack",
        "interiorFrontImage",
        "interiorBackImage",
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

      // Map Dates properly
      const formatMonthYear = (d) => {
        if (!d) return "";
        // If it's YYYY-MM-DD
        if (d.includes("-")) {
          const parts = d.split("T")[0].split("-");
          if (parts.length === 3) return `${parts[1]}/${parts[0]}`; // MM/YYYY
        }
        return d;
      };

      const formatDayMonthYear = (d) => {
        if (!d) return "";
        if (d.includes("-")) {
          const parts = d.split("T")[0].split("-");
          if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
        }
        return d;
      };

      if (otherPayload.buildDate) {
        state.buildDate = formatMonthYear(otherPayload.buildDate);
        delete otherPayload.buildDate;
      }
      if (otherPayload.complianceDate) {
        state.complianceDate = formatMonthYear(otherPayload.complianceDate);
        delete otherPayload.complianceDate;
      }
      if (otherPayload.registrationExpiry) {
        state.registrationExpiry = formatDayMonthYear(otherPayload.registrationExpiry);
        delete otherPayload.registrationExpiry;
      }

      // Map booleans/strings to UI toggles
      const toYesNo = (val) => {
        if (val === true || val === "true") return "Yes";
        if (val === false || val === "false") return "No";
        return val || "";
      };

      if (otherPayload.serviceBookPresent !== undefined) {
        state.serviceBookPresent = toYesNo(otherPayload.serviceBookPresent);
        delete otherPayload.serviceBookPresent;
      }
      if (otherPayload.serviceHistoryPresent !== undefined) {
        state.serviceHistoryPresent = toYesNo(otherPayload.serviceHistoryPresent);
        delete otherPayload.serviceHistoryPresent;
      }
      if (otherPayload.damagePresent !== undefined) {
        state.damagePresent = toYesNo(otherPayload.damagePresent);
        delete otherPayload.damagePresent;
      }
      if (otherPayload.roadTest !== undefined) {
        state.roadTest = toYesNo(otherPayload.roadTest);
        delete otherPayload.roadTest;
      }

      // keysPresent
      if (otherPayload.keysPresent !== undefined) {
        let kp = otherPayload.keysPresent;
        if (kp === true || kp === "true") kp = "1"; // Default to 1 if it was just stored as true
        if (kp === false || kp === "false") kp = "1"; // Just default to 1 since UI doesn't have 0 options
        state.keysPresent = String(kp);
        delete otherPayload.keysPresent;
      }

      // Map backend Tyre Conditions to frontend Wheel Conditions
      if (otherPayload.tyreConditionFrontLeft) {
        state.frontLeftWheelCondition = otherPayload.tyreConditionFrontLeft;
        delete otherPayload.tyreConditionFrontLeft;
      }
      if (otherPayload.tyreConditionFrontRight) {
        state.frontRightWheelCondition = otherPayload.tyreConditionFrontRight;
        delete otherPayload.tyreConditionFrontRight;
      }
      if (otherPayload.tyreConditionRearRight) {
        state.rearRightWheelCondition = otherPayload.tyreConditionRearRight;
        delete otherPayload.tyreConditionRearRight;
      }
      if (otherPayload.tyreConditionRearLeft) {
        state.rearLeftWheelCondition = otherPayload.tyreConditionRearLeft;
        delete otherPayload.tyreConditionRearLeft;
      }

      Object.assign(state, otherPayload);
    },

    // Reset all inspection data
    resetInspection: () => initialState,

    // Reset only specific wizard fields
    resetInspectionData: (state) => {
      state._id = "";
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
      state.frontLeftWheelCondition = "";
      state.frontRightWheelCondition = "";
      state.rearLeftWheelCondition = "";
      state.rearRightWheelCondition = "";
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
      state.spareWheelCondition = null;
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
