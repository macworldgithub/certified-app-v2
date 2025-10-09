import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import tw from "tailwind-react-native-classnames";
import { useDispatch } from "react-redux";
import { setElectrical } from "../redux/slices/inspectionSlice";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import { Header } from "../components/InspectionComponent";
import { useSelector } from "react-redux";
import AppIcon from "../components/AppIcon";
export default function ElectricalChecklist({ navigation }) {
  const dispatch = useDispatch();
  const redux_electrical = useSelector((state) => state.inspection.electrical);

  // ✅ Electrical State
  // const [electrical, setElectricalState] = useState({
  //   lights: { status: "", notes: "", failedBulbs: "", headlightAim: "" },
  //   battery: { voltage: "", ageMonths: "", condition: "", crankPerformance: "", notes: "" },
  //   instrumentCluster: { status: "", notes: "", errorCodes: "", warningIndicators: "" },
  //   airConditioning: { status: "", notes: "", temperatureDropC: "", compressorNoise: "" },
  //   centralLocking: { status: "", notes: "", coverage: "" },
  //   windows: { status: "", notes: "", avgUpDownSpeed: "", binding: "" },
  // });

  const [electrical, setElectricalState] = useState(redux_electrical);
  useEffect(() => {
    console.log("Electrical State Updated:", electrical);
  }, [electrical]);

  // ✅ Dropdown component
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

  // ✅ Text Input
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

  // ✅ Section wrapper
  const renderSection = (title, content) => (
    <View style={tw`mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50`}>
      <Text style={tw`text-base font-bold mb-2 text-green-700`}>{title}</Text>
      {content}
    </View>
  );
  const handleNext = () => {
    dispatch(setElectrical(electrical)); // electrical data save karo
    navigation.navigate("EngineFluidsChecklist");
  };
  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaWrapper>
      <ScrollView style={tw`flex-1 bg-white p-3`}>
        <View style={tw`flex-row items-center mb-6`}>
          <TouchableOpacity onPress={handleBack} style={tw`mr-3`}>
            <AppIcon name="arrow-left" size={24} color="#065f46" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-green-800`}>
            Electrical Checklist
          </Text>
        </View>

        {/* Lights */}
        {renderSection(
          "Lights",
          <>
            {renderDropdown(
              "Status",
              electrical?.lights?.status,
              (v) =>
                setElectricalState({
                  ...electrical,
                  lights: { ...electrical?.lights, status: v },
                }),
              ["Working", "Intermittent", "NotWorking", "NotPresent"]
            )}
            {renderInput("Notes", electrical?.lights?.notes, (v) =>
              setElectricalState({
                ...electrical,
                lights: { ...electrical?.lights, notes: v },
              })
            )}
            {renderInput("Failed Bulbs", electrical?.lights?.failedBulbs, (v) =>
              setElectricalState({
                ...electrical,
                lights: { ...electrical?.lights, failedBulbs: v },
              })
            )}
            {renderDropdown(
              "Headlight Aim",
              electrical?.lights?.headlightAim,
              (v) =>
                setElectricalState({
                  ...electrical,
                  lights: { ...electrical?.lights, headlightAim: v },
                }),
              ["OK", "NeedsAdjust", "Unknown"]
            )}
          </>
        )}

        {/* Battery */}
        {renderSection(
          "Battery",
          <>
            {renderInput(
              "Voltage",
              electrical?.battery?.voltage,
              (v) =>
                setElectricalState({
                  ...electrical,
                  battery: { ...electrical?.battery, voltage: v },
                }),
              true
            )}
            {renderInput(
              "Age (Months)",
              electrical?.battery?.ageMonths,
              (v) =>
                setElectricalState({
                  ...electrical,
                  battery: { ...electrical?.battery, ageMonths: v },
                }),
              true
            )}
            {renderDropdown(
              "Condition",
              electrical?.battery?.condition,
              (v) =>
                setElectricalState({
                  ...electrical,
                  battery: { ...electrical?.battery, condition: v },
                }),
              ["Good", "Fair", "Poor", "Damaged", "NotApplicable"]
            )}
            {renderDropdown(
              "Crank Performance",
              electrical?.battery?.crankPerformance,
              (v) =>
                setElectricalState({
                  ...electrical,
                  battery: { ...electrical?.battery, crankPerformance: v },
                }),
              ["Strong", "Weak", "Unknown"]
            )}
            {renderInput("Notes", electrical?.battery?.notes, (v) =>
              setElectricalState({
                ...electrical,
                battery: { ...electrical?.battery, notes: v },
              })
            )}
          </>
        )}

        {/* Instrument Cluster */}
        {renderSection(
          "Instrument Cluster",
          <>
            {renderDropdown(
              "Status",
              electrical?.instrumentCluster?.status,
              (v) =>
                setElectricalState({
                  ...electrical,
                  instrumentCluster: {
                    ...electrical?.instrumentCluster,
                    status: v,
                  },
                }),
              ["Working", "Intermittent", "NotWorking", "NotPresent"]
            )}
            {renderInput("Notes", electrical?.instrumentCluster?.notes, (v) =>
              setElectricalState({
                ...electrical,
                instrumentCluster: {
                  ...electrical?.instrumentCluster,
                  notes: v,
                },
              })
            )}
            {renderInput(
              "Error Codes",
              electrical?.instrumentCluster?.errorCodes,
              (v) =>
                setElectricalState({
                  ...electrical,
                  instrumentCluster: {
                    ...electrical?.instrumentCluster,
                    errorCodes: v,
                  },
                })
            )}
            {renderInput(
              "Warning Indicators",
              electrical?.instrumentCluster?.warningIndicators,
              (v) =>
                setElectricalState({
                  ...electrical,
                  instrumentCluster: {
                    ...electrical?.instrumentCluster,
                    warningIndicators: v,
                  },
                })
            )}
          </>
        )}

        {/* Air Conditioning */}
        {renderSection(
          "Air Conditioning",
          <>
            {renderDropdown(
              "Status",
              electrical?.airConditioning?.status,
              (v) =>
                setElectricalState({
                  ...electrical,
                  airConditioning: {
                    ...electrical?.airConditioning,
                    status: v,
                  },
                }),
              ["Working", "Intermittent", "NotWorking", "NotPresent"]
            )}
            {renderInput("Notes", electrical?.airConditioning?.notes, (v) =>
              setElectricalState({
                ...electrical,
                airConditioning: { ...electrical?.airConditioning, notes: v },
              })
            )}
            {renderInput(
              "Temperature Drop (°C)",
              electrical?.airConditioning?.temperatureDropC,
              (v) =>
                setElectricalState({
                  ...electrical,
                  airConditioning: {
                    ...electrical?.airConditioning,
                    temperatureDropC: v,
                  },
                }),
              true
            )}
            {renderDropdown(
              "Compressor Noise",
              electrical?.airConditioning?.compressorNoise,
              (v) =>
                setElectricalState({
                  ...electrical,
                  airConditioning: {
                    ...electrical?.airConditioning,
                    compressorNoise: v,
                  },
                }),
              ["None", "Mild", "Severe", "Unknown"]
            )}
          </>
        )}

        {/* Central Locking */}
        {renderSection(
          "Central Locking",
          <>
            {renderDropdown(
              "Status",
              electrical?.centralLocking?.status,
              (v) =>
                setElectricalState({
                  ...electrical,
                  centralLocking: { ...electrical?.centralLocking, status: v },
                }),
              ["Working", "Intermittent", "NotWorking", "NotPresent"]
            )}
            {renderInput("Notes", electrical?.centralLocking?.notes, (v) =>
              setElectricalState({
                ...electrical,
                centralLocking: { ...electrical?.centralLocking, notes: v },
              })
            )}
            {renderDropdown(
              "Coverage",
              electrical?.centralLocking?.coverage,
              (v) =>
                setElectricalState({
                  ...electrical,
                  centralLocking: {
                    ...electrical?.centralLocking,
                    coverage: v,
                  },
                }),
              ["AllDoors", "SomeDoors", "None", "NotPresent"]
            )}
          </>
        )}

        {/* Windows */}
        {renderSection(
          "Windows",
          <>
            {renderDropdown(
              "Status",
              electrical?.windows?.status,
              (v) =>
                setElectricalState({
                  ...electrical,
                  windows: { ...electrical?.windows, status: v },
                }),
              ["Working", "Intermittent", "NotWorking", "NotPresent"]
            )}
            {renderInput("Notes", electrical?.windows?.notes, (v) =>
              setElectricalState({
                ...electrical,
                windows: { ...electrical?.windows, notes: v },
              })
            )}
            {renderDropdown(
              "Avg Up/Down Speed",
              electrical?.windows?.avgUpDownSpeed,
              (v) =>
                setElectricalState({
                  ...electrical,
                  windows: { ...electrical?.windows, avgUpDownSpeed: v },
                }),
              ["Fast", "Normal", "Slow", "Unknown"]
            )}
            {renderDropdown(
              "Binding",
              electrical?.windows?.binding,
              (v) =>
                setElectricalState({
                  ...electrical,
                  windows: { ...electrical?.windows, binding: v },
                }),
              ["Yes", "No", "Unknown"]
            )}
          </>
        )}

        {/* ✅ Next Button */}
        <TouchableOpacity
          style={tw`bg-green-700 py-2 rounded-lg mt-4 mb-12`}
          onPress={handleNext}
        >
          <Text style={tw`text-white text-center font-semibold text-base`}>
            Next
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
