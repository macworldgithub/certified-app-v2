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
// import { Ionicons } from "@expo/vector-icons"; // ✅ expo users
import Ionicons from 'react-native-vector-icons/Ionicons';

import SafeAreaWrapper from "../components/SafeAreaWrapper";

export default function Engineverify({ navigation }) {
  const dispatch = useDispatch();

  // Redux store se existing values lena (agar pehle se filled hain)
  const { engineNumber: savedEngineNo, mileAge: savedMileage } = useSelector(
    (state) => state.inspection
  );

  const [engineNumber, setEngineNo] = useState(savedEngineNo || "");
  const [mileAge, setMileage] = useState(savedMileage || "");

  const handleBack = () => {
  // Optionally clear or update redux if you want when going back
  // dispatch(clearEngineDetails()); 

  navigation.goBack();
};

  const handleNext = () => {
    // Redux store me save karna
    dispatch(
      setEngineDetails({ engineNumber: engineNumber, mileAge: Number(mileAge) })
    );
    // Next screen pe navigate
    navigation.navigate("FrontImage");
  };

  return (
   <SafeAreaWrapper>
     <ScrollView
      style={tw`flex-1 bg-white px-2`}
      contentContainerStyle={tw`pb-20 px-4`}
      showsVerticalScrollIndicator={false}
    >

          {/* Header */}
    <View style={tw`flex-row items-center mb-6`}>
      <TouchableOpacity onPress={handleBack} style={tw`mr-3`}>
        <Ionicons name="arrow-back" size={24} color="#065f46" /> 
        {/* green-800 color */}
      </TouchableOpacity>
      <Text style={tw`text-lg font-bold text-green-800`}>
        Inspect Details
      </Text>
    </View>
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
          placeholderTextColor="#9CA3AF"
          onChangeText={setEngineNo}
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
          placeholder="Mileage (km)"
          value={mileAge}
          placeholderTextColor="#9CA3AF"

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
   </SafeAreaWrapper>
  );
}
