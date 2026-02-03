import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { setInspectionData } from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import { Image } from "react-native";

const wheelOptions = [
  "13 Inch",
  "14 Inch",
  "15 Inch",
  "16 Inch",
  "17 Inch",
  "18 Inch",
  "19 Inch",
  "20 Inch",
];

export default function InspectionWizardStepThree({ navigation }) {
  const dispatch = useDispatch();
  const { color, frontWheelDiameter, rearWheelDiameter, keysPresent } =
    useSelector((state) => state.inspection);

  const [showFrontDropdown, setShowFrontDropdown] = useState(false);
  const [showRearDropdown, setShowRearDropdown] = useState(false);

  const handleSelect = (field, value) => {
    dispatch(setInspectionData({ field, value }));
    if (field === "frontWheelDiameter") setShowFrontDropdown(false);
    if (field === "rearWheelDiameter") setShowRearDropdown(false);
  };

  const handleNext = () => {
    navigation.navigate("InspectionWizardStepFive");
  };

  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View style={tw`flex-1 bg-gray-100`}>
          {/* Header */}
          <View style={tw`flex-row items-center mb-6 px-4 pt-4`}>
            <TouchableOpacity onPress={handleBack} style={tw`mr-4`}>
              <AppIcon name="arrow-left" size={24} color="#065f46" />
            </TouchableOpacity>
            <Text style={tw`text-lg font-bold text-green-800 ml-16`}>
              Inspection Wizard
            </Text>
          </View>

          <ScrollView
            style={tw`px-4`}
            contentContainerStyle={tw`pb-40`}
            showsVerticalScrollIndicator={false}
          >
            {/* Progress Bar (matching screenshot style) */}
            <View style={tw`w-full h-1 bg-gray-200 rounded-full mb-4`}>
              <View style={tw`w-3/6 h-1 bg-green-600 rounded-full`} />
            </View>

            {/* Color Field */}
            <View
              style={tw`mb-4 bg-white border border-gray-300 rounded-xl p-4`}
            >
              <Text style={tw`text-gray-400 mb-2`}>Color</Text>
              <TextInput
                placeholder="Color"
                placeholderTextColor="#9CA3AF"
                value={color}
                onChangeText={(value) =>
                  dispatch(setInspectionData({ field: "color", value }))
                }
                style={tw`border border-gray-300 rounded-lg p-3 bg-white text-gray-800`}
              />
            </View>

            {/* Front Wheel Diameter */}
            <View
              style={tw`mb-4 bg-white border border-gray-300 rounded-xl p-4`}
            >
              <Text style={tw`text-gray-400 mb-2`}>Front Wheel Diameter</Text>
              <TouchableOpacity
                style={tw`flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-white`}
                onPress={() => setShowFrontDropdown(!showFrontDropdown)}
              >
                <Text style={tw`text-gray-700`}>
                  {frontWheelDiameter || "14 Inch"}
                </Text>
                <Ionicons
                  name={showFrontDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>

              {showFrontDropdown && (
                <View
                  style={tw`mt-1 border border-gray-300 rounded-lg bg-white`}
                >
                  {wheelOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={tw`p-3 border-b border-gray-200`}
                      onPress={() => handleSelect("frontWheelDiameter", option)}
                    >
                      <Text style={tw`text-gray-700`}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Rear Wheel Diameter */}
            <View
              style={tw`mb-4 bg-white border border-gray-300 rounded-xl p-4`}
            >
              <Text style={tw`text-gray-400 mb-2`}>Rear Wheel Diameter</Text>
              <TouchableOpacity
                style={tw`flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-white`}
                onPress={() => setShowRearDropdown(!showRearDropdown)}
              >
                <Text style={tw`text-gray-700`}>
                  {rearWheelDiameter || "14 Inch"}
                </Text>
                <Ionicons
                  name={showRearDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>

              {showRearDropdown && (
                <View
                  style={tw`mt-1 border border-gray-300 rounded-lg bg-white`}
                >
                  {wheelOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={tw`p-3 border-b border-gray-200`}
                      onPress={() => handleSelect("rearWheelDiameter", option)}
                    >
                      <Text style={tw`text-gray-700`}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Keys Present */}
            {/* <View
              style={tw`mb-6 bg-white border border-gray-300 rounded-xl p-4`}
            >
              <Text style={tw`text-gray-400 mb-3`}>How Many Keys Present</Text>
              <View style={tw`flex-row justify-between`}>
                {[1, 2].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={tw.style(
                      "flex-1 items-center justify-center border rounded-xl py-5 mx-1.5",
                      keysPresent === `${num}`
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 bg-white",
                    )}
                    onPress={() =>
                      dispatch(
                        setInspectionData({
                          field: "keysPresent",
                          value: `${num}`,
                        }),
                      )
                    }
                  >
                    <Ionicons
                      name="key-outline"
                      size={32}
                      color={keysPresent === `${num}` ? "#065f46" : "#4b5563"}
                    />
                    <Text
                      style={tw.style(
                        "mt-2 font-medium",
                        keysPresent === `${num}`
                          ? "text-green-700"
                          : "text-gray-700",
                      )}
                    >
                      {num} Key{num > 1 ? "s" : ""}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View> */}
            <View
              style={tw`mb-6 bg-white border border-gray-300 rounded-xl p-4`}
            >
              <Text style={tw`text-gray-400 mb-3`}>How Many Keys Present</Text>
              <View style={tw`flex-row justify-between`}>
                {[1, 2, 3].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={tw.style(
                      "flex-1 items-center justify-center border rounded-xl py-2 mx-2",
                      keysPresent === `${num}`
                        ? "border-green-400 bg-green-50"
                        : "border-gray-300 bg-white",
                    )}
                    onPress={() =>
                      dispatch(
                        setInspectionData({
                          field: "keysPresent",
                          value: `${num}`,
                        }),
                      )
                    }
                  >
                    <Image
                      source={
                        num === 1
                          ? require("../../assets/singleKey.png")
                          : num === 2
                            ? require("../../assets/doubleKey.png")
                            : require("../../assets/tripleKey.png")
                      }
                      style={tw`w-14 h-10 mb-3`}
                      resizeMode="contain"
                    />
                    <Text
                      style={tw.style(
                        "font-medium text-base",
                        keysPresent === `${num}`
                          ? "text-green-700"
                          : "text-gray-400",
                      )}
                    >
                      {num} Key{num > 1 ? "s" : ""}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Next Button - fixed at bottom */}
          <View style={tw`absolute bottom-0 left-0 right-0 px-4 pb-6 bg-white`}>
            <TouchableOpacity
              style={tw`bg-green-700 py-3 rounded-xl shadow-lg`}
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
