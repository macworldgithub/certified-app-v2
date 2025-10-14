import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { setInspectionData } from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";

const wheelOptions = ["13 Inch", "14 Inch", "15 Inch", "16 Inch"];

export default function InspectionWizardStepThree({ navigation }) {
  const dispatch = useDispatch();
  const { color, frontWheelDiameter, rearWheelDiameter, keysPresent } =
    useSelector((state) => state.inspection);

  const [showDropdown, setShowDropdown] = useState(null);

  const handleSelect = (field, value) => {
    dispatch(setInspectionData({ field, value }));
    setShowDropdown(null);
  };

  const handleNext = () => {
    navigation.navigate("InspectionWizardStepFour");
  };

  const handleBack = () => navigation.goBack();

  const renderDropdown = (field, label, options) => (
    <View style={tw`mt-4`}>
      <Text style={tw`text-gray-500 mb-1`}>{label}</Text>
      <TouchableOpacity
        style={tw`flex-row justify-between items-center border border-gray-300 rounded-lg p-3`}
        onPress={() => setShowDropdown(showDropdown === field ? null : field)}
      >
        <Text style={tw`text-gray-600`}>
          {field === "frontWheelDiameter" &&
            (frontWheelDiameter || "Select Front Wheel Diameter")}
          {field === "rearWheelDiameter" &&
            (rearWheelDiameter || "Select Rear Wheel Diameter")}
        </Text>
        <Ionicons
          name={showDropdown === field ? "chevron-up" : "chevron-down"}
          size={20}
          color="gray"
        />
      </TouchableOpacity>

      {showDropdown === field && (
        <View style={tw`bg-white border border-gray-300 rounded-lg mt-1`}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={tw`p-3 border-b border-gray-100`}
              onPress={() => handleSelect(field, option)}
            >
              <Text style={tw`text-gray-700`}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

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
          {/* Color */}
          <Text style={tw`text-gray-500 mb-1`}>Color</Text>
          <TextInput
            placeholder="Enter Color"
            value={color}
            onChangeText={(value) =>
              dispatch(setInspectionData({ field: "color", value }))
            }
            style={tw`border border-gray-300 rounded-lg p-3 bg-white`}
          />

          {/* Front Wheel Diameter */}
          {renderDropdown("frontWheelDiameter", "Front Wheel Diameter", wheelOptions)}

          {/* Rear Wheel Diameter */}
          {renderDropdown("rearWheelDiameter", "Rear Wheel Diameter", wheelOptions)}

          {/* Keys Present */}
          <View style={tw`mt-6`}>
            <Text style={tw`text-gray-500 mb-2`}>How Many Keys Present</Text>
            <View style={tw`flex-row justify-between`}>
              {[2, 1].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={tw.style(
                    "flex-1 items-center justify-center border rounded-xl py-4 mx-1",
                    keysPresent === `${num}`
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300 bg-white"
                  )}
                  onPress={() =>
                    dispatch(setInspectionData({ field: "keysPresent", value: `${num}` }))
                  }
                >
                  <Ionicons name="key-outline" size={28} color="#4b5563" />
                  <Text style={tw`text-gray-700 mt-1`}>
                    {num === 1 ? "1 Key" : "2 Keys"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={tw`bg-green-600 py-2 bg-green-800 rounded-xl mt-10 mb-6`}
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
