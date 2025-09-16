import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import { setInspectionDetails } from "../redux/slices/inspectionSlice";

export default function InspectionDetails({ navigation }) {
  const dispatch = useDispatch();

  const {
    vin: savedVin,
    make: savedMake,
    carModel: savedModel,
    year: savedYear,
  } = useSelector((state) => state.inspection);

  const [vin, setVin] = useState(savedVin || "");
  const [make, setMake] = useState(savedMake || "");
  const [carModel, setModel] = useState(savedModel || "");
  const [year, setYear] = useState(savedYear || "");

  const handleNext = () => {
    dispatch(setInspectionDetails({ vin, make, carModel, year }));
    navigation.navigate("Engineverify");
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
          value={carModel}
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
        onPress={handleNext}
      >
        <Text style={tw`text-white text-center font-bold`}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
