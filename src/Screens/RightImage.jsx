import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import tw from "tailwind-react-native-classnames";

export default function FrontImage({ route, navigation }) {
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

  const partKey = "RightImage";
  const [images, setImages] = useState(initialImages || {});
  const [urlInput, setUrlInput] = useState("");

  const handleAddUrl = () => {
    if (!urlInput.trim()) {
      alert("Please enter a valid image URL.");
      return;
    }
    setImages((prev) => ({
      ...prev,
      [partKey]: { original: urlInput, analyzed: undefined, damages: [] },
    }));
    setUrlInput("");
  };

  const handleAnalyze = () => {
    if (!images[partKey]?.original) {
      alert("No original image to analyze.");
      return;
    }
    setImages((prev) => ({
      ...prev,
      [partKey]: {
        ...prev[partKey],
        analyzed: images[partKey].original.replace(".jpg", "_annotated.jpg"),
        damages: [{ description: "Dent on bumper", type: "dent" }],
      },
    }));
  };

  const handleDelete = () => {
    setImages((prev) => ({
      ...prev,
      [partKey]: { original: undefined, analyzed: undefined, damages: [] },
    }));
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Scrollable content */}
      <ScrollView
        style={tw`flex-1 px-4 pt-10`}
        contentContainerStyle={tw`pb-32`} // extra space for bottom button
        showsVerticalScrollIndicator={false}
      >
        <Text style={tw`text-lg font-bold text-green-800 mb-6`}>
          Right Image
        </Text>

        {/* Original & Analyzed */}
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

        {/* Damages */}
        <Text style={tw`font-semibold mb-1`}>Damages</Text>
        {images[partKey]?.damages?.length > 0 ? (
          images[partKey].damages.map((d, i) => (
            <Text key={i} style={tw`text-gray-700`}>
              {d.description} ({d.type})
            </Text>
          ))
        ) : (
          <Text style={tw`text-gray-500`}>No Damages</Text>
        )}

        {/* Input + Add */}
        <TextInput
          placeholder="Enter image URL"
          value={urlInput}
          onChangeText={setUrlInput}
          style={tw`border border-gray-400 rounded-lg px-3 py-2 mt-4`}
        />
        <TouchableOpacity
          style={tw`bg-purple-500 p-2 rounded-lg mt-2`}
          onPress={handleAddUrl}
        >
          <Text style={tw`text-white text-center`}>Add Image (via URL)</Text>
        </TouchableOpacity>

        {/* Actions */}
        <View style={tw`flex-row justify-between mt-4`}>
          <TouchableOpacity
            style={tw`bg-red-500 p-2 rounded-lg flex-1 mr-2`}
            onPress={handleAnalyze}
          >
            <Text style={tw`text-white text-center`}>Analyze</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-red-500 p-2 rounded-lg flex-1 ml-2`}
            onPress={handleDelete}
          >
            <Text style={tw`text-white text-center`}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fixed Next button */}
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
