// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   Image,
//   PermissionsAndroid,
//   Platform,
//   Modal,
//   KeyboardAvoidingView,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// // import Voice from "@react-native-voice/voice";
// import * as ImagePicker from "react-native-image-picker";
// import {
//   setInspectionData,
//   resetInspection,
// } from "../redux/slices/inspectionSlice";
// import AppIcon from "../components/AppIcon";
// import SafeAreaWrapper from "../components/SafeAreaWrapper";
// import API_BASE_URL from "../../utils/config";

// import greenmic from "../../assets/greenmic.png";
// import redmic from "../../assets/redmic.png";
// import EngineImage from "./EngineImage";

// export default function InspectionWizardStepSix({ navigation }) {
//   const dispatch = useDispatch();
//   const inspectionData = useSelector((state) => state.inspection);
//   const {
//     damagePresent,
//     damages = [],
//     roadTest,
//     roadTestComments,
//     generalComments,
//   } = inspectionData;

//   const [roadTestVoiceMemo, setRoadTestVoiceMemo] = useState(null);
//   const [isRoadRecording, setIsRoadRecording] = useState(false);

//   const [isRecording, setIsRecording] = useState(false);
//   const [error, setError] = useState("");
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [damageData, setDamageData] = useState({
//     damagePhoto: null,
//     damageDescription: "",
//     damageSeverity: "minor",
//     repairRequired: false,
//   });

//   // ✅ Voice Setup
//   // useEffect(() => {
//   //   Voice.onSpeechResults = onSpeechResults;
//   //   Voice.onSpeechError = onSpeechError;
//   //   return () => {
//   //     Voice.destroy().then(Voice.removeAllListeners);
//   //   };
//   // }, []);

//   // const onSpeechResults = (event) => {
//   //   if (event.value && event.value.length > 0) {
//   //     dispatch(
//   //       setInspectionData({ field: "generalComments", value: event.value[0] })
//   //     );
//   //   }
//   // };

//   // const onSpeechError = (event) => {
//   //   setError(event.error?.message || "Voice recognition error");
//   //   setIsRecording(false);
//   // };

//   // ✅ Request Microphone Permission
//   const requestMicrophonePermission = async () => {
//     if (Platform.OS !== "android") return true;
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       console.warn("Permission error:", err);
//       return false;
//     }
//   };

//   // const toggleRoadRecording = async () => {
//   //   try {
//   //     if (isRoadRecording) {
//   //       await Voice.stop();
//   //       setIsRoadRecording(false);
//   //       dispatch(
//   //         setInspectionData({
//   //           field: "roadTestVoiceMemo",
//   //           value: "mock_voice_file_path.mp3",
//   //         })
//   //       );
//   //     } else {
//   //       const hasPermission = await requestMicrophonePermission();
//   //       if (!hasPermission) {
//   //         Alert.alert(
//   //           "Permission Denied",
//   //           "Microphone access is required for road test recording."
//   //         );
//   //         return;
//   //       }
//   //       setError("");
//   //       setIsRoadRecording(true);
//   //       await Voice.start("en-US");
//   //     }
//   //   } catch (err) {
//   //     setError(JSON.stringify(err));
//   //     setIsRoadRecording(false);
//   //   }
//   // };

//   // const toggleRecording = async () => {
//   //   try {
//   //     if (isRecording) {
//   //       await Voice.stop();
//   //       setIsRecording(false);
//   //     } else {
//   //       const hasPermission = await requestMicrophonePermission();
//   //       if (!hasPermission) {
//   //         Alert.alert("Permission Denied", "Microphone access is required.");
//   //         return;
//   //       }
//   //       setError("");
//   //       setIsRecording(true);
//   //       await Voice.start("en-US");
//   //     }
//   //   } catch (err) {
//   //     setError(JSON.stringify(err));
//   //     setIsRecording(false);
//   //   }
//   // };

//   // ✅ Image picker
//   const handleImagePick = () => {
//     Alert.alert("Upload Damage Photo", "Choose an option", [
//       {
//         text: "Camera",
//         onPress: () => openImagePicker("camera"),
//       },
//       {
//         text: "Gallery",
//         onPress: () => openImagePicker("gallery"),
//       },
//       { text: "Cancel", style: "cancel" },
//     ]);
//   };

//   const openImagePicker = async (type) => {
//     const options = { mediaType: "photo", quality: 0.8 };
//     const result =
//       type === "camera"
//         ? await ImagePicker.launchCamera(options)
//         : await ImagePicker.launchImageLibrary(options);
//     if (result?.assets && result.assets[0]) {
//       setDamageData({ ...damageData, damagePhoto: result.assets[0].uri });
//     }
//   };

//   // ✅ Add damage to list
//   const handleAddDamage = () => {
//     if (!damageData.damagePhoto || !damageData.damageDescription) {
//       Alert.alert("Missing Info", "Please add a photo and description.");
//       return;
//     }
//     const updatedDamages = [...damages, damageData];
//     dispatch(setInspectionData({ field: "damages", value: updatedDamages }));
//     setDamageData({
//       damagePhoto: null,
//       damageDescription: "",
//       damageSeverity: "minor",
//       repairRequired: false,
//     });
//     setIsModalVisible(false);
//   };

//   const handleSelect = (field, value) => {
//     dispatch(setInspectionData({ field, value }));
//   };

//   const handleTextChange = (field, value) => {
//     dispatch(setInspectionData({ field, value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       console.log(
//         "🧾 Current Redux Inspection Data:",
//         JSON.stringify(inspectionData, null, 2)
//       );

//       if (!inspectionData.vin || inspectionData.vin.length !== 17) {
//         Alert.alert(
//           "❌ Invalid VIN",
//           "VIN must be exactly 17 characters long."
//         );
//         return;
//       }

//       if (!inspectionData.make || !inspectionData.model) {
//         Alert.alert("❌ Missing Fields", "Please fill Make and Model.");
//         return;
//       }

//       // const finalPayload = {
//       //   vin: inspectionData.vin,
//       //   make: inspectionData.make,
//       //   carModel: inspectionData.model,
//       //   year: inspectionData.year || "string",
//       //   engineNumber: inspectionData.engineNumber || "string",
//       //   mileAge: Number(inspectionData.mileAge) || 0,
//       //   registrationPlate: inspectionData.registrationPlate,
//       //   registrationExpiry: inspectionData.registrationExpiry,
//       //   buildDate: inspectionData.buildDate,
//       //   complianceDate: inspectionData.complianceDate,
//       //   overallRating: 0,
//       //   inspectorEmail: "muhammadanasrashid18@gmail.com",
//       //   frontImage: inspectionData.images.frontImage || {
//       //     original: "s3://bucket/cars/front.jpg",
//       //     analyzed: "s3://bucket/cars/front_annotated.jpg",
//       //     damages: [],
//       //   },
//       //   rearImage: inspectionData.images.rearImage || {
//       //     original: "s3://bucket/cars/rear.jpg",
//       //     analyzed: "s3://bucket/cars/rear_annotated.jpg",
//       //     damages: [],
//       //   },
//       //   leftImage: inspectionData.images.leftImage || {
//       //     original: "s3://bucket/cars/left.jpg",
//       //     analyzed: "s3://bucket/cars/left_annotated.jpg",
//       //     damages: [],
//       //   },
//       //   rightImage: inspectionData.images.rightImage || {
//       //     original: "s3://bucket/cars/right.jpg",
//       //     analyzed: "s3://bucket/cars/right_annotated.jpg",
//       //     damages: [],
//       //   },
//       //   engineImage: inspectionData.images.engineImage || {
//       //     original: "s3://bucket/cars/right.jpg",
//       //     analyzed: "s3://bucket/cars/right_annotated.jpg",
//       //     damages: [],
//       //   },
//       //   odometer: inspectionData.odometer || "45200",
//       //   fuelType: inspectionData.fuelType || "Petrol",
//       //   driveTrain: inspectionData.driveTrain || "AWD",
//       //   transmission: inspectionData.transmission || "Automatic",
//       //   bodyType: inspectionData.bodyType || "Sedan",
//       //   color: inspectionData.color || "Blue",
//       //   frontWheelDiameter: inspectionData.frontWheelDiameter || 17,
//       //   rearWheelDiameter: inspectionData.rearWheelDiameter || 17,
//       //   keysPresent: inspectionData.keysPresent ?? true,
//       //   serviceBookPresent: inspectionData.serviceBookPresent ?? true,
//       //   serviceHistoryPresent: inspectionData.serviceHistoryPresent ?? true,
//       //   tyreConditionFrontLeft: inspectionData.tyreConditionFrontLeft || "Good",
//       //   tyreConditionFrontRight:
//       //     inspectionData.tyreConditionFrontRight || "Good",
//       //   tyreConditionRearRight: inspectionData.tyreConditionRearRight || "Fair",
//       //   tyreConditionRearLeft: inspectionData.tyreConditionRearLeft || "Fair",
//       //   damagePresent: inspectionData.damagePresent ?? true,
//       //   roadTest: inspectionData.roadTest ?? true,
//       //   roadTestComments: inspectionData.roadTestComments,
//       //   generalComments: inspectionData.generalComments,
//       // };

//       const finalPayload = {
//         vin: inspectionData.vin,
//         make: inspectionData.make,
//         carModel: inspectionData.model,
//         year: inspectionData.year || "string",
//         engineNumber: inspectionData.engineNumber || "string",
//         mileAge: Number(inspectionData.mileAge) || 0,
//         registrationPlate: inspectionData.registrationPlate || "ABC-123",
//         registrationExpiry: inspectionData.registrationExpiry || "2026-05-12",
//         buildDate: inspectionData.buildDate || "2020-02-01",
//         complianceDate: inspectionData.complianceDate || "2020-04-15",
//         overallRating: 0,
//         inspectorEmail: "muhammadanasrashid18@gmail.com",
//         frontImage: inspectionData.images.frontImage || {
//           original: "s3://bucket/cars/front.jpg",
//           analyzed: "s3://bucket/cars/front_annotated.jpg",
//           damages: [],
//         },
//         rearImage: inspectionData.images.rearImage || {
//           original: "s3://bucket/cars/front.jpg",
//           analyzed: "s3://bucket/cars/front_annotated.jpg",
//           damages: [],
//         },
//         leftImage: inspectionData.images.leftImage || {
//           original: "s3://bucket/cars/front.jpg",
//           analyzed: "s3://bucket/cars/front_annotated.jpg",
//           damages: [],
//         },
//         rightImage: inspectionData.images.rightImage || {
//           original: "s3://bucket/cars/front.jpg",
//           analyzed: "s3://bucket/cars/front_annotated.jpg",
//           damages: [],
//         },
//         engineImage: inspectionData.images.engineImage || {
//           original: "s3://bucket/cars/front.jpg",
//           analyzed: "s3://bucket/cars/front_annotated.jpg",
//           damages: [],
//         },
//         plateImage: inspectionData.images.plateImage || {
//           original: "s3://bucket/cars/front.jpg",
//           analyzed: "s3://bucket/cars/front_annotated.jpg",
//           damages: [],
//         },
//         interiorBackImage: inspectionData.images.interiorBackImage || {
//           original: "s3://bucket/cars/front.jpg",
//           analyzed: "s3://bucket/cars/front_annotated.jpg",
//           damages: [],
//         },
//         interiorFrontImage: inspectionData.images.interiorFrontImage || {
//           original: "s3://bucket/cars/front.jpg",
//           analyzed: "s3://bucket/cars/front_annotated.jpg",
//           damages: [],
//         },
//         odometer: inspectionData.odometer || "45200",
//         odometerImage:
//           inspectionData.odometerImage || "uploads/vehicles/odometer/45200.jpg",
//         lastServiceDate: inspectionData.lastServiceDate || "2025-10-15",
//         serviceCenterName:
//           inspectionData.serviceCenterName ||
//           "Toyota Authorized Service Center",
//         odometerAtLastService: inspectionData.odometerAtLastService || 45200,
//      serviceRecordDocumentKey: inspectionData.serviceRecordDocumentKey || "",
//         fuelType: inspectionData.fuelType || "Petrol",
//         driveTrain: inspectionData.driveTrain || "AWD",
//         transmission: inspectionData.transmission || "Automatic",
//         bodyType: inspectionData.bodyType || "Sedan",
//         color: inspectionData.color || "Blue",
//         frontWheelDiameter: inspectionData.frontWheelDiameter || 17,
//         rearWheelDiameter: inspectionData.rearWheelDiameter || 17,
//         keysPresent: inspectionData.keysPresent ?? true,
//         serviceBookPresent: inspectionData.serviceBookPresent ?? true,
//         bookImages: inspectionData.bookImages || [
//           "uploads/service_book/page1.jpg",
//           "uploads/service_book/page2.jpg",
//         ],
//         serviceHistoryPresent: inspectionData.serviceHistoryPresent ?? true,
//         tyreConditionFrontLeft: inspectionData.tyreConditionFrontLeft || "Good",
//         tyreConditionFrontRight:
//           inspectionData.tyreConditionFrontRight || "Good",
//         tyreConditionRearRight: inspectionData.tyreConditionRearRight || "Fair",
//         tyreConditionRearLeft: inspectionData.tyreConditionRearLeft || "Fair",
//         damagePresent: inspectionData.damagePresent ?? false,
//         roadTest: inspectionData.roadTest ?? true,
//         roadTestComments:
//           inspectionData.roadTestComments || "Smooth drive, no noise",
//         generalComments:
//           inspectionData.generalComments || "Vehicle in excellent condition",
//       };
//       const cleanPayload = JSON.parse(JSON.stringify(finalPayload));

//       // 🧩 Print payload before sending
//       console.log(
//         "📦 Final Payload Sent to API:",
//         JSON.stringify(cleanPayload, null, 2)
//       );

//       if (inspectionData._id) {
//         console.log("🔄 Updating inspection:", inspectionData._id);
//         await axios.put(
//           `${API_BASE_URL}/inspections/${inspectionData._id}`,
//           cleanPayload,
//           { headers: { "Content-Type": "application/json", accept: "*/*" } }
//         );
//       } else {
//         console.log("🆕 Creating new inspection...");
//         await axios.post(`${API_BASE_URL}/inspections`, cleanPayload, {
//           headers: { "Content-Type": "application/json", accept: "*/*" },
//         });
//       }

//       dispatch(resetInspection());
//       Alert.alert("✅ Success", "Inspection created successfully!");
//       navigation.navigate("MainTabs");
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.message ||
//         JSON.stringify(err.response?.data) ||
//         err.message;
//       console.error("❌ Submit failed:", errorMsg);
//       Alert.alert("❌ Error", errorMsg);
//     }
//   };

//   const handleBack = () => navigation.goBack();

//   return (
//     <SafeAreaWrapper>
//       <KeyboardAvoidingView
//         style={tw`flex-1`}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
//       >
//         <View style={tw`flex-1 bg-white`}>
//           {/* Header */}
//           <View style={tw`flex-row items-center mb-6 px-4 pt-4`}>
//             <TouchableOpacity onPress={handleBack} style={tw`mr-4`}>
//               <AppIcon name="arrow-left" size={24} color="#065f46" />
//             </TouchableOpacity>
//             <Text style={tw`text-lg font-bold text-green-800`}>
//               Inspection Wizard
//             </Text>
//           </View>

//           <ScrollView style={tw`px-6`} contentContainerStyle={tw`pb-20`}>
//             {/* Damage Section */}
//             <View style={tw`mt-4`}>
//               <Text style={tw`text-gray-500 mb-1`}>
//                 Is There Any Damage Present
//               </Text>
//               <View style={tw`flex-row justify-between`}>
//                 {["Yes", "No"].map((option) => (
//                   <TouchableOpacity
//                     key={option}
//                     style={tw.style(
//                       "flex-1 items-center justify-center border rounded-lg py-6 mx-1",
//                       damagePresent === option
//                         ? "border-green-600 bg-green-50"
//                         : "border-gray-300 bg-white"
//                     )}
//                     onPress={() => handleSelect("damagePresent", option)}
//                   >
//                     <Text style={tw`text-gray-700`}>{option}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* If Damage Present */}
//             {damagePresent === "Yes" && (
//               <View style={tw`mt-6`}>
//                 <View style={tw`flex-row justify-between items-center mb-2`}>
//                   <Text style={tw`text-gray-700 font-semibold text-base`}>
//                     Recorded Damages
//                   </Text>
//                   <TouchableOpacity
//                     onPress={() => setIsModalVisible(true)}
//                     style={tw`bg-green-600 px-3 py-2 rounded-lg`}
//                   >
//                     <Text style={tw`text-white font-semibold`}>
//                       + Add Damage
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 {damages.length === 0 ? (
//                   <Text style={tw`text-gray-500 text-sm`}>
//                     No damages added yet.
//                   </Text>
//                 ) : (
//                   damages.map((item, index) => (
//                     <View
//                       key={index}
//                       style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
//                     >
//                       {item.damagePhoto && (
//                         <Image
//                           source={{ uri: item.damagePhoto }}
//                           style={tw`w-full h-40 rounded-lg mb-2`}
//                         />
//                       )}
//                       <Text style={tw`text-gray-700`}>
//                         {item.damageDescription}
//                       </Text>
//                       <Text style={tw`text-sm text-gray-500`}>
//                         Severity: {item.damageSeverity}
//                       </Text>
//                       <Text style={tw`text-sm text-gray-500`}>
//                         Repair Required: {item.repairRequired ? "Yes" : "No"}
//                       </Text>
//                     </View>
//                   ))
//                 )}
//               </View>
//             )}

//             {/* Modal */}
//             <Modal visible={isModalVisible} transparent animationType="slide">
//               <View
//                 style={tw`flex-1 justify-center bg-black bg-opacity-50 px-6`}
//               >
//                 <View style={tw`bg-white p-4 rounded-xl`}>
//                   <Text style={tw`text-lg font-bold text-center mb-3`}>
//                     Add Damage
//                   </Text>

//                   {/* Image Upload */}
//                   <TouchableOpacity
//                     onPress={handleImagePick}
//                     style={tw`bg-green-600 p-3 rounded-lg mb-3`}
//                   >
//                     <Text style={tw`text-white text-center`}>
//                       {damageData.damagePhoto ? "Change Photo" : "Upload Photo"}
//                     </Text>
//                   </TouchableOpacity>

//                   {damageData.damagePhoto && (
//                     <Image
//                       source={{ uri: damageData.damagePhoto }}
//                       style={tw`w-full h-40 rounded-lg mb-2`}
//                     />
//                   )}

//                   {/* Description */}
//                   <TextInput
//                     placeholder="Enter damage description"
//                     value={damageData.damageDescription}
//                     onChangeText={(t) =>
//                       setDamageData({ ...damageData, damageDescription: t })
//                     }
//                     style={tw`border border-gray-300 rounded-lg p-2 mb-2`}
//                   />

//                   {/* Severity */}
//                   <Text style={tw`text-gray-700 mb-1`}>Severity</Text>
//                   <View style={tw`flex-row justify-between mb-3`}>
//                     {["minor", "moderate", "severe"].map((level) => (
//                       <TouchableOpacity
//                         key={level}
//                         onPress={() =>
//                           setDamageData({
//                             ...damageData,
//                             damageSeverity: level,
//                           })
//                         }
//                         style={tw.style(
//                           "flex-1 mx-1 py-2 border rounded-lg items-center",
//                           damageData.damageSeverity === level
//                             ? "border-green-600 bg-green-50"
//                             : "border-gray-300"
//                         )}
//                       >
//                         <Text style={tw`capitalize`}>{level}</Text>
//                       </TouchableOpacity>
//                     ))}
//                   </View>

//                   {/* Repair Required */}
//                   <TouchableOpacity
//                     onPress={() =>
//                       setDamageData({
//                         ...damageData,
//                         repairRequired: !damageData.repairRequired,
//                       })
//                     }
//                     style={tw`flex-row items-center justify-center mb-4`}
//                   >
//                     <AppIcon
//                       name={
//                         damageData.repairRequired
//                           ? "check-square-o"
//                           : "square-o"
//                       }
//                       size={20}
//                       color="#065f46"
//                     />
//                     <Text style={tw`ml-2 text-gray-700`}>Repair Required</Text>
//                   </TouchableOpacity>

//                   {/* Buttons */}
//                   <View style={tw`flex-row justify-between`}>
//                     <TouchableOpacity
//                       onPress={() => setIsModalVisible(false)}
//                       style={tw`bg-gray-400 px-4 py-2 rounded-lg`}
//                     >
//                       <Text style={tw`text-white`}>Cancel</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       onPress={handleAddDamage}
//                       style={tw`bg-green-700 px-4 py-2 rounded-lg`}
//                     >
//                       <Text style={tw`text-white`}>Save</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>
//             </Modal>

//             {/* Road Test */}
//             <View style={tw`mt-4`}>
//               <Text style={tw`text-gray-500 mb-1`}>Road Test</Text>
//               <View style={tw`flex-row justify-between`}>
//                 {["Yes", "No"].map((option) => (
//                   <TouchableOpacity
//                     key={option}
//                     style={tw.style(
//                       "flex-1 items-center justify-center border rounded-lg py-6 mx-1",
//                       roadTest === option
//                         ? "border-green-600 bg-green-50"
//                         : "border-gray-300 bg-white"
//                     )}
//                     onPress={() => handleSelect("roadTest", option)}
//                   >
//                     <Text style={tw`text-gray-700`}>{option}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               {/* Comments */}
//               <View style={tw`mt-4`}>
//                 <Text style={tw`text-gray-500 mb-1`}>Road Test Comments</Text>
//                 <TextInput
//                   value={roadTestComments}
//                   onChangeText={(value) =>
//                     handleTextChange("roadTestComments", value)
//                   }
//                   placeholder="Enter comments"
//                   style={tw`border border-gray-300 rounded-lg p-3 bg-white h-20`}
//                   multiline
//                 />
//               </View>

//               {/* 🎤 Road Test Voice Memo (only if Road Test = Yes) */}
//               {roadTest === "Yes" && (
//                 <View style={tw`flex-row justify-center mt-3`}>
//                   <TouchableOpacity
//                     // onPress={toggleRoadRecording}
//                     style={{
//                       backgroundColor: isRoadRecording ? "red" : "green",
//                       padding: 14,
//                       borderRadius: 50,
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Image
//                       source={isRoadRecording ? redmic : greenmic}
//                       style={{ width: 30, height: 30, tintColor: "white" }}
//                       resizeMode="contain"
//                     />
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>
//             {/* General Comments + Voice */}
//             <View style={tw`mt-4`}>
//               <Text style={tw`text-gray-500 mb-1`}>General Comments</Text>

//               <TextInput
//                 value={generalComments}
//                 onChangeText={(value) =>
//                   handleTextChange("generalComments", value)
//                 }
//                 placeholder="Enter comments"
//                 style={tw`border border-gray-300 rounded-lg p-3 bg-white h-20`}
//                 multiline
//               />

//               {/* 🎤 Voice Button */}
//               {/* <View style={tw`flex-row justify-center mt-3`}>
//                 <TouchableOpacity
//                   onPress={toggleRecording}
//                   style={{
//                     backgroundColor: isRecording ? "red" : "green",
//                     padding: 14,
//                     borderRadius: 50,
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Image
//                     source={isRecording ? redmic : greenmic}
//                     style={{ width: 30, height: 30, tintColor: "white" }}
//                     resizeMode="contain"
//                   />
//                 </TouchableOpacity>
//               </View> */}

//               {error ? (
//                 <Text style={tw`text-red-500 text-xs mt-2 text-center`}>
//                   {error}
//                 </Text>
//               ) : null}
//             </View>
//           </ScrollView>

//           {/* Submit Button */}
//           <View
//             style={tw`absolute bottom-0 left-0 right-0 px-4 pb-4 bg-white mb-8`}
//           >
//             <TouchableOpacity
//               style={tw`bg-green-700 py-2 rounded-xl`}
//               onPress={handleSubmit}
//             >
//               <Text style={tw`text-white text-center text-lg font-semibold`}>
//                 Submit
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaWrapper>
//   );
// }

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   Image,
//   PermissionsAndroid,
//   Platform,
//   Modal,
//   KeyboardAvoidingView,
//   ActivityIndicator,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import * as ImagePicker from "react-native-image-picker";
// import {
//   setInspectionData,
//   resetInspection,
// } from "../redux/slices/inspectionSlice";
// import AppIcon from "../components/AppIcon";
// import SafeAreaWrapper from "../components/SafeAreaWrapper";
// import API_BASE_URL from "../../utils/config";
// import { signUrl } from "../../utils/inspectionFunctions"; // ← For preview

// import greenmic from "../../assets/greenmic.png";
// import redmic from "../../assets/redmic.png";

// export default function InspectionWizardStepSix({ navigation }) {
//   const dispatch = useDispatch();
//   const inspectionData = useSelector((state) => state.inspection);
//   const {
//     damagePresent,
//     damages = [],
//     roadTest,
//     roadTestComments,
//     generalComments,
//   } = inspectionData;

//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [previewUrls, setPreviewUrls] = useState({}); // ← YEHI ADD KARO
//   const [damageData, setDamageData] = useState({
//     key: null,
//     uri: null, // local uri
//     description: "",
//     severity: "minor",
//     repairRequired: false,
//   });
//   const inspectionId = useSelector((state) => state.inspection._id);
//   const [syncing, setSyncing] = useState(false);
//   const [deletingIndex, setDeletingIndex] = useState(null);

//   // Load preview when damage key changes
//   // useEffect(() => {
//   //   if (damageData.key && !previewUrl) {
//   //     signUrl(damageData.key).then((url) => {
//   //       if (url) setPreviewUrl(url);
//   //     });
//   //   }
//   // }, [damageData.key]);
//   // Add this useEffect after the first one
//   useEffect(() => {
//     const loadDamagePreviews = async () => {
//       const urls = { ...previewUrls };
//       let hasNew = false;

//       for (const d of damages) {
//         if (d.key && !urls[d.key]) {
//           try {
//             const signed = await signUrl(d.key);
//             if (signed) {
//               urls[d.key] = signed;
//               hasNew = true;
//             }
//           } catch (err) {
//             console.log("Failed to sign damage URL:", err);
//           }
//         }
//       }

//       if (hasNew) {
//         setPreviewUrls(urls);
//       }
//     };

//     if (damages.length > 0) {
//       loadDamagePreviews();
//     }
//   }, [damages]);
//   // Pick + Upload Damage Image
//   const pickAndUploadDamageImage = async () => {
//     try {
//       setUploading(true);

//       // GALLERY ONLY
//       const result = await ImagePicker.launchImageLibrary({
//         mediaType: "photo",
//         quality: 0.8,
//       });

//       if (result.didCancel || !result.assets?.[0]?.uri) {
//         setUploading(false);
//         return;
//       }

//       const uri = result.assets[0].uri;

//       // 1. Get Presigned URL
//       const res = await fetch(`${API_BASE_URL}/inspections/presigned`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ fileType: "image/jpeg" }),
//       });

//       if (!res.ok) throw new Error("Presigned URL failed");
//       const { url: presignedUrl, key } = await res.json();

//       // 2. Upload to S3
//       const imgResp = await fetch(uri);
//       const blob = await imgResp.blob();
//       const uploadRes = await fetch(presignedUrl, {
//         method: "PUT",
//         headers: { "Content-Type": "image/jpeg" },
//         body: blob,
//       });

//       if (!uploadRes.ok) throw new Error("Upload failed");

//       console.log("Damage image uploaded with key:", key);

//       // 3. Save key + local uri
//       setDamageData((prev) => ({ ...prev, key, uri }));
//       const signed = await signUrl(key);
//       if (signed) setPreviewUrl(signed);
//     } catch (err) {
//       console.log("Damage upload error:", err);
//       Alert.alert("Upload Failed", "Could not upload damage photo.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Add Damage to Redux
//   const handleAddDamage = async () => {
//     if (!damageData.key || !damageData.description) {
//       Alert.alert("Incomplete", "Please upload photo and add description.");
//       return;
//     }

//     const newDamage = {
//       key: damageData.key,
//       description: damageData.description,
//       severity: damageData.severity,
//       repairRequired: damageData.repairRequired,
//     };

//     // Optimistic UI
//     const updatedDamages = [...damages, newDamage];
//     dispatch(setInspectionData({ field: "damages", value: updatedDamages }));

//     const signed = await signUrl(damageData.key);
//     if (signed) {
//       setPreviewUrls((prev) => ({ ...prev, [damageData.key]: signed }));
//     }

//     setSyncing(true);

//     if (inspectionId) {
//       try {
//         const payload = {
//           damageImage: damageData.key,
//           damageDescription: damageData.description,
//           damageSeverity:
//             damageData.severity.charAt(0).toUpperCase() +
//             damageData.severity.slice(1),
//           repairRequired: damageData.repairRequired ? "Yes" : "No",
//         };

//         const res = await fetch(
//           `${API_BASE_URL}/inspections/${inspectionId}/damages`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//           }
//         );

//         // YEHI JAGAH HAI — ISKE BAAD YE 5 LINES ADD/REPLACE KARO
//         if (!res.ok) throw new Error("Failed to save damage");

//         // ← YEHI NAYA CODE ADD KARO
//         const savedDamage = await res.json();
//         const damageWithId = { ...newDamage, _id: savedDamage._id };

//         // ← PURANA DISPATCH (optimistic) hatao, YE NAYA DAALO
//         dispatch(
//           setInspectionData({
//             field: "damages",
//             value: [...damages, damageWithId],
//           })
//         );
//         // ↑ YEH LINE PEHLE SE HAI? → HATA DO (optimistic wali)
//         // ↑ ISKE JAGAH UPAR WALI DAALO

//         console.log("Damage synced with _id:", savedDamage._id);
//       } catch (err) {
//         // ... catch block
//       }
//     }

//     setSyncing(false);
//     // Reset
//     setDamageData({
//       key: null,
//       uri: null,
//       description: "",
//       severity: "minor",
//       repairRequired: false,
//     });
//     setPreviewUrl(null);
//     setIsModalVisible(false);
//   };

//   const handleDeleteDamage = async (index) => {
//     const damageToDelete = damages[index];
//     if (!damageToDelete?._id) return;

//     setDeletingIndex(index);

//     // Optimistic UI Update
//     const updatedDamages = damages.filter((_, i) => i !== index);
//     dispatch(setInspectionData({ field: "damages", value: updatedDamages }));

//     // Remove preview
//     const newPreviews = { ...previewUrls };
//     delete newPreviews[damageToDelete.key];
//     setPreviewUrls(newPreviews);

//     if (inspectionId) {
//       try {
//         const res = await fetch(
//           `${API_BASE_URL}/inspections/${inspectionId}/damages/${damageToDelete._id}`,
//           {
//             method: "DELETE",
//             headers: { "Content-Type": "application/json" },
//           }
//         );

//         if (!res.ok) {
//           const err = await res.text();
//           throw new Error(err || "Failed to delete damage");
//         }

//         console.log("Damage deleted from backend:", damageToDelete._id);
//       } catch (err) {
//         console.log("Delete error:", err);
//         Alert.alert(
//           "Sync Failed",
//           "Damage removed locally but not from server."
//         );

//         // REVERT UI
//         dispatch(setInspectionData({ field: "damages", value: damages }));
//         // setPreviewUrls(previewUrls);
//         setPreviewUrls({ ...previewUrls });
//       }
//     } else {
//       console.log("No inspection ID — local delete only");
//     }

//     setDeletingIndex(null);
//   };
//   const handleSelect = (field, value) => {
//     dispatch(setInspectionData({ field, value }));
//   };

//   const handleTextChange = (field, value) => {
//     dispatch(setInspectionData({ field, value }));
//   };

// const handleSubmit = async () => {
//   try {
//     console.log(
//       "Final Inspection Data:",
//       JSON.stringify(inspectionData, null, 2)
//     );

//     if (!inspectionData.vin || inspectionData.vin.length !== 17) {
//       Alert.alert("Invalid VIN", "VIN must be 17 characters.");
//       return;
//     }

//     const finalPayload = {
//       vin: inspectionData.vin,
//       make: inspectionData.make,
//       carModel: inspectionData.model,
//       year: inspectionData.year || "2025",
//       engineNumber: inspectionData.engineNumber || "123xyz",
//       mileAge: Number(inspectionData.mileAge) || 0,
//       registrationPlate: inspectionData.registrationPlate || "ABC-123",
//       registrationExpiry: inspectionData.registrationExpiry || "2026-05-12",
//       buildDate: inspectionData.buildDate || "2020-02-01",
//       complianceDate: inspectionData.complianceDate || "2020-04-15",
//       overallRating: 0,
//       inspectorEmail: "muhammadanasrashid18@gmail.com",
//       frontImage: inspectionData.images.frontImage || {
//         original: "s3://...",
//         analyzed: "s3://...",
//       },
//       rearImage: inspectionData.images.rearImage || {
//         original: "s3://...",
//         analyzed: "s3://...",
//       },
//       leftImage: inspectionData.images.leftImage || {
//         original: "s3://...",
//         analyzed: "s3://...",
//       },
//       rightImage: inspectionData.images.rightImage || {
//         original: "s3://...",
//         analyzed: "s3://...",
//       },
//       engineImage: inspectionData.images.engineImage || {
//         original: "s3://...",
//         analyzed: "s3://...",
//       },
//       plateImage: inspectionData.images.VINPlate || {
//         original: "s3://...",
//         analyzed: "s3://...",
//       },
//       interiorFrontImage: inspectionData.images.InteriorFront || {
//         original: "s3://...",
//         analyzed: "s3://...",
//       },
//       interiorBackImage: inspectionData.images.InteriorBack || {
//         original: "s3://...",
//         analyzed: "s3://...",
//       },
//       odometer: inspectionData.odometer || "45200",
//       odometerImage: inspectionData.odometerImage || "uploads/odometer.jpg",
//       fuelType: inspectionData.fuelType || "Petrol",
//       driveTrain: inspectionData.driveTrain || "AWD",
//       transmission: inspectionData.transmission || "Automatic",
//       bodyType: inspectionData.bodyType || "Sedan",
//       color: inspectionData.color || "Blue",
//       frontWheelDiameter: inspectionData.frontWheelDiameter || "17",
//       rearWheelDiameter: inspectionData.rearWheelDiameter || "17",
//       keysPresent: inspectionData.keysPresent ?? "true",
//       serviceBookPresent: inspectionData.serviceBookPresent ?? "true",
//       // bookImages: inspectionData.bookImages?.map((i) => i.key) || [],
//       bookImages: (inspectionData.bookImages || [])
//         .filter((i) => i && i.key) // ← Null/undefined filter
//         .map((i) => i.key),
//       serviceHistoryPresent: inspectionData.serviceHistoryPresent ?? "true",
//       lastServiceDate: inspectionData.lastServiceDate || "2025-10-15",
//       serviceCenterName: inspectionData.serviceCenterName || "Toyota Service",
//       odometerAtLastService: inspectionData.odometerAtLastService || 45200,
//       serviceRecordDocumentKey: inspectionData.serviceRecordDocumentKey || "",
//       tyreConditionFrontLeft: inspectionData.tyreConditionFrontLeft || "Good",
//       tyreConditionFrontRight:
//         inspectionData.tyreConditionFrontRight || "Good",
//       tyreConditionRearRight: inspectionData.tyreConditionRearRight || "Fair",
//       tyreConditionRearLeft: inspectionData.tyreConditionRearLeft || "Fair",
//       damagePresent: damagePresent === "Yes",
//       // damages: damages.map((d) => ({
//       //   original: d.damagePhoto, // ← S3 key
//       //   description: d.damageDescription,
//       //   type: d.damageSeverity,
//       // })),
//       damages: (damages || [])
//         .filter((d) => d && d.key)
//         .map((d) => ({
//           damageImage: d.key, // S3 key
//           damageDescription: d.description || "",
//           damageSeverity:
//             d.severity.charAt(0).toUpperCase() + d.severity.slice(1), // "minor" → "Minor"
//           repairRequired: d.repairRequired ? "Yes" : "No", // String "Yes"/"No"
//         })),
//       roadTest: roadTest === "Yes",
//       roadTestComments: roadTestComments || "",
//       generalComments: generalComments || "",
//     };

//     console.log("Sending Payload:", JSON.stringify(finalPayload, null, 2));

//     if (inspectionData._id) {
//       await axios.put(
//         `${API_BASE_URL}/inspections/${inspectionData._id}`,
//         finalPayload
//       );
//     } else {
//       await axios.post(`${API_BASE_URL}/inspections`, finalPayload);
//     }

//     dispatch(resetInspection());
//     Alert.alert("Success", "Inspection submitted!");
//     navigation.navigate("MainTabs");
//   } catch (err) {
//     const msg = err.response?.data?.message || err.message;
//     console.error("Submit error:", msg);
//     Alert.alert("Error", msg);
//   }
// };

//   const handleBack = () => navigation.goBack();

//   return (
//     <SafeAreaWrapper>
//       <KeyboardAvoidingView
//         style={tw`flex-1`}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         <View style={tw`flex-1 bg-white`}>
//           {/* Header */}
//           <View style={tw`flex-row items-center mb-6 px-4 pt-4`}>
//             <TouchableOpacity onPress={handleBack} style={tw`mr-4`}>
//               <AppIcon name="arrow-left" size={24} color="#065f46" />
//             </TouchableOpacity>
//             <Text style={tw`text-lg font-bold text-green-800`}>
//               Inspection Wizard
//             </Text>
//           </View>

//           <ScrollView style={tw`px-6`} contentContainerStyle={tw`pb-20`}>
//             {/* Damage Present */}
//             <View style={tw`mt-4`}>
//               <Text style={tw`text-gray-500 mb-1`}>
//                 Is There Any Damage Present
//               </Text>
//               <View style={tw`flex-row justify-between`}>
//                 {["Yes", "No"].map((option) => (
//                   <TouchableOpacity
//                     key={option}
//                     style={tw.style(
//                       "flex-1 items-center justify-center border rounded-lg py-6 mx-1",
//                       damagePresent === option
//                         ? "border-green-600 bg-green-50"
//                         : "border-gray-300 bg-white"
//                     )}
//                     onPress={() => handleSelect("damagePresent", option)}
//                   >
//                     <Text style={tw`text-gray-700`}>{option}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Add Damage Button */}
//             {damagePresent === "Yes" && (
//               <View style={tw`mt-6`}>
//                 <View style={tw`flex-row justify-between items-center mb-2`}>
//                   <Text style={tw`text-gray-700 font-semibold`}>
//                     Recorded Damages
//                   </Text>
//                   <TouchableOpacity
//                     onPress={() => setIsModalVisible(true)}
//                     style={tw`bg-green-600 px-3 py-2 rounded-lg`}
//                   >
//                     <Text style={tw`text-white font-semibold`}>
//                       + Add Damage
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* {damages.length === 0 ? (
//                   <Text style={tw`text-gray-500`}>No damages recorded.</Text>
//                 ) : (
//                   damages.map((d, i) => (
//                     <View
//                       key={i}
//                       style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
//                     >
//                       {d.damagePhoto && (
//                         <Image
//                           source={{
//                             uri: `https://your-s3-bucket.s3.amazonaws.com/${
//                               d.damagePhoto
//                             }?t=${Date.now()}`,
//                           }}
//                           style={tw`w-full h-40 rounded-lg mb-2`}
//                           resizeMode="cover"
//                         />
//                       )}
//                       <Text style={tw`font-medium`}>{d.damageDescription}</Text>
//                       <Text style={tw`text-sm text-gray-600`}>
//                         Severity: {d.damageSeverity}
//                       </Text>
//                       <Text style={tw`text-sm text-gray-600`}>
//                         Repair: {d.repairRequired ? "Yes" : "No"}
//                       </Text>
//                     </View>
//                   ))
//                 )} */}
//                 {damages && damages.length > 0 ? (
//                   damages.map((d, i) =>
//                     d && d.key ? (
//                       // <View
//                       //   key={d.key}
//                       //   style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
//                       // >
//                       //   <Image
//                       //     source={{
//                       //       uri:
//                       //         previewUrls[d.key] ||
//                       //         `https://your-s3-bucket.s3.amazonaws.com/${
//                       //           d.key
//                       //         }?t=${Date.now()}`,
//                       //     }}
//                       //     style={tw`w-full h-40 rounded-lg mb-2`}
//                       //     resizeMode="cover"
//                       //   />
//                       //   <Text style={tw`font-medium`}>{d.description}</Text>
//                       //   <Text style={tw`text-sm text-gray-600`}>
//                       //     Severity: {d.severity}
//                       //   </Text>
//                       //   <Text style={tw`text-sm text-gray-600`}>
//                       //     Repair: {d.repairRequired ? "Yes" : "No"}
//                       //   </Text>
//                       // </View>
//                       <View
//                         key={d.key}
//                         style={tw`border border-gray-300 rounded-lg p-3 mb-3 relative`}
//                       >
//                         {/* Deleting Overlay */}
//                         {deletingIndex === i && (
//                           <View
//                             style={tw`absolute inset-0 bg-gray-300 bg-opacity-80 rounded-lg items-center justify-center z-10`}
//                           >
//                             <ActivityIndicator size="small" color="#fff" />
//                           </View>
//                         )}

//                         <Image
//                           source={{ uri: previewUrls[d.key] }}
//                           style={tw`w-full h-40 rounded-lg mb-2`}
//                           resizeMode="cover"
//                         />
//                         <Text style={tw`font-medium`}>{d.description}</Text>
//                         <Text style={tw`text-sm text-gray-600`}>
//                           Severity: {d.severity}
//                         </Text>
//                         <Text style={tw`text-sm text-gray-600`}>
//                           Repair: {d.repairRequired ? "Yes" : "No"}
//                         </Text>

//                         {/* DELETE BUTTON */}
//                         <TouchableOpacity
//                           onPress={() => handleDeleteDamage(i)}
//                           style={tw`absolute top-2 right-2 bg-red-600 p-1 rounded-full`}
//                         >
//                           <AppIcon name="close" size={16} color="white" />
//                         </TouchableOpacity>
//                       </View>
//                     ) : null
//                   )
//                 ) : (
//                   <Text style={tw`text-gray-500`}>No damages recorded.</Text>
//                 )}
//               </View>
//             )}

//             {/* Road Test */}
//             <View style={tw`mt-6`}>
//               <Text style={tw`text-gray-500 mb-1`}>Road Test</Text>
//               <View style={tw`flex-row justify-between`}>
//                 {["Yes", "No"].map((option) => (
//                   <TouchableOpacity
//                     key={option}
//                     style={tw.style(
//                       "flex-1 items-center justify-center border rounded-lg py-6 mx-1",
//                       roadTest === option
//                         ? "border-green-600 bg-green-50"
//                         : "border-gray-300 bg-white"
//                     )}
//                     onPress={() => handleSelect("roadTest", option)}
//                   >
//                     <Text style={tw`text-gray-700`}>{option}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {roadTest === "Yes" && (
//               <View style={tw`mt-4`}>
//                 <Text style={tw`text-gray-500 mb-1`}>Road Test Comments</Text>
//                 <TextInput
//                   value={roadTestComments}
//                   onChangeText={(v) => handleTextChange("roadTestComments", v)}
//                   placeholder="Enter comments"
//                   style={tw`border border-gray-300 rounded-lg p-3 h-20`}
//                   multiline
//                 />
//               </View>
//             )}

//             {/* General Comments */}
//             <View style={tw`mt-6`}>
//               <Text style={tw`text-gray-500 mb-1`}>General Comments</Text>
//               <TextInput
//                 value={generalComments}
//                 onChangeText={(v) => handleTextChange("generalComments", v)}
//                 placeholder="Enter comments"
//                 style={tw`border border-gray-300 rounded-lg p-3 h-20`}
//                 multiline
//               />
//             </View>
//           </ScrollView>

//           {/* Submit */}
//           <View
//             style={tw`absolute bottom-0 left-0 right-0 px-4 pb-4 bg-white mb-2`}
//           >
//             <TouchableOpacity
//               style={tw`bg-green-700 py-3 rounded-xl`}
//               onPress={handleSubmit}
//             >
//               <Text style={tw`text-white text-center text-lg font-semibold`}>
//                 Submit
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </KeyboardAvoidingView>

//       {/* Damage Modal */}
//       <Modal visible={isModalVisible} transparent animationType="slide">
//         <View style={tw`flex-1 justify-center bg-black bg-opacity-50 px-4`}>
//           <View style={tw`bg-white rounded-xl p-5`}>
//             <Text style={tw`text-lg font-bold text-center mb-4`}>
//               Add Damage
//             </Text>

//             {/* Upload Photo */}
//             <TouchableOpacity
//               onPress={pickAndUploadDamageImage}
//               disabled={uploading}
//               style={tw`bg-green-600 py-3 rounded-lg mb-3 items-center`}
//             >
//               {uploading ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={tw`text-white font-semibold`}>
//                   {damageData.key ? "Change Photo" : "Upload from Gallery"}
//                 </Text>
//               )}
//             </TouchableOpacity>

//             {previewUrl && (
//               <Image
//                 source={{ uri: previewUrl }}
//                 style={tw`w-full h-48 rounded-lg mb-3`}
//                 resizeMode="cover"
//               />
//             )}

//             {/* Description */}
//             <TextInput
//               placeholder="Damage description"
//               value={damageData.description}
//               onChangeText={(t) =>
//                 setDamageData({ ...damageData, description: t })
//               }
//               style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
//             />

//             {/* Severity */}
//             <Text style={tw`text-gray-700 mb-2`}>Severity</Text>
//             <View style={tw`flex-row mb-3`}>
//               {["minor", "moderate", "severe"].map((s) => (
//                 <TouchableOpacity
//                   key={s}
//                   onPress={() => setDamageData({ ...damageData, severity: s })}
//                   style={tw.style(
//                     "flex-1 mx-1 py-2 rounded-lg border items-center",
//                     damageData.severity === s
//                       ? "border-green-600 bg-green-50"
//                       : "border-gray-300"
//                   )}
//                 >
//                   <Text style={tw`capitalize`}>{s}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             {/* Repair Required */}
//             <TouchableOpacity
//               onPress={() =>
//                 setDamageData({
//                   ...damageData,
//                   repairRequired: !damageData.repairRequired,
//                 })
//               }
//               style={tw`flex-row items-center mb-4`}
//             >
//               <AppIcon
//                 name={damageData.repairRequired ? "check-square-o" : "square-o"}
//                 size={20}
//                 color="#065f46"
//               />
//               <Text style={tw`ml-2 text-gray-700`}>Repair Required</Text>
//             </TouchableOpacity>

//             {/* Buttons */}
//             <View style={tw`flex-row justify-between`}>
//               <TouchableOpacity
//                 onPress={() => {
//                   setIsModalVisible(false);
//                   setDamageData({
//                     key: null,
//                     uri: null,
//                     description: "",
//                     severity: "minor",
//                     repairRequired: false,
//                   });
//                   setPreviewUrl(null);
//                 }}
//                 style={tw`bg-gray-400 px-4 py-2 rounded-lg`}
//               >
//                 <Text style={tw`text-white`}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={handleAddDamage}
//                 disabled={syncing}
//                 style={tw`bg-green-700 px-4 py-2 rounded-lg`}
//               >
//                 {syncing ? (
//                   <ActivityIndicator size="small" color="white" />
//                 ) : (
//                   <Text style={tw`text-white`}>Save Damage</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaWrapper>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Platform,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "react-native-image-picker";
import {
  setInspectionData,
  resetInspection,
} from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import API_BASE_URL from "../../utils/config";
import { signUrl } from "../../utils/inspectionFunctions";
import axios from "axios";
export default function InspectionWizardStepSix({ navigation }) {
  const dispatch = useDispatch();
  const inspectionData = useSelector((state) => state.inspection);
  const {
    damagePresent,
    damages = [],
    roadTest,
    roadTestComments,
    generalComments,
  } = inspectionData;

  const inspectionId = useSelector((state) => state.inspection._id);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewUrls, setPreviewUrls] = useState({});

  const [damageData, setDamageData] = useState({
    key: null,
    uri: null,
    description: "",
    severity: "minor",
    repairRequired: false,
  });

  // Load previews
  useEffect(() => {
    const loadDamagePreviews = async () => {
      const urls = { ...previewUrls };
      let hasNew = false;
      for (const d of damages) {
        if (d.key && !urls[d.key]) {
          try {
            const signed = await signUrl(d.key);
            if (signed) {
              urls[d.key] = signed;
              hasNew = true;
            }
          } catch (err) {
            console.log("Failed to sign URL:", err);
          }
        }
      }
      if (hasNew) setPreviewUrls(urls);
    };
    if (damages.length > 0) loadDamagePreviews();
  }, [damages]);

  // Pick + Upload Image
  const pickAndUploadDamageImage = async () => {
    try {
      setUploading(true);
      const result = await ImagePicker.launchImageLibrary({
        mediaType: "photo",
        quality: 0.8,
      });

      if (result.didCancel || !result.assets?.[0]?.uri) {
        setUploading(false);
        return;
      }

      const uri = result.assets[0].uri;

      const res = await fetch(`${API_BASE_URL}/inspections/presigned`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileType: "image/jpeg" }),
      });

      if (!res.ok) throw new Error("Presigned URL failed");
      const { url: presignedUrl, key } = await res.json();

      const imgResp = await fetch(uri);
      const blob = await imgResp.blob();
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: blob,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      setDamageData((prev) => ({ ...prev, key, uri }));
      const signed = await signUrl(key);
      if (signed) setPreviewUrl(signed);
    } catch (err) {
      Alert.alert("Upload Failed", "Could not upload photo.");
    } finally {
      setUploading(false);
    }
  };

  // ADD DAMAGE
  const handleAddDamage = async () => {
    if (!damageData.key || !damageData.description) {
      Alert.alert("Incomplete", "Upload photo and add description.");
      return;
    }

    const newDamage = {
      key: damageData.key,
      description: damageData.description,
      severity: damageData.severity,
      repairRequired: damageData.repairRequired,
    };

    const updatedDamages = [...damages, newDamage];
    dispatch(setInspectionData({ field: "damages", value: updatedDamages }));

    const signed = await signUrl(damageData.key);
    if (signed)
      setPreviewUrls((prev) => ({ ...prev, [damageData.key]: signed }));

    setSyncing(true);
    if (inspectionId) {
      try {
        const payload = {
          damageImage: damageData.key,
          damageDescription: damageData.description,
          damageSeverity:
            damageData.severity.charAt(0).toUpperCase() +
            damageData.severity.slice(1),
          repairRequired: damageData.repairRequired ? "Yes" : "No",
        };

        const res = await fetch(
          `${API_BASE_URL}/inspections/${inspectionId}/damages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) throw new Error("Failed to save");

        const saved = await res.json();
        const withId = { ...newDamage, _id: saved._id };
        dispatch(
          setInspectionData({ field: "damages", value: [...damages, withId] })
        );
      } catch (err) {
        Alert.alert("Sync Failed", "Saved locally.");
        dispatch(setInspectionData({ field: "damages", value: damages }));
        const p = { ...previewUrls };
        delete p[damageData.key];
        setPreviewUrls(p);
      }
    }
    setSyncing(false);
    resetModal();
  };

  // EDIT DAMAGE (PATCH API)
  const handleEditDamage = async () => {
    if (!damageData.key || !damageData.description) {
      Alert.alert("Incomplete", "Photo and description required.");
      return;
    }

    const oldDamage = damages[editingIndex];
    const updatedDamage = {
      ...oldDamage,
      key: damageData.key,
      description: damageData.description,
      severity: damageData.severity,
      repairRequired: damageData.repairRequired,
    };

    // Optimistic UI
    const updatedDamages = damages.map((d, i) =>
      i === editingIndex ? updatedDamage : d
    );
    dispatch(setInspectionData({ field: "damages", value: updatedDamages }));

    const signed = await signUrl(damageData.key);
    if (signed)
      setPreviewUrls((prev) => ({ ...prev, [damageData.key]: signed }));

    setSyncing(true);
    if (inspectionId && oldDamage._id) {
      try {
        const payload = {
          damageImage: damageData.key,
          damageDescription: damageData.description,
          damageSeverity:
            damageData.severity.charAt(0).toUpperCase() +
            damageData.severity.slice(1),
          repairRequired: damageData.repairRequired ? "Yes" : "No",
        };

        const res = await fetch(
          `${API_BASE_URL}/inspections/${inspectionId}/damages/${oldDamage._id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) throw new Error("Update failed");

        // Success → keep updated
        console.log("Damage updated:", oldDamage._id);
      } catch (err) {
        Alert.alert("Update Failed", "Reverting changes.");
        dispatch(setInspectionData({ field: "damages", value: damages }));
        setPreviewUrls(previewUrls);
      }
    }
    setSyncing(false);
    resetModal();
  };

  // DELETE DAMAGE
  const handleDeleteDamage = async (index) => {
    const damage = damages[index];
    if (!damage?._id && inspectionId) return;

    setDeletingIndex(index);
    const updated = damages.filter((_, i) => i !== index);
    dispatch(setInspectionData({ field: "damages", value: updated }));

    const p = { ...previewUrls };
    delete p[damage.key];
    setPreviewUrls(p);

    if (inspectionId && damage._id) {
      try {
        const res = await fetch(
          `${API_BASE_URL}/inspections/${inspectionId}/damages/${damage._id}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("Delete failed");
      } catch (err) {
        Alert.alert("Sync Failed", "Reverting delete.");
        dispatch(setInspectionData({ field: "damages", value: damages }));
        setPreviewUrls(previewUrls);
      }
    }
    setDeletingIndex(null);
  };

  // Open Edit Modal
  const openEditModal = (index) => {
    const d = damages[index];
    setDamageData({
      key: d.key,
      uri: null,
      description: d.description,
      severity: d.severity,
      repairRequired: d.repairRequired,
    });
    setPreviewUrl(previewUrls[d.key] || null);
    setEditingIndex(index);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  // Reset Modal
  const resetModal = () => {
    setIsModalVisible(false);
    setIsEditMode(false);
    setEditingIndex(null);
    setDamageData({
      key: null,
      uri: null,
      description: "",
      severity: "minor",
      repairRequired: false,
    });
    setPreviewUrl(null);
  };

  const handleSelect = (field, value) =>
    dispatch(setInspectionData({ field, value }));
  const handleTextChange = (field, value) =>
    dispatch(setInspectionData({ field, value }));

  const handleSubmit = async () => {
    try {
      console.log(
        "Final Inspection Data:",
        JSON.stringify(inspectionData, null, 2)
      );

      if (!inspectionData.vin || inspectionData.vin.length !== 17) {
        Alert.alert("Invalid VIN", "VIN must be 17 characters.");
        return;
      }

      const finalPayload = {
        vin: inspectionData.vin,
        make: inspectionData.make,
        carModel: inspectionData.model,
        year: inspectionData.year || "2025",
        engineNumber: inspectionData.engineNumber || "123xyz",
        mileAge: Number(inspectionData.mileAge) || 0,
        registrationPlate: inspectionData.registrationPlate || "ABC-123",
        registrationExpiry: inspectionData.registrationExpiry || "2026-05-12",
        buildDate: inspectionData.buildDate || "2020-02-01",
        complianceDate: inspectionData.complianceDate || "2020-04-15",
        overallRating: 0,
        inspectorEmail: "muhammadanasrashid18@gmail.com",
        frontImage: inspectionData.images.frontImage || {
          original: "s3://...",
          analyzed: "s3://...",
        },
        rearImage: inspectionData.images.rearImage || {
          original: "s3://...",
          analyzed: "s3://...",
        },
        leftImage: inspectionData.images.leftImage || {
          original: "s3://...",
          analyzed: "s3://...",
        },
        rightImage: inspectionData.images.rightImage || {
          original: "s3://...",
          analyzed: "s3://...",
        },
        engineImage: inspectionData.images.engineImage || {
          original: "s3://...",
          analyzed: "s3://...",
        },
        plateImage: inspectionData.images.VINPlate || {
          original: "s3://...",
          analyzed: "s3://...",
        },
        interiorFrontImage: inspectionData.images.InteriorFront || {
          original: "s3://...",
          analyzed: "s3://...",
        },
        interiorBackImage: inspectionData.images.InteriorBack || {
          original: "s3://...",
          analyzed: "s3://...",
        },
        odometer: inspectionData.odometer || "45200",
        odometerImage: inspectionData.odometerImage || "uploads/odometer.jpg",
        fuelType: inspectionData.fuelType || "Petrol",
        driveTrain: inspectionData.driveTrain || "AWD",
        transmission: inspectionData.transmission || "Automatic",
        bodyType: inspectionData.bodyType || "Sedan",
        color: inspectionData.color || "Blue",
        frontWheelDiameter: inspectionData.frontWheelDiameter || "17",
        rearWheelDiameter: inspectionData.rearWheelDiameter || "17",
        keysPresent: inspectionData.keysPresent ?? "true",
        serviceBookPresent: inspectionData.serviceBookPresent ?? "true",
        // bookImages: inspectionData.bookImages?.map((i) => i.key) || [],
        bookImages: (inspectionData.bookImages || [])
          .filter((i) => i && i.key) // ← Null/undefined filter
          .map((i) => i.key),
        serviceHistoryPresent: inspectionData.serviceHistoryPresent ?? "true",
        lastServiceDate: inspectionData.lastServiceDate || "2025-10-15",
        serviceCenterName: inspectionData.serviceCenterName || "Toyota Service",
        odometerAtLastService: inspectionData.odometerAtLastService || 45200,
        serviceRecordDocumentKey: inspectionData.serviceRecordDocumentKey || "",
        tyreConditionFrontLeft: inspectionData.tyreConditionFrontLeft || "Good",
        tyreConditionFrontRight:
          inspectionData.tyreConditionFrontRight || "Good",
        tyreConditionRearRight: inspectionData.tyreConditionRearRight || "Fair",
        tyreConditionRearLeft: inspectionData.tyreConditionRearLeft || "Fair",
        damagePresent: damagePresent === "Yes",
        // damages: damages.map((d) => ({
        //   original: d.damagePhoto, // ← S3 key
        //   description: d.damageDescription,
        //   type: d.damageSeverity,
        // })),
        damages: (damages || [])
          .filter((d) => d && d.key)
          .map((d) => ({
            damageImage: d.key, // S3 key
            damageDescription: d.description || "",
            damageSeverity:
              d.severity.charAt(0).toUpperCase() + d.severity.slice(1), // "minor" → "Minor"
            repairRequired: d.repairRequired ? "Yes" : "No", // String "Yes"/"No"
          })),
        roadTest: roadTest === "Yes",
        roadTestComments: roadTestComments || "",
        generalComments: generalComments || "",
      };

      console.log("Sending Payload:", JSON.stringify(finalPayload, null, 2));

      if (inspectionData._id) {
        await axios.put(
          `${API_BASE_URL}/inspections/${inspectionData._id}`,
          finalPayload
        );
      } else {
        await axios.post(`${API_BASE_URL}/inspections`, finalPayload);
      }

      dispatch(resetInspection());
      Alert.alert("Success", "Inspection submitted!");
      navigation.navigate("MainTabs");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.error("Submit error:", msg);
      Alert.alert("Error", msg);
    }
  };

  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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

            {/* Recorded Damages */}
            {damagePresent === "Yes" && (
              <View style={tw`mt-6`}>
                <View style={tw`flex-row justify-between items-center mb-2`}>
                  <Text style={tw`text-gray-700 font-semibold`}>
                    Recorded Damages
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setIsEditMode(false);
                      setIsModalVisible(true);
                    }}
                    style={tw`bg-green-600 px-3 py-2 rounded-lg`}
                  >
                    <Text style={tw`text-white font-semibold`}>
                      + Add Damage
                    </Text>
                  </TouchableOpacity>
                </View>

                {damages.length > 0 ? (
                  damages.map((d, i) =>
                    d && d.key ? (
                      <View
                        key={d.key}
                        style={tw`border border-gray-300 rounded-lg p-3 mb-3 relative`}
                      >
                        {deletingIndex === i && (
                          <View
                            style={tw`absolute inset-0 bg-gray-300 bg-opacity-80 rounded-lg items-center justify-center z-10`}
                          >
                            <ActivityIndicator size="small" color="#fff" />
                          </View>
                        )}

                        <Image
                          source={{ uri: previewUrls[d.key] }}
                          style={tw`w-full h-40 rounded-lg mb-2`}
                          resizeMode="cover"
                        />
                        <Text style={tw`font-medium`}>{d.description}</Text>
                        <Text style={tw`text-sm text-gray-600`}>
                          Severity: {d.severity}
                        </Text>
                        <Text style={tw`text-sm text-gray-600`}>
                          Repair: {d.repairRequired ? "Yes" : "No"}
                        </Text>

                        {/* EDIT BUTTON */}
                        <TouchableOpacity
                          onPress={() => openEditModal(i)}
                          style={tw`absolute top-2 left-2 bg-blue-600 p-1 rounded-full`}
                        >
                          <AppIcon name="pencil" size={16} color="white" />
                        </TouchableOpacity>

                        {/* DELETE BUTTON */}
                        <TouchableOpacity
                          onPress={() => handleDeleteDamage(i)}
                          style={tw`absolute top-2 right-2 bg-red-600 p-1 rounded-full`}
                        >
                          <AppIcon name="close" size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    ) : null
                  )
                ) : (
                  <Text style={tw`text-gray-500`}>No damages recorded.</Text>
                )}
              </View>
            )}

            {/* Road Test */}
            <View style={tw`mt-6`}>
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

            {roadTest === "Yes" && (
              <View style={tw`mt-4`}>
                <Text style={tw`text-gray-500 mb-1`}>Road Test Comments</Text>
                <TextInput
                  value={roadTestComments}
                  onChangeText={(v) => handleTextChange("roadTestComments", v)}
                  placeholder="Enter comments"
                  style={tw`border border-gray-300 rounded-lg p-3 h-20`}
                  multiline
                />
              </View>
            )}

            {/* General Comments */}
            <View style={tw`mt-6`}>
              <Text style={tw`text-gray-500 mb-1`}>General Comments</Text>
              <TextInput
                value={generalComments}
                onChangeText={(v) => handleTextChange("generalComments", v)}
                placeholder="Enter comments"
                style={tw`border border-gray-300 rounded-lg p-3 h-20`}
                multiline
              />
            </View>
          </ScrollView>

          {/* Submit */}
          <View
            style={tw`absolute bottom-0 left-0 right-0 px-4 pb-4 bg-white mb-2`}
          >
            <TouchableOpacity
              style={tw`bg-green-700 py-3 rounded-xl`}
              onPress={handleSubmit}
            >
              <Text style={tw`text-white text-center text-lg font-semibold`}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Add/Edit Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={tw`flex-1 justify-center bg-black bg-opacity-50 px-4`}>
          <View style={tw`bg-white rounded-xl p-5`}>
            <Text style={tw`text-lg font-bold text-center mb-4`}>
              {isEditMode ? "Edit Damage" : "Add Damage"}
            </Text>

            <TouchableOpacity
              onPress={pickAndUploadDamageImage}
              disabled={uploading}
              style={tw`bg-green-600 py-3 rounded-lg mb-3 items-center`}
            >
              {uploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={tw`text-white font-semibold`}>
                  {damageData.key ? "Change Photo" : "Upload from Gallery"}
                </Text>
              )}
            </TouchableOpacity>

            {previewUrl && (
              <Image
                source={{ uri: previewUrl }}
                style={tw`w-full h-48 rounded-lg mb-3`}
                resizeMode="cover"
              />
            )}

            <TextInput
              placeholder="Damage description"
              value={damageData.description}
              onChangeText={(t) =>
                setDamageData({ ...damageData, description: t })
              }
              style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
            />

            <Text style={tw`text-gray-700 mb-2`}>Severity</Text>
            <View style={tw`flex-row mb-3`}>
              {["minor", "moderate", "severe"].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setDamageData({ ...damageData, severity: s })}
                  style={tw.style(
                    "flex-1 mx-1 py-2 rounded-lg border items-center",
                    damageData.severity === s
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300"
                  )}
                >
                  <Text style={tw`capitalize`}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() =>
                setDamageData({
                  ...damageData,
                  repairRequired: !damageData.repairRequired,
                })
              }
              style={tw`flex-row items-center mb-4`}
            >
              <AppIcon
                name={damageData.repairRequired ? "check-square-o" : "square-o"}
                size={20}
                color="#065f46"
              />
              <Text style={tw`ml-2 text-gray-700`}>Repair Required</Text>
            </TouchableOpacity>

            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                onPress={resetModal}
                style={tw`bg-gray-400 px-4 py-2 rounded-lg`}
              >
                <Text style={tw`text-white`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={isEditMode ? handleEditDamage : handleAddDamage}
                disabled={syncing}
                style={tw`bg-green-700 px-4 py-2 rounded-lg`}
              >
                {syncing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={tw`text-white`}>
                    {isEditMode ? "Update" : "Save"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaWrapper>
  );
}
