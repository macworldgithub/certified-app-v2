import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { setInspectionData } from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";

export default function InspectionWizardStepOne({ navigation }) {
  const dispatch = useDispatch();
  const { vinChassisNumber, year, make, model, registrationPlate, registrationExpiry, buildDate, complianceDate } = useSelector(
    (state) => state.inspection
  );

  const handleTextChange = (field, value) => {
    dispatch(setInspectionData({ field, value }));
  };

  const handleNext = () => {
    navigation.navigate("FrontImage");
  };

  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaWrapper>
      <View style={tw`flex-1 bg-white`}>
        {/* Header */}
        <View style={tw`flex-row items-center mb-6 px-4 pt-4`}>
          <TouchableOpacity onPress={handleBack} style={tw`mr-4`}>
            <AppIcon name="arrow-left" size={24} color="#065f46" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-green-800`}>
            Inspection Wizard
          </Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView style={tw`px-4`} contentContainerStyle={tw`pb-20`}>
          {/* VIN/Chassis Number */}
          <View style={tw`mt-6`}>
            <Text style={tw`text-gray-500 mb-2`}>VIN/Chassis Number</Text>
            <TextInput
              value={vinChassisNumber}
              onChangeText={(value) => handleTextChange("vinChassisNumber", value)}
              placeholder="Enter VIN/Chassis Number"
              style={tw`border border-gray-300 rounded-lg p-3 bg-white text-base`}
            />
          </View>

          {/* Year */}
          <View style={tw`mt-6`}>
            <Text style={tw`text-gray-500 mb-2`}>Year</Text>
            <TextInput
              value={year}
              onChangeText={(value) => handleTextChange("year", value)}
              placeholder="Enter Year"
              style={tw`border border-gray-300 rounded-lg p-3 bg-white text-base`}
              keyboardType="numeric"
            />
          </View>

          {/* Make */}
          <View style={tw`mt-6`}>
            <Text style={tw`text-gray-500 mb-2`}>Make</Text>
            <TextInput
              value={make}
              onChangeText={(value) => handleTextChange("make", value)}
              placeholder="Enter Make"
              style={tw`border border-gray-300 rounded-lg p-3 bg-white text-base`}
            />
          </View>

          {/* Model */}
          <View style={tw`mt-6`}>
            <Text style={tw`text-gray-500 mb-2`}>Model</Text>
            <TextInput
              value={model}
              onChangeText={(value) => handleTextChange("model", value)}
              placeholder="Enter Model"
              style={tw`border border-gray-300 rounded-lg p-3 bg-white text-base`}
            />
          </View>

          {/* Registration Plate and Registration Expiry (Same Row) */}
          <View style={tw`mt-6 flex-row justify-between`}>
            <View style={tw`flex-1 mr-2`}>
              <Text style={tw`text-gray-500 mb-2`}>Registration Plate</Text>
              <TextInput
                value={registrationPlate}
                onChangeText={(value) => handleTextChange("registrationPlate", value)}
                placeholder="Enter Registration Plate"
                style={tw`border border-gray-300 rounded-lg p-3 bg-white text-base`}
              />
            </View>
            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`text-gray-500 mb-2`}>Registration Expiry</Text>
              <TextInput
                value={registrationExpiry}
                onChangeText={(value) => handleTextChange("registrationExpiry", value)}
                placeholder="Enter Registration Expiry"
                style={tw`border border-gray-300 rounded-lg p-3 bg-white text-base`}
              />
            </View>
          </View>

          {/* Build Date and Compliance Date (Same Row) */}
          <View style={tw`mt-6 flex-row justify-between`}>
            <View style={tw`flex-1 mr-2`}>
              <Text style={tw`text-gray-500 mb-2`}>Build Date</Text>
              <TextInput
                value={buildDate}
                onChangeText={(value) => handleTextChange("buildDate", value)}
                placeholder="Enter Build Date"
                style={tw`border border-gray-300 rounded-lg p-3 bg-white text-base`}
              />
            </View>
            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`text-gray-500 mb-2`}>Compliance Date</Text>
              <TextInput
                value={complianceDate}
                onChangeText={(value) => handleTextChange("complianceDate", value)}
                placeholder="Enter Compliance Date"
                style={tw`border border-gray-300 rounded-lg p-3 bg-white text-base`}
              />
            </View>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={tw`bg-green-800 py-3 rounded-xl mt-10 mb-6`}
            onPress={handleNext}
          >
            <Text style={tw`text-white text-center text-lg font-semibold`}>
              Next
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
}