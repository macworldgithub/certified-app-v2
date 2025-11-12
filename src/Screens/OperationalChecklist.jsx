import React, { use, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  setOperational,
  resetInspection,
} from "../redux/slices/inspectionSlice";
import axios from "axios";
import { buildInspectionPayload } from "../../utils/buildInspectionPayload";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import API_BASE_URL from "../../utils/config";
import AppIcon from "../components/AppIcon";
import { useEffect } from "react";
import { Header } from "../components/InspectionComponent";

export default function OperationalChecklist({ navigation }) {
  const dispatch = useDispatch();
  const inspectionData = useSelector((state) => state.inspection);
  const redux_operational = useSelector(
    (state) => state.inspection.operational
  );
  // console.log(inspectionData);
  // console.log("mileage", inspectionData.inspectionDetails);
  const createInspection = async (inspectionPayload) => {
    try {
      const response = await axios.post(
        // "http://192.168.18.11:5000/inspections",
        `${API_BASE_URL}/inspections`,
        inspectionPayload,
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      console.log("✅ Inspection created:", response.data);
      return response.data;
    } catch (err) {
      console.error(
        "❌ Error creating inspection:",
        err.response?.data || err.message
      );
      throw err;
    }
  };

  // const [operational, setOperationalState] = useState({
  //   start: { success: "", crankTimeSeconds: "", notes: "" },
  //   steering: { freePlayMm: "", pull: "", alignmentRecommended: "", notes: "" },
  //   suspension: { condition: "", noises: "", bounceTestResult: "", notes: "" },
  //   noises: { present: "", source: "", when: "", notes: "" },
  //   drivetrain: { vibration: "", shiftQuality: "", clutchSlip: "", notes: "" },
  //   warningLights: { active: "", notes: "" },
  //   temperature: { withinNormalRange: "", maxObservedC: "", notes: "" },
  //   brakes: {
  //     pedalFeel: "",
  //     stoppingDistanceM: "",
  //     pulls: "",
  //     absLight: "",
  //     notes: "",
  //   },
  //   serviceHistory: {
  //     available: "",
  //     lastServiceKm: "",
  //     lastServiceDate: "",
  //     records: "",
  //     notes: "",
  //   },
  //   keys: { count: "", remoteWorking: "", immobilizerPresent: "", notes: "" },
  // });
  const [operational, setOperationalState] = useState(redux_operational);
  useEffect(() => {
    console.log("Operational State Updated:", operational);
  }, [operational]);

  // ✅ Dropdown Component
  const renderDropdown = (label, value, onChange, options) => (
    <View style={tw`mb-2`}>
      <Text style={tw`text-sm font-semibold mb-1`}>{label}</Text>
      <View style={tw`border border-gray-300 rounded-md`}>
        <Picker selectedValue={value} onValueChange={onChange}>
          <Picker.Item label={`Select ${label}`} value="" color="black" />
          {options.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} color="black" />
          ))}
        </Picker>
      </View>
    </View>
  );

  // ✅ Input Component
  const renderInput = (label, value, onChange, numeric = false) => (
    <View style={tw`mb-2`}>
      <Text style={tw`text-sm font-semibold mb-1`}>{label}</Text>
      <TextInput
        placeholder={label}
        value={value}
        onChangeText={onChange}
        keyboardType={numeric ? "numeric" : "default"}
        style={tw`border border-gray-300 rounded-md px-2 py-1`}
      />
    </View>
  );

  // ✅ Section Wrapper
  const renderSection = (title, content) => (
    <View style={tw`mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50`}>
      <Text style={tw`text-base font-bold mb-2 text-green-700`}>{title}</Text>
      {content}
    </View>
  );

  const handleSubmit = async () => {
    try {
      dispatch(setOperational(operational));
      // console.log("Testing", inspectionData.carModel);
      // console.log("Testing", inspectionData.year);

      // ✅ Validate required data
      if (
        !inspectionData.vin ||
        !inspectionData.make ||
        !inspectionData.carModel ||
        !inspectionData.year
      ) {
        Alert.alert(
          "❌ Missing Data",
          "Please fill VIN, Make, Model, and Year before submitting."
        );
        return;
      }
      // console.log("Mileage", inspectionData.inspectionDetail);
      const finalPayload = {
        vin: inspectionData.vin,
        make: inspectionData.make,
        carModel: inspectionData.carModel,
        year: inspectionData.year,
        engineNumber: inspectionData.engineNumber,
        mileAge: inspectionData.mileAge,

        // Images (object-based)
        frontImage: inspectionData.images.frontImage,
        rearImage: inspectionData.images.rearImage,
        leftImage: inspectionData.images.leftImage,
        rightImage: inspectionData.images.rightImage,

        // Checklists (object-based)
        body: inspectionData.body,
        electrical: inspectionData.electrical,
        engineFluids: inspectionData.engineFluids,
        operational: inspectionData.operational,

        inspectorEmail: "muhammadanasrashid18@gmail.com", // ✅ hardcoded
      };

      // ✅ Remove undefined/null before sending
      const cleanPayload = JSON.parse(JSON.stringify(finalPayload));
      console.log("📦 Final Clean Payload:", cleanPayload);

      await createInspection(cleanPayload);

      dispatch(resetInspection());
      Alert.alert("✅ Success", "Inspection created successfully!");
      navigation.navigate("MainTabs");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        err.message;
      console.error("❌ Submit failed:", errorMsg);
      Alert.alert("❌ Error", errorMsg);
    }
  };
  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaWrapper>
      <ScrollView style={tw`flex-1 bg-white p-3`}>
        <View style={tw`flex-row items-center mb-6`}>
          <TouchableOpacity onPress={handleBack} style={tw`mr-3`}>
            <AppIcon name="arrow-left" size={24} color="#065f46" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-green-800`}>Operational</Text>
        </View>
        {/* Start */}
        {renderSection(
          "Start",
          <>
            {renderDropdown(
              "Success",
              operational?.start?.success,
              (v) =>
                setOperationalState({
                  ...operational,
                  start: { ...(operational?.start || {}), success: v },
                }),
              ["FirstTry", "MultipleTries", "NoStart", "Unknown"]
            )}
            {renderInput(
              "Crank Time (sec)",
              operational?.start?.crankTimeSeconds,
              (v) =>
                setOperationalState({
                  ...operational,
                  start: { ...(operational?.start || {}), crankTimeSeconds: v },
                }),
              true
            )}
            {renderInput("Notes", operational?.start?.notes, (v) =>
              setOperationalState({
                ...operational,
                start: { ...(operational?.start || {}), notes: v },
              })
            )}
          </>
        )}

        {/* Service History */}
        {renderSection(
          "Service History",
          <>
            {renderDropdown(
              "Available",
              operational?.serviceHistory?.available,
              (v) =>
                setOperationalState({
                  ...operational,
                  serviceHistory: {
                    ...(operational?.serviceHistory || {}),
                    available: v,
                  },
                }),
              ["Yes", "No", "Partial"]
            )}
            {renderInput(
              "Last Service Km",
              operational?.serviceHistory?.lastServiceKm,
              (v) =>
                setOperationalState({
                  ...operational,
                  serviceHistory: {
                    ...(operational?.serviceHistory || {}),
                    lastServiceKm: v,
                  },
                }),
              true
            )}
            {renderInput(
              "Last Service Date",
              operational?.serviceHistory?.lastServiceDate,
              (v) =>
                setOperationalState({
                  ...operational,
                  serviceHistory: {
                    ...(operational?.serviceHistory || {}),
                    lastServiceDate: v,
                  },
                })
            )}
            {renderInput("Records", operational?.serviceHistory?.records, (v) =>
              setOperationalState({
                ...operational,
                serviceHistory: {
                  ...(operational?.serviceHistory || {}),
                  records: v,
                },
              })
            )}
            {renderInput("Notes", operational?.serviceHistory?.notes, (v) =>
              setOperationalState({
                ...operational,
                serviceHistory: {
                  ...(operational?.serviceHistory || {}),
                  notes: v,
                },
              })
            )}
          </>
        )}

        {/* Keys */}
        {renderSection(
          "Keys",
          <>
            {renderInput(
              "Count",
              operational?.keys?.count,
              (v) =>
                setOperationalState({
                  ...operational,
                  keys: { ...(operational?.keys || {}), count: v },
                }),
              true
            )}
            {renderDropdown(
              "Remote Working",
              operational?.keys?.remoteWorking,
              (v) =>
                setOperationalState({
                  ...operational,
                  keys: { ...(operational?.keys || {}), remoteWorking: v },
                }),
              ["Yes", "No", "Some"]
            )}
            {renderDropdown(
              "Immobilizer Present",
              operational?.keys?.immobilizerPresent,
              (v) =>
                setOperationalState({
                  ...operational,
                  keys: { ...(operational?.keys || {}), immobilizerPresent: v },
                }),
              ["Yes", "No", "Unknown"]
            )}
            {renderInput("Notes", operational?.keys?.notes, (v) =>
              setOperationalState({
                ...operational,
                keys: { ...(operational?.keys || {}), notes: v },
              })
            )}
          </>
        )}

        {/* ✅ Submit Button */}
        <TouchableOpacity
          style={tw`bg-green-700 py-2 rounded-lg mt-4 mb-12`}
          onPress={handleSubmit}
        >
          <Text style={tw`text-white text-center font-semibold text-base`}>
            Submit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
