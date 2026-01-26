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
    <TouchableOpacity onPress={onBack} style={tw`mr-3`}>
      <Ionicons name="arrow-back" size={24} color="#065f46" />
    </TouchableOpacity>
    <Text style={tw`text-lg font-bold text-green-800`}>{title}</Text>
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
  <View style={tw`flex-row justify-between mb-4`}>
    {/* Original */}
    <View style={tw`flex-1 mr-2`}>
      <Text style={tw`font-semibold`}>Original</Text>
      {images[partKey]?.original ? (
        <SignedImage
          s3Key={images[partKey].original}
          onPress={(url) => {
            setPreviewUri(url);
            setPreviewVisible(true);
          }}
        />
      ) : (
        <Text style={tw`text-gray-500 mt-2`}>No Original Image</Text>
      )}
    </View>

    {/* Analyzed */}
    <View style={tw`flex-1 ml-2`}>
      <Text style={tw`font-semibold`}>Analyzed</Text>
      {images[partKey]?.analyzed ? (
        <SignedImage
          s3Key={images[partKey].analyzed}
          onPress={(url) => {
            setPreviewUri(url);
            setPreviewVisible(true);
          }}
        />
      ) : (
        <Text style={tw`text-gray-500 mt-2`}>No Analyzed Image</Text>
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

const LoadingIndicator = ({ label }) => (
  <View style={tw`my-2`}>
    <Text>{label}...</Text>
    <ActivityIndicator size="small" color="#16a34a" />
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

const AnalyzeDeleteButtons = ({
  partKey,
  images,
  saveImagesToRedux,
  analyzing,
  setAnalyzing,
}) => (
  <View style={tw`flex-row justify-between mt-4`}>
    {images[partKey]?.original && (
      <>
        <TouchableOpacity
          style={tw`${
            analyzing ? "bg-gray-400" : "bg-red-500"
          } p-3 rounded-lg flex-1 mr-2`}
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
          <Text style={tw`text-white text-center`}>
            {analyzing ? "Analyzing..." : "Analyze"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`${
            analyzing ? "bg-gray-400" : "bg-red-500"
          } p-3 rounded-lg flex-1 ml-2`}
          onPress={() =>
            handleDeleteFromS3({ partKey, images, saveImagesToRedux })
          }
          disabled={analyzing}
        >
          <Text style={tw`text-white text-center`}>Delete</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
);

const DamageSection = ({ inspection, partKey }) => {
  const damages = inspection?.images?.[partKey]?.damages;

  if (!damages || damages.length === 0) return null;

  return (
    <View style={tw`mt-6`}>
      <Text style={tw`text-lg font-bold text-green-800 mb-2`}>
        Detected Damages
      </Text>
      <DamageList damages={damages} />
    </View>
  );
};

const NextButton = ({ navigation, nextScreen }) => (
  <View style={tw`absolute bottom-0 left-0 right-0 p-4 mb-10 bg-white`}>
    <TouchableOpacity
      style={tw`bg-green-700 p-3 rounded-lg`}
      onPress={() => navigation.navigate(nextScreen)}
    >
      <Text style={tw`text-white text-center font-bold`}>Next</Text>
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
