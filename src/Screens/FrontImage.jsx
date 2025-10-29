// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   TextInput,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import { useDispatch, useSelector } from "react-redux";
// import { setImages } from "../redux/slices/inspectionSlice";
// import axios from "axios";
// // import { Ionicons } from "@expo/vector-icons"; // ✅ expo users
// import Ionicons from "react-native-vector-icons/Ionicons";

// import { API_BASE_URL_Prod } from "../../utils/config";
// import ImageViewing from "react-native-image-viewing";
// import SafeAreaWrapper from "../components/SafeAreaWrapper";
// import Collapsible from "react-native-collapsible";
// import Icon from "react-native-vector-icons/Feather";
// import {
//   handleImageCapture,
//   handlePickFromGallery,
//   handleDeleteFromS3,
//   handleAnalyzeImage,
// } from "../../utils/inspectionFunctions";
// import SignedImage from "../components/SignedImage";
// import DamageList from "../components/DamageList";
// import AppIcon from "../components/AppIcon";
// import {
//   Header,
//   ImageComparison,
//   ImageActions,
//   LoadingIndicator,
//   AnalyzeDeleteButtons,
//   DamageSection,
//   NextButton,
// } from "../components/InspectionComponent";

// export default function FrontImage({ navigation }) {
//   const dispatch = useDispatch();
//   const { images: savedImages } = useSelector((state) => state.inspection);
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [previewUri, setPreviewUri] = useState(null);

//   const inspection = useSelector((state) => state.inspection);

//   const partKey = "frontImage";
//   console.log("savedImages:", savedImages);
//   const [images, setLocalImages] = useState(savedImages || {});
//   const [urlInput, setUrlInput] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [analyzing, setAnalyzing] = useState(false);

//   // ✅ Helper to update Redux + local state
//   const saveImagesToRedux = (updatedImages) => {
//     setLocalImages(updatedImages);
//     dispatch(setImages(updatedImages));
//   };

//   const handleBack = () => {
//     // Optionally clear or update redux if you want when going back
//     // dispatch(clearEngineDetails());

//     navigation.goBack();
//   };

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
//               Front Image
//             </Text>
//           </View>

//           {/* Original + Analyzed */}
//           <ImageComparison
//             partKey={partKey}
//             images={images}
//             setPreviewUri={setPreviewUri}
//             setPreviewVisible={setPreviewVisible}
//           />

//           {uploading && <LoadingIndicator label={`Uploading...`} />}
//           {analyzing && <LoadingIndicator label={`Analyzing...`} />}

//           <ImageActions
//             partKey={partKey} // 🔹 change per page
//             images={images}
//             saveImagesToRedux={saveImagesToRedux}
//             setUploading={setUploading}
//             setProgress={setProgress}
//           />

//           {/* Analyze + Delete */}
//           <AnalyzeDeleteButtons
//             partKey={partKey} // 🔹 change per page
//             images={images}
//             saveImagesToRedux={saveImagesToRedux}
//             setAnalyzing={setAnalyzing}
//             analyzing={analyzing}
//           />

//           {/* Damages List */}
//           <DamageSection inspection={inspection} partKey={partKey} />
//         </ScrollView>

//         {/* Next */}
//         <NextButton navigation={navigation} nextScreen="RearImage" />
//       </View>
//     </SafeAreaWrapper>
//   );
// }
import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { setImages } from "../redux/slices/inspectionSlice";
import axios from "axios";
// import { Ionicons } from "@expo/vector-icons"; // ✅ expo users
import Ionicons from "react-native-vector-icons/Ionicons";

import { API_BASE_URL_Prod } from "../../utils/config";
import ImageViewing from "react-native-image-viewing";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import Collapsible from "react-native-collapsible";
import Icon from "react-native-vector-icons/Feather";
import {
  handleImageCapture,
  handlePickFromGallery,
  handleDeleteFromS3,
  handleAnalyzeImage,
} from "../../utils/inspectionFunctions";
import SignedImage from "../components/SignedImage";
import DamageList from "../components/DamageList";
import AppIcon from "../components/AppIcon";
import {
  Header,
  ImageComparison,
  ImageActions,
  LoadingIndicator,
  AnalyzeDeleteButtons,
  DamageSection,
  NextButton,
} from "../components/InspectionComponent";

export default function FrontImage({ navigation }) {
  const dispatch = useDispatch();
  const { images: savedImages } = useSelector((state) => state.inspection);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState(null);

  const inspection = useSelector((state) => state.inspection);

  const partKey = "frontImage";
  console.log("savedImages:", savedImages);
  const [images, setLocalImages] = useState(savedImages || {});
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  // ✅ Helper to update Redux + local state
  const saveImagesToRedux = (updatedImages) => {
    setLocalImages(updatedImages);
    dispatch(setImages(updatedImages));
  };

  const handleBack = () => {
    // Optionally clear or update redux if you want when going back
    // dispatch(clearEngineDetails());

    navigation.goBack();
  };

  return (
    <SafeAreaWrapper>
      <View style={tw`flex-1 bg-white`}>
        <ScrollView style={tw`flex-1 px-4`} contentContainerStyle={tw`pb-32`}>
          <View style={tw`flex-row items-center mb-6`}>
            <TouchableOpacity onPress={handleBack} style={tw`mr-3`}>
              <AppIcon name="arrow-left" size={24} color="#065f46" />
              {/* green-800 color */}
            </TouchableOpacity>
            <Text style={tw`text-lg font-bold text-green-800`}>
              Front Image
            </Text>
          </View>

          {/* Original + Analyzed */}
          <ImageComparison
            partKey={partKey}
            images={images}
            setPreviewUri={setPreviewUri}
            setPreviewVisible={setPreviewVisible}
          />

          {uploading && <LoadingIndicator label={`Uploading...`} />}
          {analyzing && <LoadingIndicator label={`Analyzing...`} />}

          <ImageActions
            partKey={partKey} // 🔹 change per page
            images={images}
            saveImagesToRedux={saveImagesToRedux}
            setUploading={setUploading}
            setProgress={setProgress}
          />

          {/* Analyze + Delete */}
          <AnalyzeDeleteButtons
            partKey={partKey} // 🔹 change per page
            images={images}
            saveImagesToRedux={saveImagesToRedux}
            setAnalyzing={setAnalyzing}
            analyzing={analyzing}
          />

          {/* Damages List */}
          <DamageSection inspection={inspection} partKey={partKey} />
        </ScrollView>

        {/* Next */}
        <NextButton navigation={navigation} nextScreen="RearImage" />
      </View>
    </SafeAreaWrapper>
  );
}
