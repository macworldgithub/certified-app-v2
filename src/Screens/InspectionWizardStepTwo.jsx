// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Platform,
//   ScrollView,
//   KeyboardAvoidingView,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useDispatch, useSelector } from "react-redux";
// import { setInspectionData } from "../redux/slices/inspectionSlice";
// import AppIcon from "../components/AppIcon";
// import SafeAreaWrapper from "../components/SafeAreaWrapper";

// const fuelOptions = ["Petrol", "Diesel", "Hybrid", "Electric", "other"];
// const driveTrainOptions = ["FWD", "RWD", "AWD", "4WD"];
// const transmissionOptions = ["Manual", "Automatic", "CVT"];
// const bodyTypeOptions = ["Sedan", "SUV", "Hatchback", "Truck", "Van"];

// export default function InspectionWizardStepTwo({ navigation }) {
//   const dispatch = useDispatch();
//   const { odometer, fuelType, driveTrain, transmission, bodyType } =
//     useSelector((state) => state.inspection);

//   const [showDropdown, setShowDropdown] = useState(null);

//   const handleSelect = (field, value) => {
//     dispatch(setInspectionData({ field, value }));
//     setShowDropdown(null);
//   };

//   const handleNext = () => {
//     navigation.navigate("InspectionWizardStepThree");
//   };

//   const handleBack = () => navigation.goBack();

//   const renderDropdown = (field, options) => (
//     <View>
//       <TouchableOpacity
//         style={tw`flex-row justify-between items-center border border-gray-300 rounded-lg p-3 mt-2`}
//         onPress={() => setShowDropdown(showDropdown === field ? null : field)}
//       >
//         <Text style={tw`text-gray-600`}>
//           {field === "fuelType" && (fuelType || "Select Fuel Type")}
//           {field === "driveTrain" && (driveTrain || "Select Drive Train")}
//           {field === "transmission" && (transmission || "Select Transmission")}
//           {field === "bodyType" && (bodyType || "Select Body Type")}
//         </Text>
//         <Ionicons
//           name={showDropdown === field ? "chevron-up" : "chevron-down"}
//           size={20}
//           color="gray"
//         />
//       </TouchableOpacity>

//       {showDropdown === field && (
//         <View style={tw`bg-white border border-gray-300 rounded-lg mt-1`}>
//           {options.map((option) => (
//             <TouchableOpacity
//               key={option}
//               style={tw`p-3 border-b border-gray-100`}
//               onPress={() => handleSelect(field, option)}
//             >
//               <Text style={tw`text-gray-700`}>{option}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </View>
//   );

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

//           {/* Scroll Content */}
//           <ScrollView style={tw`px-4`} contentContainerStyle={tw`pb-32`}>
//             {/* Odometer */}
//             <Text style={tw`text-gray-500 mb-1`}>Odometer (KMS)</Text>
//             <TextInput
//               placeholder="Enter Odometer Reading"
//               keyboardType="numeric"
//               value={odometer}
//               onChangeText={(value) =>
//                 dispatch(setInspectionData({ field: "odometer", value }))
//               }
//               style={tw`border border-gray-300 rounded-lg p-3 bg-white`}
//             />

//             {/* Fuel Type */}
//             <Text style={tw`text-gray-500 mt-4 mb-1`}>Fuel Type</Text>
//             {renderDropdown("fuelType", fuelOptions)}

//             {/* Drive Train */}
//             <Text style={tw`text-gray-500 mt-4 mb-1`}>Drive Train</Text>
//             {renderDropdown("driveTrain", driveTrainOptions)}

//             {/* Transmission */}
//             <Text style={tw`text-gray-500 mt-4 mb-1`}>Transmission</Text>
//             {renderDropdown("transmission", transmissionOptions)}

//             {/* Body Type */}
//             <Text style={tw`text-gray-500 mt-4 mb-1`}>Body Type</Text>
//             {renderDropdown("bodyType", bodyTypeOptions)}
//           </ScrollView>
//           {/* Next Button */}

//           <View
//             style={tw`absolute bottom-0 left-0 right-0 px-4 pb-4 bg-white mb-8`}
//           >
//             <TouchableOpacity
//               style={tw`bg-green-700 py-2 rounded-xl`}
//               onPress={handleNext}
//             >
//               <Text style={tw`text-white text-center text-lg font-semibold`}>
//                 Next
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaWrapper>
//   );
// }
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { setInspectionData } from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import { signUrl } from "../../utils/inspectionFunctions";
import API_BASE_URL from "../../utils/config";

const fuelOptions = ["Petrol", "Diesel", "Hybrid", "Electric", "other"];
const driveTrainOptions = ["FWD", "RWD", "AWD", "4WD"];
const transmissionOptions = ["Manual", "Automatic", "CVT"];
const bodyTypeOptions = ["Sedan", "SUV", "Hatchback", "Truck", "Van"];

export default function InspectionWizardStepTwo({ navigation }) {
  const dispatch = useDispatch();
  const {
    odometer,
    odometerImage,
    fuelType,
    driveTrain,
    transmission,
    bodyType,
  } = useSelector((state) => state.inspection);

  const [showDropdown, setShowDropdown] = useState(null);
  const [odometerImageUrl, setOdometerImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const handleSelect = (field, value) => {
    dispatch(setInspectionData({ field, value }));
    setShowDropdown(null);
  };

  const handleNext = () => {
    navigation.navigate("InspectionWizardStepThree");
  };

  const handleBack = () => navigation.goBack();

  // const handleCaptureOdometer = async () => {
  //   try {
  //     // 1. Capture photo
  //     const result = await ImagePicker.launchCamera({
  //       mediaType: "photo",
  //       quality: 0.8,
  //       includeBase64: false,
  //     });

  //     if (result.didCancel) return;

  //     const uri = result?.assets?.[0]?.uri;
  //     if (!uri) return;

  //     // 2. Request presigned URL from your backend
  //     const presigned = await fetch(`${API_BASE_URL}/inspections/presigned`, {
  //       method: "POST",
  //       headers: {
  //         Accept: "*/*",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ fileType: "image/jpeg" }),
  //     });

  //     const { url, key } = await presigned.json();

  //     // console.log("Presigned URL:", url);
  //     console.log("Upload Key:", key);

  //     // 3. Convert iPhone "ph://" or "file://" URI to blob
  //     const imgResp = await fetch(uri);
  //     const imgBlob = await imgResp.blob();

  //     // 4. Upload to S3 using the presigned URL
  //     const upload = await fetch(url, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "image/jpeg",
  //       },
  //       body: imgBlob,
  //     });

  //     if (!upload.ok) {
  //       throw new Error("Upload failed: " + upload.status);
  //     }

  //     console.log("✅ Upload SUCCESS on iPhone");

  //     // 5. Store ONLY the S3 key
  //     dispatch(
  //       setInspectionData({
  //         field: "odometerImage",
  //         value: key,
  //       })
  //     );
  //   } catch (err) {
  //     console.log("Error:", err);
  //   }
  // };

  const handleCaptureOdometer = async () => {
    try {
      setUploading(true); // ← Start loading

      const result = await ImagePicker.launchCamera({
        mediaType: "photo",
        quality: 0.8,
        includeBase64: false,
      });

      if (result.didCancel) {
        setUploading(false);
        return;
      }

      const uri = result?.assets?.[0]?.uri;
      if (!uri) {
        setUploading(false);
        return;
      }

      // Presigned URL
      const presigned = await fetch(`${API_BASE_URL}/inspections/presigned`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileType: "image/jpeg" }),
      });

      if (!presigned.ok) throw new Error("Presigned URL failed");

      const { url, key } = await presigned.json();

      // Upload to S3
      const imgResp = await fetch(uri);
      const imgBlob = await imgResp.blob();

      const upload = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: imgBlob,
      });

      if (!upload.ok) throw new Error("Upload failed");

      // Save key
      dispatch(setInspectionData({ field: "odometerImage", value: key }));

      // Optional: Show success
      // Alert.alert("Success", "Odometer image uploaded!");
    } catch (err) {
      console.log("Upload error:", err);
      Alert.alert("Upload Failed", err.message || "Try again.");
    } finally {
      setUploading(false); // ← Stop loading
    }
  };
  useEffect(() => {
    const loadSignedUrl = async () => {
      if (odometerImage) {
        const url = await signUrl(odometerImage); // your function that creates signed GET URL
        setOdometerImageUrl(url);
      }
    };

    loadSignedUrl();
  }, [odometerImage]);

  const renderDropdown = (field, options) => (
    <View>
      <TouchableOpacity
        style={tw`flex-row justify-between items-center border border-gray-300 rounded-lg p-3 mt-2`}
        onPress={() => setShowDropdown(showDropdown === field ? null : field)}
      >
        <Text style={tw`text-gray-600`}>
          {field === "fuelType" && (fuelType || "Select Fuel Type")}
          {field === "driveTrain" && (driveTrain || "Select Drive Train")}
          {field === "transmission" && (transmission || "Select Transmission")}
          {field === "bodyType" && (bodyType || "Select Body Type")}
        </Text>
        <Ionicons
          name={showDropdown === field ? "chevron-up" : "chevron-down"}
          size={20}
          color="gray"
        />
      </TouchableOpacity>

      {showDropdown === field && (
        <View style={tw`bg-white border border-gray-300 rounded-lg mt-1`}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={tw`p-3 border-b border-gray-100`}
              onPress={() => handleSelect(field, option)}
            >
              <Text style={tw`text-gray-700`}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
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

          {/* Scrollable Content */}
          <ScrollView style={tw`px-4`} contentContainerStyle={tw`pb-32`}>
            {/* 📸 Odometer Image Section */}
            <Text style={tw`text-gray-500 mb-2`}>Odometer Image</Text>

            {odometerImageUrl && (
              <Image
                source={{ uri: odometerImageUrl }}
                style={tw`w-full h-48 rounded-lg mb-4`}
                resizeMode="cover"
              />
            )}

            {/* <TouchableOpacity
              onPress={handleCaptureOdometer}
              style={tw`border border-green-700 py-3 rounded-xl flex-row justify-center items-center mb-4`}
            >
              <AppIcon name="camera" size={20} color="#065f46" />
              <Text style={tw`text-green-800 ml-2 font-semibold`}>
                Capture Odometer Image
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={handleCaptureOdometer}
              disabled={uploading}
              style={tw`border border-green-700 py-3 rounded-xl flex-row justify-center items-center mb-4`}
            >
              {uploading ? (
                <ActivityIndicator color="#065f46" size="small" />
              ) : (
                <>
                  <AppIcon name="camera" size={20} color="#065f46" />
                  <Text style={tw`text-green-800 ml-2 font-semibold`}>
                    {odometerImage
                      ? "Change Odometer Image"
                      : "Capture Odometer Image"}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* 🔢 Odometer Reading (After Image) */}
            <Text style={tw`text-gray-500 mb-1`}>Odometer Reading (KMS)</Text>
            <TextInput
              placeholder="Enter Odometer Reading"
              keyboardType="numeric"
              value={odometer}
              onChangeText={(value) =>
                dispatch(setInspectionData({ field: "odometer", value }))
              }
              style={tw`border border-gray-300 rounded-lg p-3 bg-white mb-4`}
            />

            {/* ⚙️ Fuel Type */}
            <Text style={tw`text-gray-500 mt-4 mb-1`}>Fuel Type</Text>
            {renderDropdown("fuelType", fuelOptions)}

            {/* ⚙️ Drive Train */}
            <Text style={tw`text-gray-500 mt-4 mb-1`}>Drive Train</Text>
            {renderDropdown("driveTrain", driveTrainOptions)}

            {/* ⚙️ Transmission */}
            <Text style={tw`text-gray-500 mt-4 mb-1`}>Transmission</Text>
            {renderDropdown("transmission", transmissionOptions)}

            {/* ⚙️ Body Type */}
            <Text style={tw`text-gray-500 mt-4 mb-1`}>Body Type</Text>
            {renderDropdown("bodyType", bodyTypeOptions)}
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
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
}
