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

export default function RearImage({ navigation }) {
  const dispatch = useDispatch();
  const { images: savedImages } = useSelector((state) => state.inspection);

  const partKey = "rearImage";
  const [images, setLocalImages] = useState(savedImages || {});
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const saveImagesToRedux = (updatedImages) => {
    setLocalImages(updatedImages);
    dispatch(setImages(updatedImages));
  };

  const analyzeInspection = async (key) => {
    try {
      console.log("🔑 Passing key to analyze:", key); // ✅ yahan lagao

      // STEP 1: Analyze API call
      const analyzeResp = await axios.post(
        "http://192.168.100.95:5000/inspections/analyze",
        { key },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      console.log("🔍 Analyze Response:", analyzeResp.data);

      const { analysedImageUrl, damages } = analyzeResp.data;

      Alert.alert(
        "Analysis Complete",
        damages.length > 0
          ? `Damages detected: ${JSON.stringify(damages)}`
          : "No damages found!"
      );

      // Example: Redux ya state update
      // dispatch(setAnalyzedData(analyzeResp.data));

      return analyzeResp.data;
    } catch (err) {
      console.error("❌ Analyze error:", err);
      Alert.alert("Error", "Image analysis failed");
      return null;
    }
  };
  const handleAnalyze = async () => {
    if (!images[partKey]?.key) {
      Alert.alert("No Image", "Please upload an image first.");
      return;
    }

    const analysis = await analyzeInspection(images[partKey].key);
    if (analysis) {
      const updated = {
        ...images,
        [partKey]: {
          ...images[partKey],
          analyzed: analysis.analysedImageUrl,
          damages: analysis.damages || [],
        },
      };
      saveImagesToRedux(updated);
    }
  };

  const uploadToS3 = async (fileUri) => {
    try {
      setUploading(true);
      setProgress(0);

      const fileType = mime.getType(fileUri) || "image/jpeg";

      // STEP 1: Presigned URL le lo
      const presignedResp = await axios.post(
        "http://192.168.100.95:5000/inspections/presigned",
        { fileType },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      const { url, key } = presignedResp.data;

      // STEP 2: Local file ko blob me convert karo (Hermes friendly)
      const fileResp = await fetch(fileUri);
      const blob = await fileResp.blob();

      console.log("okkkk", fileResp);

      // STEP 3: PUT request to upload
      const uploadResp = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": fileType,
        },
        body: blob,
      });

      if (uploadResp.ok) {
        console.log("✅ Image uploaded successfully to S3");
        Alert.alert("Success", "Image uploaded to S3!");

        // STEP 4: Clean URL banake Redux me key + s3Url save karo
        const cleanUrl = url.split("?")[0];
        console.log("📂 Final S3 File URL:", cleanUrl);

        const updated = {
          ...images,
          [partKey]: {
            ...images[partKey],
            original: fileUri, 
            s3Url: cleanUrl, 
            key: key, 
            analyzed: undefined,
            damages: [],
          },
        };
        saveImagesToRedux(updated);
      } else {
        console.error("❌ Upload failed:", uploadResp.status);
        Alert.alert("Error", "Failed to upload image to S3");
      }

      setUploading(false);
      setProgress(0);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setUploading(false);
      setProgress(0);
      Alert.alert("Error", "Upload failed due to network or file issue");
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 1,
      });
      if (!result.didCancel && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        const updated = {
          ...images,
          [partKey]: { original: uri, analyzed: undefined, damages: [] },
        };
        saveImagesToRedux(updated);
        uploadToS3(uri);
      }
    } catch (err) {
      console.log("Gallery pick failed", err);
    }
  };

  const handleImageCapture = async () => {
    try {
      const result = await launchCamera({
        mediaType: "photo",
        quality: 1,
        saveToPhotos: true,
      });
      if (!result.didCancel && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        const updated = {
          ...images,
          [partKey]: { original: uri, analyzed: undefined, damages: [] },
        };
        saveImagesToRedux(updated);
        uploadToS3(uri);
      }
    } catch (err) {
      console.log("Camera capture failed", err);
    }
  };

  const handleAddFromUrl = () => {
    if (!urlInput.trim()) {
      Alert.alert("Invalid URL", "Please enter a valid image URL.");
      return;
    }
    const updated = {
      ...images,
      [partKey]: {
        original: urlInput.trim(),
        analyzed: undefined,
        damages: [],
      },
    };
    saveImagesToRedux(updated);
    setUrlInput("");
  };

  const handleDelete = () => {
    const updated = {
      ...images,
      [partKey]: { original: undefined, analyzed: undefined, damages: [] },
    };
    saveImagesToRedux(updated);
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView
        style={tw`flex-1 px-4 pt-10`}
        contentContainerStyle={tw`pb-32`}
      >
        <Text style={tw`text-lg font-bold text-green-800 mb-6`}>
          Rear Image
        </Text>

        {/* Original + Analyzed */}
        <View style={tw`flex-row justify-between mb-4`}>
          <View style={tw`flex-1 mr-2`}>
            <Text style={tw`font-semibold`}>Original</Text>
            {images[partKey]?.original ? (
              <Image
                source={{ uri: images[partKey].original }}
                style={tw`w-full h-32 rounded-lg mt-2`}
                resizeMode="cover"
              />
            ) : (
              <Text style={tw`text-gray-500 mt-2`}>No Original Image</Text>
            )}
          </View>
          <View style={tw`flex-1 ml-2`}>
            <Text style={tw`font-semibold`}>Analyzed</Text>
            {images[partKey]?.analyzed ? (
              <Image
                source={{ uri: images[partKey].analyzed }}
                style={tw`w-full h-32 rounded-lg mt-2`}
                resizeMode="cover"
              />
            ) : (
              <Text style={tw`text-gray-500 mt-2`}>No Analyzed Image</Text>
            )}
          </View>
        </View>

        {uploading && (
          <View style={tw`my-2`}>
            <Text>Uploading...</Text>
            <ActivityIndicator size="small" color="#16a34a" />
          </View>
        )}

        {/* Add Image by URL */}
        <View style={tw`mt-4`}>
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
        </View>

        {/* Gallery & Camera */}
        <TouchableOpacity
          style={tw`bg-purple-600 p-3 rounded-lg mt-4`}
          onPress={handlePickFromGallery}
        >
          <Text style={tw`text-white text-center`}>Pick from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-purple-600 p-3 rounded-lg mt-4`}
          onPress={handleImageCapture}
        >
          <Text style={tw`text-white text-center`}>Capture from Camera</Text>
        </TouchableOpacity>

        {/* Analyze + Delete */}
        <View style={tw`flex-row justify-between mt-4`}>
          <TouchableOpacity
            style={tw`bg-red-500 p-3 rounded-lg flex-1 mr-2`}
            onPress={handleAnalyze}
          >
            <Text style={tw`text-white text-center`}>Analyze</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-red-500 p-3 rounded-lg flex-1 ml-2`}
            onPress={handleDelete}
          >
            <Text style={tw`text-white text-center`}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Next */}
      <View style={tw`absolute bottom-0 left-0 right-0 p-4 bg-white`}>
        <TouchableOpacity
          style={tw`bg-green-700 p-3 rounded-lg`}
          onPress={() => navigation.navigate("LeftImage")}
        >
          <Text style={tw`text-white text-center font-bold`}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
