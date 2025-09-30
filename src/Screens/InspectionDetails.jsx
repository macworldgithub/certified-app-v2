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
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import Ionicons from 'react-native-vector-icons/Ionicons';


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

     const handleBack = () => {
  // Optionally clear or update redux if you want when going back
  // dispatch(clearEngineDetails()); 

  navigation.goBack();
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
        Back
      </Text>
    </View>
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
          placeholderTextColor="#9CA3AF" // Tailwind's gray-400
          
            onChangeText={(text) => {
    if (text.length <= 17) setVin(text); // extra safeguard
  }}
  maxLength={17} // enforce VIN length
  autoCapitalize="characters" // VINs are uppercase
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
          placeholder="Make"
          value={make}
          placeholderTextColor="#9CA3AF" // Tailwind's gray-400
          onChangeText={setMake}
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
          placeholder="Model"
          value={carModel}
          placeholderTextColor="#9CA3AF" // Tailwind's gray-400
          onChangeText={setModel}
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2`}
          placeholder="Year"
          value={year}
          placeholderTextColor="#9CA3AF" // Tailwind's gray-400
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
    </SafeAreaWrapper>
  );
}
