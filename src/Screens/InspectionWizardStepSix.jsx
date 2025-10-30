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
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import Voice from "@react-native-voice/voice";
// import {
//   setInspectionData,
//   resetInspection,
// } from "../redux/slices/inspectionSlice";
// import AppIcon from "../components/AppIcon";
// import SafeAreaWrapper from "../components/SafeAreaWrapper";
// import API_BASE_URL from "../../utils/config";

// import greenmic from "../../assets/greenmic.png";
// import redmic from "../../assets/redmic.png";

// export default function InspectionWizardStepSix({ navigation }) {
//   const dispatch = useDispatch();
//   const inspectionData = useSelector((state) => state.inspection);
//   const { damagePresent, roadTest, roadTestComments, generalComments } =
//     inspectionData;

//   const [isRecording, setIsRecording] = useState(false);
//   const [error, setError] = useState("");

//   // ✅ Voice Setup
//   useEffect(() => {
//     Voice.onSpeechResults = onSpeechResults;
//     Voice.onSpeechError = onSpeechError;

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const onSpeechResults = (event) => {
//     if (event.value && event.value.length > 0) {
//       dispatch(
//         setInspectionData({ field: "generalComments", value: event.value[0] })
//       );
//     }
//   };

//   const onSpeechError = (event) => {
//     setError(event.error?.message || "Voice recognition error");
//     setIsRecording(false);
//   };

//   // ✅ Request Microphone Permission (Android only)
//   const requestMicrophonePermission = async () => {
//     console.log("platform.os", Platform.OS);
//     if (Platform.OS !== "android") return true;
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         {
//           title: "Microphone Permission",
//           message:
//             "This app needs access to your microphone so you can record voice comments.",
//           buttonNeutral: "Ask Me Later",
//           buttonNegative: "Cancel",
//           buttonPositive: "OK",
//         }
//       );
//       console.log(granted);
//       console.log(PermissionsAndroid.RESULTS.GRANTED);
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       console.warn("Permission error:", err);
//       return false;
//     }
//   };

//   const toggleRecording = async () => {
//     try {
//       if (isRecording) {
//         await Voice.stop();
//         setIsRecording(false);
//       } else {
//         const hasPermission = await requestMicrophonePermission();
//         console.log("abc");
//         if (!hasPermission) {
//           Alert.alert(
//             "Permission Denied",
//             "Microphone permission is required to record voice."
//           );
//           return;
//         }
//         setError("");
//         setIsRecording(true);
//         console.log("Voice module:", Voice);

//         await Voice.start("en-US");
//         console.log("3");
//       }
//     } catch (err) {
//       console.log("Voice error:", err);
//       setError(JSON.stringify(err));
//       setIsRecording(false);
//     }
//   };

//   // ✅ Redux handlers
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

//       const finalPayload = {
//         vin: inspectionData.vin,
//         make: inspectionData.make,
//         carModel: inspectionData.model,
//         year: inspectionData.year || "string",
//         engineNumber: inspectionData.engineNumber || "string",
//         mileAge: Number(inspectionData.mileAge) || 0,
//         registrationPlate: inspectionData.registrationPlate,
//         registrationExpiry: inspectionData.registrationExpiry,
//         buildDate: inspectionData.buildDate,
//         complianceDate: inspectionData.complianceDate,
//         overallRating: 0,
//         inspectorEmail: "muhammadanasrashid18@gmail.com",
//         frontImage: inspectionData.images.frontImage || {
//           original: "s3://bucket/cars/front.jpg",
//           analyzed: "s3://bucket/cars/front_annotated.jpg",
//           damages: [],
//         },
//         rearImage: inspectionData.images.rearImage || {
//           original: "s3://bucket/cars/rear.jpg",
//           analyzed: "s3://bucket/cars/rear_annotated.jpg",
//           damages: [],
//         },
//         leftImage: inspectionData.images.leftImage || {
//           original: "s3://bucket/cars/left.jpg",
//           analyzed: "s3://bucket/cars/left_annotated.jpg",
//           damages: [],
//         },
//         rightImage: inspectionData.images.rightImage || {
//           original: "s3://bucket/cars/right.jpg",
//           analyzed: "s3://bucket/cars/right_annotated.jpg",
//           damages: [],
//         },
//         odometer: inspectionData.odometer || "45200",
//         fuelType: inspectionData.fuelType || "Petrol",
//         driveTrain: inspectionData.driveTrain || "AWD",
//         transmission: inspectionData.transmission || "Automatic",
//         bodyType: inspectionData.bodyType || "Sedan",
//         color: inspectionData.color || "Blue",
//         frontWheelDiameter: inspectionData.frontWheelDiameter || 17,
//         rearWheelDiameter: inspectionData.rearWheelDiameter || 17,
//         keysPresent: inspectionData.keysPresent ?? true,
//         serviceBookPresent: inspectionData.serviceBookPresent ?? true,
//         serviceHistoryPresent: inspectionData.serviceHistoryPresent ?? true,
//         tyreConditionFrontLeft: inspectionData.tyreConditionFrontLeft || "Good",
//         tyreConditionFrontRight:
//           inspectionData.tyreConditionFrontRight || "Good",
//         tyreConditionRearRight: inspectionData.tyreConditionRearRight || "Fair",
//         tyreConditionRearLeft: inspectionData.tyreConditionRearLeft || "Fair",
//         damagePresent: inspectionData.damagePresent ?? true,
//         roadTest: inspectionData.roadTest ?? true,
//         roadTestComments: inspectionData.roadTestComments,
//         generalComments: inspectionData.generalComments,
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

//         <ScrollView style={tw`px-6`} contentContainerStyle={tw`pb-20`}>
//           {/* Damage */}
//           <View style={tw`mt-4`}>
//             <Text style={tw`text-gray-500 mb-1`}>
//               Is There Any Damage Present
//             </Text>
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

//           {/* Comments */}
//           <View style={tw`mt-4`}>
//             <Text style={tw`text-gray-500 mb-1`}>Road Test Comments</Text>
//             <TextInput
//               value={roadTestComments}
//               onChangeText={(value) =>
//                 handleTextChange("roadTestComments", value)
//               }
//               placeholder="Enter comments"
//               style={tw`border border-gray-300 rounded-lg p-3 bg-white h-20`}
//               multiline
//             />
//           </View>

//           {/* General Comments + Voice */}
//           <View style={tw`mt-4`}>
//             <Text style={tw`text-gray-500 mb-1`}>General Comments</Text>

//             <TextInput
//               value={generalComments}
//               onChangeText={(value) =>
//                 handleTextChange("generalComments", value)
//               }
//               placeholder="Enter comments"
//               style={tw`border border-gray-300 rounded-lg p-3 bg-white h-20`}
//               multiline
//             />

//             {/* 🎤 Voice Button */}
//             <View style={tw`flex-row justify-center mt-3`}>
//               <TouchableOpacity
//                 onPress={toggleRecording}
//                 style={{
//                   backgroundColor: isRecording ? "red" : "green",
//                   padding: 14,
//                   borderRadius: 50,
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <Image
//                   source={isRecording ? redmic : greenmic}
//                   style={{ width: 30, height: 30, tintColor: "white" }}
//                   resizeMode="contain"
//                 />
//               </TouchableOpacity>
//             </View>

//             {error ? (
//               <Text style={tw`text-red-500 text-xs mt-2 text-center`}>
//                 {error}
//               </Text>
//             ) : null}
//           </View>
//         </ScrollView>

//         {/* Submit Button */}
//         <View
//           style={tw`absolute bottom-0 left-0 right-0 px-4 pb-4 bg-white mb-8`}
//         >
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
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  Modal,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Voice from "@react-native-voice/voice";
import * as ImagePicker from "react-native-image-picker";
import {
  setInspectionData,
  resetInspection,
} from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import API_BASE_URL from "../../utils/config";

import greenmic from "../../assets/greenmic.png";
import redmic from "../../assets/redmic.png";

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

  const [roadTestVoiceMemo, setRoadTestVoiceMemo] = useState(null);
  const [isRoadRecording, setIsRoadRecording] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [damageData, setDamageData] = useState({
    damagePhoto: null,
    damageDescription: "",
    damageSeverity: "minor",
    repairRequired: false,
  });

  // ✅ Voice Setup
  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (event) => {
    if (event.value && event.value.length > 0) {
      dispatch(
        setInspectionData({ field: "generalComments", value: event.value[0] })
      );
    }
  };

  const onSpeechError = (event) => {
    setError(event.error?.message || "Voice recognition error");
    setIsRecording(false);
  };

  // ✅ Request Microphone Permission
  const requestMicrophonePermission = async () => {
    if (Platform.OS !== "android") return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn("Permission error:", err);
      return false;
    }
  };

  const toggleRoadRecording = async () => {
    try {
      if (isRoadRecording) {
        await Voice.stop();
        setIsRoadRecording(false);
        dispatch(
          setInspectionData({
            field: "roadTestVoiceMemo",
            value: "mock_voice_file_path.mp3",
          })
        );
      } else {
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
          Alert.alert(
            "Permission Denied",
            "Microphone access is required for road test recording."
          );
          return;
        }
        setError("");
        setIsRoadRecording(true);
        await Voice.start("en-US");
      }
    } catch (err) {
      setError(JSON.stringify(err));
      setIsRoadRecording(false);
    }
  };

  const toggleRecording = async () => {
    try {
      if (isRecording) {
        await Voice.stop();
        setIsRecording(false);
      } else {
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
          Alert.alert("Permission Denied", "Microphone access is required.");
          return;
        }
        setError("");
        setIsRecording(true);
        await Voice.start("en-US");
      }
    } catch (err) {
      setError(JSON.stringify(err));
      setIsRecording(false);
    }
  };

  // ✅ Image picker
  const handleImagePick = () => {
    Alert.alert("Upload Damage Photo", "Choose an option", [
      {
        text: "Camera",
        onPress: () => openImagePicker("camera"),
      },
      {
        text: "Gallery",
        onPress: () => openImagePicker("gallery"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const openImagePicker = async (type) => {
    const options = { mediaType: "photo", quality: 0.8 };
    const result =
      type === "camera"
        ? await ImagePicker.launchCamera(options)
        : await ImagePicker.launchImageLibrary(options);
    if (result?.assets && result.assets[0]) {
      setDamageData({ ...damageData, damagePhoto: result.assets[0].uri });
    }
  };

  // ✅ Add damage to list
  const handleAddDamage = () => {
    if (!damageData.damagePhoto || !damageData.damageDescription) {
      Alert.alert("Missing Info", "Please add a photo and description.");
      return;
    }
    const updatedDamages = [...damages, damageData];
    dispatch(setInspectionData({ field: "damages", value: updatedDamages }));
    setDamageData({
      damagePhoto: null,
      damageDescription: "",
      damageSeverity: "minor",
      repairRequired: false,
    });
    setIsModalVisible(false);
  };

  const handleSelect = (field, value) => {
    dispatch(setInspectionData({ field, value }));
  };

  const handleTextChange = (field, value) => {
    dispatch(setInspectionData({ field, value }));
  };

  const handleSubmit = async () => {
    try {
      console.log(
        "🧾 Current Redux Inspection Data:",
        JSON.stringify(inspectionData, null, 2)
      );

      if (!inspectionData.vin || inspectionData.vin.length !== 17) {
        Alert.alert(
          "❌ Invalid VIN",
          "VIN must be exactly 17 characters long."
        );
        return;
      }

      if (!inspectionData.make || !inspectionData.model) {
        Alert.alert("❌ Missing Fields", "Please fill Make and Model.");
        return;
      }

      const finalPayload = {
        vin: inspectionData.vin,
        make: inspectionData.make,
        carModel: inspectionData.model,
        year: inspectionData.year || "string",
        engineNumber: inspectionData.engineNumber || "string",
        mileAge: Number(inspectionData.mileAge) || 0,
        registrationPlate: inspectionData.registrationPlate,
        registrationExpiry: inspectionData.registrationExpiry,
        buildDate: inspectionData.buildDate,
        complianceDate: inspectionData.complianceDate,
        overallRating: 0,
        inspectorEmail: "muhammadanasrashid18@gmail.com",
        frontImage: inspectionData.images.frontImage || {
          original: "s3://bucket/cars/front.jpg",
          analyzed: "s3://bucket/cars/front_annotated.jpg",
          damages: [],
        },
        rearImage: inspectionData.images.rearImage || {
          original: "s3://bucket/cars/rear.jpg",
          analyzed: "s3://bucket/cars/rear_annotated.jpg",
          damages: [],
        },
        leftImage: inspectionData.images.leftImage || {
          original: "s3://bucket/cars/left.jpg",
          analyzed: "s3://bucket/cars/left_annotated.jpg",
          damages: [],
        },
        rightImage: inspectionData.images.rightImage || {
          original: "s3://bucket/cars/right.jpg",
          analyzed: "s3://bucket/cars/right_annotated.jpg",
          damages: [],
        },
        odometer: inspectionData.odometer || "45200",
        fuelType: inspectionData.fuelType || "Petrol",
        driveTrain: inspectionData.driveTrain || "AWD",
        transmission: inspectionData.transmission || "Automatic",
        bodyType: inspectionData.bodyType || "Sedan",
        color: inspectionData.color || "Blue",
        frontWheelDiameter: inspectionData.frontWheelDiameter || 17,
        rearWheelDiameter: inspectionData.rearWheelDiameter || 17,
        keysPresent: inspectionData.keysPresent ?? true,
        serviceBookPresent: inspectionData.serviceBookPresent ?? true,
        serviceHistoryPresent: inspectionData.serviceHistoryPresent ?? true,
        tyreConditionFrontLeft: inspectionData.tyreConditionFrontLeft || "Good",
        tyreConditionFrontRight:
          inspectionData.tyreConditionFrontRight || "Good",
        tyreConditionRearRight: inspectionData.tyreConditionRearRight || "Fair",
        tyreConditionRearLeft: inspectionData.tyreConditionRearLeft || "Fair",
        damagePresent: inspectionData.damagePresent ?? true,
        roadTest: inspectionData.roadTest ?? true,
        roadTestComments: inspectionData.roadTestComments,
        generalComments: inspectionData.generalComments,
      };

      const cleanPayload = JSON.parse(JSON.stringify(finalPayload));

      // 🧩 Print payload before sending
      console.log(
        "📦 Final Payload Sent to API:",
        JSON.stringify(cleanPayload, null, 2)
      );

      if (inspectionData._id) {
        console.log("🔄 Updating inspection:", inspectionData._id);
        await axios.put(
          `${API_BASE_URL}/inspections/${inspectionData._id}`,
          cleanPayload,
          { headers: { "Content-Type": "application/json", accept: "*/*" } }
        );
      } else {
        console.log("🆕 Creating new inspection...");
        await axios.post(`${API_BASE_URL}/inspections`, cleanPayload, {
          headers: { "Content-Type": "application/json", accept: "*/*" },
        });
      }

      dispatch(resetInspection());
      Alert.alert("✅ Success", "Inspection created successfully!");
      navigation.navigate("MainTabs");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        err.message;
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

        <ScrollView style={tw`px-6`} contentContainerStyle={tw`pb-20`}>
          {/* Damage Section */}
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

          {/* If Damage Present */}
          {damagePresent === "Yes" && (
            <View style={tw`mt-6`}>
              <View style={tw`flex-row justify-between items-center mb-2`}>
                <Text style={tw`text-gray-700 font-semibold text-base`}>
                  Recorded Damages
                </Text>
                <TouchableOpacity
                  onPress={() => setIsModalVisible(true)}
                  style={tw`bg-green-600 px-3 py-2 rounded-lg`}
                >
                  <Text style={tw`text-white font-semibold`}>+ Add Damage</Text>
                </TouchableOpacity>
              </View>

              {damages.length === 0 ? (
                <Text style={tw`text-gray-500 text-sm`}>
                  No damages added yet.
                </Text>
              ) : (
                damages.map((item, index) => (
                  <View
                    key={index}
                    style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
                  >
                    {item.damagePhoto && (
                      <Image
                        source={{ uri: item.damagePhoto }}
                        style={tw`w-full h-40 rounded-lg mb-2`}
                      />
                    )}
                    <Text style={tw`text-gray-700`}>
                      {item.damageDescription}
                    </Text>
                    <Text style={tw`text-sm text-gray-500`}>
                      Severity: {item.damageSeverity}
                    </Text>
                    <Text style={tw`text-sm text-gray-500`}>
                      Repair Required: {item.repairRequired ? "Yes" : "No"}
                    </Text>
                  </View>
                ))
              )}
            </View>
          )}

          {/* Modal */}
          <Modal visible={isModalVisible} transparent animationType="slide">
            <View style={tw`flex-1 justify-center bg-black bg-opacity-50 px-6`}>
              <View style={tw`bg-white p-4 rounded-xl`}>
                <Text style={tw`text-lg font-bold text-center mb-3`}>
                  Add Damage
                </Text>

                {/* Image Upload */}
                <TouchableOpacity
                  onPress={handleImagePick}
                  style={tw`bg-green-600 p-3 rounded-lg mb-3`}
                >
                  <Text style={tw`text-white text-center`}>
                    {damageData.damagePhoto ? "Change Photo" : "Upload Photo"}
                  </Text>
                </TouchableOpacity>

                {damageData.damagePhoto && (
                  <Image
                    source={{ uri: damageData.damagePhoto }}
                    style={tw`w-full h-40 rounded-lg mb-2`}
                  />
                )}

                {/* Description */}
                <TextInput
                  placeholder="Enter damage description"
                  value={damageData.damageDescription}
                  onChangeText={(t) =>
                    setDamageData({ ...damageData, damageDescription: t })
                  }
                  style={tw`border border-gray-300 rounded-lg p-2 mb-2`}
                />

                {/* Severity */}
                <Text style={tw`text-gray-700 mb-1`}>Severity</Text>
                <View style={tw`flex-row justify-between mb-3`}>
                  {["minor", "moderate", "severe"].map((level) => (
                    <TouchableOpacity
                      key={level}
                      onPress={() =>
                        setDamageData({ ...damageData, damageSeverity: level })
                      }
                      style={tw.style(
                        "flex-1 mx-1 py-2 border rounded-lg items-center",
                        damageData.damageSeverity === level
                          ? "border-green-600 bg-green-50"
                          : "border-gray-300"
                      )}
                    >
                      <Text style={tw`capitalize`}>{level}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Repair Required */}
                <TouchableOpacity
                  onPress={() =>
                    setDamageData({
                      ...damageData,
                      repairRequired: !damageData.repairRequired,
                    })
                  }
                  style={tw`flex-row items-center justify-center mb-4`}
                >
                  <AppIcon
                    name={
                      damageData.repairRequired ? "check-square-o" : "square-o"
                    }
                    size={20}
                    color="#065f46"
                  />
                  <Text style={tw`ml-2 text-gray-700`}>Repair Required</Text>
                </TouchableOpacity>

                {/* Buttons */}
                <View style={tw`flex-row justify-between`}>
                  <TouchableOpacity
                    onPress={() => setIsModalVisible(false)}
                    style={tw`bg-gray-400 px-4 py-2 rounded-lg`}
                  >
                    <Text style={tw`text-white`}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleAddDamage}
                    style={tw`bg-green-700 px-4 py-2 rounded-lg`}
                  >
                    <Text style={tw`text-white`}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

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

            {/* Comments */}
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

            {/* 🎤 Road Test Voice Memo (only if Road Test = Yes) */}
            {roadTest === "Yes" && (
              <View style={tw`flex-row justify-center mt-3`}>
                <TouchableOpacity
                  onPress={toggleRoadRecording}
                  style={{
                    backgroundColor: isRoadRecording ? "red" : "green",
                    padding: 14,
                    borderRadius: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={isRoadRecording ? redmic : greenmic}
                    style={{ width: 30, height: 30, tintColor: "white" }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          {/* General Comments + Voice */}
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

            {/* 🎤 Voice Button */}
            <View style={tw`flex-row justify-center mt-3`}>
              <TouchableOpacity
                onPress={toggleRecording}
                style={{
                  backgroundColor: isRecording ? "red" : "green",
                  padding: 14,
                  borderRadius: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={isRecording ? redmic : greenmic}
                  style={{ width: 30, height: 30, tintColor: "white" }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {error ? (
              <Text style={tw`text-red-500 text-xs mt-2 text-center`}>
                {error}
              </Text>
            ) : null}
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View
          style={tw`absolute bottom-0 left-0 right-0 px-4 pb-4 bg-white mb-8`}
        >
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
