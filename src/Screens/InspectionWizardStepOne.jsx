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
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import { setInspectionData } from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import DateTimePicker from "@react-native-community/datetimepicker";

// Import the infoAgent API helpers
import {
  fetchAndStoreInfoAgentToken,
  fetchVehicleReport,
  getVehicleBasicInfo,
  getVehicleAdditionalInfo,
} from "../../utils/infoAgentApi";

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
  } = useSelector((state) => state.inspection);

  const [showPicker, setShowPicker] = useState(null); // "registrationExpiry" | "buildDate" | "complianceDate"
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [vinError, setVinError] = useState("");

  const handleTextChange = (field, value) => {
    dispatch(setInspectionData({ field, value }));
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

    navigation.navigate("InspectionWizardStepTwo");
  };

  // --- New: fetch vehicle info flow ---
  // const handleFetchVehicleInfo = async () => {
  //   // Basic validation
  //   if (!vin || vin.trim().length === 0) {
  //     Alert.alert(
  //       "VIN required",
  //       "Please enter a VIN/Chassis number before fetching."
  //     );
  //     return;
  //   }

  //   // Optionally check length 17 (common for VINs) — not mandatory
  //   // if (vin.trim().length < 10) { /* ignore or warn */ }

  //   try {
  //     setLoading(true);

  //     // 1) Ensure token present
  //     await fetchAndStoreInfoAgentToken();

  //     // 2) Call vehicle report endpoint (stores report in AsyncStorage inside api util)
  //     await fetchVehicleReport(vin.trim());

  //     // 3) Read basic info from saved report
  //     const basic = await getVehicleBasicInfo();
  //     // console.log("info", basic);
  //     if (basic) {
  //       // Map fields to your redux fields (use defensive checks)
  //       // console.log("Basic info", basic);
  //       if (basic.year)
  //         dispatch(
  //           setInspectionData({ field: "year", value: String(basic.year) })
  //         );

  //       if (basic.make)
  //         dispatch(setInspectionData({ field: "make", value: basic.make }));
  //       if (basic.model)
  //         dispatch(setInspectionData({ field: "model", value: basic.model }));
  //       if (basic.mileAge)
  //         dispatch(
  //           setInspectionData({ field: "mileAge", value: basic.mileAge })
  //         );

  //       // buildDate / compliancePlate (naming depends on API). Basic util returned buildDate & compliancePlate
  //       if (basic.buildDate)
  //         dispatch(
  //           setInspectionData({ field: "buildDate", value: basic.buildDate })
  //         );
  //       if (basic.compliancePlate)
  //         dispatch(
  //           setInspectionData({
  //             field: "complianceDate",
  //             value: basic.compliancePlate,
  //           })
  //         );

  //       // identification plate
  //       if (basic.plate)
  //         dispatch(
  //           setInspectionData({
  //             field: "registrationPlate",
  //             value: basic.plate,
  //           })
  //         );
  //     } else {
  //       // basic null -> warn the user but continue to try additional info
  //       console.warn("No basic info read from vehicleReport.");
  //     }

  //     // 4) Read additional info if you want to store/use it
  //     const additional = await getVehicleAdditionalInfo();
  //     if (additional) {
  //       console.log("Additional info", additional);
  //       // Example: if you want to store colour, fuelType etc. in inspection state,
  //       // either extend your redux slice or temporarily store them under other fields.
  //       // Below I show dispatches to fields named fuelType, driveType, etc.
  //       if (additional.colour)
  //         dispatch(
  //           setInspectionData({ field: "color", value: additional.colour })
  //         );
  //       if (additional.fuelType)
  //         dispatch(
  //           setInspectionData({ field: "fuelType", value: additional.fuelType })
  //         );
  //       if (additional.transmissionType)
  //         dispatch(
  //           setInspectionData({
  //             field: "transmission",
  //             value: additional.transmissionType,
  //           })
  //         );
  //       if (additional.driveType)
  //         dispatch(
  //           setInspectionData({
  //             field: "driveTrain",
  //             value: additional.driveType,
  //           })
  //         );
  //       if (additional.bodyType)
  //         dispatch(
  //           setInspectionData({ field: "bodyType", value: additional.bodyType })
  //         );
  //     }

  //     Alert.alert(
  //       "Vehicle info loaded",
  //       "Vehicle details have been populated from InfoAgent."
  //     );
  //   } catch (err) {
  //     console.error("Error in fetch flow:", err);
  //     // Show friendly message
  //     Alert.alert(
  //       "Fetch failed",
  //       err?.message ||
  //         "Failed to fetch vehicle info. Check the VIN and network."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
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
            style={tw`px-4`}
            contentContainerStyle={tw`pb-10`}
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
                  style={tw`flex-1 border ${
                    vinError ? "border-red-500" : "border-gray-300"
                  } rounded-lg p-3 bg-white text-base`}
                  autoCapitalize="characters"
                  maxLength={17}
                />

                {/* <TouchableOpacity
                  onPress={handleFetchVehicleInfo}
                  style={tw`ml-2 bg-green-700 px-4 py-3 rounded-lg`}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={tw`text-white font-semibold`}>Fetch</Text>
                  )}
                </TouchableOpacity> */}
              </View>

              {vinError ? (
                <Text style={tw`text-red-600 text-sm mt-1 ml-1`}>
                  {vinError}
                </Text>
              ) : null}
            </View>

            {/* Year */}
            <View style={tw`mt-6`}>
              <Text style={tw`text-gray-500 mb-2`}>Year</Text>
              <TextInput
                value={year}
                onChangeText={(val) => handleTextChange("year", val)}
                placeholder="Enter Year"
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
                style={tw`border border-gray-300 rounded-lg p-3 bg-white text-base`}
              />
            </View>

            {/* Mileage */}
            <View style={tw`mt-6`}>
              <Text style={tw`text-gray-500 mb-2`}>Mileage</Text>
              <TextInput
                value={String(mileAge)}
                onChangeText={(val) => handleTextChange("mileAge", val)}
                placeholder="Enter Mileage"
                style={tw`border border-gray-300 rounded-lg p-3 bg-white text-base`}
              />
            </View>

            {/* Registration Plate & Expiry */}
            <View style={tw`mt-6 flex-row justify-between`}>
              <View style={tw`flex-1 mr-2`}>
                <Text style={tw`text-gray-500 mb-2`}>Registration Plate</Text>
                <TextInput
                  value={registrationPlate}
                  onChangeText={(val) =>
                    handleTextChange("registrationPlate", val)
                  }
                  placeholder="Enter Registration Plate"
                  style={tw`border border-gray-300 rounded-lg p-3 bg-white text-xs`}
                />
              </View>

              <View style={tw`flex-1 ml-2`}>
                <Text style={tw`text-gray-500 mb-2`}>Registration Expiry</Text>
                <TouchableOpacity
                  onPress={() => showDatePicker("registrationExpiry")}
                  style={tw`border border-gray-300 rounded-lg p-3 bg-white`}
                >
                  <Text style={tw`text-base text-gray-800`}>
                    {registrationExpiry || "Select Date"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Build & Compliance Dates */}
            <View style={tw`mt-6 flex-row justify-between`}>
              <View style={tw`flex-1 mr-2`}>
                <Text style={tw`text-gray-500 mb-2`}>Build Date</Text>
                <TouchableOpacity
                  onPress={() => showDatePicker("buildDate")}
                  style={tw`border border-gray-300 rounded-lg p-3 bg-white`}
                >
                  <Text style={tw`text-base text-gray-800`}>
                    {buildDate || "Select Date"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={tw`flex-1 ml-2`}>
                <Text style={tw`text-gray-500 mb-2`}>Compliance Date</Text>
                <TouchableOpacity
                  onPress={() => showDatePicker("complianceDate")}
                  style={tw`border border-gray-300 rounded-lg p-3 bg-white`}
                >
                  <Text style={tw`text-base text-gray-800`}>
                    {complianceDate || "Select Date"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Button */}
          <View style={tw` bottom-0 left-0 right-0 px-4 mb-2 bg-white`}>
            <TouchableOpacity
              style={tw`bg-green-700 py-3 rounded-xl`}
              // onPress={handleNext}
              onPress={validateAndGoNext}
            >
              <Text style={tw`text-white text-center text-lg font-semibold`}>
                Next
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Pickers... keep your date picker code here unchanged */}
          {showPicker && Platform.OS === "android" && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date || new Date()}
              mode="date"
              display="calendar"
              onChange={onDateChange}
            />
          )}

          {/* iOS Picker modal */}
          {showPicker && Platform.OS === "ios" && (
            <Modal transparent animationType="slide">
              <View style={tw`flex-1 justify-end bg-black/50`}>
                <View style={tw`bg-white rounded-t-2xl p-4`}>
                  <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={onDateChange}
                  />

                  <View style={tw`flex-row justify-end mt-2`}>
                    <TouchableOpacity onPress={() => setShowPicker(null)}>
                      <Text style={tw`text-gray-500 mr-4 text-base`}>
                        Cancel
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        const formatted = date.toLocaleDateString("en-GB");
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
