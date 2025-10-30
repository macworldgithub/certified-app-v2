// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, ScrollView } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import { useDispatch, useSelector } from "react-redux";
// import { setInspectionData } from "../redux/slices/inspectionSlice";
// import AppIcon from "../components/AppIcon";
// import SafeAreaWrapper from "../components/SafeAreaWrapper";

// export default function InspectionWizardStepFour({ navigation }) {
//   const dispatch = useDispatch();
//   const { serviceBookPresent, serviceHistoryPresent } = useSelector(
//     (state) => state.inspection
//   );

//   const handleSelect = (field, value) => {
//     dispatch(setInspectionData({ field, value }));
//   };

//   const handleNext = () => {
//     navigation.navigate("InspectionWizardStepSix");
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
//         <ScrollView style={tw`px-4`} contentContainerStyle={tw`pb-32`}>
//           {/* Service Book Present */}
//           <View style={tw`mt-4`}>
//             <Text style={tw`text-gray-500 mb-2`}>Is A Servicebook Present</Text>
//             <View style={tw`flex-row justify-between`}>
//               {["Yes", "No"].map((option) => (
//                 <TouchableOpacity
//                   key={option}
//                   style={tw.style(
//                     "flex-1 items-center justify-center border rounded-lg py-8 mx-1",
//                     serviceBookPresent === option
//                       ? "border-green-600 bg-green-50"
//                       : "border-gray-300 bg-white"
//                   )}
//                   onPress={() => handleSelect("serviceBookPresent", option)}
//                 >
//                   <Text style={tw`text-gray-700`}>{option}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           {/* Service History Present */}
//           <View style={tw`mt-6`}>
//             <Text style={tw`text-gray-500 mb-2`}>
//               Is A Service History Present
//             </Text>
//             <View style={tw`flex-row justify-between`}>
//               {["Yes", "No"].map((option) => (
//                 <TouchableOpacity
//                   key={option}
//                   style={tw.style(
//                     "flex-1 items-center justify-center border rounded-lg py-8 mx-1",
//                     serviceHistoryPresent === option
//                       ? "border-green-600 bg-green-50"
//                       : "border-gray-300 bg-white"
//                   )}
//                   onPress={() => handleSelect("serviceHistoryPresent", option)}
//                 >
//                   <Text style={tw`text-gray-700`}>{option}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         </ScrollView>
//         {/* Next Button */}
//         <View
//           style={tw`absolute bottom-0 left-0 right-0 px-4 pb-4 bg-white mb-8`}
//         >
//           <TouchableOpacity
//             style={tw`bg-green-700 py-2 rounded-xl`}
//             onPress={handleNext}
//           >
//             <Text style={tw`text-white text-center text-lg font-semibold`}>
//               Next
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
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import { setInspectionData } from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import * as ImagePicker from "react-native-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function InspectionWizardStepFour({ navigation }) {
  const dispatch = useDispatch();
  const {
    serviceBookPresent,
    serviceHistoryPresent,
    bookImages = [],
    serviceHistoryAvailable,
    currentServiceDate,
    currentServiceKilometers,
    lastServiceDate,
    lastServiceKilometers,
    serviceNotes,
  } = useSelector((state) => state.inspection);

  // date picker visibility state
  const [showCurrentDatePicker, setShowCurrentDatePicker] = useState(false);
  const [showLastDatePicker, setShowLastDatePicker] = useState(false);

  // handle yes/no selections
  const handleSelect = (field, value) => {
    dispatch(setInspectionData({ field, value }));

    // serviceBookPresent logic
    if (field === "serviceBookPresent" && value === "No") {
      dispatch(setInspectionData({ field: "bookImages", value: [] }));
    }

    // serviceHistoryPresent logic
    if (field === "serviceHistoryPresent") {
      const isAvailable = value === "Yes";
      dispatch(setInspectionData({ field: "serviceHistoryAvailable", value: isAvailable }));

      if (!isAvailable) {
        // clear fields when No
        dispatch(setInspectionData({ field: "currentServiceDate", value: "" }));
        dispatch(setInspectionData({ field: "currentServiceKilometers", value: "" }));
        dispatch(setInspectionData({ field: "lastServiceDate", value: "" }));
        dispatch(setInspectionData({ field: "lastServiceKilometers", value: "" }));
        dispatch(setInspectionData({ field: "serviceNotes", value: "" }));
      }
    }
  };

  // image picker
  const pickImage = async (source) => {
    try {
      const options = { mediaType: "photo", quality: 0.8 };
      let result;

      if (source === "camera") result = await ImagePicker.launchCamera(options);
      else result = await ImagePicker.launchImageLibrary(options);

      if (!result.didCancel && result.assets?.length) {
        const newImage = result.assets[0];
        const updatedImages = [...bookImages, newImage];
        dispatch(setInspectionData({ field: "bookImages", value: updatedImages }));
      }
    } catch (error) {
      console.log("Image pick error:", error);
      Alert.alert("Error", "Unable to pick image.");
    }
  };

  // date handlers
  const handleCurrentServiceDate = (event, selectedDate) => {
    setShowCurrentDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      dispatch(setInspectionData({ field: "currentServiceDate", value: formatted }));
    }
  };

  const handleLastServiceDate = (event, selectedDate) => {
    setShowLastDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      dispatch(setInspectionData({ field: "lastServiceDate", value: formatted }));
    }
  };

  const handleNext = () => navigation.navigate("InspectionWizardStepSix");
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
        <ScrollView style={tw`px-4`} contentContainerStyle={tw`pb-40`}>
          {/* Service Book Present */}
          <View style={tw`mt-4`}>
            <Text style={tw`text-gray-500 mb-2`}>Is A Servicebook Present</Text>
            <View style={tw`flex-row justify-between`}>
              {["Yes", "No"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={tw.style(
                    "flex-1 items-center justify-center border rounded-lg py-8 mx-1",
                    serviceBookPresent === option
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300 bg-white"
                  )}
                  onPress={() => handleSelect("serviceBookPresent", option)}
                >
                  <Text style={tw`text-gray-700`}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Book Upload Section */}
          {serviceBookPresent === "Yes" && (
            <View style={tw`mt-6`}>
              <Text style={tw`text-gray-500 mb-2`}>
                Upload Book / Manual Photos
              </Text>

              <View style={tw`flex-row mb-2`}>
                <TouchableOpacity
                  style={tw`flex-1 bg-purple-600 py-2 rounded-lg mr-2`}
                  onPress={() => pickImage("camera")}
                >
                  <Text style={tw`text-white text-center`}>Pick From Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`flex-1 bg-purple-600 py-2 rounded-lg`}
                  onPress={() => pickImage("gallery")}
                >
                  <Text style={tw`text-white text-center`}>Pick From Gallery</Text>
                </TouchableOpacity>
              </View>

              <View style={tw`flex-row flex-wrap`}>
                {bookImages.map((img, index) => (
                  <Image
                    key={index}
                    source={{ uri: img.uri }}
                    style={tw`w-24 h-24 m-1 rounded-lg border border-gray-300`}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Service History Present */}
          <View style={tw`mt-8`}>
            <Text style={tw`text-gray-500 mb-2`}>
              Is A Service History Present
            </Text>
            <View style={tw`flex-row justify-between`}>
              {["Yes", "No"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={tw.style(
                    "flex-1 items-center justify-center border rounded-lg py-8 mx-1",
                    serviceHistoryPresent === option
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300 bg-white"
                  )}
                  onPress={() => handleSelect("serviceHistoryPresent", option)}
                >
                  <Text style={tw`text-gray-700`}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Service History Details (Visible if Yes) */}
          {serviceHistoryPresent === "Yes" && (
            <View style={tw`mt-6`}>
              <Text style={tw`text-lg font-semibold text-gray-700 mb-2`}>
                Service Details
              </Text>

              {/* Current Service Date */}
              <Text style={tw`text-gray-500 mb-1`}>Current Service Date</Text>
              <TouchableOpacity
                style={tw`border border-gray-300 rounded-lg p-3 mb-3 bg-white`}
                onPress={() => setShowCurrentDatePicker(true)}
              >
                <Text>
                  {currentServiceDate ? currentServiceDate : "Select Date"}
                </Text>
              </TouchableOpacity>
              {showCurrentDatePicker && (
                <DateTimePicker
                  value={
                    currentServiceDate
                      ? new Date(currentServiceDate)
                      : new Date()
                  }
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleCurrentServiceDate}
                />
              )}

              {/* Current Service Kilometers */}
              <Text style={tw`text-gray-500 mb-1`}>
                Current Service Kilometers
              </Text>
              <TextInput
                placeholder="Enter kilometers"
                keyboardType="numeric"
                value={currentServiceKilometers}
                onChangeText={(value) =>
                  dispatch(
                    setInspectionData({ field: "currentServiceKilometers", value })
                  )
                }
                style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
              />

              {/* Last Service Date */}
              <Text style={tw`text-gray-500 mb-1`}>Last Service Date</Text>
              <TouchableOpacity
                style={tw`border border-gray-300 rounded-lg p-3 mb-3 bg-white`}
                onPress={() => setShowLastDatePicker(true)}
              >
                <Text>{lastServiceDate ? lastServiceDate : "Select Date"}</Text>
              </TouchableOpacity>
              {showLastDatePicker && (
                <DateTimePicker
                  value={lastServiceDate ? new Date(lastServiceDate) : new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleLastServiceDate}
                />
              )}

              {/* Last Service Kilometers */}
              <Text style={tw`text-gray-500 mb-1`}>
                Last Service Kilometers
              </Text>
              <TextInput
                placeholder="Enter kilometers"
                keyboardType="numeric"
                value={lastServiceKilometers}
                onChangeText={(value) =>
                  dispatch(
                    setInspectionData({ field: "lastServiceKilometers", value })
                  )
                }
                style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
              />

              {/* Notes */}
              <Text style={tw`text-gray-500 mb-1`}>Service Notes</Text>
              <TextInput
                placeholder="Enter any notes"
                value={serviceNotes}
                onChangeText={(value) =>
                  dispatch(setInspectionData({ field: "serviceNotes", value }))
                }
                style={tw`border border-gray-300 rounded-lg p-3 mb-3 h-20`}
                multiline
              />
            </View>
          )}
        </ScrollView>

        {/* Next Button */}
        <View
          style={tw`absolute bottom-0 left-0 right-0 px-4 pb-4 bg-white mb-8`}
        >
          <TouchableOpacity
            style={tw`bg-green-700 py-2 rounded-xl`}
            onPress={handleNext}
          >
            <Text style={tw`text-white text-center text-lg font-semibold`}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
