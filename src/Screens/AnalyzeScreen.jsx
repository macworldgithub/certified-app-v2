import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import tw from "tailwind-react-native-classnames";

export default function AnalyzeScreen({ route }) {
  const { vin } = route.params; // Auto-filled VIN
  const [vinNumber, setVinNumber] = useState(vin || "");
  const [rating, setRating] = useState(null);

  const handleAnalyze = async () => {
    try {
      const resp = await axios.post(
        `http://192.168.100.95:5000/inspections/${vinNumber}/analyze`
      );
      setRating(resp.data.overallRating);
      Alert.alert("✅ Success", "Inspection analyzed successfully!");
    } catch (err) {
      if (err.response?.status === 404) {
        Alert.alert("❌ Error", "Inspection not found");
      } else {
        Alert.alert("❌ Error", "Failed to analyze inspection");
      }
    }
  };

  return (
    <View style={tw`flex-1 p-6 bg-white`}>
      <Text style={tw`text-lg font-bold mb-2`}>Analyze Inspection</Text>

      <Text style={tw`text-sm mb-1`}>VIN Number</Text>
      <TextInput
        style={tw`border p-2 mb-4 rounded bg-gray-100`}
        value={vinNumber}
        editable={false} // auto-filled, not editable
      />

      <TouchableOpacity
        onPress={handleAnalyze}
        style={tw`bg-blue-500 p-3 rounded mb-4`}
      >
        <Text style={tw`text-white text-center`}>Analyze</Text>
      </TouchableOpacity>

      {rating !== null && (
        <Text style={tw`text-lg font-semibold`}>
          Overall Rating: {rating}
        </Text>
      )}
    </View>
  );
}
