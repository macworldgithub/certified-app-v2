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
// import API_BASE_URL from "../../utils/config";
// import { signUrl } from "../../utils/inspectionFunctions";

// export default function InspectionWizardStepFour({ navigation }) {
//   const dispatch = useDispatch();
//   const inspectionState = useSelector((state) => state.inspection);

//   const {
//     _id: inspectionId,
//     serviceBookPresent = "",
//     serviceHistoryPresent = "",
//     bookImages = [],
//     lastServiceDate = "",
//     serviceCenterName = "",
//     odometerAtLastService = 0,
//     serviceRecordDocumentKey = "",
//   } = inspectionState;

//   const [uploading, setUploading] = useState(false);
//   const [deletingIndex, setDeletingIndex] = useState(null);
//   const [previewUrls, setPreviewUrls] = useState({}); // { key: signedUrl }
//   const [showLastDatePicker, setShowLastDatePicker] = useState(false);

//   // Load signed URLs for all book images
//   useEffect(() => {
//     const loadPreviews = async () => {
//       if (!bookImages || bookImages.length === 0) {
//         setPreviewUrls({});
//         return;
//       }

//       const urls = { ...previewUrls };
//       let updated = false;

//       for (const item of bookImages) {
//         const key = typeof item === "string" ? item : item.key;
//         if (key && !urls[key]) {
//           try {
//             const signed = await signUrl(key);
//             if (signed) {
//               urls[key] = signed;
//               updated = true;
//             }
//           } catch (err) {
//             console.warn("Failed to sign URL for:", key);
//           }
//         }
//       }

//       if (updated) setPreviewUrls(urls);
//     };

//     loadPreviews();
//   }, [bookImages]);

//   // Upload image + Add via POST /book-images
//   const pickAndUploadImage = async (source) => {
//     if (!inspectionId) {
//       Alert.alert("Error", "Inspection not created yet. Please save first.");
//       return;
//     }

//     try {
//       setUploading(true);

//       const options = { mediaType: "photo", quality: 0.8 };
//       const result =
//         source === "camera"
//           ? await ImagePicker.launchCamera(options)
//           : await ImagePicker.launchImageLibrary(options);

//       if (result.didCancel || !result.assets?.[0]?.uri) {
//         setUploading(false);
//         return;
//       }

//       const uri = result.assets[0].uri;

//       // 1. Get presigned URL
//       const presignedRes = await fetch(
//         `${API_BASE_URL}/inspections/presigned`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ fileType: "image/jpeg" }),
//         }
//       );

//       if (!presignedRes.ok) throw new Error("Failed to get upload URL");

//       const { url: presignedUrl, key } = await presignedRes.json();

//       // 2. Upload to S3
//       const imgResp = await fetch(uri);
//       const blob = await imgResp.blob();

//       const uploadRes = await fetch(presignedUrl, {
//         method: "PUT",
//         headers: { "Content-Type": "image/jpeg" },
//         body: blob,
//       });

//       if (!uploadRes.ok) throw new Error("Failed to upload image");

//       // 3. Add to backend via POST /book-images
//       const addRes = await fetch(
//         `${API_BASE_URL}/inspections/${inspectionId}/book-images`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ key }),
//         }
//       );

//       if (!addRes.ok) {
//         const err = await addRes.text();
//         throw new Error(`Server rejected image: ${err}`);
//       }

//       // 4. Update Redux + Preview
//       dispatch(
//         setInspectionData({ field: "bookImages", value: [...bookImages, key] })
//       );

//       const signed = await signUrl(key);
//       if (signed) {
//         setPreviewUrls((prev) => ({ ...prev, [key]: signed }));
//       }

//       Alert.alert("Success", "Service book page added!");
//     } catch (err) {
//       console.error("Upload failed:", err);
//       Alert.alert("Upload Failed", err.message || "Could not upload image.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Delete image via DELETE /book-images
//   const handleDeleteImage = async (index) => {
//     if (!inspectionId) {
//       Alert.alert("Error", "Cannot delete: Inspection ID missing.");
//       return;
//     }

//     const item = bookImages[index];
//     const key = typeof item === "string" ? item : item.key;
//     if (!key) return;

//     setDeletingIndex(index);

//     // Optimistic UI update
//     const newImages = bookImages.filter((_, i) => i !== index);
//     dispatch(setInspectionData({ field: "bookImages", value: newImages }));
//     setPreviewUrls((prev) => {
//       const copy = { ...prev };
//       delete copy[key];
//       return copy;
//     });

//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/inspections/${inspectionId}/book-images`,
//         {
//           method: "DELETE",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ key }),
//         }
//       );

//       if (!res.ok) {
//         const err = await res.text();
//         throw new Error(err || "Failed to delete from server");
//       }

//       Alert.alert("Success", "Image removed.");
//     } catch (err) {
//       Alert.alert(
//         "Delete Failed",
//         "Removed locally but not from server. Reverting..."
//       );
//       // Revert
//       dispatch(setInspectionData({ field: "bookImages", value: bookImages }));
//       setPreviewUrls((prev) => ({ ...prev, [key]: previewUrls[key] }));
//     } finally {
//       setDeletingIndex(null);
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
//               <AppIcon name="arrow-left" size={28} color="#065f46" />
//             </TouchableOpacity>
//             <Text style={tw`text-xl font-bold text-green-800`}>
//               inspection wizard
//             </Text>
//           </View>

//           <ScrollView style={tw`px-4`} contentContainerStyle={tw`pb-32`}>
//             {/* Service Book Present */}
//             <View style={tw`mb-3`}>
//               <Text style={tw`text-gray-500 mb-1`}>
//                 Is Service Book Present?
//               </Text>
//               <View style={tw`flex-row justify-between`}>
//                 {["Yes", "No"].map((opt) => (
//                   <TouchableOpacity
//                     key={opt}
//                     onPress={() => handleSelect("serviceBookPresent", opt)}
//                     style={tw.style(
//                       "flex-1 items-center justify-center border rounded-lg py-6 mx-1",
//                       serviceBookPresent === opt
//                         ? "border-green-600 bg-green-50"
//                         : "border-gray-300 bg-white"
//                     )}
//                   >
//                     <Text style={tw`text-lg font-semibold text-gray-800`}>
//                       {opt}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Upload Service Book Images */}
//             {serviceBookPresent === "Yes" && (
//               <View style={tw`mb-4`}>
//                 <Text style={tw` font-semibold text-gray-800 mb-4`}>
//                   Upload Service Book Pages
//                 </Text>

//                 {uploading && (
//                   <View style={tw`flex-row items-center mb-4`}>
//                     <ActivityIndicator size="small" color="#16a34a" />
//                     <Text style={tw`ml-2 text-green-600`}>Uploading...</Text>
//                   </View>
//                 )}

//                 <View style={tw`flex-row mb-4`}>
//                   <TouchableOpacity
//                     disabled={uploading}
//                     onPress={() => pickAndUploadImage("camera")}
//                     style={tw`flex-1 bg-purple-600 py-4 rounded-xl mr-2`}
//                   >
//                     <Text style={tw`text-white text-center font-medium`}>
//                       Camera
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     disabled={uploading}
//                     onPress={() => pickAndUploadImage("gallery")}
//                     style={tw`flex-1 bg-purple-600 py-4 rounded-xl`}
//                   >
//                     <Text style={tw`text-white text-center font-medium`}>
//                       Gallery
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Image Grid */}
//                 <View style={tw`flex-row flex-wrap -m-1`}>
//                   {bookImages.map((item, idx) => {
//                     const key = typeof item === "string" ? item : item.key;
//                     const url = previewUrls[key];

//                     return (
//                       <View
//                         key={`${key}-${idx}`}
//                         style={tw`w-28 h-32 m-1 relative bg-gray-100 rounded-xl overflow-hidden`}
//                       >
//                         {deletingIndex === idx ? (
//                           <View
//                             style={tw`absolute inset-0 bg-black bg-opacity-50 items-center justify-center`}
//                           >
//                             <ActivityIndicator color="white" />
//                           </View>
//                         ) : url ? (
//                           <Image
//                             source={{ uri: url }}
//                             style={tw`w-full h-full`}
//                             resizeMode="cover"
//                           />
//                         ) : (
//                           <View
//                             style={tw`w-full h-full items-center justify-center`}
//                           >
//                             <ActivityIndicator color="#065f46" />
//                           </View>
//                         )}

//                         <TouchableOpacity
//                           onPress={() => handleDeleteImage(idx)}
//                           style={tw`absolute top-1 right-1 bg-red-600 p-1.5 rounded-full`}
//                         >
//                           <AppIcon name="close" size={18} color="white" />
//                         </TouchableOpacity>
//                       </View>
//                     );
//                   })}
//                 </View>
//               </View>
//             )}

//             {/* Service History Present */}
//             <View style={tw`mb-8`}>
//               <Text style={tw`text-gray-500 mb-1`}>
//                 Is Service History Present?
//               </Text>
//               <View style={tw`flex-row justify-between`}>
//                 {["Yes", "No"].map((opt) => (
//                   <TouchableOpacity
//                     key={opt}
//                     onPress={() => handleSelect("serviceHistoryPresent", opt)}
//                     style={tw.style(
//                       "flex-1 items-center justify-center border rounded-lg py-6 mx-1",
//                       serviceHistoryPresent === opt
//                         ? "border-green-500 bg-green-50"
//                         : "border-gray-300 bg-white"
//                     )}
//                   >
//                     <Text style={tw`text-lg font-semibold text-gray-800`}>
//                       {opt}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Service History Details */}
//             {serviceHistoryPresent === "Yes" && (
//               <View style={tw`bg-gray-50 p-5 rounded-xl`}>
//                 <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
//                   Last Service Details
//                 </Text>

//                 <Text style={tw`text-gray-600 mb-2`}>Last Service Date</Text>
//                 <TouchableOpacity
//                   onPress={() => setShowLastDatePicker(true)}
//                   style={tw`border border-gray-300 rounded-lg p-4 mb-4 bg-white`}
//                 >
//                   <Text>{lastServiceDate || "Select Date"}</Text>
//                 </TouchableOpacity>
//                 {showLastDatePicker && (
//                   <DateTimePicker
//                     value={
//                       lastServiceDate ? new Date(lastServiceDate) : new Date()
//                     }
//                     mode="date"
//                     onChange={handleLastServiceDate}
//                   />
//                 )}

//                 <Text style={tw`text-gray-600 mb-2`}>Service Center Name</Text>
//                 <TextInput
//                   value={serviceCenterName}
//                   onChangeText={(v) =>
//                     dispatch(
//                       setInspectionData({
//                         field: "serviceCenterName",
//                         value: v,
//                       })
//                     )
//                   }
//                   placeholder="e.g. Toyota Service Center"
//                   style={tw`border border-gray-300 rounded-lg p-4 mb-4 bg-white`}
//                 />

//                 <Text style={tw`text-gray-600 mb-2`}>
//                   Odometer at Last Service
//                 </Text>
//                 <TextInput
//                   value={odometerAtLastService?.toString() || ""}
//                   onChangeText={(v) =>
//                     dispatch(
//                       setInspectionData({
//                         field: "odometerAtLastService",
//                         value: Number(v) || 0,
//                       })
//                     )
//                   }
//                   keyboardType="numeric"
//                   placeholder="e.g. 45200"
//                   style={tw`border border-gray-300 rounded-lg p-4 mb-4 bg-white`}
//                 />

//                 <Text style={tw`text-gray-600 mb-2`}>
//                   Service Record Document Key (Optional)
//                 </Text>
//                 <TextInput
//                   value={serviceRecordDocumentKey}
//                   onChangeText={(v) =>
//                     dispatch(
//                       setInspectionData({
//                         field: "serviceRecordDocumentKey",
//                         value: v,
//                       })
//                     )
//                   }
//                   placeholder="e.g. uploads/service_record.pdf"
//                   style={tw`border border-gray-300 rounded-lg p-4 bg-white`}
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
      const presignedRes = await fetch(
        `${API_BASE_URL}/inspections/presigned`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileType: "image/jpeg" }),
        }
      );

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
          Alert.alert(
            "Sync Failed",
            "Image uploaded but not saved to inspection."
          );
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
      dispatch(
        setInspectionData({ field: "serviceRecordDocumentKey", value: "" })
      );
    }
  };

  // Date picker
  const handleLastServiceDate = (event, selectedDate) => {
    setShowLastDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      dispatch(
        setInspectionData({ field: "lastServiceDate", value: formatted })
      );
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
        Alert.alert(
          "Sync Failed",
          "Image removed locally but not from server."
        );
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
              <Text style={tw`text-gray-500 mb-2`}>
                Is A Servicebook Present
              </Text>
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
                    onPress={() =>
                      handleSelect("serviceHistoryPresent", option)
                    }
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
                    dispatch(
                      setInspectionData({
                        field: "serviceCenterName",
                        value: v,
                      })
                    )
                  }
                  style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
                />

                <Text style={tw`text-gray-500 mb-1`}>
                  Odometer At Last Service
                </Text>
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

                <Text style={tw`text-gray-500 mb-1`}>
                  Service Record Document Key
                </Text>
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
