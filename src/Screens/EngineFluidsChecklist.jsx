import React, { useState } from "react";
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
import { setFluids } from "../redux/slices/inspectionSlice";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Header } from "../components/InspectionComponent";
import AppIcon from "../components/AppIcon";
export default function EngineFluidsChecklist({ navigation }) {
  const dispatch = useDispatch();
  const redux_engineFluids = useSelector(
    (state) => state.inspection.engineFluids
  );

  // ✅ Engine Fluids State
  // const [engineFluids, setEngineFluids] = useState({
  //   engineOil: { level: "", condition: "", notes: "" },
  //   coolant: { level: "", condition: "", notes: "" },
  //   transmissionFluid: { level: "", condition: "", notes: "" },
  //   brakeFluid: { level: "", condition: "", notes: "" },
  //   powerSteeringFluid: { level: "", condition: "", notes: "" },
  //   windshieldWasher: { level: "", condition: "", notes: "" },
  // });
  // ✅ Engine Fluids State
  const [engineFluids, setEngineFluids] = useState(redux_engineFluids);
  useEffect(() => {
    console.log("Engine Fluids State Updated:", engineFluids);
  }, [engineFluids]);

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

  const renderSection = (title, content) => (
    <View style={tw`mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50`}>
      <Text style={tw`text-base font-bold mb-2 text-green-700`}>{title}</Text>
      {content}
    </View>
  );
  const handleNext = () => {
    dispatch(setFluids(engineFluids));
    navigation.navigate("OperationalChecklist");
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
            Engine Fluids
          </Text>
        </View>
        {/* Engine Oil */}
        {renderSection(
          "Engine Oil",
          <>
            {renderDropdown(
              "Level",
              engineFluids?.engineOil?.level,
              (v) =>
                setEngineFluids({
                  ...engineFluids,
                  engineOil: { ...(engineFluids?.engineOil || {}), level: v },
                }),
              ["Full", "Low", "Empty", "Unknown"]
            )}
            {renderDropdown(
              "Condition",
              engineFluids?.engineOil?.condition,
              (v) =>
                setEngineFluids({
                  ...engineFluids,
                  engineOil: {
                    ...(engineFluids?.engineOil || {}),
                    condition: v,
                  },
                }),
              ["Good", "Dirty", "Leaking", "Unknown"]
            )}
            {renderInput("Notes", engineFluids?.engineOil?.notes, (v) =>
              setEngineFluids({
                ...engineFluids,
                engineOil: { ...(engineFluids?.engineOil || {}), notes: v },
              })
            )}
          </>
        )}

        {/* Coolant */}
        {renderSection(
          "Coolant",
          <>
            {renderDropdown(
              "Level",
              engineFluids?.coolant?.level,
              (v) =>
                setEngineFluids({
                  ...engineFluids,
                  coolant: { ...(engineFluids?.coolant || {}), level: v },
                }),
              ["Full", "Low", "Empty", "Unknown"]
            )}
            {renderDropdown(
              "Condition",
              engineFluids?.coolant?.condition,
              (v) =>
                setEngineFluids({
                  ...engineFluids,
                  coolant: { ...(engineFluids?.coolant || {}), condition: v },
                }),
              ["Good", "Contaminated", "Leaking", "Unknown"]
            )}
            {renderInput("Notes", engineFluids?.coolant?.notes, (v) =>
              setEngineFluids({
                ...engineFluids,
                coolant: { ...(engineFluids?.coolant || {}), notes: v },
              })
            )}
          </>
        )}

        {/* Transmission Fluid */}
        {renderSection(
          "Transmission Fluid",
          <>
            {renderDropdown(
              "Level",
              engineFluids?.transmissionFluid?.level,
              (v) =>
                setEngineFluids({
                  ...engineFluids,
                  transmissionFluid: {
                    ...(engineFluids?.transmissionFluid || {}),
                    level: v,
                  },
                }),
              ["Full", "Low", "Empty", "Unknown"]
            )}
            {renderDropdown(
              "Condition",
              engineFluids?.transmissionFluid?.condition,
              (v) =>
                setEngineFluids({
                  ...engineFluids,
                  transmissionFluid: {
                    ...(engineFluids?.transmissionFluid || {}),
                    condition: v,
                  },
                }),
              ["Good", "Burnt", "Leaking", "Unknown"]
            )}
            {renderInput("Notes", engineFluids?.transmissionFluid?.notes, (v) =>
              setEngineFluids({
                ...engineFluids,
                transmissionFluid: {
                  ...(engineFluids?.transmissionFluid || {}),
                  notes: v,
                },
              })
            )}
          </>
        )}

        {/* Brake Fluid */}
        {renderSection(
          "Brake Fluid",
          <>
            {renderDropdown(
              "Level",
              engineFluids?.brakeFluid?.level,
              (v) =>
                setEngineFluids({
                  ...engineFluids,
                  brakeFluid: { ...(engineFluids?.brakeFluid || {}), level: v },
                }),
              ["Full", "Low", "Empty", "Unknown"]
            )}
            {renderDropdown(
              "Condition",
              engineFluids?.brakeFluid?.condition,
              (v) =>
                setEngineFluids({
                  ...engineFluids,
                  brakeFluid: {
                    ...(engineFluids?.brakeFluid || {}),
                    condition: v,
                  },
                }),
              ["Good", "Contaminated", "Leaking", "Unknown"]
            )}
            {renderInput("Notes", engineFluids?.brakeFluid?.notes, (v) =>
              setEngineFluids({
                ...engineFluids,
                brakeFluid: { ...(engineFluids?.brakeFluid || {}), notes: v },
              })
            )}
          </>
        )}

        {/* Power Steering Fluid */}
        {renderSection(
          "Power Steering Fluid",
          <>
            {renderDropdown(
              "Level",
              engineFluids?.powerSteeringFluid?.level,
              (v) =>
                setEngineFluids({
                  ...engineFluids,
                  powerSteeringFluid: {
                    ...(engineFluids?.powerSteeringFluid || {}),
                    level: v,
                  },
                }),
              ["Full", "Low", "Empty", "Unknown"]
            )}
            {renderDropdown(
              "Condition",
              engineFluids?.powerSteeringFluid?.condition,
              (v) =>
                setEngineFluids({
                  ...engineFluids,
                  powerSteeringFluid: {
                    ...(engineFluids?.powerSteeringFluid || {}),
                    condition: v,
                  },
                }),
              ["Good", "Contaminated", "Leaking", "Unknown"]
            )}
            {renderInput(
              "Notes",
              engineFluids?.powerSteeringFluid?.notes,
              (v) =>
                setEngineFluids({
                  ...engineFluids,
                  powerSteeringFluid: {
                    ...(engineFluids?.powerSteeringFluid || {}),
                    notes: v,
                  },
                })
            )}
          </>
        )}

        {/* Windshield Washer */}
        {renderSection(
          "Windshield Washer",
          <>
            {renderDropdown(
              "Level",
              engineFluids?.windshieldWasher?.level,
              (v) =>
                setEngineFluids({
                  ...engineFluids,
                  windshieldWasher: {
                    ...(engineFluids?.windshieldWasher || {}),
                    level: v,
                  },
                }),
              ["Full", "Low", "Empty", "Unknown"]
            )}
            {renderDropdown(
              "Condition",
              engineFluids?.windshieldWasher?.condition,
              (v) =>
                setEngineFluids({
                  ...engineFluids,
                  windshieldWasher: {
                    ...(engineFluids?.windshieldWasher || {}),
                    condition: v,
                  },
                }),
              ["Good", "Leaking", "Clogged", "Unknown"]
            )}
            {renderInput("Notes", engineFluids?.windshieldWasher?.notes, (v) =>
              setEngineFluids({
                ...engineFluids,
                windshieldWasher: {
                  ...(engineFluids?.windshieldWasher || {}),
                  notes: v,
                },
              })
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
