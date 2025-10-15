// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { setInspectionData, resetInspection } from "../redux/slices/inspectionSlice";
// import AppIcon from "../components/AppIcon";
// import SafeAreaWrapper from "../components/SafeAreaWrapper";
// import API_BASE_URL from "../../utils/config"; // ✅ make sure config.js exports your base URL

// export default function InspectionWizardStepSix({ navigation }) {
//   const dispatch = useDispatch();
//   const inspectionData = useSelector((state) => state.inspection);
//   const { damagePresent, roadTest, roadTestComments, generalComments } = inspectionData;

//   // ✅ Update Redux fields
//   const handleSelect = (field, value) => {
//     dispatch(setInspectionData({ field, value }));
//   };

//   const handleTextChange = (field, value) => {
//     dispatch(setInspectionData({ field, value }));
//   };

//   // ✅ API Function
//   const createInspection = async (payload) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/inspections`, payload, {
//         headers: {
//           "Content-Type": "application/json",
//           accept: "*/*",
//         },
//       });
//       console.log("✅ Inspection created:", response.data);
//       return response.data;
//     } catch (err) {
//       console.error("❌ Error creating inspection:", err.response?.data || err.message);
//       throw err;
//     }
//   };

//   // ✅ Submit handler
//   const handleSubmit = async () => {
//     try {
//       console.log("📦 Full Redux Inspection Data:", inspectionData);

//       // Minimal validation
//       if (!inspectionData.vinChassisNumber || !inspectionData.make || !inspectionData.model) {
//         Alert.alert("❌ Missing Fields", "Please fill VIN, Make, and Model before submitting.");
//         return;
//       }

//       // ✅ Build payload
//       const finalPayload = {
//         vin: inspectionData.vinChassisNumber,
//         make: inspectionData.make,
//         model: inspectionData.model,
//         year: inspectionData.year,
//         registrationPlate: inspectionData.registrationPlate,
//         registrationExpiry: inspectionData.registrationExpiry,
//         buildDate: inspectionData.buildDate,
//         complianceDate: inspectionData.complianceDate,
//         damagePresent: inspectionData.damagePresent,
//         roadTest: inspectionData.roadTest,
//         roadTestComments: inspectionData.roadTestComments,
//         generalComments: inspectionData.generalComments,
//         images: inspectionData.images,
//         inspectorEmail: "muhammadanasrashid18@gmail.com", // ✅ Hardcoded like your operational checklist
//       };

//       // Remove empty/undefined fields
//       const cleanPayload = JSON.parse(JSON.stringify(finalPayload));
//       console.log("🚀 Final Payload to Send:", cleanPayload);

//       await createInspection(cleanPayload);

//       dispatch(resetInspection());
//       Alert.alert("✅ Success", "Inspection submitted successfully!");
//       navigation.navigate("MainTabs");
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.message || JSON.stringify(err.response?.data) || err.message;
//       console.error("❌ Submit failed:", errorMsg);
//       Alert.alert("❌ Error", errorMsg);
//     }
//   };

//   const handleBack = () => navigation.goBack();

//   return (
//     <SafeAreaWrapper>
//       <View style={tw`flex-1 bg-white`}>
//         {/* Header */}
//         <View style={tw`flex-row items-center mb-6 px-4 pt-4`}>
//           <TouchableOpacity onPress={handleBack} style={tw`mr-4`}>
//             <AppIcon name="arrow-left" size={24} color="#065f46" />
//           </TouchableOpacity>
//           <Text style={tw`text-lg font-bold text-green-800`}>
//             Inspection Wizard
//           </Text>
//         </View>

//         {/* Scrollable Content */}
//         <ScrollView style={tw`px-6`} contentContainerStyle={tw`pb-20`}>
//           {/* Damage Present */}
//           <View style={tw`mt-4`}>
//             <Text style={tw`text-gray-500 mb-1`}>Is There Any Damage Present</Text>
//             <View style={tw`flex-row justify-between`}>
//               {["Yes", "No"].map((option) => (
//                 <TouchableOpacity
//                   key={option}
//                   style={tw.style(
//                     "flex-1 items-center justify-center border rounded-lg py-6 mx-1",
//                     damagePresent === option
//                       ? "border-green-600 bg-green-50"
//                       : "border-gray-300 bg-white"
//                   )}
//                   onPress={() => handleSelect("damagePresent", option)}
//                 >
//                   <Text style={tw`text-gray-700`}>{option}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           {/* Road Test */}
//           <View style={tw`mt-4`}>
//             <Text style={tw`text-gray-500 mb-1`}>Road Test</Text>
//             <View style={tw`flex-row justify-between`}>
//               {["Yes", "No"].map((option) => (
//                 <TouchableOpacity
//                   key={option}
//                   style={tw.style(
//                     "flex-1 items-center justify-center border rounded-lg py-6 mx-1",
//                     roadTest === option
//                       ? "border-green-600 bg-green-50"
//                       : "border-gray-300 bg-white"
//                   )}
//                   onPress={() => handleSelect("roadTest", option)}
//                 >
//                   <Text style={tw`text-gray-700`}>{option}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           {/* Road Test Comments */}
//           <View style={tw`mt-4`}>
//             <Text style={tw`text-gray-500 mb-1`}>Road Test Comments</Text>
//             <TextInput
//               value={roadTestComments}
//               onChangeText={(value) => handleTextChange("roadTestComments", value)}
//               placeholder="Enter comments"
//               style={tw`border border-gray-300 rounded-lg p-3 bg-white h-20`}
//               multiline
//             />
//           </View>

//           {/* General Comments */}
//           <View style={tw`mt-4`}>
//             <Text style={tw`text-gray-500 mb-1`}>General Comments</Text>
//             <TextInput
//               value={generalComments}
//               onChangeText={(value) => handleTextChange("generalComments", value)}
//               placeholder="Enter comments"
//               style={tw`border border-gray-300 rounded-lg p-3 bg-white h-20`}
//               multiline
//             />
//           </View>
//         </ScrollView>

//         {/* Submit Button (Fixed Bottom) */}
//         <View style={tw`absolute bottom-0 left-0 right-0 px-4 pb-4 bg-white mb-8`}>
//           <TouchableOpacity
//             style={tw`bg-green-700 py-2 rounded-xl`}
//             onPress={handleSubmit}
//           >
//             <Text style={tw`text-white text-center text-lg font-semibold`}>
//               Submit
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaWrapper>
//   );
// }
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setInspectionData, resetInspection } from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import API_BASE_URL from "../../utils/config"; // ✅ make sure config.js exports your base URL

export default function InspectionWizardStepSix({ navigation }) {
  const dispatch = useDispatch();
  const inspectionData = useSelector((state) => state.inspection);
  const { damagePresent, roadTest, roadTestComments, generalComments } = inspectionData;

  // ✅ Update Redux fields
  const handleSelect = (field, value) => {
    dispatch(setInspectionData({ field, value }));
  };

  const handleTextChange = (field, value) => {
    dispatch(setInspectionData({ field, value }));
  };

  // ✅ API Function
  const createInspection = async (payload) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/inspections`, payload, {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      });
      console.log("✅ Inspection created:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ Error creating inspection:", err.response?.data || err.message);
      throw err;
    }
  };

  // ✅ Submit handler
  const handleSubmit = async () => {
    try {
      console.log("📦 Full Redux Inspection Data:", inspectionData);

      // Minimal validation
      if (!inspectionData.vin || !inspectionData.make || !inspectionData.model) {
        Alert.alert("❌ Missing Fields", "Please fill VIN, Make, and Model before submitting.");
        return;
      }

      // ✅ Build payload
      const finalPayload = {
        vin: inspectionData.vin,
        make: inspectionData.make,
        model: inspectionData.model,
        year: inspectionData.year,
        registrationPlate: inspectionData.registrationPlate,
        registrationExpiry: inspectionData.registrationExpiry,
        buildDate: inspectionData.buildDate,
        complianceDate: inspectionData.complianceDate,
        damagePresent: inspectionData.damagePresent,
        roadTest: inspectionData.roadTest,
        roadTestComments: inspectionData.roadTestComments,
        generalComments: inspectionData.generalComments,
        images: inspectionData.images,
        inspectorEmail: "muhammadanasrashid18@gmail.com", // ✅ Hardcoded like your operational checklist
      };

      // Remove empty/undefined fields
      const cleanPayload = JSON.parse(JSON.stringify(finalPayload));
      console.log("🚀 Final Payload to Send:", cleanPayload);

      await createInspection(cleanPayload);

      dispatch(resetInspection());
      Alert.alert("✅ Success", "Inspection submitted successfully!");
      navigation.navigate("MainTabs");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || JSON.stringify(err.response?.data) || err.message;
      console.error("❌ Submit failed:", errorMsg);
      Alert.alert("❌ Error", errorMsg);
    }
  };

  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaWrapper>
      <View style={tw`flex-1 bg-white`}>
        {/* Header */}
        <View style={tw`flex-row items-center mb-6 px-4 pt-4`}>
          <TouchableOpacity onPress={handleBack} style={tw`mr-4`}>
            <AppIcon name="arrow-left" size={24} color="#065f46" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-green-800`}>
            Inspection Wizard
          </Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView style={tw`px-6`} contentContainerStyle={tw`pb-20`}>
          {/* Damage Present */}
          <View style={tw`mt-4`}>
            <Text style={tw`text-gray-500 mb-1`}>
              Is There Any Damage Present
            </Text>
            <View style={tw`flex-row justify-between`}>
              {["Yes", "No"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={tw.style(
                    "flex-1 items-center justify-center border rounded-lg py-6 mx-1",
                    damagePresent === option
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300 bg-white"
                  )}
                  onPress={() => handleSelect("damagePresent", option)}
                >
                  <Text style={tw`text-gray-700`}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Road Test */}
          <View style={tw`mt-4`}>
            <Text style={tw`text-gray-500 mb-1`}>Road Test</Text>
            <View style={tw`flex-row justify-between`}>
              {["Yes", "No"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={tw.style(
                    "flex-1 items-center justify-center border rounded-lg py-6 mx-1",
                    roadTest === option
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300 bg-white"
                  )}
                  onPress={() => handleSelect("roadTest", option)}
                >
                  <Text style={tw`text-gray-700`}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Road Test Comments */}
          <View style={tw`mt-4`}>
            <Text style={tw`text-gray-500 mb-1`}>Road Test Comments</Text>
            <TextInput
              value={roadTestComments}
              onChangeText={(value) =>
                handleTextChange("roadTestComments", value)
              }
              placeholder="Enter comments"
              style={tw`border border-gray-300 rounded-lg p-3 bg-white h-20`}
              multiline
            />
          </View>

          {/* General Comments */}
          <View style={tw`mt-4`}>
            <Text style={tw`text-gray-500 mb-1`}>General Comments</Text>
            <TextInput
              value={generalComments}
              onChangeText={(value) =>
                handleTextChange("generalComments", value)
              }
              placeholder="Enter comments"
              style={tw`border border-gray-300 rounded-lg p-3 bg-white h-20`}
              multiline
            />
          </View>
        </ScrollView>

        {/* Submit Button (Fixed Bottom) */}
        <View style={tw`absolute bottom-0 left-0 right-0 px-4 pb-4 bg-white mb-8`}>
          <TouchableOpacity
            style={tw`bg-green-700 py-2 rounded-xl`}
            onPress={handleSubmit}
          >
            <Text style={tw`text-white text-center text-lg font-semibold`}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
