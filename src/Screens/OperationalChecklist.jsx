import React, { useState } from "react";
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
import { API_BASE_URL_Prod } from "../../utils/config";


export default function OperationalChecklist({ navigation }) {
  const dispatch = useDispatch();
  const inspectionData = useSelector((state) => state.inspection);
  // console.log(inspectionData);
  // console.log("mileage", inspectionData.inspectionDetails);
  const createInspection = async (inspectionPayload) => {
    try {
      const response = await axios.post(
        // "http://192.168.18.11:5000/inspections",
        `${API_BASE_URL_Prod}/inspections`,
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

  const [operational, setOperationalState] = useState({
    start: { success: "", crankTimeSeconds: "", notes: "" },
    steering: { freePlayMm: "", pull: "", alignmentRecommended: "", notes: "" },
    suspension: { condition: "", noises: "", bounceTestResult: "", notes: "" },
    noises: { present: "", source: "", when: "", notes: "" },
    drivetrain: { vibration: "", shiftQuality: "", clutchSlip: "", notes: "" },
    warningLights: { active: "", notes: "" },
    temperature: { withinNormalRange: "", maxObservedC: "", notes: "" },
    brakes: {
      pedalFeel: "",
      stoppingDistanceM: "",
      pulls: "",
      absLight: "",
      notes: "",
    },
    serviceHistory: {
      available: "",
      lastServiceKm: "",
      lastServiceDate: "",
      records: "",
      notes: "",
    },
    keys: { count: "", remoteWorking: "", immobilizerPresent: "", notes: "" },
  });

  // ✅ Dropdown Component
  const renderDropdown = (label, value, onChange, options) => (
    <View style={tw`mb-2`}>
      <Text style={tw`text-sm font-semibold mb-1`}>{label}</Text>
      <View style={tw`border border-gray-300 rounded-md`}>
        <Picker selectedValue={value} onValueChange={onChange}>
          <Picker.Item label={`Select ${label}`} value="" color="black"/>
          {options.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} color="black"/>
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

        checklist: {
          body: inspectionData.bodyChecklist,
          electrical: inspectionData.electricalChecklist,
          engineFluids: inspectionData.engineFluidsChecklist,
          operational: inspectionData.operationalChecklist,
          other: inspectionData.otherChecklist || {},
        },

        inspectorEmail: "m.ahmed.fahim02@gmail.com", // ✅ hardcoded
      };

      // ✅ Remove undefined/null before sending
      const cleanPayload = JSON.parse(JSON.stringify(finalPayload));
      console.log("📦 Final Clean Payload:", cleanPayload);

      await createInspection(cleanPayload);

      dispatch(resetInspection());
      Alert.alert("✅ Success", "Inspection created successfully!");
      navigation.navigate("Home");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        err.message;
      console.error("❌ Submit failed:", errorMsg);
      Alert.alert("❌ Error", errorMsg);
    }
  };

  return (
   <SafeAreaWrapper>
     <ScrollView style={tw`flex-1 bg-white p-3`}>
      <Text style={tw`text-xl font-bold mb-4 text-green-800 `}>
        Operational Inspection
      </Text>

      {/* Start */}
      {renderSection(
        "Start",
        <>
          {renderDropdown(
            "Success",
            operational.start.success,
            (v) =>
              setOperationalState({
                ...operational,
                start: { ...operational.start, success: v },
              }),
            ["FirstTry", "MultipleTries", "NoStart", "Unknown"]
          )}
          {renderInput(
            "Crank Time (sec)",
            operational.start.crankTimeSeconds,
            (v) =>
              setOperationalState({
                ...operational,
                start: { ...operational.start, crankTimeSeconds: v },
              }),
            true
          )}
          {renderInput("Notes", operational.start.notes, (v) =>
            setOperationalState({
              ...operational,
              start: { ...operational.start, notes: v },
            })
          )}
        </>
      )}

      {/* Steering */}
      {renderSection(
        "Steering",
        <>
          {renderInput(
            "Free Play (mm)",
            operational.steering.freePlayMm,
            (v) =>
              setOperationalState({
                ...operational,
                steering: { ...operational.steering, freePlayMm: v },
              }),
            true
          )}
          {renderDropdown(
            "Pull",
            operational.steering.pull,
            (v) =>
              setOperationalState({
                ...operational,
                steering: { ...operational.steering, pull: v },
              }),
            ["None", "Left", "Right"]
          )}
          {renderDropdown(
            "Alignment Recommended",
            operational.steering.alignmentRecommended,
            (v) =>
              setOperationalState({
                ...operational,
                steering: { ...operational.steering, alignmentRecommended: v },
              }),
            ["Yes", "No", "Unknown"]
          )}
          {renderInput("Notes", operational.steering.notes, (v) =>
            setOperationalState({
              ...operational,
              steering: { ...operational.steering, notes: v },
            })
          )}
        </>
      )}

      {/* Suspension */}
      {renderSection(
        "Suspension",
        <>
          {renderDropdown(
            "Condition",
            operational.suspension.condition,
            (v) =>
              setOperationalState({
                ...operational,
                suspension: { ...operational.suspension, condition: v },
              }),
            ["Good", "Firm", "Soft", "Noisy", "Unknown"]
          )}
          {renderInput("Noises", operational.suspension.noises, (v) =>
            setOperationalState({
              ...operational,
              suspension: { ...operational.suspension, noises: v },
            })
          )}
          {renderDropdown(
            "Bounce Test Result",
            operational.suspension.bounceTestResult,
            (v) =>
              setOperationalState({
                ...operational,
                suspension: { ...operational.suspension, bounceTestResult: v },
              }),
            ["Pass", "Fail", "NotTested"]
          )}
          {renderInput("Notes", operational.suspension.notes, (v) =>
            setOperationalState({
              ...operational,
              suspension: { ...operational.suspension, notes: v },
            })
          )}
        </>
      )}

      {/* Noises */}
      {renderSection(
        "Noises",
        <>
          {renderDropdown(
            "Present",
            operational.noises.present,
            (v) =>
              setOperationalState({
                ...operational,
                noises: { ...operational.noises, present: v },
              }),
            ["None", "Mild", "Severe"]
          )}
          {renderInput("Source", operational.noises.source, (v) =>
            setOperationalState({
              ...operational,
              noises: { ...operational.noises, source: v },
            })
          )}
          {renderInput("When", operational.noises.when, (v) =>
            setOperationalState({
              ...operational,
              noises: { ...operational.noises, when: v },
            })
          )}
          {renderInput("Notes", operational.noises.notes, (v) =>
            setOperationalState({
              ...operational,
              noises: { ...operational.noises, notes: v },
            })
          )}
        </>
      )}

      {/* Drivetrain */}
      {renderSection(
        "Drivetrain",
        <>
          {renderDropdown(
            "Vibration",
            operational.drivetrain.vibration,
            (v) =>
              setOperationalState({
                ...operational,
                drivetrain: { ...operational.drivetrain, vibration: v },
              }),
            ["None", "Mild", "Severe"]
          )}
          {renderDropdown(
            "Shift Quality",
            operational.drivetrain.shiftQuality,
            (v) =>
              setOperationalState({
                ...operational,
                drivetrain: { ...operational.drivetrain, shiftQuality: v },
              }),
            ["Smooth", "Acceptable", "Harsh", "NotApplicable"]
          )}
          {renderDropdown(
            "Clutch Slip",
            operational.drivetrain.clutchSlip,
            (v) =>
              setOperationalState({
                ...operational,
                drivetrain: { ...operational.drivetrain, clutchSlip: v },
              }),
            ["Yes", "No", "Unknown"]
          )}
          {renderInput("Notes", operational.drivetrain.notes, (v) =>
            setOperationalState({
              ...operational,
              drivetrain: { ...operational.drivetrain, notes: v },
            })
          )}
        </>
      )}

      {/* Warning Lights */}
      {renderSection(
        "Warning Lights",
        <>
          {renderInput("Active Lights", operational.warningLights.active, (v) =>
            setOperationalState({
              ...operational,
              warningLights: { ...operational.warningLights, active: v },
            })
          )}
          {renderInput("Notes", operational.warningLights.notes, (v) =>
            setOperationalState({
              ...operational,
              warningLights: { ...operational.warningLights, notes: v },
            })
          )}
        </>
      )}

      {/* Temperature */}
      {renderSection(
        "Temperature",
        <>
          {renderDropdown(
            "Within Normal Range",
            operational.temperature.withinNormalRange,
            (v) =>
              setOperationalState({
                ...operational,
                temperature: {
                  ...operational.temperature,
                  withinNormalRange: v,
                },
              }),
            ["Yes", "No", "Unknown"]
          )}
          {renderInput(
            "Max Observed °C",
            operational.temperature.maxObservedC,
            (v) =>
              setOperationalState({
                ...operational,
                temperature: { ...operational.temperature, maxObservedC: v },
              }),
            true
          )}
          {renderInput("Notes", operational.temperature.notes, (v) =>
            setOperationalState({
              ...operational,
              temperature: { ...operational.temperature, notes: v },
            })
          )}
        </>
      )}

      {/* Brakes */}
      {renderSection(
        "Brakes",
        <>
          {renderDropdown(
            "Pedal Feel",
            operational.brakes.pedalFeel,
            (v) =>
              setOperationalState({
                ...operational,
                brakes: { ...operational.brakes, pedalFeel: v },
              }),
            ["Firm", "Soft", "Spongy", "Unknown"]
          )}
          {renderInput(
            "Stopping Distance (m)",
            operational.brakes.stoppingDistanceM,
            (v) =>
              setOperationalState({
                ...operational,
                brakes: { ...operational.brakes, stoppingDistanceM: v },
              }),
            true
          )}
          {renderDropdown(
            "Pulls",
            operational.brakes.pulls,
            (v) =>
              setOperationalState({
                ...operational,
                brakes: { ...operational.brakes, pulls: v },
              }),
            ["None", "Left", "Right", "Unknown"]
          )}
          {renderDropdown(
            "ABS Light",
            operational.brakes.absLight,
            (v) =>
              setOperationalState({
                ...operational,
                brakes: { ...operational.brakes, absLight: v },
              }),
            ["On", "Off", "NoABS"]
          )}
          {renderInput("Notes", operational.brakes.notes, (v) =>
            setOperationalState({
              ...operational,
              brakes: { ...operational.brakes, notes: v },
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
            operational.serviceHistory.available,
            (v) =>
              setOperationalState({
                ...operational,
                serviceHistory: { ...operational.serviceHistory, available: v },
              }),
            ["Yes", "No", "Partial"]
          )}
          {renderInput(
            "Last Service Km",
            operational.serviceHistory.lastServiceKm,
            (v) =>
              setOperationalState({
                ...operational,
                serviceHistory: {
                  ...operational.serviceHistory,
                  lastServiceKm: v,
                },
              }),
            true
          )}
          {renderInput(
            "Last Service Date",
            operational.serviceHistory.lastServiceDate,
            (v) =>
              setOperationalState({
                ...operational,
                serviceHistory: {
                  ...operational.serviceHistory,
                  lastServiceDate: v,
                },
              })
          )}
          {renderInput("Records", operational.serviceHistory.records, (v) =>
            setOperationalState({
              ...operational,
              serviceHistory: { ...operational.serviceHistory, records: v },
            })
          )}
          {renderInput("Notes", operational.serviceHistory.notes, (v) =>
            setOperationalState({
              ...operational,
              serviceHistory: { ...operational.serviceHistory, notes: v },
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
            operational.keys.count,
            (v) =>
              setOperationalState({
                ...operational,
                keys: { ...operational.keys, count: v },
              }),
            true
          )}
          {renderDropdown(
            "Remote Working",
            operational.keys.remoteWorking,
            (v) =>
              setOperationalState({
                ...operational,
                keys: { ...operational.keys, remoteWorking: v },
              }),
            ["Yes", "No", "Some"]
          )}
          {renderDropdown(
            "Immobilizer Present",
            operational.keys.immobilizerPresent,
            (v) =>
              setOperationalState({
                ...operational,
                keys: { ...operational.keys, immobilizerPresent: v },
              }),
            ["Yes", "No", "Unknown"]
          )}
          {renderInput("Notes", operational.keys.notes, (v) =>
            setOperationalState({
              ...operational,
              keys: { ...operational.keys, notes: v },
            })
          )}
        </>
      )}
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
