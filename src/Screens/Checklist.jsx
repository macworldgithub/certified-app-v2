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
import { setBody } from "../redux/slices/inspectionSlice";
export default function BodyChecklist({ navigation }) {
  const dispatch = useDispatch();
  const [body, setBodyState] = useState({
    panels: {
      condition: "",
      severity: "",
      notes: "",
      dentsCount: "",
      rust: "",
      alignment: "",
    },
    paint: {
      condition: "",
      severity: "",
      notes: "",
      scratches: "",
      fade: "",
      resprayDetected: "",
    },
    doors: {
      condition: "",
      severity: "",
      notes: "",
      closingEffort: "",
      weatherStripCondition: "",
    },
    locks: { status: "", notes: "", allDoorsCovered: "" },
    glass: {
      condition: "",
      severity: "",
      notes: "",
      cracks: "",
      chipsCount: "",
      tintCondition: "",
    },
    mirrors: { condition: "", severity: "", notes: "", adjusterStatus: "" },
    interior: {
      condition: "",
      severity: "",
      notes: "",
      cleanliness: "",
      odor: "",
      wearLevel: "",
    },
    seats: {
      condition: "",
      severity: "",
      notes: "",
      upholstery: "",
      tears: "",
      stains: "",
      adjustmentsStatus: "",
    },
    seatBelts: { latchStatus: "", retraction: "", frayed: "", notes: "" },
    repairEvidence: { found: "", areas: "", description: "" },
  });

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

  // ✅ Section renderer
  const renderSection = (title, content) => (
    <View style={tw`mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50`}>
      <Text style={tw`text-base font-bold mb-2 text-green-700`}>{title}</Text>
      {content}
    </View>
  );
  const handleNext = () => {
    dispatch(setBody(body));
    navigation.navigate("ElectricalChecklist");
  };

  return (
    <ScrollView style={tw`flex-1 bg-white p-3`}>
      <Text style={tw`text-xl font-bold mb-4 text-green-800 pt-6`}>
        Body Inspection
      </Text>

      {/* Panels */}
      {renderSection(
        "Panels",
        <>
          {renderDropdown(
            "Condition",
            body.panels.condition,
            (v) =>
              setBody({ ...body, panels: { ...body.panels, condition: v } }),
            ["Good", "Fair", "Poor", "Damaged", "NotApplicable"]
          )}
          {renderDropdown(
            "Severity",
            body.panels.severity,
            (v) =>
              setBody({ ...body, panels: { ...body.panels, severity: v } }),
            ["None", "Minor", "Moderate", "Severe"]
          )}
          {renderInput("Notes", body.panels.notes, (v) =>
            setBody({ ...body, panels: { ...body.panels, notes: v } })
          )}
          {renderInput(
            "Dents Count",
            body.panels.dentsCount,
            (v) =>
              setBody({ ...body, panels: { ...body.panels, dentsCount: v } }),
            true
          )}
          {renderDropdown(
            "Rust",
            body.panels.rust,
            (v) => setBody({ ...body, panels: { ...body.panels, rust: v } }),
            ["Yes", "No", "Unknown"]
          )}
          {renderDropdown(
            "Alignment",
            body.panels.alignment,
            (v) =>
              setBody({ ...body, panels: { ...body.panels, alignment: v } }),
            ["Good", "MinorMisalign", "MajorMisalign", "NotApplicable"]
          )}
        </>
      )}

      {/* Paint */}
      {renderSection(
        "Paint",
        <>
          {renderDropdown(
            "Condition",
            body.paint.condition,
            (v) => setBody({ ...body, paint: { ...body.paint, condition: v } }),
            ["Good", "Fair", "Poor", "Damaged", "NotApplicable"]
          )}
          {renderDropdown(
            "Severity",
            body.paint.severity,
            (v) => setBody({ ...body, paint: { ...body.paint, severity: v } }),
            ["None", "Minor", "Moderate", "Severe"]
          )}
          {renderInput("Notes", body.paint.notes, (v) =>
            setBody({ ...body, paint: { ...body.paint, notes: v } })
          )}
          {renderDropdown(
            "Scratches",
            body.paint.scratches,
            (v) => setBody({ ...body, paint: { ...body.paint, scratches: v } }),
            ["None", "Minor", "Moderate", "Severe"]
          )}
          {renderDropdown(
            "Fade",
            body.paint.fade,
            (v) => setBody({ ...body, paint: { ...body.paint, fade: v } }),
            ["None", "Minor", "Moderate", "Severe"]
          )}
          {renderDropdown(
            "Respray Detected",
            body.paint.resprayDetected,
            (v) =>
              setBody({
                ...body,
                paint: { ...body.paint, resprayDetected: v },
              }),
            ["Yes", "No", "Unknown"]
          )}
        </>
      )}

      {/* Doors */}
      {renderSection(
        "Doors",
        <>
          {renderDropdown(
            "Condition",
            body.doors.condition,
            (v) => setBody({ ...body, doors: { ...body.doors, condition: v } }),
            ["Good", "Fair", "Poor", "Damaged", "NotApplicable"]
          )}
          {renderDropdown(
            "Severity",
            body.doors.severity,
            (v) => setBody({ ...body, doors: { ...body.doors, severity: v } }),
            ["None", "Minor", "Moderate", "Severe"]
          )}
          {renderInput("Notes", body.doors.notes, (v) =>
            setBody({ ...body, doors: { ...body.doors, notes: v } })
          )}
          {renderDropdown(
            "Closing Effort",
            body.doors.closingEffort,
            (v) =>
              setBody({ ...body, doors: { ...body.doors, closingEffort: v } }),
            ["Light", "Normal", "Hard"]
          )}
          {renderDropdown(
            "Weather Strip Condition",
            body.doors.weatherStripCondition,
            (v) =>
              setBody({
                ...body,
                doors: { ...body.doors, weatherStripCondition: v },
              }),
            ["Good", "Fair", "Poor", "Damaged", "NotApplicable"]
          )}
        </>
      )}

      {/* Locks */}
      {renderSection(
        "Locks",
        <>
          {renderDropdown(
            "Status",
            body.locks.status,
            (v) => setBody({ ...body, locks: { ...body.locks, status: v } }),
            ["Working", "Intermittent", "NotWorking", "NotPresent"]
          )}
          {renderInput("Notes", body.locks.notes, (v) =>
            setBody({ ...body, locks: { ...body.locks, notes: v } })
          )}
          {renderDropdown(
            "All Doors Covered",
            body.locks.allDoorsCovered,
            (v) =>
              setBody({
                ...body,
                locks: { ...body.locks, allDoorsCovered: v },
              }),
            ["Yes", "No", "Unknown"]
          )}
        </>
      )}

      {/* Glass */}
      {renderSection(
        "Glass",
        <>
          {renderDropdown(
            "Condition",
            body.glass.condition,
            (v) => setBody({ ...body, glass: { ...body.glass, condition: v } }),
            ["Good", "Fair", "Poor", "Damaged", "NotApplicable"]
          )}
          {renderDropdown(
            "Severity",
            body.glass.severity,
            (v) => setBody({ ...body, glass: { ...body.glass, severity: v } }),
            ["None", "Minor", "Moderate", "Severe"]
          )}
          {renderInput("Notes", body.glass.notes, (v) =>
            setBody({ ...body, glass: { ...body.glass, notes: v } })
          )}
          {renderDropdown(
            "Cracks",
            body.glass.cracks,
            (v) => setBody({ ...body, glass: { ...body.glass, cracks: v } }),
            ["None", "Minor", "Moderate", "Severe"]
          )}
          {renderInput(
            "Chips Count",
            body.glass.chipsCount,
            (v) =>
              setBody({ ...body, glass: { ...body.glass, chipsCount: v } }),
            true
          )}
          {renderDropdown(
            "Tint Condition",
            body.glass.tintCondition,
            (v) =>
              setBody({ ...body, glass: { ...body.glass, tintCondition: v } }),
            ["Good", "Fair", "Poor", "Damaged", "NotApplicable"]
          )}
        </>
      )}

      {/* Mirrors */}
      {renderSection(
        "Mirrors",
        <>
          {renderDropdown(
            "Condition",
            body.mirrors.condition,
            (v) =>
              setBody({ ...body, mirrors: { ...body.mirrors, condition: v } }),
            ["Good", "Fair", "Poor", "Damaged", "NotApplicable"]
          )}
          {renderDropdown(
            "Severity",
            body.mirrors.severity,
            (v) =>
              setBody({ ...body, mirrors: { ...body.mirrors, severity: v } }),
            ["None", "Minor", "Moderate", "Severe"]
          )}
          {renderInput("Notes", body.mirrors.notes, (v) =>
            setBody({ ...body, mirrors: { ...body.mirrors, notes: v } })
          )}
          {renderDropdown(
            "Adjuster Status",
            body.mirrors.adjusterStatus,
            (v) =>
              setBody({
                ...body,
                mirrors: { ...body.mirrors, adjusterStatus: v },
              }),
            ["Working", "Intermittent", "NotWorking", "NotPresent"]
          )}
        </>
      )}

      {/* Interior */}
      {renderSection(
        "Interior",
        <>
          {renderDropdown(
            "Condition",
            body.interior.condition,
            (v) =>
              setBody({
                ...body,
                interior: { ...body.interior, condition: v },
              }),
            ["Good", "Fair", "Poor", "Damaged", "NotApplicable"]
          )}
          {renderDropdown(
            "Severity",
            body.interior.severity,
            (v) =>
              setBody({ ...body, interior: { ...body.interior, severity: v } }),
            ["None", "Minor", "Moderate", "Severe"]
          )}
          {renderInput("Notes", body.interior.notes, (v) =>
            setBody({ ...body, interior: { ...body.interior, notes: v } })
          )}
          {renderDropdown(
            "Cleanliness",
            body.interior.cleanliness,
            (v) =>
              setBody({
                ...body,
                interior: { ...body.interior, cleanliness: v },
              }),
            ["Clean", "Acceptable", "Dirty"]
          )}
          {renderDropdown(
            "Odor",
            body.interior.odor,
            (v) =>
              setBody({ ...body, interior: { ...body.interior, odor: v } }),
            ["None", "Mild", "Strong"]
          )}
          {renderDropdown(
            "Wear Level",
            body.interior.wearLevel,
            (v) =>
              setBody({
                ...body,
                interior: { ...body.interior, wearLevel: v },
              }),
            ["Low", "Medium", "High"]
          )}
        </>
      )}

      {/* Seats */}
      {renderSection(
        "Seats",
        <>
          {renderDropdown(
            "Condition",
            body.seats.condition,
            (v) => setBody({ ...body, seats: { ...body.seats, condition: v } }),
            ["Good", "Fair", "Poor", "Damaged", "NotApplicable"]
          )}
          {renderDropdown(
            "Severity",
            body.seats.severity,
            (v) => setBody({ ...body, seats: { ...body.seats, severity: v } }),
            ["None", "Minor", "Moderate", "Severe"]
          )}
          {renderInput("Notes", body.seats.notes, (v) =>
            setBody({ ...body, seats: { ...body.seats, notes: v } })
          )}
          {renderDropdown(
            "Upholstery",
            body.seats.upholstery,
            (v) =>
              setBody({ ...body, seats: { ...body.seats, upholstery: v } }),
            ["Fabric", "Leather", "Synthetic", "Mixed", "Unknown"]
          )}
          {renderDropdown(
            "Tears",
            body.seats.tears,
            (v) => setBody({ ...body, seats: { ...body.seats, tears: v } }),
            ["None", "Minor", "Moderate", "Severe"]
          )}
          {renderDropdown(
            "Stains",
            body.seats.stains,
            (v) => setBody({ ...body, seats: { ...body.seats, stains: v } }),
            ["None", "Light", "Heavy"]
          )}
          {renderDropdown(
            "Adjustments Status",
            body.seats.adjustmentsStatus,
            (v) =>
              setBody({
                ...body,
                seats: { ...body.seats, adjustmentsStatus: v },
              }),
            ["ManualOK", "PowerOK", "Faulty", "NotPresent"]
          )}
        </>
      )}

      {/* Seat Belts */}
      {renderSection(
        "Seat Belts",
        <>
          {renderDropdown(
            "Latch Status",
            body.seatBelts.latchStatus,
            (v) =>
              setBody({
                ...body,
                seatBelts: { ...body.seatBelts, latchStatus: v },
              }),
            ["Working", "Intermittent", "NotWorking", "NotPresent"]
          )}
          {renderDropdown(
            "Retraction",
            body.seatBelts.retraction,
            (v) =>
              setBody({
                ...body,
                seatBelts: { ...body.seatBelts, retraction: v },
              }),
            ["Smooth", "Slow", "Sticky", "NotPresent"]
          )}
          {renderInput("Frayed", body.seatBelts.frayed, (v) =>
            setBody({ ...body, seatBelts: { ...body.seatBelts, frayed: v } })
          )}
          {renderInput("Notes", body.seatBelts.notes, (v) =>
            setBody({ ...body, seatBelts: { ...body.seatBelts, notes: v } })
          )}
        </>
      )}

      {/* Repair Evidence */}
      {renderSection(
        "Repair Evidence",
        <>
          {renderDropdown(
            "Found",
            body.repairEvidence.found,
            (v) =>
              setBody({
                ...body,
                repairEvidence: { ...body.repairEvidence, found: v },
              }),
            ["Yes", "No", "Unknown"]
          )}
          {renderInput("Areas", body.repairEvidence.areas, (v) =>
            setBody({
              ...body,
              repairEvidence: { ...body.repairEvidence, areas: v },
            })
          )}
          {renderInput("Description", body.repairEvidence.description, (v) =>
            setBody({
              ...body,
              repairEvidence: { ...body.repairEvidence, description: v },
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
  );
}
