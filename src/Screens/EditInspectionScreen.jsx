// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { useSelector } from "react-redux";
// import tw from "tailwind-react-native-classnames";
// import axios from "axios";

// export default function EditInspectionScreen({ route, navigation }) {
//   const { id } = route.params;

//   // 👇 ADD THIS LINE RIGHT HERE
//   console.log("Requested ID:", id);
//     const inspections = useSelector((state) => state.inspection?.data || []);
// //   const inspections = useSelector((state) => state.inspection.data);

//   const inspection = inspections.find((item) => item._id === id);

//   const [form, setForm] = useState({
//     make: "",
//     carModel: "",
//     year: "",
//     mileAge: "",
//     notes: "",
//   });

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchInspection = async () => {
//       try {
//         const res = await axios.get(
//           `https://apiv2.certifiedinspect.com.au/inspections/${id}`
//         );
//         const data = res.data;
//         setForm({
//           make: data.make || "",
//           carModel: data.carModel || "",
//           year: data.year || "",
//           mileAge: data.mileAge?.toString() || "",
//           notes: data.body?.panels?.notes || "",
//         });
//       } catch (error) {
//         console.error("Failed to fetch inspection:", error);
//         Alert.alert("Error", "Unable to load inspection details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (inspection) {
//       // Prefill from Redux
//       setForm({
//         make: inspection.make || "",
//         carModel: inspection.carModel || "",
//         year: inspection.year || "",
//         mileAge: inspection.mileAge?.toString() || "",
//         notes: inspection.body?.panels?.notes || "",
//       });
//       setLoading(false);
//     } else {
//       // Fetch from API if not in Redux
//       fetchInspection();
//     }
//   }, [id, inspection]);

//   const handleChange = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleUpdate = async () => {
//     try {
//       const res = await axios.put(
//         `https://apiv2.certifiedinspect.com.au/inspections/${id}`,
//         {
//           make: form.make,
//           carModel: form.carModel,
//           year: form.year,
//           mileAge: Number(form.mileAge),
//           body: {
//             panels: {
//               notes: form.notes,
//             },
//           },
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             accept: "*/*",
//           },
//         }
//       );

//       console.log("Updated:", res.data);
//       Alert.alert("✅ Success", "Inspection updated successfully!");
//       navigation.goBack();
//     } catch (error) {
//       console.error("Update failed:", error);
//       Alert.alert("Error", "Failed to update inspection. Please try again.");
//     }
//   };

//   // 🌀 Show loader while data is loading
//   if (loading) {
//     return (
//       <View style={tw`flex-1 items-center justify-center bg-white`}>
//         <ActivityIndicator size="large" color="#16a34a" />
//         <Text style={tw`text-gray-600 mt-3`}>
//           Loading inspection details...
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={tw`flex-1 bg-white p-4`}>
//       <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
//         Edit Inspection ({form.make || "Car"})
//       </Text>

//       {/* Editable fields */}
//       <Text style={tw`text-gray-700 mb-1`}>Make</Text>
//       <TextInput
//         value={form.make}
//         onChangeText={(text) => handleChange("make", text)}
//         style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
//       />

//       <Text style={tw`text-gray-700 mb-1`}>Model</Text>
//       <TextInput
//         value={form.carModel}
//         onChangeText={(text) => handleChange("carModel", text)}
//         style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
//       />

//       <Text style={tw`text-gray-700 mb-1`}>Year</Text>
//       <TextInput
//         value={form.year}
//         onChangeText={(text) => handleChange("year", text)}
//         keyboardType="numeric"
//         style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
//       />

//       <Text style={tw`text-gray-700 mb-1`}>Mileage</Text>
//       <TextInput
//         value={form.mileAge}
//         onChangeText={(text) => handleChange("mileAge", text)}
//         keyboardType="numeric"
//         style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
//       />

//       <Text style={tw`text-gray-700 mb-1`}>Notes</Text>
//       <TextInput
//         value={form.notes}
//         onChangeText={(text) => handleChange("notes", text)}
//         multiline
//         style={tw`border border-gray-300 rounded-lg p-2 mb-3 h-24`}
//       />

//       <TouchableOpacity
//         onPress={handleUpdate}
//         style={tw`bg-green-600 py-3 rounded-lg mt-4`}
//       >
//         <Text style={tw`text-white text-center font-semibold text-base`}>
//           Update Inspection
//         </Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import axios from "axios";

export default function EditInspectionScreen({ route, navigation }) {
  const { vin } = route.params;
  console.log("Requested VIN:", vin);

  const inspections = useSelector((state) => state.inspection?.data || []);
  const inspection = inspections.find((item) => item.vin === vin);

  const [form, setForm] = useState({
    make: "",
    carModel: "",
    year: "",
    mileAge: "",
    engineNumber: "",
    body: {
      panels: {
        notes: "",
        condition: "",
        severity: "",
        dentsCount: "",
        rust: "",
        alignment: "",
      },
      paint: {
        notes: "",
        condition: "",
        severity: "",
        resprayDetected: "",
        scratches: "",
        fade: "",
      },
      doors: {
        severity: "",
      },
    },
    electrical: {
      lights: {
        notes: "",
        status: "",
        failedBulbs: [],
        headlightAim: "",
      },
      battery: {
        condition: "",
        crankPerformance: "",
      },
    },
    engineFluids: {
      oil: {
        color: "",
        leak: "",
      },
    },
    operational: {
      start: {
        success: "",
      },
    },
  });

  const [loading, setLoading] = useState(true);

useEffect(() => {
  // If inspection exists in Redux, use it directly
  if (inspection) {
    console.log("Loaded from Redux:", inspection);
    setForm({
      make: inspection.make || "",
      carModel: inspection.carModel || "",
      year: inspection.year || "",
      mileAge: inspection.mileAge?.toString() || "",
      engineNumber: inspection.engineNumber || "",
      body: {
        panels: {
          notes: inspection.body?.panels?.notes || "",
          condition: inspection.body?.panels?.condition || "",
          severity: inspection.body?.panels?.severity || "",
          dentsCount: inspection.body?.panels?.dentsCount?.toString() || "",
          rust: inspection.body?.panels?.rust || "",
          alignment: inspection.body?.panels?.alignment || "",
        },
        paint: {
          notes: inspection.body?.paint?.notes || "",
          condition: inspection.body?.paint?.condition || "",
          severity: inspection.body?.paint?.severity || "",
          resprayDetected: inspection.body?.paint?.resprayDetected || "",
          scratches: inspection.body?.paint?.scratches || "",
          fade: inspection.body?.paint?.fade || "",
        },
        doors: {
          severity: inspection.body?.doors?.severity || "",
        },
      },
      electrical: {
        lights: {
          notes: inspection.electrical?.lights?.notes || "",
          status: inspection.electrical?.lights?.status || "",
          failedBulbs: inspection.electrical?.lights?.failedBulbs || [],
          headlightAim: inspection.electrical?.lights?.headlightAim || "",
        },
        battery: {
          condition: inspection.electrical?.battery?.condition || "",
          crankPerformance: inspection.electrical?.battery?.crankPerformance || "",
        },
      },
      engineFluids: {
        oil: {
          color: inspection.engineFluids?.oil?.color || "",
          leak: inspection.engineFluids?.oil?.leak || "",
        },
      },
      operational: {
        start: {
          success: inspection.operational?.start?.success || "",
        },
      },
    });
    setLoading(false);
    return; // ✅ Stop here — don’t fetch API
  }

  // Otherwise, fallback to API call
  const fetchInspection = async () => {
    try {
      const res = await axios.get(
        `https://apiv2.certifiedinspect.com.au/inspections/${vin}`,
        { headers: { accept: "*/*" } }
      );
      const data = res.data;
      console.log("Loaded from API:", data);

      setForm({
        make: data.make || "",
        carModel: data.carModel || "",
        year: data.year || "",
        mileAge: data.mileAge?.toString() || "",
        engineNumber: data.engineNumber || "",
        body: {
          panels: {
            notes: data.body?.panels?.notes || "",
            condition: data.body?.panels?.condition || "",
            severity: data.body?.panels?.severity || "",
            dentsCount: data.body?.panels?.dentsCount?.toString() || "",
            rust: data.body?.panels?.rust || "",
            alignment: data.body?.panels?.alignment || "",
          },
          paint: {
            notes: data.body?.paint?.notes || "",
            condition: data.body?.paint?.condition || "",
            severity: data.body?.paint?.severity || "",
            resprayDetected: data.body?.paint?.resprayDetected || "",
            scratches: data.body?.paint?.scratches || "",
            fade: data.body?.paint?.fade || "",
          },
          doors: {
            severity: data.body?.doors?.severity || "",
          },
        },
        electrical: {
          lights: {
            notes: data.electrical?.lights?.notes || "",
            status: data.electrical?.lights?.status || "",
            failedBulbs: data.electrical?.lights?.failedBulbs || [],
            headlightAim: data.electrical?.lights?.headlightAim || "",
          },
          battery: {
            condition: data.electrical?.battery?.condition || "",
            crankPerformance: data.electrical?.battery?.crankPerformance || "",
          },
        },
        engineFluids: {
          oil: {
            color: data.engineFluids?.oil?.color || "",
            leak: data.engineFluids?.oil?.leak || "",
          },
        },
        operational: {
          start: {
            success: data.operational?.start?.success || "",
          },
        },
      });
    } catch (error) {
      console.error("Failed to fetch inspection:", error);
      Alert.alert("Error", "Unable to load inspection details.");
    } finally {
      setLoading(false);
    }
  };

  fetchInspection();
}, [vin, inspection]);


  const handleChange = (key, value, nestedKey = null, subNestedKey = null) => {
    if (nestedKey && subNestedKey) {
      setForm((prev) => ({
        ...prev,
        [nestedKey]: {
          ...prev[nestedKey],
          [subNestedKey]: {
            ...prev[nestedKey][subNestedKey],
            [key]: value,
          },
        },
      }));
    } else if (nestedKey) {
      setForm((prev) => ({
        ...prev,
        [nestedKey]: {
          ...prev[nestedKey],
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        make: form.make,
        carModel: form.carModel,
        year: form.year,
        mileAge: Number(form.mileAge) || 0,
        engineNumber: form.engineNumber,
        body: {
          panels: {
            notes: form.body.panels.notes,
            condition: form.body.panels.condition,
            severity: form.body.panels.severity,
            dentsCount: Number(form.body.panels.dentsCount) || 0,
            rust: form.body.panels.rust,
            alignment: form.body.panels.alignment,
          },
          paint: {
            notes: form.body.paint.notes,
            condition: form.body.paint.condition,
            severity: form.body.paint.severity,
            resprayDetected: form.body.paint.resprayDetected,
            scratches: form.body.paint.scratches,
            fade: form.body.paint.fade,
          },
          doors: {
            severity: form.body.doors.severity,
          },
        },
        electrical: {
          lights: {
            notes: form.electrical.lights.notes,
            status: form.electrical.lights.status,
            failedBulbs: form.electrical.lights.failedBulbs,
            headlightAim: form.electrical.lights.headlightAim,
          },
          battery: {
            condition: form.electrical.battery.condition,
            crankPerformance: form.electrical.battery.crankPerformance,
          },
        },
        engineFluids: {
          oil: {
            color: form.engineFluids.oil.color,
            leak: form.engineFluids.oil.leak,
          },
        },
        operational: {
          start: {
            success: form.operational.start.success,
          },
        },
      };

      const res = await axios.put(
        `https://apiv2.certifiedinspect.com.au/inspections/${vin}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      console.log("Updated:", res.data);
      Alert.alert("✅ Success", "Inspection updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update inspection. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-white`}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={tw`text-gray-600 mt-3`}>
          Loading inspection details...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
        Edit Inspection ({form.make || "Car"})
      </Text>

      <Text style={tw`text-gray-700 mb-1`}>Make</Text>
      <TextInput
        value={form.make}
        onChangeText={(text) => handleChange("make", text)}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />

      <Text style={tw`text-gray-700 mb-1`}>Model</Text>
      <TextInput
        value={form.carModel}
        onChangeText={(text) => handleChange("carModel", text)}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />

      <Text style={tw`text-gray-700 mb-1`}>Year</Text>
      <TextInput
        value={form.year}
        onChangeText={(text) => handleChange("year", text)}
        keyboardType="numeric"
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />

      <Text style={tw`text-gray-700 mb-1`}>Mileage</Text>
      <TextInput
        value={form.mileAge}
        onChangeText={(text) => handleChange("mileAge", text)}
        keyboardType="numeric"
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />

      <Text style={tw`text-gray-700 mb-1`}>Engine Number</Text>
      <TextInput
        value={form.engineNumber}
        onChangeText={(text) => handleChange("engineNumber", text)}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />

      <Text style={tw`text-gray-700 mb-1 font-semibold`}>Body - Panels</Text>
      <Text style={tw`text-gray-700 mb-1`}>Notes</Text>
      <TextInput
        value={form.body.panels.notes}
        onChangeText={(text) => handleChange("notes", text, "body", "panels")}
        multiline
        style={tw`border border-gray-300 rounded-lg p-2 mb-3 h-24`}
      />
      <Text style={tw`text-gray-700 mb-1`}>Condition</Text>
      <TextInput
        value={form.body.panels.condition}
        onChangeText={(text) => handleChange("condition", text, "body", "panels")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />
      <Text style={tw`text-gray-700 mb-1`}>Severity</Text>
      <TextInput
        value={form.body.panels.severity}
        onChangeText={(text) => handleChange("severity", text, "body", "panels")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />
      <Text style={tw`text-gray-700 mb-1`}>Dents Count</Text>
      <TextInput
        value={form.body.panels.dentsCount}
        onChangeText={(text) => handleChange("dentsCount", text, "body", "panels")}
        keyboardType="numeric"
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />
      <Text style={tw`text-gray-700 mb-1`}>Rust</Text>
      <TextInput
        value={form.body.panels.rust}
        onChangeText={(text) => handleChange("rust", text, "body", "panels")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />
      <Text style={tw`text-gray-700 mb-1`}>Alignment</Text>
      <TextInput
        value={form.body.panels.alignment}
        onChangeText={(text) => handleChange("alignment", text, "body", "panels")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />

      <Text style={tw`text-gray-700 mb-1 font-semibold`}>Body - Paint</Text>
      <Text style={tw`text-gray-700 mb-1`}>Notes</Text>
      <TextInput
        value={form.body.paint.notes}
        onChangeText={(text) => handleChange("notes", text, "body", "paint")}
        multiline
        style={tw`border border-gray-300 rounded-lg p-2 mb-3 h-24`}
      />
      <Text style={tw`text-gray-700 mb-1`}>Condition</Text>
      <TextInput
        value={form.body.paint.condition}
        onChangeText={(text) => handleChange("condition", text, "body", "paint")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />
      <Text style={tw`text-gray-700 mb-1`}>Severity</Text>
      <TextInput
        value={form.body.paint.severity}
        onChangeText={(text) => handleChange("severity", text, "body", "paint")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />
      <Text style={tw`text-gray-700 mb-1`}>Respray Detected</Text>
      <TextInput
        value={form.body.paint.resprayDetected}
        onChangeText={(text) => handleChange("resprayDetected", text, "body", "paint")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />
      <Text style={tw`text-gray-700 mb-1`}>Scratches</Text>
      <TextInput
        value={form.body.paint.scratches}
        onChangeText={(text) => handleChange("scratches", text, "body", "paint")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />
      <Text style={tw`text-gray-700 mb-1`}>Fade</Text>
      <TextInput
        value={form.body.paint.fade}
        onChangeText={(text) => handleChange("fade", text, "body", "paint")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />

      <Text style={tw`text-gray-700 mb-1 font-semibold`}>Body - Doors</Text>
      <Text style={tw`text-gray-700 mb-1`}>Severity</Text>
      <TextInput
        value={form.body.doors.severity}
        onChangeText={(text) => handleChange("severity", text, "body", "doors")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />

      <Text style={tw`text-gray-700 mb-1 font-semibold`}>Electrical - Lights</Text>
      <Text style={tw`text-gray-700 mb-1`}>Notes</Text>
      <TextInput
        value={form.electrical.lights.notes}
        onChangeText={(text) => handleChange("notes", text, "electrical", "lights")}
        multiline
        style={tw`border border-gray-300 rounded-lg p-2 mb-3 h-24`}
      />
      <Text style={tw`text-gray-700 mb-1`}>Status</Text>
      <TextInput
        value={form.electrical.lights.status}
        onChangeText={(text) => handleChange("status", text, "electrical", "lights")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />
      <Text style={tw`text-gray-700 mb-1`}>Headlight Aim</Text>
      <TextInput
        value={form.electrical.lights.headlightAim}
        onChangeText={(text) => handleChange("headlightAim", text, "electrical", "lights")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />

      <Text style={tw`text-gray-700 mb-1 font-semibold`}>Electrical - Battery</Text>
      <Text style={tw`text-gray-700 mb-1`}>Condition</Text>
      <TextInput
        value={form.electrical.battery.condition}
        onChangeText={(text) => handleChange("condition", text, "electrical", "battery")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />
      <Text style={tw`text-gray-700 mb-1`}>Crank Performance</Text>
      <TextInput
        value={form.electrical.battery.crankPerformance}
        onChangeText={(text) => handleChange("crankPerformance", text, "electrical", "battery")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />

      <Text style={tw`text-gray-700 mb-1 font-semibold`}>Engine Fluids - Oil</Text>
      <Text style={tw`text-gray-700 mb-1`}>Color</Text>
      <TextInput
        value={form.engineFluids.oil.color}
        onChangeText={(text) => handleChange("color", text, "engineFluids", "oil")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />
      <Text style={tw`text-gray-700 mb-1`}>Leak</Text>
      <TextInput
        value={form.engineFluids.oil.leak}
        onChangeText={(text) => handleChange("leak", text, "engineFluids", "oil")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />

      <Text style={tw`text-gray-700 mb-1 font-semibold`}>Operational - Start</Text>
      <Text style={tw`text-gray-700 mb-1`}>Success</Text>
      <TextInput
        value={form.operational.start.success}
        onChangeText={(text) => handleChange("success", text, "operational", "start")}
        style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
      />

      <TouchableOpacity
        onPress={handleUpdate}
        style={tw`bg-green-600 py-3 rounded-lg mt-4`}
      >
        <Text style={tw`text-white text-center font-semibold text-base`}>
          Update Inspection
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}