import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { setInspectionData } from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";

const fuelOptions = ["Petrol", "Diesel", "Hybrid", "Electric", "other"];
const driveTrainOptions = ["FWD", "RWD", "AWD", "4WD"];
const transmissionOptions = ["Manual", "Automatic", "CVT"];
const bodyTypeOptions = ["Sedan", "SUV", "Hatchback", "Truck", "Van"];

export default function InspectionWizardStepTwo({ navigation }) {
  const dispatch = useDispatch();
  const { odometer, fuelType, driveTrain, transmission, bodyType } =
    useSelector((state) => state.inspection);

  const [showDropdown, setShowDropdown] = useState(null);

  const handleSelect = (field, value) => {
    dispatch(setInspectionData({ field, value }));
    setShowDropdown(null);
  };

  const handleNext = () => {
    navigation.navigate("InspectionWizardStepThree");
  };

  const handleBack = () => navigation.goBack();

  const renderDropdown = (field, options) => (
    <View>
      <TouchableOpacity
        style={tw`flex-row justify-between items-center border border-gray-300 rounded-lg p-3 mt-2`}
        onPress={() => setShowDropdown(showDropdown === field ? null : field)}
      >
        <Text style={tw`text-gray-600`}>
          {field === "fuelType" && (fuelType || "Select Fuel Type")}
          {field === "driveTrain" && (driveTrain || "Select Drive Train")}
          {field === "transmission" && (transmission || "Select Transmission")}
          {field === "bodyType" && (bodyType || "Select Body Type")}
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

        {/* Scroll Content */}
        <ScrollView style={tw`px-4`} contentContainerStyle={tw`pb-32`}>
          {/* Odometer */}
          <Text style={tw`text-gray-500 mb-1`}>Odometer (KMS)</Text>
          <TextInput
            placeholder="Enter Odometer Reading"
            keyboardType="numeric"
            value={odometer}
            onChangeText={(value) =>
              dispatch(setInspectionData({ field: "odometer", value }))
            }
            style={tw`border border-gray-300 rounded-lg p-3 bg-white`}
          />

          {/* Fuel Type */}
          <Text style={tw`text-gray-500 mt-4 mb-1`}>Fuel Type</Text>
          {renderDropdown("fuelType", fuelOptions)}

          {/* Drive Train */}
          <Text style={tw`text-gray-500 mt-4 mb-1`}>Drive Train</Text>
          {renderDropdown("driveTrain", driveTrainOptions)}

          {/* Transmission */}
          <Text style={tw`text-gray-500 mt-4 mb-1`}>Transmission</Text>
          {renderDropdown("transmission", transmissionOptions)}

          {/* Body Type */}
          <Text style={tw`text-gray-500 mt-4 mb-1`}>Body Type</Text>
          {renderDropdown("bodyType", bodyTypeOptions)}
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
    </SafeAreaWrapper>
  );
}
