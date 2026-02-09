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
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  <View style={tw`flex-row items-center mb-6`}>
    <TouchableOpacity
      onPress={onBack}
      style={tw`w-10 h-10 rounded-full bg-gray-100 items-center justify-center`}
    >
      <Ionicons name="arrow-back" size={22} color="#065f46" />
    </TouchableOpacity>

    <Text style={tw`ml-3 text-xl font-bold text-gray-900`}>{title}</Text>
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
  <View style={tw`flex-row justify-between mb-6`}>
    {/* Original */}
    <View style={tw`flex-1 mr-2 bg-white rounded-2xl p-3 shadow-sm`}>
      <Text style={tw`text-gray-800 font-bold mb-2`}>Original</Text>

      {images?.[partKey]?.original ? (
        <SignedImage
          s3Key={images[partKey].original}
          onPress={(url) => {
            setPreviewUri(url);
            setPreviewVisible(true);
          }}
        />
      ) : (
        <Text style={tw`text-gray-400 text-sm mt-4 text-center`}>
          No original image
        </Text>
      )}
    </View>

    {/* Analyzed */}
    <View style={tw`flex-1 ml-2 bg-white rounded-2xl p-3 shadow-sm`}>
      <Text style={tw`text-gray-800 font-bold mb-2`}>Analyzed</Text>

      {images?.[partKey]?.analyzed ? (
        <SignedImage
          s3Key={images[partKey].analyzed}
          onPress={(url) => {
            setPreviewUri(url);
            setPreviewVisible(true);
          }}
        />
      ) : (
        <Text style={tw`text-gray-400 text-sm mt-4 text-center`}>
          Not analyzed yet
        </Text>
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
  <>
    <TouchableOpacity
      style={tw`bg-green-700 p-3 rounded-lg mt-4`}
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
      <Text style={tw`text-white text-center`}>Pick from Gallery</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={tw`bg-green-700 p-3 rounded-lg mt-4`}
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
      <Text style={tw`text-white text-center`}>Capture from Camera</Text>
    </TouchableOpacity>
  </>
);

const LoadingIndicator = ({ label }) => (
  <View style={tw`flex-row items-center bg-green-50 p-4 rounded-2xl mb-4`}>
    <ActivityIndicator size="small" color="#15803d" />
    <Text style={tw`ml-3 text-green-800 font-bold`}>{label}...</Text>
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
    <View style={tw`flex-row justify-between mb-6`}>
      <TouchableOpacity
        style={tw.style(
          "flex-1 py-4 rounded-2xl flex-row justify-center items-center mr-2",
          analyzing ? "bg-gray-300" : "bg-blue-600",
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
        <Ionicons name="sparkles" size={18} color="white" />
        <Text style={tw`text-white font-bold ml-2`}>
          {analyzing ? "Analyzing..." : "Analyze"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw.style(
          "flex-1 py-4 rounded-2xl flex-row justify-center items-center ml-2",
          analyzing ? "bg-gray-300" : "bg-red-600",
        )}
        onPress={() =>
          handleDeleteFromS3({ partKey, images, saveImagesToRedux })
        }
        disabled={analyzing}
      >
        <Ionicons name="trash" size={18} color="white" />
        <Text style={tw`text-white font-bold ml-2`}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const DamageSection = ({ inspection, partKey }) => {
  const damages = inspection?.images?.[partKey]?.damages;

  if (!damages || damages.length === 0) return null;

  return (
    <View style={tw`bg-white rounded-3xl p-5 shadow-sm`}>
      <Text style={tw`text-lg font-bold text-gray-900 mb-3`}>
        Detected Damages
      </Text>
      <DamageList damages={damages} />
    </View>
  );
};

const NextButton = ({ onNext }) => (
  <View style={tw`absolute bottom-0 left-0 right-0 px-4 pb-6 bg-white`}>
    <TouchableOpacity
      style={tw`bg-green-700 py-4 rounded-3xl shadow-lg`}
      onPress={onNext}
    >
      <Text style={tw`text-white text-center text-lg font-bold`}>Continue</Text>
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
