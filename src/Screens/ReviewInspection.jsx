import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useSelector } from "react-redux";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import { useDispatch } from "react-redux";

import { resetInspection } from "../redux/slices/inspectionSlice";

export default function ReviewInspection({ navigation }) {
  const dispatch = useDispatch();
  const inspection = useSelector((state) => state.inspection);
  const { images } = inspection;

  const {
    vin,
    make,
    model,
    year,
    mileAge,
    registrationPlate,
    registrationExpiry,
    buildDate,
    complianceDate,
    odometer,
    fuelType,
    driveTrain,
    transmission,
    bodyType,
    color,
    frontWheelDiameter,
    rearWheelDiameter,
    keysPresent,
    serviceBookPresent,
    serviceHistoryPresent,
    tyreConditionFrontLeft,
    tyreConditionFrontRight,
    tyreConditionRearRight,
    tyreConditionRearLeft,
    damagePresent,
    damages,
    roadTest,
    roadTestComments,
    generalComments,
  } = inspection;

  const handleSubmit = async () => {
    try {
      console.log(
        "Final Submission Payload:",
        JSON.stringify(inspection, null, 2),
      );
      dispatch(resetInspection());
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs", params: { screen: "InspectionList" } }],
      });
      Alert.alert("Success", "Inspection submitted!");
      // navigation.navigate("InspectionList");
    } catch (err) {
      Alert.alert("Error", "Failed to submit inspection");
    }
  };

  const renderSection = (title, children) => (
    <View style={tw`mb-6 bg-white border border-gray-200 rounded-xl p-4`}>
      <Text style={tw`text-gray-500 text-sm font-medium mb-3 uppercase`}>
        {title}
      </Text>
      {children}
    </View>
  );

  const renderField = (label, value) => (
    <View style={tw`py-2.5 border-b border-gray-100`}>
      <Text style={tw`text-gray-500 text-sm mb-1`}>{label}</Text>
      <Text style={tw`text-gray-800 font-medium text-base`}>
        {value || "Not provided"}
      </Text>
    </View>
  );

  const IMAGE_FIELDS = [
    { key: "frontImage", label: "Front Image" },
    { key: "LHFImage", label: "LHF Image" },
    { key: "leftSideImage", label: "Left Side Image" },
    { key: "LHRImage", label: "LHR Image" },
    { key: "rearImage", label: "Rear Image" },
    { key: "RHRImage", label: "RHR Image" },
    { key: "RightSideImage", label: "Right Side Image" },
    { key: "RHFImage", label: "RHF Image" },
    { key: "RoofImage", label: "Roof Image" },
    { key: "UnderbonnetImage", label: "Under Bonnet Image" },
    { key: "InsideBonnetImage", label: "Inside Bonnet Image" },
    { key: "DriversSeatImage", label: "Driver Seat Image" },
    { key: "FrontPassengerSeatImage", label: "Front Passenger Seat Image" },
    { key: "RearSeatImage", label: "Rear Seat Image" },
    { key: "compliancePlateImage", label: "Compliance Plate" },
    { key: "OdoImage", label: "Odometer Image" },
  ];

  const uploadedCount = IMAGE_FIELDS.filter(
    (img) => images?.[img.key]?.original || images?.[img.key],
  ).length;

  const renderImageCard = (label, imageObj) => {
    const uri =
      typeof imageObj === "string"
        ? imageObj
        : imageObj?.analyzedUrl || imageObj?.original || null;

    return (
      <View
        style={tw`w-full mb-4 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden`}
      >
        <View
          style={tw`px-3 py-2 bg-white border-b border-gray-200 flex-row justify-between items-center`}
        >
          <Text style={tw`text-gray-800 font-semibold text-sm`}>{label}</Text>

          <View
            style={tw.style(
              "px-2 py-1 rounded-full",
              uri ? "bg-green-100" : "bg-red-100",
            )}
          >
            <Text
              style={tw.style(
                "text-xs font-semibold",
                uri ? "text-green-700" : "text-red-700",
              )}
            >
              {uri ? "Uploaded" : "Missing"}
            </Text>
          </View>
        </View>

        {uri ? (
          <Image source={{ uri }} style={tw`w-full h-44`} resizeMode="cover" />
        ) : (
          <View style={tw`w-full h-44 bg-gray-100 items-center justify-center`}>
            <Text style={tw`text-gray-400 font-medium`}>No Image Uploaded</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaWrapper>
      <SafeAreaView style={tw`flex-1 bg-gray-50`}>
        {/* Header */}
        <View
          style={tw`flex-row items-center px-4 pt-4 pb-3 bg-white border-b border-gray-200`}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
            <AppIcon name="arrow-left" size={24} color="#065f46" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-green-800 ml-2`}>
            Review Inspection
          </Text>
        </View>

        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`pb-36 px-4`}
          showsVerticalScrollIndicator={false}
        >
          {/* VEHICLE INFO */}
          {renderSection(
            "Vehicle Information",
            <>
              {renderField("VIN", vin)}
              {renderField("Make", make)}
              {renderField("Model", model)}
              {renderField("Year", year)}
              {renderField("Mileage", mileAge)}
              {renderField("Registration Plate", registrationPlate)}
              {renderField("Registration Expiry", registrationExpiry)}
              {renderField("Build Date", buildDate)}
              {renderField("Compliance Date", complianceDate)}
            </>,
          )}

          {/* BASIC DETAILS */}
          {renderSection(
            "Basic Details",
            <>
              {renderField("Odometer Reading", odometer)}
              {renderField("Fuel Type", fuelType)}
              {renderField("Drive Train", driveTrain)}
              {renderField("Transmission", transmission)}
              {renderField("Body Type", bodyType)}
              {renderField("Color", color)}
            </>,
          )}

          {/* WHEELS & KEYS */}
          {renderSection(
            "Wheels & Keys",
            <>
              {renderField("Front Wheel Diameter", frontWheelDiameter || "N/A")}
              {renderField("Rear Wheel Diameter", rearWheelDiameter || "N/A")}
              {renderField("Keys Present", keysPresent)}
            </>,
          )}

          {/* TYRE CONDITION */}
          {renderSection(
            "Tyre Condition",
            <>
              {renderField("Front Left", tyreConditionFrontLeft)}
              {renderField("Front Right", tyreConditionFrontRight)}
              {renderField("Rear Right", tyreConditionRearRight)}
              {renderField("Rear Left", tyreConditionRearLeft)}
            </>,
          )}

          {/* SERVICE DOCUMENTS */}
          {renderSection(
            "Service Documents",
            <>
              {renderField("Service Book Present", serviceBookPresent)}
              {renderField("Service History Present", serviceHistoryPresent)}
            </>,
          )}

          {/* DAMAGE & ROAD TEST */}
          {renderSection(
            "Damage & Road Test",
            <>
              {renderField("Damage Present", damagePresent)}
              {damagePresent === "Yes" && damages?.length > 0 && (
                <View style={tw`mt-2`}>
                  <Text style={tw`text-gray-600 font-medium`}>Damages:</Text>
                  {damages.map((d, i) => (
                    <Text key={i} style={tw`text-gray-800 mt-1`}>
                      • {d.damageDescription} ({d.damageSeverity})
                    </Text>
                  ))}
                </View>
              )}
              {renderField("Road Test", roadTest)}
              {roadTest === "Yes" &&
                renderField("Road Test Comments", roadTestComments)}
            </>,
          )}

          {/* GENERAL COMMENTS */}
          {renderSection("General Comments", renderField("", generalComments))}

          {/* IMAGES REVIEW */}
          {renderSection(
            "Images",
            <>
              <View style={tw`mb-3`}>
                <Text style={tw`text-gray-700 font-semibold`}>
                  Uploaded Images: {uploadedCount} / {IMAGE_FIELDS.length}
                </Text>
              </View>
              
              {IMAGE_FIELDS.map((img) =>
                renderImageCard(img.label, images?.[img.key]),
              )}
            </>,
          )}
        </ScrollView>

        {/* SUBMIT BUTTON */}
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
