import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useSelector, useDispatch } from "react-redux";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";

export default function ReviewInspection({ navigation }) {
  const dispatch = useDispatch();
  const inspection = useSelector((state) => state.inspection);

  const {
    odometer,
    FuelType,
    DriveTrain,
    Transmission,
    bodyType,
    color,
    frontWheelDiameter,
    rearWheelDiameter,
    keysPresent,
    FrontLeft,
    FrontRight,
    RearRight,
    RearLeft,
    serviceBookPresent,
    ServiceHisoryPresent,
    damagePresent,
    roadTest,
    generalComments,
  } = inspection;

  const handleSubmit = async () => {
    try {
      console.log(
        "Final Inspection Data:",
        JSON.stringify(inspection, null, 2),
      );

      Alert.alert("Success", "Inspection submitted!");
      navigation.navigate("MainTabs");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.error("Submit error:", msg);
      Alert.alert("Error", msg || "Failed to submit inspection");
    }
  };

  const renderSection = (title, children) => (
    <View
      style={tw`mb-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm`}
    >
      <Text
        style={tw`text-gray-500 text-sm font-medium mb-3 uppercase tracking-wide`}
      >
        {title}
      </Text>
      {children}
    </View>
  );

  const renderField = (label, value) => (
    <View style={tw`py-2.5 border-b border-gray-100 last:border-b-0`}>
      <Text style={tw`text-gray-500 text-sm mb-1`}>{label}</Text>
      <Text style={tw`text-gray-800 font-medium text-base`}>
        {value || "Not provided"}
      </Text>
    </View>
  );

  return (
    <SafeAreaWrapper>
      <SafeAreaView style={tw`flex-1 bg-gray-50`}>
        {/* Header */}
        <View
          style={tw`flex-row items-center justify-between px-4 pt-4 pb-3 bg-white border-b border-gray-200`}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
            <AppIcon name="arrow-left" size={24} color="#065f46" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-green-800`}>
            Review Inspection
          </Text>
          <View style={tw`w-10`} />
        </View>

        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`pb-32 px-4`}
          showsVerticalScrollIndicator={false}
        >
          {/* Body Type */}
          {renderSection(
            "Body Type",
            renderField("Body Type", bodyType || "Coupe"),
          )}

          {/* Service / Wheel Diameter Section */}
          {renderSection(
            "SERVICE / WHEEL DIAMETER",
            <>
              {renderField("Color", color || "Red")}
              {renderField(
                "Front Wheel Diameter",
                frontWheelDiameter || "14 Inch",
              )}
              {renderField(
                "Rear Wheel Diameter",
                rearWheelDiameter || "14 Inch",
              )}
              {renderField(
                "Keys",
                keysPresent ? `${keysPresent} Keys` : "Not specified",
              )}
            </>,
          )}

          {/* Tyre Condition */}
          {renderSection(
            "TYRE CONDITION",
            <>
              {renderField("Front Left", FrontLeft)}
              {renderField("Front Right", FrontRight)}
              {renderField("Rear Right", RearRight)}
              {renderField("Rear Left", RearLeft)}
            </>,
          )}

          {/* Service Documents */}
          {renderSection(
            "SERVICE DOCUMENTS",
            <>
              {renderField("Service Book Present", serviceBookPresent)}
              {renderField("Service History Present", ServiceHisoryPresent)}
            </>,
          )}

          {/* Additional */}
          {renderSection(
            "ADDITIONAL",
            <>
              {renderField("Damage Present", damagePresent)}
              {renderField("Road Test", roadTest)}
              {renderField("General Comments", generalComments)}
            </>,
          )}
        </ScrollView>

        {/* Fixed Submit Button */}
        <View
          style={tw`absolute bottom-0 left-0 right-0 px-4 pb-6 bg-white pt-4 border-t border-gray-200`}
        >
          <TouchableOpacity
            onPress={handleSubmit}
            style={tw`bg-green-700 py-4 rounded-xl items-center shadow-lg`}
          >
            <Text style={tw`text-white text-lg font-semibold`}>
              Submit For Approval
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaWrapper>
  );
}
