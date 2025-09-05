import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import tw from "tailwind-react-native-classnames";

export default function InspectionDetails({ route, navigation }) {
  const { make: initialMake, model: initialModel, city, owner, selectedPart, carImage } = route.params;

  const [vin, setVin] = useState("");
  const [make, setMake] = useState(initialMake || "");
  const [model, setModel] = useState(initialModel || "");
  const [year, setYear] = useState("");

  return (
    <ScrollView
      style={tw`flex-1 bg-white pt-10 px-2`}
      contentContainerStyle={tw`pb-20 px-4`}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={tw`flex-row justify-between items-center mb-6`}>
        <Text style={tw`text-lg font-bold text-green-800`}>
          Inspection Details
        </Text>
      </View>

      {/* Input Fields */}
      <View
        style={tw`bg-white rounded-xl p-4 shadow border border-gray-200 mb-6`}
      >
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
          placeholder="VIN Number"
          value={vin}
          onChangeText={setVin}
        />
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
          style={tw`border border-gray-300 rounded-lg px-3 py-2`}
          placeholder="Year"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={tw`bg-green-700 p-3 rounded-lg mt-6`}
        onPress={() =>
          navigation.navigate("Engineverify", {
            vin,
            make,
            model,
            year,
            city,
            owner,
            selectedPart,
            carImage,
          })
        }
      >
        <Text style={tw`text-white text-center font-bold`}>
          Next
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}