import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import axios from "axios";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import { setAnalysisData } from "../redux/slices/inspectionSlice";
import API_BASE_URL from "../../utils/config";

export default function AnalyzeScreen() {
  const dispatch = useDispatch();

  // VIN aur baaki data redux se uthao
  const vinNumber = useSelector((state) => state.inspection.vin);
  const analysis = useSelector((state) => state.inspection.analysis);

  const handleAnalyze = async () => {
    try {
      const resp = await axios.post(
        `${API_BASE_URL}/${vinNumber}/analyze`,
        {} // empty body
      );

      dispatch(setAnalysisData(resp.data)); // response ko redux mein save
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
    <ScrollView style={tw`flex-1 p-6 bg-white`}>
      <Text style={tw`text-lg font-bold mb-2`}>Analyze Inspection</Text>

      <Text style={tw`text-sm mb-1`}>VIN Number</Text>
      <TextInput
        style={tw`border p-2 mb-4 rounded bg-gray-100`}
        value={vinNumber || ""}
        editable={false}
      />

      <TouchableOpacity
        onPress={handleAnalyze}
        style={tw`bg-green-600 p-3 rounded mb-4`}
      >
        <Text style={tw`text-white text-center`}>Analyze</Text>
      </TouchableOpacity>

      {analysis && (
        <View>
          <Text style={tw`text-lg font-semibold mb-2`}>
            Overall Rating: {analysis.overallRating}
          </Text>
          <Text style={tw`text-base mb-1`}>
            Car: {analysis.make} {analysis.carModel} ({analysis.year})
          </Text>
          <Text style={tw`text-base mb-1`}>
            Inspector: {analysis.inspectorEmail}
          </Text>

          <Text style={tw`text-base font-bold mt-3 mb-1`}>Damages (Front Image)</Text>
          {analysis.frontImage?.damages?.length > 0 ? (
            analysis.frontImage.damages.map((dmg, idx) => (
              <Text key={idx} style={tw`text-sm mb-1`}>
                • {dmg.type}: {dmg.description}
              </Text>
            ))
          ) : (
            <Text style={tw`text-sm text-gray-500`}>No damages found</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}
