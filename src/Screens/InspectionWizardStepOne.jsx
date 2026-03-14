import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { setInspectionData } from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import DateTimePicker from "@react-native-community/datetimepicker";
import MonthYearPicker from "react-native-month-year-picker";
// Import the infoAgent API helpers
import {
  fetchAndStoreInfoAgentToken,
  fetchVehicleReport,
  getVehicleBasicInfo,
  getVehicleAdditionalInfo,
} from "../../utils/infoAgentApi";

const fuelOptions = ["Petrol", "Diesel", "Hybrid", "Electric", "other"];
const driveTrainOptions = ["FWD", "RWD", "AWD", "4WD"];
const transmissionOptions = ["Manual", "Automatic", "CVT"];
const bodyTypeOptions = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Truck",
  "Van",
  "Coupe",
  "Wagon",
  "Convertible",
  "Ute",
  "Minivan",
  "Bus",
  "other",
];

export default function InspectionWizardStepOne({ navigation }) {
  const dispatch = useDispatch();
  const {
    vin,
    year,
    make,
    model,
    mileAge,
    registrationPlate,
    registrationExpiry,
    buildDate,
    complianceDate,
    fuelType,
    transmission,
    driveTrain,
    bodyType,
    color,
    keysPresent,
  } = useSelector((state) => state.inspection);

  const isFormComplete =
    vin?.trim().length === 17 &&
    year?.trim().length > 0 &&
    make?.trim().length > 0 &&
    model?.trim().length > 0 &&
    registrationPlate?.trim().length > 0 &&
    mileAge &&
    !isNaN(Number(mileAge)) &&
    registrationExpiry &&
    buildDate &&
    complianceDate &&
    fuelType &&
    transmission &&
    driveTrain &&
    bodyType &&
    color &&
    keysPresent;

  const [showPicker, setShowPicker] = useState(null); // "registrationExpiry" | "buildDate" | "complianceDate"
  const [date, setDate] = useState(new Date());
  const [vinLoading, setVinLoading] = useState(false);
  const [regoLoading, setRegoLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [vinError, setVinError] = useState("");

  const handleTextChange = (field, value) => {
    dispatch(setInspectionData({ field, value }));
  };

  const handleSelect = (field, value) => {
    dispatch(setInspectionData({ field, value }));
    setShowDropdown(null);
  };

  const handleNext = () => navigation.navigate("InspectionWizardStepTwo");
  const handleBack = () => navigation.goBack();

  const showDatePicker = (field) => {
    setShowPicker(field);
  };

  const onDateChange = (event, selectedDate) => {
    // on Android 'event.type' might be 'set' or 'dismissed' (older RN versions vary)
    if (selectedDate) {
      setDate(selectedDate);
      const formatted = selectedDate.toLocaleDateString("en-GB"); // dd/mm/yyyy
      dispatch(setInspectionData({ field: showPicker, value: formatted }));
    }
    setShowPicker(null); // close after selection
  };

  const onMonthYearChange = (event, newDate) => {
    if (newDate) {
      setDate(newDate);
      const formatted = `${String(newDate.getMonth() + 1).padStart(2, "0")}/${newDate.getFullYear()}`;

      dispatch(
        setInspectionData({
          field: showPicker,
          value: formatted,
        }),
      );
    }

    setShowPicker(null);
  };

  const validateAndGoNext = () => {
    setVinError("");

    const trimmedVin = vin?.trim() || "";

    if (trimmedVin.length === 0) {
      setVinError("VIN/Chassis Number is required");
      return;
    }

    if (trimmedVin.length !== 17) {
      setVinError("VIN must be exactly 17 characters");
      return;
    }

    if (buildDate && complianceDate) {
      const parseDate = (d) => {
        if (d.includes("/")) {
          const parts = d.split("/");
          if (parts.length === 2) {
            return { month: Number(parts[0]), year: Number(parts[1]) };
          } else if (parts.length === 3) {
            return { month: Number(parts[1]), year: Number(parts[2]) };
          }
        }
        if (d.includes("-")) {
          const parts = d.split("-");
          if (parts.length === 3) {
            return { month: Number(parts[1]), year: Number(parts[0]) };
          }
        }
        return null;
      };

      const bD = parseDate(buildDate);
      const cD = parseDate(complianceDate);

      if (bD && cD) {
        const bNum = bD.year * 12 + bD.month;
        const cNum = cD.year * 12 + cD.month;

        if (cNum <= bNum) {
          Alert.alert(
            "Validation Error",
            "Compliance date must be higher than the build date.",
          );
          return;
        }
      }
    }

    navigation.navigate("InspectionWizardStepThree");
  };

  // --- New: fetch vehicle info flow ---
  // const handleFetchVehicleInfo = async () => {
  //   // Basic validation
  //   if (!vin || vin.trim().length === 0) {
  //     Alert.alert(
  //       "VIN required",
  //       "Please enter a VIN/Chassis number before fetching.",
  //     );
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     // 1) Ensure token present
  //     await fetchAndStoreInfoAgentToken();

  //     // 2) Call vehicle report endpoint
  //     await fetchVehicleReport(vin.trim());

  //     // 3) Read basic info
  //     const basic = await getVehicleBasicInfo();

  //     if (basic) {
  //       if (basic.year)
  //         dispatch(
  //           setInspectionData({ field: "year", value: String(basic.year) }),
  //         );
  //       if (basic.make)
  //         dispatch(setInspectionData({ field: "make", value: basic.make }));
  //       if (basic.model)
  //         dispatch(setInspectionData({ field: "model", value: basic.model }));
  //       if (basic.mileAge)
  //         dispatch(
  //           setInspectionData({ field: "mileAge", value: basic.mileAge }),
  //         );
  //       if (basic.buildDate)
  //         dispatch(
  //           setInspectionData({ field: "buildDate", value: basic.buildDate }),
  //         );
  //       if (basic.compliancePlate)
  //         dispatch(
  //           setInspectionData({
  //             field: "complianceDate",
  //             value: basic.compliancePlate,
  //           }),
  //         );
  //       if (basic.plate)
  //         dispatch(
  //           setInspectionData({
  //             field: "registrationPlate",
  //             value: basic.plate,
  //           }),
  //         );
  //     }

  //     const additional = await getVehicleAdditionalInfo();
  //     if (additional) {
  //       if (additional.colour)
  //         dispatch(
  //           setInspectionData({ field: "color", value: additional.colour }),
  //         );
  //       if (additional.fuelType)
  //         dispatch(
  //           setInspectionData({
  //             field: "fuelType",
  //             value: additional.fuelType,
  //           }),
  //         );
  //       if (additional.transmissionType)
  //         dispatch(
  //           setInspectionData({
  //             field: "transmission",
  //             value: additional.transmissionType,
  //           }),
  //         );
  //       if (additional.driveType)
  //         dispatch(
  //           setInspectionData({
  //             field: "driveTrain",
  //             value: additional.driveType,
  //           }),
  //         );
  //       if (additional.bodyType)
  //         dispatch(
  //           setInspectionData({
  //             field: "bodyType",
  //             value: additional.bodyType,
  //           }),
  //         );
  //     }

  //     const requiredFields = [
  //       { key: "vin", label: "VIN/Chassis Number" },
  //       { key: "year", label: "Year" },
  //       { key: "make", label: "Make" },
  //       { key: "model", label: "Model" },
  //       { key: "mileAge", label: "mileAge" },
  //       { key: "registrationPlate", label: "Registration Plate" },
  //       { key: "buildDate", label: "Build Date" },
  //       { key: "complianceDate", label: "Compliance Date" },
  //     ];

  //     const collectedData = {
  //       vin: vin?.trim() || "",
  //       year: basic?.year ? String(basic.year) : year,
  //       make: basic?.make || make,
  //       model: basic?.model || model,
  //       mileAge: basic?.mileAge || mileAge,
  //       registrationPlate: basic?.plate || registrationPlate,
  //       buildDate: basic?.buildDate || buildDate,
  //       complianceDate: basic?.compliancePlate || complianceDate,
  //     };

  //     const missingFields = requiredFields
  //       .filter(
  //         (f) => !collectedData[f.key] || collectedData[f.key].trim() === "",
  //       )
  //       .map((f) => f.label);

  //     let validationStatus = false;
  //     let validationMessage = "";

  //     if (missingFields.length > 0) {
  //       validationStatus = false;
  //       validationMessage = `Missing fields:\n${missingFields.join("\n")}`;
  //       Alert.alert("⚠️ Missing Data", validationMessage);
  //     } else {
  //       validationStatus = true;
  //       validationMessage = "✅ All fields have been successfully populated.";
  //       Alert.alert("Success", validationMessage);
  //     }

  //     console.log({
  //       missingFields,
  //       validationStatus,
  //       validationMessage,
  //     });
  //   } catch (err) {
  //     console.error("Error in fetch flow:", err);
  //     Alert.alert(
  //       "Fetch failed",
  //       err?.message ||
  //         "Failed to fetch vehicle info. Check the VIN and network.",
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const renderDropdown = (field, options) => (
    <View style={tw`mt-6`}>
      <Text style={tw`text-gray-500 mb-2`}>
        {field === "fuelType" && "Fuel Type"}
        {field === "driveTrain" && "Drive Train"}
        {field === "transmission" && "Transmission"}
        {field === "bodyType" && "Body Type"}
      </Text>

      <TouchableOpacity
        style={tw`flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-white`}
        onPress={() => setShowDropdown(showDropdown === field ? null : field)}
      >
        <Text
          style={tw`
        ${
          (field === "fuelType" && fuelType) ||
          (field === "driveTrain" && driveTrain) ||
          (field === "transmission" && transmission) ||
          (field === "bodyType" && bodyType)
            ? "text-black"
            : "text-gray-400"
        }
      `}
        >
          {field === "fuelType" && (fuelType || "Select Fuel Type")}
          {field === "driveTrain" && (driveTrain || "Select Drive Train")}
          {field === "transmission" && (transmission || "Select Transmission")}
          {field === "bodyType" && (bodyType || "Select Body Type")}
        </Text>

        <Ionicons
          name={showDropdown === field ? "chevron-up" : "chevron-down"}
          size={20}
          color="gray"
        />
      </TouchableOpacity>

      {showDropdown === field && (
        <View style={tw`bg-white border border-gray-300 rounded-lg mt-1`}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={tw`p-3 border-b border-gray-100`}
              onPress={() => handleSelect(field, option)}
            >
              <Text style={tw`text-gray-700`}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  // --- Active: fetch vehicle info flow ---
  // source: "vin" | "rego"
  const handleFetchVehicleInfo = async (source = "vin") => {
    // Validate the relevant field
    if (source === "vin") {
      if (!vin || vin.trim().length === 0) {
        Alert.alert(
          "VIN required",
          "Please enter a VIN/Chassis number before fetching.",
        );
        return;
      }
      if (vin.trim().length !== 17) {
        Alert.alert("Invalid VIN", "VIN must be exactly 17 characters.");
        return;
      }
    } else {
      if (!registrationPlate || registrationPlate.trim().length === 0) {
        Alert.alert(
          "Registration Plate required",
          "Please enter a Registration Plate before fetching.",
        );
        return;
      }
    }

    const setLoading = source === "vin" ? setVinLoading : setRegoLoading;

    try {
      setLoading(true);

      // 1) Ensure token present
      await fetchAndStoreInfoAgentToken();

      // 2) Call vehicle report endpoint — pass both so the API can use whichever is provided
      await fetchVehicleReport(
        source === "vin" ? vin.trim() : undefined,
        source === "rego" ? registrationPlate.trim() : undefined,
      );

      // 3) Read basic info
      const basic = await getVehicleBasicInfo();

      if (basic) {
        const formatMonthYear = (d) => {
          if (!d) return d;
          if (d.includes("/")) {
            const parts = d.split("/");
            if (parts.length === 2)
              return `${String(parts[0]).padStart(2, "0")}/${parts[1]}`;
            if (parts.length === 3)
              return `${String(parts[1]).padStart(2, "0")}/${parts[2]}`;
          }
          if (d.includes("-")) {
            const parts = d.split("-");
            if (parts.length === 3)
              return `${String(parts[1]).padStart(2, "0")}/${parts[0]}`;
            if (parts.length === 2)
              return `${String(parts[1]).padStart(2, "0")}/${parts[0]}`;
          }
          return d;
        };

        if (basic.year)
          dispatch(
            setInspectionData({ field: "year", value: String(basic.year) }),
          );
        if (basic.make)
          dispatch(setInspectionData({ field: "make", value: basic.make }));
        if (basic.model)
          dispatch(setInspectionData({ field: "model", value: basic.model }));
        if (basic.mileAge)
          dispatch(
            setInspectionData({
              field: "mileAge",
              value: String(basic.mileAge),
            }),
          );
        if (basic.buildDate)
          dispatch(
            setInspectionData({
              field: "buildDate",
              value: formatMonthYear(basic.buildDate),
            }),
          );
        if (basic.compliancePlate)
          dispatch(
            setInspectionData({
              field: "complianceDate",
              value: formatMonthYear(basic.compliancePlate),
            }),
          );
        if (basic.plate)
          dispatch(
            setInspectionData({
              field: "registrationPlate",
              value: basic.plate,
            }),
          );
      }

      const additional = await getVehicleAdditionalInfo();
      if (additional) {
        if (additional.colour)
          dispatch(
            setInspectionData({ field: "color", value: additional.colour }),
          );
        if (additional.fuelType)
          dispatch(
            setInspectionData({
              field: "fuelType",
              value: additional.fuelType,
            }),
          );
        if (additional.transmissionType)
          dispatch(
            setInspectionData({
              field: "transmission",
              value: additional.transmissionType,
            }),
          );
        if (additional.driveType)
          dispatch(
            setInspectionData({
              field: "driveTrain",
              value: additional.driveType,
            }),
          );
        if (additional.bodyType)
          dispatch(
            setInspectionData({
              field: "bodyType",
              value: additional.bodyType,
            }),
          );
      }

      Alert.alert(
        "Vehicle info loaded",
        "Vehicle details have been populated.",
      );
    } catch (err) {
      console.error("Error in fetch flow:", err);
      Alert.alert(
        "Fetch failed",
        err?.message ||
          "Failed to fetch vehicle info. Check the VIN and network.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <View style={tw`flex-1 bg-white`}>
          {/* Header */}
          <View style={tw`flex-row items-center mb-6 px-4 pt-4`}>
            <TouchableOpacity onPress={handleBack} style={tw`mr-4`}>
              <AppIcon name="arrow-left" size={24} color="#065f46" />
            </TouchableOpacity>
            <Text style={tw`text-lg font-bold text-green-800 ml-8`}>
              Basic Vehicle Information
            </Text>
          </View>

          {/* Scrollable content */}
          <ScrollView
            style={tw`flex-1 px-4`}
            contentContainerStyle={tw`pb-18`}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Progress Bar*/}
            <View style={tw`w-full h-1 bg-gray-200 rounded-full mb-4`}>
              <View style={tw`w-1/6 h-1 bg-green-600 rounded-full`} />
            </View>

            {/* VIN */}
            <View>
              <Text style={tw`text-gray-500 mb-2`}>VIN/Chassis Number</Text>

              <View style={tw`flex-row items-center`}>
                <TextInput
                  value={vin}
                  onChangeText={(val) => {
                    handleTextChange("vin", val);
                    setVinError("");
                  }}
                  placeholder="Enter VIN/Chassis Number"
                  placeholderTextColor="#0a09094d"
                  style={tw`flex-1 border ${
                    vinError ? "border-red-500" : "border-gray-300"
                  } rounded-lg p-3 bg-white text-base`}
                  autoCapitalize="characters"
                  maxLength={17}
                />

                <TouchableOpacity
                  onPress={() => handleFetchVehicleInfo("vin")}
                  style={tw`ml-2 bg-green-700 px-4 py-3 rounded-lg`}
                  disabled={vinLoading || regoLoading}
                >
                  {vinLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={tw`text-white font-semibold`}>Fetch</Text>
                  )}
                </TouchableOpacity>
              </View>

              {vinError ? (
                <Text style={tw`text-red-600 text-sm mt-1 ml-1`}>
                  {vinError}
                </Text>
              ) : null}
            </View>

            {/* Registration Plate */}
            <View style={tw`mt-6`}>
              <Text style={tw`text-gray-500 mb-2`}>Registration Plate</Text>

              <View style={tw`flex-row items-center`}>
                <TextInput
                  value={registrationPlate}
                  onChangeText={(val) =>
                    handleTextChange("registrationPlate", val)
                  }
                  placeholder="Enter Registration Plate"
                  placeholderTextColor="#0a09094d"
                  style={tw`flex-1 border border-gray-300 rounded-lg p-3 bg-white text-base`}
                  autoCapitalize="characters"
                />

                <TouchableOpacity
                  onPress={() => handleFetchVehicleInfo("rego")}
                  style={tw`ml-2 bg-green-700 px-4 py-3 rounded-lg`}
                  disabled={vinLoading || regoLoading}
                >
                  {regoLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={tw`text-white font-semibold`}>Fetch</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Year */}
            <View style={tw`mt-6`}>
              <Text style={tw`text-gray-500 mb-2`}>Year</Text>
              <TextInput
                value={year}
                onChangeText={(val) => handleTextChange("year", val)}
                placeholder="Enter Year"
                placeholderTextColor="#0a09094d"
                style={tw`border border-gray-300 rounded-lg p-3 bg-white text-base`}
                keyboardType="numeric"
              />
            </View>

            {/* Make */}
            <View style={tw`mt-6`}>
              <Text style={tw`text-gray-500 mb-2`}>Make</Text>
              <TextInput
                value={make}
                onChangeText={(val) => handleTextChange("make", val)}
                placeholder="Enter Make"
                placeholderTextColor="#0a09094d"
                style={tw`border border-gray-300 rounded-lg p-3 bg-white text-base`}
              />
            </View>

            {/* Model */}
            <View style={tw`mt-6`}>
              <Text style={tw`text-gray-500 mb-2`}>Model</Text>
              <TextInput
                value={model}
                onChangeText={(val) => handleTextChange("model", val)}
                placeholder="Enter Model"
                placeholderTextColor="#0a09094d"
                style={tw`border border-gray-300 rounded-lg p-3 bg-white text-base`}
              />
            </View>

            {/* Spec Fields */}
            {renderDropdown("bodyType", bodyTypeOptions)}
            {renderDropdown("fuelType", fuelOptions)}
            {renderDropdown("transmission", transmissionOptions)}
            {renderDropdown("driveTrain", driveTrainOptions)}

            {/* Mileage */}
            <View style={tw`mt-6`}>
              <Text style={tw`text-gray-500 mb-2`}>Mileage</Text>
              <TextInput
                value={String(mileAge)}
                onChangeText={(val) => handleTextChange("mileAge", val)}
                placeholder="Enter Mileage"
                placeholderTextColor="#0a09094d"
                style={tw`border border-gray-300 rounded-lg p-3 bg-white text-base`}
              />
            </View>

            {/* Color */}
            <View style={tw`mt-6`}>
              <Text style={tw`text-gray-500 mb-2`}>Color</Text>
              <TextInput
                value={color}
                onChangeText={(val) => handleTextChange("color", val)}
                placeholder="Enter Color"
                placeholderTextColor="#0a09094d"
                style={tw`border border-gray-300 rounded-lg p-3 bg-white text-base`}
              />
            </View>

            {/* Registration Expiry */}
            <View style={tw`mt-6`}>
              <Text style={tw`text-black mb-2`}>Registration Expiry</Text>

              <TouchableOpacity
                onPress={() => showDatePicker("registrationExpiry")}
                style={tw`border border-gray-300 rounded-lg p-3 bg-white`}
              >
                <Text
                  style={[
                    tw`text-base`,
                    { color: registrationExpiry ? "#000" : "#0a09094d" },
                  ]}
                >
                  {registrationExpiry || "Select Date"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Build & Compliance Dates */}
            <View style={tw`mt-6 flex-row justify-between`}>
              {/* Build Date */}
              <View style={tw`flex-1 mr-2`}>
                <Text style={tw`text-black mb-2`}>Build Date</Text>
                <TouchableOpacity
                  onPress={() => showDatePicker("buildDate")}
                  style={tw`border border-gray-300 rounded-lg p-3 bg-white`}
                >
                  <Text
                    style={[
                      tw`text-base`,
                      { color: buildDate ? "#000" : "#0a09094d" },
                    ]}
                  >
                    {buildDate || "Select Month / Year"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Compliance Date */}
              <View style={tw`flex-1 ml-2`}>
                <Text style={tw`text-black mb-2`}>Compliance Date</Text>
                <TouchableOpacity
                  onPress={() => showDatePicker("complianceDate")}
                  style={tw`border border-gray-300 rounded-lg p-3 bg-white`}
                >
                  <Text
                    style={[
                      tw`text-base`,
                      { color: complianceDate ? "#000" : "#0a09094d" },
                    ]}
                  >
                    {complianceDate || "Select Month / Year"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Keys Present */}
            {/* <View style={tw`mt-6 mb-4`}>
              <Text style={tw`text-black mb-3`}>How Many Keys Present</Text>
              <View style={tw`flex-row justify-between`}>
                {[1, 2, 3].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={tw.style(
                      "flex-1 items-center justify-center border rounded-xl py-2 mx-2 bg-white",
                      keysPresent === `${num}`
                        ? "border-green-400 bg-green-50"
                        : "border-gray-300",
                    )}
                    onPress={() =>
                      dispatch(
                        setInspectionData({
                          field: "keysPresent",
                          value: `${num}`,
                        }),
                      )
                    }
                  >
                    <Image
                      source={
                        num === 1
                          ? require("../../assets/singleKey.png")
                          : num === 2
                            ? require("../../assets/doubleKey.png")
                            : require("../../assets/tripleKey.png")
                      }
                      style={tw`w-14 h-10 mb-3`}
                      resizeMode="contain"
                    />
                    <Text
                      style={tw.style(
                        "font-medium text-base",
                        keysPresent === `${num}`
                          ? "text-green-700"
                          : "text-gray-400",
                      )}
                    >
                      {num} Key{num > 1 ? "s" : ""}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View> */}
          </ScrollView>

          {/* Bottom Button */}
          <View
            style={[
              tw`absolute left-0 right-0 px-4 bg-white`,
              { bottom: Platform.OS === "ios" ? 20 : 10 },
            ]}
          >
            <TouchableOpacity
              style={tw`${isFormComplete ? "bg-green-700" : "bg-gray-300"} py-3 rounded-xl`}
              onPress={validateAndGoNext}
              disabled={!isFormComplete}
            >
              <Text
                style={tw`${isFormComplete ? "text-white" : "text-gray-500"} text-center text-lg font-semibold`}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Pickers... keep your date picker code here unchanged */}
          {/* Registration Expiry → Date Picker */}
          {showPicker === "registrationExpiry" && Platform.OS === "android" && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="calendar"
              onChange={onDateChange}
            />
          )}

          {/* Build Date & Compliance Date → Month Year Picker */}
          {(showPicker === "buildDate" || showPicker === "complianceDate") &&
            Platform.OS === "android" && (
              <MonthYearPicker
                onChange={onMonthYearChange}
                value={date || new Date()}
                minimumDate={new Date(2000, 0)}
                maximumDate={new Date(2035, 11)}
              />
            )}

          {/* iOS Picker modal */}
          {Platform.OS === "ios" && showPicker !== null && (
            <Modal transparent animationType="slide">
              <View style={tw`flex-1 justify-end bg-black/50`}>
                <View style={tw`bg-white rounded-t-2xl p-4`}>
                  {showPicker === "registrationExpiry" ? (
                    <DateTimePicker
                      value={date || new Date()}
                      mode="date"
                      display="spinner"
                      textColor="black"
                      themeVariant="light"
                      onChange={onDateChange}
                    />
                  ) : (
                    <MonthYearPicker
                      onChange={onMonthYearChange}
                      value={date || new Date()}
                    />
                  )}

                  <View style={tw`flex-row justify-end mt-2`}>
                    <TouchableOpacity onPress={() => setShowPicker(null)}>
                      <Text style={tw`text-gray-500 mr-4 text-base`}>
                        Cancel
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        let formatted;
                        if (showPicker === "registrationExpiry") {
                          formatted = date.toLocaleDateString("en-GB");
                        } else {
                          formatted = `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
                        }
                        dispatch(
                          setInspectionData({
                            field: showPicker,
                            value: formatted,
                          }),
                        );
                        setShowPicker(null);
                      }}
                    >
                      <Text style={tw`text-green-700 text-base font-semibold`}>
                        Done
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
}
