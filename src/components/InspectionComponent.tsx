// import React from "react";
// import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import tw from "tailwind-react-native-classnames";
// import ImageViewing from "react-native-image-viewing";
// import SignedImage from "./SignedImage";
// import {
//   handleAnalyzeImage,
//   handleDeleteFromS3,
//   handleImageCapture,
//   handlePickFromGallery,
// } from "../../utils/inspectionFunctions";
// import DamageList from "./DamageList";

// const Header = ({ title, onBack }) => (
//   <View style={tw`flex-row items-center mb-6`}>
//     <TouchableOpacity onPress={onBack} style={tw`mr-3`}>
//       <Ionicons name="arrow-back" size={24} color="#065f46" />
//     </TouchableOpacity>
//     <Text style={tw`text-lg font-bold text-green-800`}>{title}</Text>
//   </View>
// );

// const ImageComparison = ({
//   partKey,
//   images,
//   previewUri,
//   setPreviewUri,
//   previewVisible,
//   setPreviewVisible,
// }) => (
//   <View style={tw`flex-row justify-between mb-4`}>
//     {/* Original */}
//     <View style={tw`flex-1 mr-2`}>
//       <Text style={tw`font-semibold`}>Original</Text>
//       {images[partKey]?.original ? (
//         <SignedImage
//           s3Key={images[partKey].original}
//           onPress={(url) => {
//             setPreviewUri(url);
//             setPreviewVisible(true);
//           }}
//         />
//       ) : (
//         <Text style={tw`text-gray-500 mt-2`}>No Original Image</Text>
//       )}
//     </View>

//     {/* Analyzed */}
//     <View style={tw`flex-1 ml-2`}>
//       <Text style={tw`font-semibold`}>Analyzed</Text>
//       {images[partKey]?.analyzed ? (
//         <SignedImage
//           s3Key={images[partKey].analyzed}
//           onPress={(url) => {
//             setPreviewUri(url);
//             setPreviewVisible(true);
//           }}
//         />
//       ) : (
//         <Text style={tw`text-gray-500 mt-2`}>No Analyzed Image</Text>
//       )}
//     </View>

//     {/* Fullscreen Preview */}
//     <ImageViewing
//       images={[{ uri: previewUri }]}
//       imageIndex={0}
//       visible={previewVisible}
//       onRequestClose={() => setPreviewVisible(false)}
//     />
//   </View>
// );

// const LoadingIndicator = ({ label }) => (
//   <View style={tw`my-2`}>
//     <Text>{label}...</Text>
//     <ActivityIndicator size="small" color="#16a34a" />
//   </View>
// );

// const ImageActions = ({
//   partKey,
//   images,
//   saveImagesToRedux,
//   setUploading,
//   setProgress,
// }) => (
//   <>
//     <TouchableOpacity
//       style={tw`bg-purple-600 p-3 rounded-lg mt-4`}
//       onPress={() =>
//         handlePickFromGallery({
//           partKey,
//           images,
//           saveImagesToRedux,
//           setUploading,
//           setProgress,
//         })
//       }
//     >
//       <Text style={tw`text-white text-center`}>Pick from Gallery</Text>
//     </TouchableOpacity>

//     <TouchableOpacity
//       style={tw`bg-purple-600 p-3 rounded-lg mt-4`}
//       onPress={() =>
//         handleImageCapture({
//           partKey,
//           images,
//           saveImagesToRedux,
//           setUploading,
//           setProgress,
//         })
//       }
//     >
//       <Text style={tw`text-white text-center`}>Capture from Camera</Text>
//     </TouchableOpacity>
//   </>
// );

// const AnalyzeDeleteButtons = ({
//   partKey,
//   images,
//   saveImagesToRedux,
//   analyzing,
//   setAnalyzing,
// }) => (
//   <View style={tw`flex-row justify-between mt-4`}>
//     {images[partKey]?.original && (
//       <>
//         <TouchableOpacity
//           style={tw`${
//             analyzing ? "bg-gray-400" : "bg-red-500"
//           } p-3 rounded-lg flex-1 mr-2`}
//           onPress={() =>
//             handleAnalyzeImage({
//               partKey,
//               images,
//               saveImagesToRedux,
//               setAnalyzing,
//             })
//           }
//           disabled={analyzing}
//         >
//           <Text style={tw`text-white text-center`}>
//             {analyzing ? "Analyzing..." : "Analyze"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={tw`${
//             analyzing ? "bg-gray-400" : "bg-red-500"
//           } p-3 rounded-lg flex-1 ml-2`}
//           onPress={() =>
//             handleDeleteFromS3({ partKey, images, saveImagesToRedux })
//           }
//           disabled={analyzing}
//         >
//           <Text style={tw`text-white text-center`}>Delete</Text>
//         </TouchableOpacity>
//       </>
//     )}
//   </View>
// );

// const DamageSection = ({ inspection, partKey }) => {
//   const damages = inspection?.images?.[partKey]?.damages;

//   if (!damages || damages.length === 0) return null;

//   return (
//     <View style={tw`mt-6`}>
//       <Text style={tw`text-lg font-bold text-green-800 mb-2`}>
//         Detected Damages
//       </Text>
//       <DamageList damages={damages} />
//     </View>
//   );
// };

// const NextButton = ({ navigation, nextScreen }) => (
//   <View style={tw`absolute bottom-0 left-0 right-0 p-4 mb-10 bg-white`}>
//     <TouchableOpacity
//       style={tw`bg-green-700 p-3 rounded-lg`}
//       onPress={() => navigation.navigate(nextScreen)}
//     >
//       <Text style={tw`text-white text-center font-bold`}>Next</Text>
//     </TouchableOpacity>
//   </View>
// );

// export = {
//   Header,
//   NextButton,
//   DamageSection,
//   ImageComparison,
//   LoadingIndicator,
//   ImageActions,
//   AnalyzeDeleteButtons,
// };
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  CameraIcon,
  ArrowRightIcon,
  SparklesIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "react-native-heroicons/outline";
import tw from "tailwind-react-native-classnames";
import ImageViewing from "react-native-image-viewing";
import SignedImage from "./SignedImage";
import {
  handleAnalyzeImage,
  handleDeleteFromS3,
  handleImageCapture,
  handlePickFromGallery,
} from "../../utils/inspectionFunctions";
import DamageList from "./DamageList";

const Header = ({ title, onBack }) => (
  <View style={tw`flex-row items-center justify-between mb-6`}>
    <TouchableOpacity
      onPress={onBack}
      activeOpacity={0.8}
      style={tw`w-11 h-11 text-color items-center justify-center`}
    >
      <ArrowRightIcon size={22} color="white" />
    </TouchableOpacity>

    <Text
      style={tw`flex-1 ml-4 text-xl font-extrabold text-gray-900`}
      numberOfLines={1}
    >
      {title}
    </Text>
  </View>
);

const ImageComparison = ({
  partKey,
  images,
  previewUri,
  setPreviewUri,
  previewVisible,
  setPreviewVisible,
}) => (
  <View style={tw`flex-row justify-between mb-8`}>
    {/* Original */}
    <View
      style={tw`flex-1 mr-2 bg-white rounded-3xl p-4 border border-gray-200 shadow-sm`}
    >
      <Text style={tw`text-gray-900 font-extrabold text-base mb-2`}>
        Original
      </Text>

      <Text style={tw`text-gray-500 text-xs mb-3`}>Captured photo</Text>

      {images?.[partKey]?.original ? (
        <SignedImage
          s3Key={images[partKey].original}
          onPress={(url) => {
            setPreviewUri(url);
            setPreviewVisible(true);
          }}
        />
      ) : (
        <View
          style={tw`h-32 bg-gray-50 rounded-2xl border border-gray-200 items-center justify-center`}
        >
          <Ionicons name="image-outline" size={26} color="#9ca3af" />
          <Text style={tw`text-gray-400 text-sm mt-2`}>No original image</Text>
        </View>
      )}
    </View>

    {/* Analyzed */}
    <View
      style={tw`flex-1 ml-2 bg-white rounded-3xl p-4 border border-gray-200 shadow-sm`}
    >
      <Text style={tw`text-gray-900 font-extrabold text-base mb-2`}>
        Analyzed
      </Text>

      <Text style={tw`text-gray-500 text-xs mb-3`}>AI processed result</Text>

      {images?.[partKey]?.analyzed ? (
        <SignedImage
          s3Key={images[partKey].analyzed}
          onPress={(url) => {
            setPreviewUri(url);
            setPreviewVisible(true);
          }}
        />
      ) : (
        <View
          style={tw`h-32 bg-gray-50 rounded-2xl border border-gray-200 items-center justify-center`}
        >
          <SparklesIcon size={26} color="#9ca3af" />
          <Text style={tw`text-gray-400 text-sm mt-2`}>Not analyzed yet</Text>
        </View>
      )}
    </View>

    {/* Fullscreen Preview */}
    <ImageViewing
      images={[{ uri: previewUri }]}
      imageIndex={0}
      visible={previewVisible}
      onRequestClose={() => setPreviewVisible(false)}
    />
  </View>
);

const ImageActions = ({
  partKey,
  images,
  saveImagesToRedux,
  setUploading,
  setProgress,
}) => (
  <View style={tw`mb-6`}>
    <Text style={tw`text-gray-900 font-extrabold text-lg mb-3`}>
      Upload Options
    </Text>

    <View style={tw`bg-white rounded-3xl p-4 border border-gray-200 shadow-sm`}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={tw`bg-green-700 py-4 rounded-2xl flex-row items-center justify-center`}
        onPress={() =>
          handlePickFromGallery({
            partKey,
            images,
            saveImagesToRedux,
            setUploading,
            setProgress,
          })
        }
      >
        <View
          style={tw`w-9 h-9 rounded-full bg-white bg-opacity-20 items-center justify-center mr-3`}
        >
          <CameraIcon size={18} color="white" />
        </View>

        <Text style={tw`text-white font-extrabold text-base`}>
          Pick from Gallery
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        style={tw`mt-3 bg-gray-900 py-4 rounded-2xl flex-row items-center justify-center`}
        onPress={() =>
          handleImageCapture({
            partKey,
            images,
            saveImagesToRedux,
            setUploading,
            setProgress,
          })
        }
      >
        <View
          style={tw`w-9 h-9 rounded-full bg-white bg-opacity-20 items-center justify-center mr-3`}
        >
          <CameraIcon size={18} color="white" />
        </View>

        <Text style={tw`text-white font-extrabold text-base`}>
          Capture from Camera
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const LoadingIndicator = ({ label }) => (
  <View
    style={tw`flex-row items-center bg-green-50 border border-green-200 p-4 rounded-2xl mb-4`}
  >
    <ActivityIndicator size="small" color="#15803d" />
    <Text style={tw`ml-3 text-green-900 font-bold text-sm`}>{label}...</Text>
  </View>
);

const AnalyzeDeleteButtons = ({
  partKey,
  images,
  saveImagesToRedux,
  analyzing,
  setAnalyzing,
}) => {
  if (!images?.[partKey]?.original) return null;

  return (
    <View style={tw`flex-row mb-8`}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={tw.style(
          "flex-1 py-4 rounded-2xl flex-row justify-center items-center mr-2 border shadow-sm",
          analyzing
            ? "bg-gray-200 border-gray-200"
            : "bg-black border-black-600",
        )}
        onPress={() =>
          handleAnalyzeImage({
            partKey,
            images,
            saveImagesToRedux,
            setAnalyzing,
          })
        }
        disabled={analyzing}
      >
        <SparklesIcon size={18} color="white" />
        <Text style={tw`text-white font-extrabold ml-2 text-base`}>
          {analyzing ? "Analyzing..." : "Analyze"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        style={tw.style(
          "flex-1 py-4 rounded-2xl flex-row justify-center items-center ml-2 border shadow-sm",
          analyzing ? "bg-gray-200 border-gray-200" : "bg-black ",
        )}
        onPress={() =>
          handleDeleteFromS3({ partKey, images, saveImagesToRedux })
        }
        disabled={analyzing}
      >
        <TrashIcon size={18} color="white" />
        <Text style={tw`text-white font-extrabold ml-2 text-base`}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const DamageSection = ({ inspection, partKey }) => {
  const damages = inspection?.images?.[partKey]?.damages;

  if (!damages || damages.length === 0) return null;

  const isScrollable = damages.length > 3;

  const getTypeStyle = (type) => {
    switch ((type || "").toLowerCase()) {
      case "dent":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          icon: "alert-circle-outline",
        };
      case "scratch":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          border: "border-yellow-200",
          icon: "warning-outline",
        };
      case "broken glass":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
          icon: "sparkles-outline",
        };
      case "rust":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          border: "border-orange-200",
          icon: "flame-outline",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: "help-circle-outline",
        };
    }
  };

  const DamageItem = ({ damage, index }) => {
    const style = getTypeStyle(damage?.type);

    return (
      <View
        style={tw.style(
          "bg-white rounded-2xl border p-4 mb-3 shadow-sm",
          style.border,
        )}
      >
        {/* Header Row */}
        <View style={tw`flex-row items-center justify-between mb-2`}>
          <View style={tw`flex-row items-center`}>
            <View
              style={tw.style(
                "w-10 h-10 rounded-2xl items-center justify-center mr-3",
                style.bg,
              )}
            >
              <SparklesIcon size={18} color="black" />
            </View>

            <View>
              <Text style={tw`text-gray-900 font-extrabold text-sm`}>
                Damage #{index + 1}
              </Text>

              <View
                style={tw.style(
                  "mt-1 px-3 py-1 rounded-full self-start border",
                  style.bg,
                  style.border,
                )}
              >
                <Text
                  style={tw.style("text-xs font-bold uppercase", style.text)}
                >
                  {damage?.type || "Unknown"}
                </Text>
              </View>
            </View>
          </View>

        </View>

        {/* Description */}
        <Text style={tw`text-gray-700 text-sm leading-5`}>
          {damage?.description || "No description provided"}
        </Text>

        {/* Footer */}
        {damage?.bbox && (
          <View style={tw`flex-row items-center mt-3`}>
            <Ionicons name="scan-outline" size={15} color="#6b7280" />
            <Text style={tw`text-gray-500 text-xs ml-2 font-semibold`}>
              Region detected in image
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      style={tw`bg-white rounded-3xl p-5 border border-gray-200 shadow-sm mb-4`}
    >
      {/* Top Header */}
      <View style={tw`flex-row items-center justify-between mb-4`}>
        <View style={tw`flex-row items-center`}>
          <View
            style={tw`w-12 h-12 rounded-2xl bg-red-50 items-center justify-center mr-3`}
          >
            <ExclamationTriangleIcon size={24} color="#dc2626" />
          </View>

          <View>
            <Text style={tw`text-lg font-extrabold text-gray-900`}>
              Damage Report
            </Text>
            <Text style={tw`text-gray-500 text-xs mt-1`}>
              AI detected possible issues in this image
            </Text>
          </View>
        </View>

        {/* Count Badge */}
        <View style={tw`bg-red-100 px-2 mb-3 py-2 rounded-full`}>
          <Text style={tw`text-red-700 font-extrabold text-xs`}>
            {damages.length} Found
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={tw`h-px bg-gray-200 mb-4`} />

      {/* Damage List */}
      {isScrollable ? (
        <ScrollView
          style={tw`max-h-72`}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}
        >
          {damages.map((damage: any, index: any) => (
            <DamageItem key={index} damage={damage} index={index} />
          ))}
        </ScrollView>
      ) : (
        <View>
          {damages.map((damage: any, index: any) => (
            <DamageItem key={index} damage={damage} index={index} />
          ))}
        </View>
      )}

      {/* Footer Disclaimer */}
      <View
        style={tw`mt-3 flex-row items-center bg-gray-50 border border-gray-200 p-3 rounded-2xl`}
      >
        <InformationCircleIcon size={18} color="#4b5563" />
        <Text style={tw`text-gray-600 text-xs ml-2 leading-4 flex-1`}>
          Please confirm damages manually before submitting. AI detection may
          not always be accurate.
        </Text>
      </View>
    </View>
  );
};

const NextButton = ({ onNext, label = "Continue" }) => (
  <View
    style={tw`absolute bottom-0 left-0 right-0 px-4 pb-6 bg-white border-t border-gray-200`}
  >
    <TouchableOpacity
      activeOpacity={0.9}
      style={tw`bg-green-700 py-4 rounded-3xl shadow-lg`}
      onPress={onNext}
    >
      <Text style={tw`text-white text-center text-lg font-extrabold`}>
        {label}
      </Text>
    </TouchableOpacity>
  </View>
);

export = {
  Header,
  NextButton,
  DamageSection,
  ImageComparison,
  LoadingIndicator,
  ImageActions,
  AnalyzeDeleteButtons,
};
