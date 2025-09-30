import React, { useState ,useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons"; // ✅ expo users
import { API_BASE_URL_Prod } from "../../utils/config";
import ImageViewing from "react-native-image-viewing";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import Collapsible from "react-native-collapsible";
import Icon from "react-native-vector-icons/Feather";
import { handleImageCapture ,handlePickFromGallery ,handleDeleteFromS3 , handleAnalyzeImage} from "../../utils/inspectionFunctions";
import SignedImage from "../components/SignedImage";
import DamageList from "../components/DamageList";

export default function FrontImage({ navigation }) {
  const dispatch = useDispatch();
  const { images: savedImages } = useSelector((state) => state.inspection);
  const [previewVisible, setPreviewVisible] = useState(false);
const [previewUri, setPreviewUri] = useState(null);

const inspection = useSelector((state) => state.inspection);


  const partKey = "frontImage";
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
      <ScrollView
        style={tw`flex-1 px-4 `}
        contentContainerStyle={tw`pb-32`}
      >
                 {/* Header */}
    <View style={tw`flex-row items-center mb-6`}>
      <TouchableOpacity onPress={handleBack} style={tw`mr-3`}>
        <Ionicons name="arrow-back" size={24} color="#065f46" /> 
        {/* green-800 color */}
      </TouchableOpacity>
      <Text style={tw`text-lg font-bold text-green-800`}>
        Vehicle Details
      </Text>
    </View>
        <Text style={tw`text-lg font-bold text-green-800 mb-6`}>
          Front Image
        </Text>

      {/* Original + Analyzed */}
<View style={tw`flex-row justify-between mb-4`}>
  {/* Original */}
  <View style={tw`flex-1 mr-2`}>
    <Text style={tw`font-semibold`}>Original</Text>
    {images[partKey]?.original ? (
      <SignedImage
        s3Key={images[partKey].original}
        onPress={(url) => {
          setPreviewUri(url); // use signed url
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
          setPreviewUri(url); // use signed url
          setPreviewVisible(true);
        }}
      />
    ) : (
      <Text style={tw`text-gray-500 mt-2`}>No Analyzed Image</Text>
    )}
  </View>

  {/* Fullscreen Preview */}
  <ImageViewing
    images={[{ uri: previewUri }]} // now this is a signed URL
    imageIndex={0}
    visible={previewVisible}
    onRequestClose={() => setPreviewVisible(false)}
  />
</View>


        {uploading && (
          <View style={tw`my-2`}>
            <Text>Uploading...</Text>
            <ActivityIndicator size="small" color="#16a34a" />
          </View>
        )}
        {analyzing && (
          <View style={tw`my-2`}>
            <Text>Analyzing...</Text>
            <ActivityIndicator size="small" color="#16a34a" />
          </View>
        )}

        {/* Add Image by URL */}
        {/* <View style={tw`mt-4`}>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3`}
            placeholder="Enter Image URL"
            value={urlInput}
            onChangeText={setUrlInput}
          />
          <TouchableOpacity
            style={tw`bg-indigo-600 p-3 rounded-lg mt-2`}
            onPress={handleAddFromUrl}
          >
            <Text style={tw`text-white text-center`}>Add Image by URL</Text>
          </TouchableOpacity>
        </View> */}

       {/* Gallery & Camera */}
<TouchableOpacity
  style={tw`bg-purple-600 p-3 rounded-lg mt-4`}
  onPress={() =>
    handlePickFromGallery({
      partKey: partKey,      // change to rearImage, leftImage, rightImage in other screens
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
  style={tw`bg-purple-600 p-3 rounded-lg mt-4`}
  onPress={() =>
    handleImageCapture({
      partKey: partKey,      // change accordingly per screen
      images,
      saveImagesToRedux,
      setUploading,
      setProgress,
    })
  }
>
  <Text style={tw`text-white text-center`}>Capture from Camera</Text>
</TouchableOpacity>


        {/* Analyze + Delete */}
     <View style={tw`flex-row justify-between mt-4`}>
  {inspection?.images?.frontImage?.original && (
    <>
  {/* Analyze Button */}
<TouchableOpacity
  style={tw`${analyzing ? "bg-gray-400" : "bg-red-500"} p-3 rounded-lg flex-1 mr-2`}
  onPress={() =>
    handleAnalyzeImage({
      partKey: partKey,   // 🔹 pass "frontImage", "rearImage", etc. per page
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


      {/* Delete Button */}
      <TouchableOpacity
        style={tw`bg-red-500 p-3 rounded-lg flex-1 ml-2`}
        onPress={() =>
          handleDeleteFromS3({
            partKey: partKey,   // 🔹 change per page
            images,
            saveImagesToRedux,
          })
        }
      >
        <Text style={tw`text-white text-center`}>Delete</Text>
      </TouchableOpacity>
    </>
  )}
</View>


        {/* Damages List */}
        {inspection?.images?.frontImage?.damages?.length > 0 && (
          <View style={tw`mt-6 `}>
            <Text style={tw`text-lg font-bold text-green-800 mb-2`}>
              Detected Damages
            </Text>
            <DamageList damages={inspection.images.frontImage.damages} />
          </View>
        )}
      </ScrollView>

      {/* Next */}
      <View style={tw`absolute bottom-0 left-0 right-0 p-4 mb-10 bg-white`}>
        <TouchableOpacity
          style={tw`bg-green-700 p-3 rounded-lg`}
          onPress={() => navigation.navigate("RearImage")}
        >
          <Text style={tw`text-white text-center font-bold`}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaWrapper>
  );
}
