import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";

export default function RightImage({ route, navigation }) {
  const {
    vin,
    make,
    carModel,
    year,
    engineNumber,
    mileAge,
    overallRating,
    city,
    owner,
    inspectorEmail,
    images: initialImages,
  } = route.params;

  const partKey = "rightImage"; // 🔹 lowercase
  const [images, setImages] = useState(initialImages || {});
  const [urlInput, setUrlInput] = useState("");

  // 📌 Pick from Gallery
  const handlePickFromGallery = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: "photo", quality: 1 });
      if (!result.didCancel && result.assets?.length > 0) {
        setImages((prev) => ({
          ...prev,
          [partKey]: {
            original: result.assets[0].uri,
            analyzed: undefined,
            damages: [],
          },
        }));
      }
    } catch (err) {
      console.log("Gallery pick failed", err);
    }
  };

  // 📌 Capture from Camera
  const handleImageCapture = async () => {
    try {
      const result = await launchCamera({
        mediaType: "photo",
        quality: 1,
        saveToPhotos: true,
      });
      if (!result.didCancel && result.assets?.length > 0) {
        setImages((prev) => ({
          ...prev,
          [partKey]: {
            original: result.assets[0].uri,
            analyzed: undefined,
            damages: [],
          },
        }));
      }
    } catch (err) {
      console.log("Camera capture failed", err);
    }
  };

  // 📌 Add from URL
  const handleAddFromUrl = () => {
    if (!urlInput.trim()) {
      Alert.alert("Invalid URL", "Please enter a valid image URL.");
      return;
    }
    setImages((prev) => ({
      ...prev,
      [partKey]: {
        original: urlInput.trim(),
        analyzed: undefined,
        damages: [],
      },
    }));
    setUrlInput("");
  };

  // 📌 Analyze Mock
  const handleAnalyze = () => {
    if (!images[partKey]?.original) {
      Alert.alert("No Image", "Please add an image first.");
      return;
    }
    setImages((prev) => ({
      ...prev,
      [partKey]: {
        ...prev[partKey],
        analyzed: images[partKey].original,
        damages: [{ description: "Dent on right fender", type: "dent" }],
      },
    }));
  };

  // 📌 Delete
  const handleDelete = () => {
    setImages((prev) => ({
      ...prev,
      [partKey]: { original: undefined, analyzed: undefined, damages: [] },
    }));
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 px-4 pt-10`} contentContainerStyle={tw`pb-32`}>
        <Text style={tw`text-lg font-bold text-green-800 mb-6`}>
          Right Image
        </Text>

        {/* Show Original + Analyzed */}
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

        {/* Gallery Button */}
        <TouchableOpacity
          style={tw`bg-purple-600 p-3 rounded-lg mt-4`}
          onPress={handlePickFromGallery}
        >
          <Text style={tw`text-white text-center`}>Pick from Gallery</Text>
        </TouchableOpacity>

        {/* Camera Button */}
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
          onPress={() =>
            navigation.navigate("BodyChecklist", {
              vin,
              make,
              carModel,
              year,
              engineNumber,
              mileAge,
              overallRating,
              city,
              owner,
              inspectorEmail,
              images,
            })
          }
        >
          <Text style={tw`text-white text-center font-bold`}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
