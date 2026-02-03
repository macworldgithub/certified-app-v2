import React from "react";
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
    spareWheelCondition,
  } = useSelector((state) => state.inspection);

  const handleSelect = (field, value) => {
    dispatch(setInspectionData({ field, value }));
  };

  const handleNext = () => {
    navigation.navigate("InspectionWizardStepFour");
  };

  const handleBack = () => navigation.goBack();

  const renderTyreSection = (label, field, value, imageSource) => (
    <View style={tw`mb-2 bg-white border border-gray-300 rounded-xl p-2`}>
      <Text style={tw`text-gray-400 mb-3 font-medium`}>{label}</Text>
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-row flex-1`}>
          <TouchableOpacity
            style={tw.style(
              "flex-1 items-center justify-center border rounded-lg py-4 mr-2",
              value === "Pass"
                ? "border-green-600 bg-green-50"
                : "border-gray-300 bg-white",
            )}
            onPress={() => handleSelect(field, "Pass")}
          >
            <Text
              style={tw.style(
                "text-gray-700 font-medium",
                value === "Pass" && "text-green-700",
              )}
            >
              Pass
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw.style(
              "flex-1 items-center justify-center border rounded-lg py-4 ml-2",
              value === "Fail"
                ? "border-green-600 bg-green-50"
                : "border-gray-300 bg-white",
            )}
            onPress={() => handleSelect(field, "Fail")}
          >
            <Text
              style={tw.style(
                "text-gray-700 font-medium",
                value === "Fail" && "text-green-700",
              )}
            >
              Fail
            </Text>
          </TouchableOpacity>
        </View>

        <Image
          source={imageSource}
          style={tw`w-20 h-20 ml-4`}
          resizeMode="contain"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View style={tw`flex-1 bg-gray-100`}>
          {/* Header */}
          <View style={tw`flex-row items-center mb-4 px-4 pt-4`}>
            <TouchableOpacity onPress={handleBack} style={tw`mr-4`}>
              <AppIcon name="arrow-left" size={24} color="#065f46" />
            </TouchableOpacity>
            <Text style={tw`text-lg font-bold text-green-800 ml-16`}>
              Inspection Wizard
            </Text>
          </View>

          {/* Progress Bar (≈40-50% like screenshot) */}
          <View style={tw`w-full h-1 bg-gray-200 rounded-full mb-4`}>
            <View style={tw`w-4/6 h-1 bg-green-600 rounded-full`} />
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={tw`px-4`}
            contentContainerStyle={tw`pb-40`}
            showsVerticalScrollIndicator={false}
          >
            {renderTyreSection(
              "Tyre Condition - Front Left",
              "tyreConditionFrontLeft",
              tyreConditionFrontLeft,
              require("../../assets/tyreFrontLeft.png"),
            )}

            {renderTyreSection(
              "Tyre Condition - Front Right",
              "tyreConditionFrontRight",
              tyreConditionFrontRight,
              require("../../assets/tyreFrontRight.png"),
            )}

            {renderTyreSection(
              "Tyre Condition - Rear Right",
              "tyreConditionRearRight",
              tyreConditionRearRight,
              require("../../assets/tyreRearRight.png"),
            )}

            {renderTyreSection(
              "Tyre Condition - Rear Left",
              "tyreConditionRearLeft",
              tyreConditionRearLeft,
              require("../../assets/tyreRearLeft.png"),
            )}
            
            {renderTyreSection(
              "Spare Wheel (Optional)",
              "spareWheelCondition",
              spareWheelCondition,
              require("../../assets/tyreSpare.png"),
            )}
          </ScrollView>

          {/* Next Button - fixed bottom */}
          <View style={tw`absolute bottom-0 left-0 right-0 px-4 pb-6 bg-white`}>
            <TouchableOpacity
              style={tw`bg-green-700 py-3 rounded-xl shadow-md`}
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
