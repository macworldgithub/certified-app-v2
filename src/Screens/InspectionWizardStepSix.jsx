// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import { useDispatch, useSelector } from "react-redux";
// import { setInspectionData } from "../redux/slices/inspectionSlice";
// import AppIcon from "../components/AppIcon";
// import SafeAreaWrapper from "../components/SafeAreaWrapper";

// export default function InspectionWizardStepSix({ navigation }) {
//   const dispatch = useDispatch();
//   const { damagePresent, roadTest, roadTestComments, generalComments } = useSelector(
//     (state) => state.inspection
//   );

//   const handleSelect = (field, value) => {
//     dispatch(setInspectionData({ field, value }));
//   };

//   const handleTextChange = (field, value) => {
//     dispatch(setInspectionData({ field, value }));
//   };

//   const handleNext = () => {
//     navigation.navigate("");
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
//         <ScrollView style={tw`px-6`} contentContainerStyle={tw`pb-32`}>
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

//           {/* Next Button */}
//           <TouchableOpacity
//             style={tw`bg-green-800 py-2 rounded-xl mt-10 mb-6`}
//             onPress={handleNext}
//           >
//             <Text style={tw`text-white text-center text-lg font-semibold`}>
//               Next
//             </Text>
//           </TouchableOpacity>
//         </ScrollView>
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
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import { setInspectionData } from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import axios from "axios";
import { resetInspection } from "../redux/slices/inspectionSlice";
import API_BASE_URL from "../../utils/config";
import { Alert } from "react-native";

export default function InspectionWizardStepSix({ navigation }) {
  const dispatch = useDispatch();
  const { damagePresent, roadTest, roadTestComments, generalComments } =
    useSelector((state) => state.inspection);
  const inspectionData = useSelector((state) => state.inspection);

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

  const handleSelect = (field, value) => {
    dispatch(setInspectionData({ field, value }));
  };

  const handleTextChange = (field, value) => {
    dispatch(setInspectionData({ field, value }));
  };

  const handleSubmit = async () => {
    try {
      // ✅ Validate required data
      if (
        !inspectionData.vin ||
        !inspectionData.make ||
        !inspectionData.model ||
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

        odometer: inspectionData.odometer, // From InspectionWizardStepTwo
        fuelType: inspectionData.fuelType, // From InspectionWizardStepTwo,
        driveTrain: inspectionData.driveTrain, // From InspectionWizardStepTwo
        transmission: inspectionData.transmission, // From InspectionWizardStepTwo
        bodyType: inspectionData.bodyType, // From InspectionWizardStepTwo
        color: inspectionData.color, // From InspectionWizardStepThree
        frontWheelDiameter: inspectionData.frontWheelDiameter, // From InspectionWizardStepThree
        rearWheelDiameter: inspectionData.rearWheelDiameter, // From InspectionWizardStepThree
        keysPresent: inspectionData.keysPresent, // From InspectionWizardStepThree
        serviceBookPresent: inspectionData.serviceBookPresent, // From InspectionWizardStepFour
        serviceHistoryPresent: inspectionData.serviceHistoryPresent, // From InspectionWizardStepFour
        tyreConditionFrontLeft: inspectionData.tyreConditionFrontLeft, // From InspectionWizardStepFive
        tyreConditionFrontRight: inspectionData.tyreConditionFrontRight, // From InspectionWizardStepFive
        tyreConditionRearRight: inspectionData.tyreConditionRearRight, // From InspectionWizardStepFive
        tyreConditionRearLeft: inspectionData.tyreConditionRearLeft, // From InspectionWizardStepFive
        damagePresent: inspectionData.damagePresent, // From InspectionWizardStepSix
        roadTest: "" + inspectionData.roadTest, // From InspectionWizardStepSix
        roadTestComments: inspectionData.roadTestComments, // From InspectionWizardStepSix
        generalComments: inspectionData.generalComments, // From InspectionWizardStepSix

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
      console.error("❌ Submit failed:", errorMsg, inspectionData);
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

        {/* Submit Button (Fixed at Bottom) */}
        <View style={tw`absolute bottom-0 left-0 right-0`}>
          <TouchableOpacity
            style={tw`bg-green-800 py-2 rounded-xl mx-6 mb-6`}
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
