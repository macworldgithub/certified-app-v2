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
import { setEngineDetails } from "../redux/slices/inspectionSlice";

export default function Engineverify({ navigation }) {
  const dispatch = useDispatch();

  // Redux store se existing values lena (agar pehle se filled hain)
  const { engineNumber: savedEngineNo, mileAge: savedMileage } = useSelector(
    (state) => state.inspection
  );

  const [engineNumber, setEngineNo] = useState(savedEngineNo || "");
  const [mileAge, setMileage] = useState(savedMileage || "");

  const handleNext = () => {
    // Redux store me save karna
    dispatch(
      setEngineDetails({ engineNumber: engineNumber, mileAge: Number(mileAge) })
    );
    // Next screen pe navigate
    navigation.navigate("FrontImage");
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
          value={engineNumber}
          onChangeText={setEngineNo}
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
          placeholder="Mileage (km)"
          value={mileAge}
          onChangeText={setMileage}
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
