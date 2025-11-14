

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Alert,
//   Platform,
//   KeyboardAvoidingView,
//   ActivityIndicator,
//   Image,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import { useDispatch, useSelector } from "react-redux";
// import { setInspectionData } from "../redux/slices/inspectionSlice";
// import AppIcon from "../components/AppIcon";
// import SafeAreaWrapper from "../components/SafeAreaWrapper";
// import * as ImagePicker from "react-native-image-picker";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import SignedImage from "../components/SignedImage";
// import API_BASE_URL from "../../utils/config";
// import { signUrl } from "../../utils/inspectionFunctions"; // ← Add this for preview

// export default function InspectionWizardStepFour({ navigation }) {
//   const dispatch = useDispatch();
//   const {
//     serviceBookPresent,
//     serviceHistoryPresent,
//     bookImages = [],
//     lastServiceDate,
//     serviceCenterName,
//     odometerAtLastService,
//     serviceRecordDocumentKey,
//   } = useSelector((state) => state.inspection);

//   const [showLastDatePicker, setShowLastDatePicker] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [previewUrls, setPreviewUrls] = useState({}); // ← Key → signed URL
//   // ADD THIS: Get inspection ID
//   const inspectionId = useSelector((state) => state.inspection._id);
//   const [deletingIndex, setDeletingIndex] = useState(null);
//   // Load signed URLs for preview when bookImages change
//   // useEffect(() => {
//   //   const loadPreviews = async () => {
//   //     const urls = {};
//   //     for (const img of bookImages) {
//   //       if (img.key && !previewUrls[img.key]) {
//   //         try {
//   //           const signed = await signUrl(img.key);
//   //           urls[img.key] = signed;
//   //         } catch (err) {
//   //           console.log("Failed to sign URL:", err);
//   //         }
//   //       }
//   //     }
//   //     if (Object.keys(urls).length > 0) {
//   //       setPreviewUrls((prev) => ({ ...prev, ...urls }));
//   //     }
//   //   };

//   //   loadPreviews();
//   // }, [bookImages]);

//   // Load signed URLs for preview when bookImages change OR on mount
//   useEffect(() => {
//     const loadPreviews = async () => {
//       const urls = { ...previewUrls }; // preserve existing
//       let hasNew = false;

//       for (const img of bookImages) {
//         const key = typeof img === "string" ? img : img.key;
//         if (key && !urls[key]) {
//           try {
//             const signed = await signUrl(key);
//             urls[key] = signed;
//             hasNew = true;
//           } catch (err) {
//             console.log("Failed to sign URL for key:", key, err);
//           }
//         }
//       }

//       if (hasNew) {
//         setPreviewUrls(urls);
//       }
//     };

//     if (bookImages?.length > 0) {
//       loadPreviews();
//     }
//   }, [bookImages]); // Dependency sahi hai

//   const pickAndUploadImage = async (source) => {
//     try {
//       setUploading(true);

//       const options = { mediaType: "photo", quality: 0.8 };
//       let result;

//       if (source === "camera") {
//         result = await ImagePicker.launchCamera(options);
//       } else {
//         result = await ImagePicker.launchImageLibrary(options);
//       }

//       if (result.didCancel || !result.assets?.[0]?.uri) {
//         setUploading(false);
//         return;
//       }

//       const uri = result.assets[0].uri;

//       // 1. Get Presigned URL
//       const presignedRes = await fetch(
//         `${API_BASE_URL}/inspections/presigned`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ fileType: "image/jpeg" }),
//         }
//       );

//       if (!presignedRes.ok) throw new Error("Failed to get presigned URL");

//       const { url: presignedUrl, key } = await presignedRes.json();

//       // 2. Upload to S3
//       const imgResp = await fetch(uri);
//       const imgBlob = await imgResp.blob();

//       const uploadRes = await fetch(presignedUrl, {
//         method: "PUT",
//         headers: { "Content-Type": "image/jpeg" },
//         body: imgBlob,
//       });

//       if (!uploadRes.ok) throw new Error("Upload failed");

//       // 3. Save key to Redux (local UI)
//       const newImages = [...bookImages, { key }];
//       dispatch(setInspectionData({ field: "bookImages", value: newImages }));

//       // 4. Generate preview
//       const signedUrl = await signUrl(key);
//       if (signedUrl) {
//         setPreviewUrls((prev) => ({ ...prev, [key]: signedUrl }));
//       }

//       // 5. CALL NEW API: Add to backend inspection
//       if (inspectionId) {
//         const addRes = await fetch(
//           `${API_BASE_URL}/inspections/${inspectionId}/book-images`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ key }),
//           }
//         );

//         if (!addRes.ok) {
//           const err = await addRes.text();
//           console.log("Failed to add book image to inspection:", err);
//           Alert.alert(
//             "Sync Failed",
//             "Image uploaded but not saved to inspection."
//           );
//           // Optionally: remove from Redux
//           // dispatch(setInspectionData({ field: "bookImages", value: bookImages }));
//         } else {
//           console.log("Book image added to inspection:", key);
//         }
//       } else {
//         console.log(
//           "No inspection ID — skipping backend sync (edit mode only)"
//         );
//       }
//     } catch (err) {
//       console.log("Upload error:", err);
//       Alert.alert("Upload Failed", err.message || "Could not upload image.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSelect = (field, value) => {
//     dispatch(setInspectionData({ field, value }));
//     if (field === "serviceBookPresent" && value === "No") {
//       dispatch(setInspectionData({ field: "bookImages", value: [] }));
//       setPreviewUrls({});
//     }
//     if (field === "serviceHistoryPresent" && value === "No") {
//       dispatch(setInspectionData({ field: "lastServiceDate", value: "" }));
//       dispatch(setInspectionData({ field: "serviceCenterName", value: "" }));
//       dispatch(setInspectionData({ field: "odometerAtLastService", value: 0 }));
//       dispatch(
//         setInspectionData({ field: "serviceRecordDocumentKey", value: "" })
//       );
//     }
//   };

//   const handleLastServiceDate = (event, selectedDate) => {
//     setShowLastDatePicker(false);
//     if (selectedDate) {
//       const formatted = selectedDate.toISOString().split("T")[0];
//       dispatch(
//         setInspectionData({ field: "lastServiceDate", value: formatted })
//       );
//     }
//   };

//   const handleDeleteImage = async (index) => {
//     const imgToDelete = bookImages[index];
//     if (!imgToDelete?.key) return;

//     setDeletingIndex(index);

//     // Optimistic UI
//     const updated = bookImages.filter((_, i) => i !== index);
//     dispatch(setInspectionData({ field: "bookImages", value: updated }));
//     const newPreviews = { ...previewUrls };
//     delete newPreviews[imgToDelete.key];
//     setPreviewUrls(newPreviews);

//     if (inspectionId) {
//       try {
//         const res = await fetch(
//           `${API_BASE_URL}/inspections/${inspectionId}/book-images`,
//           {
//             method: "DELETE",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ key: imgToDelete.key }),
//           }
//         );

//         if (!res.ok) throw new Error("Failed to delete from server");
//         console.log("Deleted from backend:", imgToDelete.key);
//       } catch (err) {
//         Alert.alert(
//           "Sync Failed",
//           "Image removed locally but not from server."
//         );
//         // Revert
//         dispatch(setInspectionData({ field: "bookImages", value: bookImages }));
//         setPreviewUrls(previewUrls);
//       }
//     }

//     setDeletingIndex(null);
//   };

//   const handleNext = () => navigation.navigate("InspectionWizardStepSix");
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

//           <ScrollView style={tw`px-4`} contentContainerStyle={tw`pb-40`}>
//             {/* Service Book Present */}
//             <View style={tw`mt-4`}>
//               <Text style={tw`text-gray-500 mb-2`}>
//                 Is A Servicebook Present
//               </Text>
//               <View style={tw`flex-row justify-between`}>
//                 {["Yes", "No"].map((option) => (
//                   <TouchableOpacity
//                     key={option}
//                     style={tw.style(
//                       "flex-1 items-center justify-center border rounded-lg py-8 mx-1",
//                       serviceBookPresent === option
//                         ? "border-green-600 bg-green-50"
//                         : "border-gray-300 bg-white"
//                     )}
//                     onPress={() => handleSelect("serviceBookPresent", option)}
//                   >
//                     <Text style={tw`text-gray-700`}>{option}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Book Upload Section */}
//             {serviceBookPresent === "Yes" && (
//               <View style={tw`mt-6`}>
//                 <Text style={tw`text-gray-500 mb-2`}>
//                   Upload Book / Manual Photos
//                 </Text>

//                 {uploading && (
//                   <View style={tw`flex-row items-center mb-2`}>
//                     <ActivityIndicator size="small" color="#16a34a" />
//                     <Text style={tw`ml-2 text-green-700`}>Uploading...</Text>
//                   </View>
//                 )}

//                 <View style={tw`flex-row mb-3`}>
//                   <TouchableOpacity
//                     style={tw`flex-1 bg-purple-600 py-2 rounded-lg mr-2`}
//                     onPress={() => pickAndUploadImage("camera")}
//                     disabled={uploading}
//                   >
//                     <Text style={tw`text-white text-center`}>Camera</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={tw`flex-1 bg-purple-600 py-2 rounded-lg`}
//                     onPress={() => pickAndUploadImage("gallery")}
//                     disabled={uploading}
//                   >
//                     <Text style={tw`text-white text-center`}>Gallery</Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Uploaded Images with Preview */}
//                 {/* Uploaded Images with Preview */}
//                 <View style={tw`flex-row flex-wrap mt-2`}>
//                   {(bookImages || []).map((img, index) => (
//                     <View
//                       key={img.key || index}
//                       style={tw`w-24 h-28 m-1 relative`}
//                     >
//                       {/* YEHI NEW CODE */}
//                       {/* {deletingIndex === index ? (
//                         <View
//                           style={tw`w-full h-full bg-gray-300 rounded-lg items-center justify-center`}
//                         >
//                           <ActivityIndicator size="small" color="#fff" />
//                         </View>
//                       ) : previewUrls[img.key] ? (
//                         <Image
//                           source={{ uri: previewUrls[img.key] }}
//                           style={tw`w-full h-full rounded-lg`}
//                           resizeMode="cover"
//                         />
//                       ) : (
//                         <View
//                           style={tw`w-full h-full bg-gray-200 rounded-lg items-center justify-center`}
//                         >
//                           <ActivityIndicator size="small" color="#065f46" />
//                         </View>
//                       )}

//                       <TouchableOpacity
//                         onPress={() => handleDeleteImage(index)}
//                         style={tw`absolute top-1 right-1 bg-red-600 p-1 rounded-full`}
//                       >
//                         <AppIcon name="close" size={16} color="white" />
//                       </TouchableOpacity> */}
//                       {deletingIndex === index ? (
//                         <View
//                           style={tw`w-full h-full bg-gray-300 rounded-lg items-center justify-center`}
//                         >
//                           <ActivityIndicator size="small" color="#fff" />
//                         </View>
//                       ) : previewUrls[img.key] ? (
//                         <Image
//                           source={{ uri: previewUrls[img.key] }}
//                           style={tw`w-full h-full rounded-lg`}
//                           resizeMode="cover"
//                           onError={() => {
//                             // If signed URL expired or failed
//                             console.log("Image load failed, retrying...");
//                             signUrl(img.key).then((url) => {
//                               if (url)
//                                 setPreviewUrls((prev) => ({
//                                   ...prev,
//                                   [img.key]: url,
//                                 }));
//                             });
//                           }}
//                         />
//                       ) : (
//                         <View
//                           style={tw`w-full h-full bg-gray-200 rounded-lg items-center justify-center`}
//                         >
//                           <ActivityIndicator size="small" color="#065f46" />
//                           <Text style={tw`text-xs mt-1 text-gray-600`}>
//                             Loading...
//                           </Text>
//                         </View>
//                       )}

//                       <TouchableOpacity
//                         onPress={() => handleDeleteImage(index)}
//                         style={tw`absolute top-1 right-1 bg-red-600 p-1 rounded-full`}
//                       >
//                         <AppIcon name="close" size={16} color="white" />
//                       </TouchableOpacity>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//             )}

//             {/* Service History Present */}
//             <View style={tw`mt-8`}>
//               <Text style={tw`text-gray-500 mb-2`}>
//                 Is A Service History Present
//               </Text>
//               <View style={tw`flex-row justify-between`}>
//                 {["Yes", "No"].map((option) => (
//                   <TouchableOpacity
//                     key={option}
//                     style={tw.style(
//                       "flex-1 items-center justify-center border rounded-lg py-8 mx-1",
//                       serviceHistoryPresent === option
//                         ? "border-green-600 bg-green-50"
//                         : "border-gray-300 bg-white"
//                     )}
//                     onPress={() =>
//                       handleSelect("serviceHistoryPresent", option)
//                     }
//                   >
//                     <Text style={tw`text-gray-700`}>{option}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Service History Details */}
//             {serviceHistoryPresent === "Yes" && (
//               <View style={tw`mt-6`}>
//                 <Text style={tw`text-lg font-semibold text-gray-700 mb-2`}>
//                   Service Details
//                 </Text>

//                 {/* Last Service Date */}
//                 <Text style={tw`text-gray-500 mb-1`}>Last Service Date</Text>
//                 <TouchableOpacity
//                   style={tw`border border-gray-300 rounded-lg p-3 mb-3 bg-white`}
//                   onPress={() => setShowLastDatePicker(true)}
//                 >
//                   <Text>{lastServiceDate || "Select Date"}</Text>
//                 </TouchableOpacity>
//                 {showLastDatePicker && (
//                   <DateTimePicker
//                     value={
//                       lastServiceDate ? new Date(lastServiceDate) : new Date()
//                     }
//                     mode="date"
//                     display={Platform.OS === "ios" ? "spinner" : "default"}
//                     onChange={handleLastServiceDate}
//                   />
//                 )}

//                 {/* Service Center Name */}
//                 <Text style={tw`text-gray-500 mb-1`}>Service Center Name</Text>
//                 <TextInput
//                   placeholder="Enter service center name"
//                   value={serviceCenterName}
//                   onChangeText={(v) =>
//                     dispatch(
//                       setInspectionData({
//                         field: "serviceCenterName",
//                         value: v,
//                       })
//                     )
//                   }
//                   style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
//                 />

//                 {/* Odometer */}
//                 <Text style={tw`text-gray-500 mb-1`}>
//                   Odometer At Last Service
//                 </Text>
//                 <TextInput
//                   placeholder="Enter reading"
//                   keyboardType="numeric"
//                   value={odometerAtLastService?.toString()}
//                   onChangeText={(v) =>
//                     dispatch(
//                       setInspectionData({
//                         field: "odometerAtLastService",
//                         value: Number(v) || 0,
//                       })
//                     )
//                   }
//                   style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
//                 />

//                 {/* Document Key */}
//                 <Text style={tw`text-gray-500 mb-1`}>
//                   Service Record Document Key
//                 </Text>
//                 <TextInput
//                   placeholder="Enter key"
//                   value={serviceRecordDocumentKey}
//                   onChangeText={(v) =>
//                     dispatch(
//                       setInspectionData({
//                         field: "serviceRecordDocumentKey",
//                         value: v,
//                       })
//                     )
//                   }
//                   style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
//                 />
//               </View>
//             )}
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
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import { setInspectionData } from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import * as ImagePicker from "react-native-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_BASE_URL from "../../utils/config";
import { signUrl } from "../../utils/inspectionFunctions";

export default function InspectionWizardStepFour({ navigation }) {
  const dispatch = useDispatch();
  const {
    serviceBookPresent,
    serviceHistoryPresent,
    bookImages = [],
    lastServiceDate,
    serviceCenterName,
    odometerAtLastService,
    serviceRecordDocumentKey,
  } = useSelector((state) => state.inspection);

  const inspectionId = useSelector((state) => state.inspection._id);

  const [showLastDatePicker, setShowLastDatePicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState({}); // { key: signedUrl }
  const [deletingIndex, setDeletingIndex] = useState(null);

  // Load signed URLs for all book images (like odometer)
  useEffect(() => {
    const loadPreviews = async () => {
      if (!bookImages || bookImages.length === 0) {
        setPreviewUrls({});
        return;
      }

      const urls = { ...previewUrls };
      let hasNew = false;

      for (const img of bookImages) {
        const key = typeof img === "string" ? img : img.key;
        if (key && !urls[key]) {
          try {
            const signed = await signUrl(key);
            if (signed) {
              urls[key] = signed;
              hasNew = true;
            }
          } catch (err) {
            console.log("Failed to sign URL for key:", key, err);
          }
        }
      }

      if (hasNew) {
        setPreviewUrls(urls);
      }
    };

    loadPreviews();
  }, [bookImages]);

  // Upload image (camera/gallery)
  const pickAndUploadImage = async (source) => {
    try {
      setUploading(true);

      const options = { mediaType: "photo", quality: 0.8 };
      let result;

      if (source === "camera") {
        result = await ImagePicker.launchCamera(options);
      } else {
        result = await ImagePicker.launchImageLibrary(options);
      }

      if (result.didCancel || !result.assets?.[0]?.uri) {
        setUploading(false);
        return;
      }

      const uri = result.assets[0].uri;

      // 1. Get Presigned URL
      const presignedRes = await fetch(`${API_BASE_URL}/inspections/presigned`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileType: "image/jpeg" }),
      });

      if (!presignedRes.ok) throw new Error("Failed to get presigned URL");

      const { url: presignedUrl, key } = await presignedRes.json();

      // 2. Upload to S3
      const imgResp = await fetch(uri);
      const imgBlob = await imgResp.blob();

      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: imgBlob,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      // 3. Save to Redux
      const newImages = [...bookImages, { key }];
      dispatch(setInspectionData({ field: "bookImages", value: newImages }));

      // 4. Generate preview (same as odometer)
      const signedUrl = await signUrl(key);
      if (signedUrl) {
        setPreviewUrls((prev) => ({ ...prev, [key]: signedUrl }));
      }

      // 5. Sync with backend
      if (inspectionId) {
        const addRes = await fetch(
          `${API_BASE_URL}/inspections/${inspectionId}/book-images`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key }),
          }
        );

        if (!addRes.ok) {
          Alert.alert("Sync Failed", "Image uploaded but not saved to inspection.");
        }
      }
    } catch (err) {
      Alert.alert("Upload Failed", err.message || "Could not upload image.");
    } finally {
      setUploading(false);
    }
  };

  // Handle Yes/No selection
  const handleSelect = (field, value) => {
    dispatch(setInspectionData({ field, value }));

    if (field === "serviceBookPresent" && value === "No") {
      dispatch(setInspectionData({ field: "bookImages", value: [] }));
      setPreviewUrls({});
    }

    if (field === "serviceHistoryPresent" && value === "No") {
      dispatch(setInspectionData({ field: "lastServiceDate", value: "" }));
      dispatch(setInspectionData({ field: "serviceCenterName", value: "" }));
      dispatch(setInspectionData({ field: "odometerAtLastService", value: 0 }));
      dispatch(setInspectionData({ field: "serviceRecordDocumentKey", value: "" }));
    }
  };

  // Date picker
  const handleLastServiceDate = (event, selectedDate) => {
    setShowLastDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      dispatch(setInspectionData({ field: "lastServiceDate", value: formatted }));
    }
  };

  // Delete image
  const handleDeleteImage = async (index) => {
    const imgToDelete = bookImages[index];
    const key = typeof imgToDelete === "string" ? imgToDelete : imgToDelete.key;
    if (!key) return;

    setDeletingIndex(index);

    // Optimistic UI
    const updated = bookImages.filter((_, i) => i !== index);
    dispatch(setInspectionData({ field: "bookImages", value: updated }));
    const newPreviews = { ...previewUrls };
    delete newPreviews[key];
    setPreviewUrls(newPreviews);

    // Backend delete
    if (inspectionId) {
      try {
        const res = await fetch(
          `${API_BASE_URL}/inspections/${inspectionId}/book-images`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key }),
          }
        );

        if (!res.ok) throw new Error("Failed to delete from server");
      } catch (err) {
        Alert.alert("Sync Failed", "Image removed locally but not from server.");
        // Revert
        dispatch(setInspectionData({ field: "bookImages", value: bookImages }));
        setPreviewUrls(previewUrls);
      }
    }

    setDeletingIndex(null);
  };

  const handleNext = () => navigation.navigate("InspectionWizardStepSix");
  const handleBack = () => navigation.goBack();

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

                {uploading && (
                  <View style={tw`flex-row items-center mb-2`}>
                    <ActivityIndicator size="small" color="#16a34a" />
                    <Text style={tw`ml-2 text-green-700`}>Uploading...</Text>
                  </View>
                )}

                <View style={tw`flex-row mb-3`}>
                  <TouchableOpacity
                    style={tw`flex-1 bg-purple-600 py-2 rounded-lg mr-2`}
                    onPress={() => pickAndUploadImage("camera")}
                    disabled={uploading}
                  >
                    <Text style={tw`text-white text-center`}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={tw`flex-1 bg-purple-600 py-2 rounded-lg`}
                    onPress={() => pickAndUploadImage("gallery")}
                    disabled={uploading}
                  >
                    <Text style={tw`text-white text-center`}>Gallery</Text>
                  </TouchableOpacity>
                </View>

                {/* Preview Images */}
                <View style={tw`flex-row flex-wrap mt-2`}>
                  {(bookImages || []).map((img, index) => {
                    const key = typeof img === "string" ? img : img.key;
                    const signedUrl = previewUrls[key];

                    return (
                      <View
                        key={key || index}
                        style={tw`w-24 h-28 m-1 relative`}
                      >
                        {deletingIndex === index ? (
                          <View
                            style={tw`w-full h-full bg-gray-300 rounded-lg items-center justify-center`}
                          >
                            <ActivityIndicator size="small" color="#fff" />
                          </View>
                        ) : signedUrl ? (
                          <Image
                            source={{ uri: signedUrl }}
                            style={tw`w-full h-full rounded-lg`}
                            resizeMode="cover"
                            onError={() => {
                              // Auto retry if URL expired
                              signUrl(key).then((url) => {
                                if (url) {
                                  setPreviewUrls((prev) => ({
                                    ...prev,
                                    [key]: url,
                                  }));
                                }
                              });
                            }}
                          />
                        ) : (
                          <View
                            style={tw`w-full h-full bg-gray-200 rounded-lg items-center justify-center`}
                          >
                            <ActivityIndicator size="small" color="#065f46" />
                            <Text style={tw`text-xs mt-1 text-gray-600`}>
                              Loading...
                            </Text>
                          </View>
                        )}

                        <TouchableOpacity
                          onPress={() => handleDeleteImage(index)}
                          style={tw`absolute top-1 right-1 bg-red-600 p-1 rounded-full`}
                        >
                          <AppIcon name="close" size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
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

            {/* Service History Details */}
            {serviceHistoryPresent === "Yes" && (
              <View style={tw`mt-6`}>
                <Text style={tw`text-lg font-semibold text-gray-700 mb-2`}>
                  Service Details
                </Text>

                <Text style={tw`text-gray-500 mb-1`}>Last Service Date</Text>
                <TouchableOpacity
                  style={tw`border border-gray-300 rounded-lg p-3 mb-3 bg-white`}
                  onPress={() => setShowLastDatePicker(true)}
                >
                  <Text>{lastServiceDate || "Select Date"}</Text>
                </TouchableOpacity>
                {showLastDatePicker && (
                  <DateTimePicker
                    value={
                      lastServiceDate ? new Date(lastServiceDate) : new Date()
                    }
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleLastServiceDate}
                  />
                )}

                <Text style={tw`text-gray-500 mb-1`}>Service Center Name</Text>
                <TextInput
                  placeholder="Enter service center name"
                  value={serviceCenterName}
                  onChangeText={(v) =>
                    dispatch(setInspectionData({ field: "serviceCenterName", value: v }))
                  }
                  style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
                />

                <Text style={tw`text-gray-500 mb-1`}>Odometer At Last Service</Text>
                <TextInput
                  placeholder="Enter reading"
                  keyboardType="numeric"
                  value={odometerAtLastService?.toString()}
                  onChangeText={(v) =>
                    dispatch(
                      setInspectionData({
                        field: "odometerAtLastService",
                        value: Number(v) || 0,
                      })
                    )
                  }
                  style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
                />

                <Text style={tw`text-gray-500 mb-1`}>Service Record Document Key</Text>
                <TextInput
                  placeholder="Enter key"
                  value={serviceRecordDocumentKey}
                  onChangeText={(v) =>
                    dispatch(
                      setInspectionData({
                        field: "serviceRecordDocumentKey",
                        value: v,
                      })
                    )
                  }
                  style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
                />
              </View>
            )}
          </ScrollView>

          {/* Next Button */}
          <View style={tw`absolute bottom-0 left-0 right-0 px-4 pb-4 bg-white mb-8`}>
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