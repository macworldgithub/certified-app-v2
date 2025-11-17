import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { setInspectionData } from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";

export default function InspectionWizardStepFive({ navigation }) {
  const dispatch = useDispatch();
  const {
    tyreConditionFrontLeft,
    tyreConditionFrontRight,
    tyreConditionRearRight,
    tyreConditionRearLeft,
  } = useSelector((state) => state.inspection);

  const handleSelect = (field, value) => {
    dispatch(setInspectionData({ field, value }));
  };

  const handleNext = () => {
    navigation.navigate("InspectionWizardStepFour");
  };

  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
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
          <ScrollView style={tw`px-6`} contentContainerStyle={tw`pb-32`}>
            {/* Tyre Condition - Front Left */}
            <View style={tw`mt-4`}>
              <Text style={tw`text-gray-500 mb-1`}>
                Tyre Condition - Front Left
              </Text>
              <View style={tw`flex-row items-center justify-between`}>
                {["Pass", "Fail"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={tw.style(
                      "w-16 w-24 items-center justify-center border rounded-lg py-4 mx-2",
                      tyreConditionFrontLeft === option
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 bg-white"
                    )}
                    onPress={() =>
                      handleSelect("tyreConditionFrontLeft", option)
                    }
                  >
                    <Text style={tw`text-gray-700 text-sm`}>{option}</Text>
                  </TouchableOpacity>
                ))}
                <Image
                  source={require("../../assets/tyreFrontLeft.png")}
                  style={tw`w-16 h-16`}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Tyre Condition - Front Right */}
            <View style={tw`mt-4`}>
              <Text style={tw`text-gray-500 mb-1`}>
                Tyre Condition - Front Right
              </Text>
              <View style={tw`flex-row items-center justify-between`}>
                {["Pass", "Fail"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={tw.style(
                      "w-16 w-24 items-center justify-center border rounded-lg py-4 mx-2",
                      tyreConditionFrontRight === option
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 bg-white"
                    )}
                    onPress={() =>
                      handleSelect("tyreConditionFrontRight", option)
                    }
                  >
                    <Text style={tw`text-gray-700 text-sm`}>{option}</Text>
                  </TouchableOpacity>
                ))}
                <Image
                  source={require("../../assets/tyreFrontRight.png")}
                  style={tw`w-16 h-16`}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Tyre Condition - Rear Right */}
            <View style={tw`mt-4`}>
              <Text style={tw`text-gray-500 mb-1`}>
                Tyre Condition - Rear Right
              </Text>
              <View style={tw`flex-row items-center justify-between`}>
                {["Pass", "Fail"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={tw.style(
                      "w-16 w-24 items-center justify-center border rounded-lg py-4 mx-2",
                      tyreConditionRearRight === option
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 bg-white"
                    )}
                    onPress={() =>
                      handleSelect("tyreConditionRearRight", option)
                    }
                  >
                    <Text style={tw`text-gray-700 text-sm`}>{option}</Text>
                  </TouchableOpacity>
                ))}
                <Image
                  source={require("../../assets/tyreRearRight.png")}
                  style={tw`w-16 h-16`}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Tyre Condition - Rear Left */}
            <View style={tw`mt-4`}>
              <Text style={tw`text-gray-500 mb-1`}>
                Tyre Condition - Rear Left
              </Text>
              <View style={tw`flex-row items-center justify-between`}>
                {["Pass", "Fail"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={tw.style(
                      "w-16 w-24 items-center justify-center border rounded-lg py-4 mx-2",
                      tyreConditionRearLeft === option
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 bg-white"
                    )}
                    onPress={() =>
                      handleSelect("tyreConditionRearLeft", option)
                    }
                  >
                    <Text style={tw`text-gray-700 text-sm`}>{option}</Text>
                  </TouchableOpacity>
                ))}
                <Image
                  source={require("../../assets/tyreRearLeft.png")}
                  style={tw`w-16 h-16`}
                  resizeMode="contain"
                />
              </View>
            </View>
          </ScrollView>

          {/* Next Button */}
          <View
            style={tw`absolute bottom-0 left-0 right-0 px-4 pb-4 bg-white mb-8`}
          >
            <TouchableOpacity
              style={tw`bg-green-700 py-2 rounded-xl`}
              onPress={handleNext}
            >
              <Text style={tw`text-white text-center text-lg font-semibold`}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
}
