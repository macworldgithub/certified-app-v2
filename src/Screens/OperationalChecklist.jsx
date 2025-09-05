import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import tw from "tailwind-react-native-classnames";

export default function OperationalChecklist({ navigation, route }) {
  const { vin, make, carModel, year, engineNumber, mileAge, overallRating, inspectorEmail, body, electrical, fluids } = route.params;

  // ✅ Operational State
  const [operational, setOperational] = useState({
    start: { success: "", crankTimeSeconds: "", notes: "" },
    steering: { freePlayMm: "", pull: "", alignmentRecommended: "", notes: "" },
    suspension: { condition: "", noises: "", bounceTestResult: "", notes: "" },
    noises: { present: "", source: "", when: "", notes: "" },
    drivetrain: { vibration: "", shiftQuality: "", clutchSlip: "", notes: "" },
    warningLights: { active: "", notes: "" },
    temperature: { withinNormalRange: "", maxObservedC: "", notes: "" },
    brakes: { pedalFeel: "", stoppingDistanceM: "", pulls: "", absLight: "", notes: "" },
    serviceHistory: { available: "", lastServiceKm: "", lastServiceDate: "", records: "", notes: "" },
    keys: { count: "", remoteWorking: "", immobilizerPresent: "", notes: "" },
  });

  // ✅ Dropdown Component
  const renderDropdown = (label, value, onChange, options) => (
    <View style={tw`mb-2`}>
      <Text style={tw`text-sm font-semibold mb-1`}>{label}</Text>
      <View style={tw`border border-gray-300 rounded-md`}>
        <Picker selectedValue={value} onValueChange={onChange}>
          <Picker.Item label={`Select ${label}`} value="" />
          {options.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
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

  return (
    <ScrollView style={tw`flex-1 bg-white p-3`}>
      <Text style={tw`text-xl font-bold mb-4 text-green-800 pt-6`}>
        Operational Inspection
      </Text>

      {/* Start */}
      {renderSection("Start", <>
        {renderDropdown("Success", operational.start.success, (v) => setOperational({ ...operational, start: { ...operational.start, success: v } }), ["FirstTry","MultipleTries","NoStart","Unknown"])}
        {renderInput("Crank Time (sec)", operational.start.crankTimeSeconds, (v) => setOperational({ ...operational, start: { ...operational.start, crankTimeSeconds: v } }), true)}
        {renderInput("Notes", operational.start.notes, (v) => setOperational({ ...operational, start: { ...operational.start, notes: v } }))}
      </>)}

      {/* Steering */}
      {renderSection("Steering", <>
        {renderInput("Free Play (mm)", operational.steering.freePlayMm, (v) => setOperational({ ...operational, steering: { ...operational.steering, freePlayMm: v } }), true)}
        {renderDropdown("Pull", operational.steering.pull, (v) => setOperational({ ...operational, steering: { ...operational.steering, pull: v } }), ["None","Left","Right"])}
        {renderDropdown("Alignment Recommended", operational.steering.alignmentRecommended, (v) => setOperational({ ...operational, steering: { ...operational.steering, alignmentRecommended: v } }), ["Yes","No","Unknown"])}
        {renderInput("Notes", operational.steering.notes, (v) => setOperational({ ...operational, steering: { ...operational.steering, notes: v } }))}
      </>)}

      {/* Suspension */}
      {renderSection("Suspension", <>
        {renderDropdown("Condition", operational.suspension.condition, (v) => setOperational({ ...operational, suspension: { ...operational.suspension, condition: v } }), ["Good","Firm","Soft","Noisy","Unknown"])}
        {renderInput("Noises", operational.suspension.noises, (v) => setOperational({ ...operational, suspension: { ...operational.suspension, noises: v } }))}
        {renderDropdown("Bounce Test Result", operational.suspension.bounceTestResult, (v) => setOperational({ ...operational, suspension: { ...operational.suspension, bounceTestResult: v } }), ["Pass","Fail","NotTested"])}
        {renderInput("Notes", operational.suspension.notes, (v) => setOperational({ ...operational, suspension: { ...operational.suspension, notes: v } }))}
      </>)}

      {/* Noises */}
      {renderSection("Noises", <>
        {renderDropdown("Present", operational.noises.present, (v) => setOperational({ ...operational, noises: { ...operational.noises, present: v } }), ["None","Mild","Severe"])}
        {renderInput("Source", operational.noises.source, (v) => setOperational({ ...operational, noises: { ...operational.noises, source: v } }))}
        {renderInput("When", operational.noises.when, (v) => setOperational({ ...operational, noises: { ...operational.noises, when: v } }))}
        {renderInput("Notes", operational.noises.notes, (v) => setOperational({ ...operational, noises: { ...operational.noises, notes: v } }))}
      </>)}

      {/* Drivetrain */}
      {renderSection("Drivetrain", <>
        {renderDropdown("Vibration", operational.drivetrain.vibration, (v) => setOperational({ ...operational, drivetrain: { ...operational.drivetrain, vibration: v } }), ["None","Mild","Severe"])}
        {renderDropdown("Shift Quality", operational.drivetrain.shiftQuality, (v) => setOperational({ ...operational, drivetrain: { ...operational.drivetrain, shiftQuality: v } }), ["Smooth","Acceptable","Harsh","NotApplicable"])}
        {renderDropdown("Clutch Slip", operational.drivetrain.clutchSlip, (v) => setOperational({ ...operational, drivetrain: { ...operational.drivetrain, clutchSlip: v } }), ["Yes","No","Unknown"])}
        {renderInput("Notes", operational.drivetrain.notes, (v) => setOperational({ ...operational, drivetrain: { ...operational.drivetrain, notes: v } }))}
      </>)}

      {/* Warning Lights */}
      {renderSection("Warning Lights", <>
        {renderInput("Active Lights", operational.warningLights.active, (v) => setOperational({ ...operational, warningLights: { ...operational.warningLights, active: v } }))}
        {renderInput("Notes", operational.warningLights.notes, (v) => setOperational({ ...operational, warningLights: { ...operational.warningLights, notes: v } }))}
      </>)}

      {/* Temperature */}
      {renderSection("Temperature", <>
        {renderDropdown("Within Normal Range", operational.temperature.withinNormalRange, (v) => setOperational({ ...operational, temperature: { ...operational.temperature, withinNormalRange: v } }), ["Yes","No","Unknown"])}
        {renderInput("Max Observed °C", operational.temperature.maxObservedC, (v) => setOperational({ ...operational, temperature: { ...operational.temperature, maxObservedC: v } }), true)}
        {renderInput("Notes", operational.temperature.notes, (v) => setOperational({ ...operational, temperature: { ...operational.temperature, notes: v } }))}
      </>)}

      {/* Brakes */}
      {renderSection("Brakes", <>
        {renderDropdown("Pedal Feel", operational.brakes.pedalFeel, (v) => setOperational({ ...operational, brakes: { ...operational.brakes, pedalFeel: v } }), ["Firm","Soft","Spongy","Unknown"])}
        {renderInput("Stopping Distance (m)", operational.brakes.stoppingDistanceM, (v) => setOperational({ ...operational, brakes: { ...operational.brakes, stoppingDistanceM: v } }), true)}
        {renderDropdown("Pulls", operational.brakes.pulls, (v) => setOperational({ ...operational, brakes: { ...operational.brakes, pulls: v } }), ["None","Left","Right","Unknown"])}
        {renderDropdown("ABS Light", operational.brakes.absLight, (v) => setOperational({ ...operational, brakes: { ...operational.brakes, absLight: v } }), ["On","Off","NoABS"])}
        {renderInput("Notes", operational.brakes.notes, (v) => setOperational({ ...operational, brakes: { ...operational.brakes, notes: v } }))}
      </>)}

      {/* Service History */}
      {renderSection("Service History", <>
        {renderDropdown("Available", operational.serviceHistory.available, (v) => setOperational({ ...operational, serviceHistory: { ...operational.serviceHistory, available: v } }), ["Yes","No","Partial"])}
        {renderInput("Last Service Km", operational.serviceHistory.lastServiceKm, (v) => setOperational({ ...operational, serviceHistory: { ...operational.serviceHistory, lastServiceKm: v } }), true)}
        {renderInput("Last Service Date", operational.serviceHistory.lastServiceDate, (v) => setOperational({ ...operational, serviceHistory: { ...operational.serviceHistory, lastServiceDate: v } }))}
        {renderInput("Records", operational.serviceHistory.records, (v) => setOperational({ ...operational, serviceHistory: { ...operational.serviceHistory, records: v } }))}
        {renderInput("Notes", operational.serviceHistory.notes, (v) => setOperational({ ...operational, serviceHistory: { ...operational.serviceHistory, notes: v } }))}
      </>)}

      {/* Keys */}
      {renderSection("Keys", <>
        {renderInput("Count", operational.keys.count, (v) => setOperational({ ...operational, keys: { ...operational.keys, count: v } }), true)}
        {renderDropdown("Remote Working", operational.keys.remoteWorking, (v) => setOperational({ ...operational, keys: { ...operational.keys, remoteWorking: v } }), ["Yes","No","Some"])}
        {renderDropdown("Immobilizer Present", operational.keys.immobilizerPresent, (v) => setOperational({ ...operational, keys: { ...operational.keys, immobilizerPresent: v } }), ["Yes","No","Unknown"])}
        {renderInput("Notes", operational.keys.notes, (v) => setOperational({ ...operational, keys: { ...operational.keys, notes: v } }))}
      </>)}

      {/* ✅ Submit Button */}
      <TouchableOpacity
        style={tw`bg-green-700 py-2 rounded-lg mt-4 mb-12`}
        onPress={() => {
          console.log("Final Operational Data:", operational);
          navigation.navigate("VehicalReport", {
            vin, make, carModel, year, engineNumber, mileAge, overallRating,
            inspectorEmail, body, electrical, fluids, operational
          });
        }}
      >
        <Text style={tw`text-white text-center font-semibold text-base`}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
