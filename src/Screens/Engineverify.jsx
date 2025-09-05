import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import tw from "tailwind-react-native-classnames";

export default function Engineverify({ route, navigation }) {
  const { vin, make, model, year, city, owner, selectedPart, images } = route.params;

  const [engineNo, setEngineNo] = useState("");
  const [mileage, setMileage] = useState("");

  return (
    <ScrollView
      style={tw`flex-1 bg-white pt-10 px-2`}
      contentContainerStyle={tw`pb-20 px-4`}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={tw`flex-row justify-between items-center mb-6`}>
        <Text style={tw`text-lg font-bold text-green-800`}>
          Vehicle Details
        </Text>
      </View>

      {/* Input Fields */}
      <View
        style={tw`bg-white rounded-xl p-4 shadow border border-gray-200 mb-6`}
      >
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
          placeholder="Engine Number"
          value={engineNo}
          onChangeText={setEngineNo}
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
          placeholder="Mileage (km)"
          value={mileage}
          onChangeText={setMileage}
          keyboardType="numeric"
        />
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={tw`bg-green-700 p-3 rounded-lg mt-6`}
        onPress={() =>
          navigation.navigate("FrontImage", {
            vin,
            make,
            model,
            year,
            city,
            owner,
            selectedPart,
            engineNo,
            mileage,
            images,
          })
        }
      >
        <Text style={tw`text-white text-center font-bold text-md`}>
          Next
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}