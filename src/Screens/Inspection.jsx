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
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";

export default function InspectionScreen() {
  const [selectedPart, setSelectedPart] = useState("Front");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [city, setCity] = useState("");
  const [owner, setOwner] = useState("");
  const [carImage, setCarImage] = useState(null);

  const navigation = useNavigation();
  const parts = ["Front", "Back", "Left", "Right", "Roof"];

  // 📌 Upload from Gallery
  const handleImagePick = async () => {
    const result = await launchImageLibrary({ mediaType: "photo", quality: 1 });
    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setCarImage(result.assets[0].uri);
    }
  };

  // 📌 Capture from Camera
  const handleImageCapture = async () => {
    const result = await launchCamera({
      mediaType: "photo",
      quality: 1,
      saveToPhotos: true,
    });
    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setCarImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView
      style={tw`flex-1 bg-white pt-10 px-2`}
      contentContainerStyle={tw`pb-20 px-4`}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={tw`flex-row justify-between items-center mb-6`}>
        <Text style={tw`text-lg font-bold text-green-800`}>
          Vehicle Inspection
        </Text>
        <TouchableOpacity>
          <FontAwesome5 name="user-circle" size={24} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <View
        style={tw`bg-white rounded-xl p-4 shadow border border-gray-200 mb-6`}
      >
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
          placeholder="Make"
          value={make}
          onChangeText={setMake}
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
          placeholder="Model"
          value={model}
          onChangeText={setModel}
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2`}
          placeholder="Owner Name"
          value={owner}
          onChangeText={setOwner}
        />
      </View>

      {/* Select Body Part */}
      <View
        style={tw`bg-white rounded-xl p-4 shadow border border-gray-200 mb-6`}
      >
        <Text style={tw`text-green-800 font-semibold mb-3`}>
          Select Body Part
        </Text>
        {parts.map((part, index) => (
          <TouchableOpacity
            key={index}
            style={tw`flex-row items-center mb-3`}
            onPress={() => setSelectedPart(part)}
          >
            <View
              style={[
                tw`w-5 h-5 rounded-full border-2 mr-3`,
                {
                  borderColor: selectedPart === part ? "#fbbf24" : "#d1d5db",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              {selectedPart === part && (
                <View style={tw`w-2.5 h-2.5 bg-yellow-400 rounded-full`} />
              )}
            </View>
            <Text
              style={[
                tw`text-base`,
                { fontWeight: selectedPart === part ? "bold" : "normal" },
              ]}
            >
              {part}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upload / Capture Image */}
      <View style={tw`bg-white rounded-xl p-4 shadow border border-gray-200`}>
        {/* Show selected image */}
        {carImage ? (
          <Image
            source={{ uri: carImage }}
            style={tw`w-full h-48 rounded-xl mb-4`}
            resizeMode="cover"
          />
        ) : (
          <Text style={tw`text-gray-500 mb-4 text-center`}>
            No Image Selected
          </Text>
        )}

        {/* Two Box Options */}
        <View
          style={tw`flex-row border border-gray-400 rounded-xl overflow-hidden`}
        >
          <TouchableOpacity
            style={tw`flex-1 items-center justify-center p-6 border-r border-gray-300`}
            onPress={handleImagePick}
          >
            <FontAwesome5 name="cloud-upload-alt" size={24} color="#6b7280" />
            <Text style={tw`text-gray-600 mt-2`}>Upload Image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-1 items-center justify-center p-4`}
            onPress={handleImageCapture}
          >
            <FontAwesome5 name="camera" size={24} color="#6b7280" />
            <Text style={tw`text-gray-600 mt-2`}>Capture Image</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Start Inspection Button */}
      <TouchableOpacity
        style={tw`bg-green-700 p-3 rounded-lg mt-6`}
        onPress={() =>
          navigation.navigate("InspectionDetails", {
            make,
            model,
            city,
            owner,
            selectedPart,
            carImage,
          })
        }
      >
        <Text style={tw`text-white text-center font-bold text-md`}>
          Start Inspection
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}