import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import { setInspectionData } from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";

export default function InspectionWizardStepFour({ navigation }) {
  const dispatch = useDispatch();
  const { serviceBookPresent, serviceHistoryPresent } = useSelector(
    (state) => state.inspection
  );

  const handleSelect = (field, value) => {
    dispatch(setInspectionData({ field, value }));
  };

  const handleNext = () => {
    navigation.navigate("InspectionWizardStepFive");
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
        <ScrollView style={tw`px-4`} contentContainerStyle={tw`pb-32`}>
          {/* Service Book Present */}
          <View style={tw`mt-4`}>
            <Text style={tw`text-gray-500 mb-2`}>Is A Servicebook Present</Text>
            <View style={tw`flex-row justify-between`}>
              {["Yes", "No"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={tw.style(
                    "flex-1 items-center justify-center border rounded-lg py-8 mx-1",
                    serviceBookPresent === option
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300 bg-white"
                  )}
                  onPress={() => handleSelect("serviceBookPresent", option)}
                >
                  <Text style={tw`text-gray-700`}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Service History Present */}
          <View style={tw`mt-6`}>
            <Text style={tw`text-gray-500 mb-2`}>Is A Service History Present</Text>
            <View style={tw`flex-row justify-between`}>
              {["Yes", "No"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={tw.style(
                    "flex-1 items-center justify-center border rounded-lg py-8 mx-1",
                    serviceHistoryPresent === option
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300 bg-white"
                  )}
                  onPress={() => handleSelect("serviceHistoryPresent", option)}
                >
                  <Text style={tw`text-gray-700`}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={tw`bg-green-800 py-2 rounded-xl mt-10 mb-6`}
            onPress={handleNext}
          >
            <Text style={tw`text-white text-center text-lg font-semibold `}>
              Next
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
}