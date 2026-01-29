import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { setImages } from "../redux/slices/inspectionSlice";
import mime from "mime";
import API_BASE_URL from "../../utils/config";
import axios from "axios";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import { API_BASE_URL_Prod } from "../../utils/config";
import ImageViewing from "react-native-image-viewing";
import {
  Header,
  ImageComparison,
  ImageActions,
  LoadingIndicator,
  AnalyzeDeleteButtons,
  DamageSection,
  NextButton,
} from "../components/InspectionComponent";
import AppIcon from "../components/AppIcon";
import {
  setInspectionData,
  resetInspection,
} from "../redux/slices/inspectionSlice";

// export default function InteriorBack({ navigation }) {
//   const dispatch = useDispatch();
//   const { images: savedImages } = useSelector((state) => state.inspection);
//   const inspection = useSelector((state) => state.inspection);

//   const partKey = "InteriorBack";

//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [previewUri, setPreviewUri] = useState(null);
//   const [images, setLocalImages] = useState(savedImages || {});
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [analyzing, setAnalyzing] = useState(false);
//   const saveImagesToRedux = (updatedImages) => {
//     setLocalImages(updatedImages);
//     dispatch(setImages(updatedImages));
//   };

//   const handleBack = () => navigation.goBack();

//   return (
//     <SafeAreaWrapper>
//       <View style={tw`flex-1 bg-white`}>
//         <ScrollView style={tw`flex-1 px-4`} contentContainerStyle={tw`pb-32`}>
//           <View style={tw`flex-row items-center mb-6`}>
//             <TouchableOpacity onPress={handleBack} style={tw`mr-3`}>
//               <AppIcon name="arrow-left" size={24} color="#065f46" />
//               {/* green-800 color */}
//             </TouchableOpacity>
//             <Text style={tw`text-lg font-bold text-green-800`}>
//               Interior Back Image
//             </Text>
//           </View>

//           <ImageComparison
//             partKey={partKey}
//             images={images}
//             setPreviewUri={setPreviewUri}
//             setPreviewVisible={setPreviewVisible}
//           />

//           {uploading && <LoadingIndicator label="Uploading..." />}
//           {analyzing && <LoadingIndicator label="Analyzing..." />}

//           <ImageActions
//             partKey={partKey}
//             images={images}
//             saveImagesToRedux={saveImagesToRedux}
//             setUploading={setUploading}
//             setProgress={setProgress}
//           />

//           <AnalyzeDeleteButtons
//             partKey={partKey}
//             images={images}
//             saveImagesToRedux={saveImagesToRedux}
//             analyzing={analyzing}
//             setAnalyzing={setAnalyzing}
//           />

//           <DamageSection inspection={inspection} partKey={partKey} />
//         </ScrollView>

//         <NextButton navigation={navigation} nextScreen="ReviewInspection" />
//       </View>
//     </SafeAreaWrapper>
//   );
// }
export default function InteriorBack({ navigation }) {
  const dispatch = useDispatch();
  const inspection = useSelector((state) => state.inspection);
  const { images: savedImages } = useSelector((state) => state.inspection);

  const partKey = "InteriorBack";

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState(null);
  const [images, setLocalImages] = useState(savedImages || {});
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  const saveImagesToRedux = (updatedImages) => {
    setLocalImages(updatedImages);
    dispatch(setImages(updatedImages));
  };

  const handleBack = () => navigation.goBack();

  const handleSubmit = async () => {
    try {
      console.log(
        "Final Inspection Data:",
        JSON.stringify(inspection, null, 2),
      );

      if (!inspection.vin || inspection.vin.length !== 17) {
        Alert.alert("Invalid VIN", "VIN must be 17 characters.");
        return;
      }

      const finalPayload = {
        vin: inspection.vin,
        make: inspection.make,
        carModel: inspection.model,
        year: inspection.year || "2025",
        engineNumber: inspection.engineNumber || "123xyz",
        mileAge: Number(inspection.mileAge) || 0,
        registrationPlate: inspection.registrationPlate || "ABC-123",
        registrationExpiry: inspection.registrationExpiry || null,
        buildDate: inspection.buildDate || "2020-02-01",
        complianceDate: inspection.complianceDate || "2020-04-15",
        overallRating: 0,
        inspectorEmail: "muhammadanasrashid18@gmail.com",

        frontImage: inspection.images?.frontImage || {
          original: "",
          analyzed: "",
        },
        rearImage: inspection.images?.rearImage || {
          original: "",
          analyzed: "",
        },
        leftImage: inspection.images?.leftImage || {
          original: "",
          analyzed: "",
        },
        rightImage: inspection.images?.rightImage || {
          original: "",
          analyzed: "",
        },
        engineImage: inspection.images?.engineImage || {
          original: "",
          analyzed: "",
        },
        plateImage: inspection.images?.VINPlate || {
          original: "",
          analyzed: "",
        },
        interiorFrontImage: inspection.images?.InteriorFront || {
          original: "",
          analyzed: "",
        },
        interiorBackImage: inspection.images?.InteriorBack || {
          original: "",
          analyzed: "",
        },

        odometer: inspection.odometer || "45200",
        odometerImage: inspection.odometerImage || "uploads/odometer.jpg",
        fuelType: inspection.fuelType || "Petrol",
        driveTrain: inspection.driveTrain || "AWD",
        transmission: inspection.transmission || "Automatic",
        bodyType: inspection.bodyType || "Sedan",
        color: inspection.color || "Blue",
        frontWheelDiameter: inspection.frontWheelDiameter || "17",
        rearWheelDiameter: inspection.rearWheelDiameter || "17",

        keysPresent: inspection.keysPresent ?? "true",
        serviceBookPresent: inspection.serviceBookPresent ?? "true",
        bookImages: (inspection.bookImages || [])
          .filter((i) => i && i.key)
          .map((i) => i.key),

        serviceHistoryPresent: inspection.serviceHistoryPresent ?? "true",
        lastServiceDate: inspection.lastServiceDate || "2025-10-15",
        serviceCenterName: inspection.serviceCenterName || "Toyota Service",
        odometerAtLastService: inspection.odometerAtLastService || 45200,
        serviceRecordDocumentKey: inspection.serviceRecordDocumentKey || "",

        tyreConditionFrontLeft: inspection.tyreConditionFrontLeft || "Good",
        tyreConditionFrontRight: inspection.tyreConditionFrontRight || "Good",
        tyreConditionRearRight: inspection.tyreConditionRearRight || "Fair",
        tyreConditionRearLeft: inspection.tyreConditionRearLeft || "Fair",

        damagePresent: inspection.damagePresent || "Yes",
        damages: (inspection.damages || [])
          .filter((d) => d && d.key)
          .map((d) => ({
            damageImage: d.key,
            damageDescription: d.description || "",
            damageSeverity:
              d.severity?.charAt(0).toUpperCase() + d.severity?.slice(1) ||
              "Minor",
            repairRequired: d.repairRequired ? "Yes" : "No",
          })),

        roadTest: inspection.roadTest || "Yes",
        roadTestComments: inspection.roadTestComments || "",
        generalComments: inspection.generalComments || "",
      };

      console.log("Sending Payload:", JSON.stringify(finalPayload, null, 2));

      if (inspection._id) {
        await axios.put(
          `http://192.168.100.25:5000/inspections/${inspection._id}`,
          finalPayload,
        );
      } else {
        await axios.post(
          `http://192.168.100.25:5000/inspections`,
          finalPayload,
        );
      }

      // dispatch(resetInspection());
      Alert.alert("Success", "Inspection submitted successfully!");
      navigation.navigate("ReviewInspection");
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Something went wrong";
      console.error("Submit error:", msg);
      Alert.alert("Submission Failed", msg);
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={tw`flex-1 bg-white`}>
        <ScrollView style={tw`flex-1 px-4`} contentContainerStyle={tw`pb-32`}>
          <View style={tw`flex-row items-center mb-6`}>
            <TouchableOpacity onPress={handleBack} style={tw`mr-3`}>
              <AppIcon name="arrow-left" size={24} color="#065f46" />
            </TouchableOpacity>
            <Text style={tw`text-lg font-bold text-green-800`}>
              Interior Back Image
            </Text>
          </View>

          <ImageComparison
            partKey={partKey}
            images={images}
            setPreviewUri={setPreviewUri}
            setPreviewVisible={setPreviewVisible}
          />

          {uploading && <LoadingIndicator label="Uploading..." />}
          {analyzing && <LoadingIndicator label="Analyzing..." />}

          <ImageActions
            partKey={partKey}
            images={images}
            saveImagesToRedux={saveImagesToRedux}
            setUploading={setUploading}
            setProgress={setProgress}
          />

          <AnalyzeDeleteButtons
            partKey={partKey}
            images={images}
            saveImagesToRedux={saveImagesToRedux}
            analyzing={analyzing}
            setAnalyzing={setAnalyzing}
          />

          <DamageSection inspection={inspection} partKey={partKey} />
        </ScrollView>

        <View
          style={tw`absolute bottom-0 left-0 right-0 px-4 pb-6 bg-white pt-4 border-t border-gray-200`}
        >
          <TouchableOpacity
            onPress={handleSubmit}
            style={tw`bg-green-700 py-4 rounded-xl items-center shadow-lg`}
          >
            <Text style={tw`text-white text-lg font-semibold`}>
              Review Inspection
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
