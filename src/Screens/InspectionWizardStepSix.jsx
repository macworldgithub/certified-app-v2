

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Voice from "@react-native-voice/voice";
import {
  setInspectionData,
  resetInspection,
} from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import API_BASE_URL from "../../utils/config";

import greenmic from "../../assets/greenmic.png";
import redmic from "../../assets/redmic.png";

export default function InspectionWizardStepSix({ navigation }) {
  const dispatch = useDispatch();
  const inspectionData = useSelector((state) => state.inspection);
  const { damagePresent, roadTest, roadTestComments, generalComments } =
    inspectionData;

  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");

  // ✅ Voice Setup
  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (event) => {
    if (event.value && event.value.length > 0) {
      dispatch(
        setInspectionData({ field: "generalComments", value: event.value[0] })
      );
    }
  };

  const onSpeechError = (event) => {
    setError(event.error?.message || "Voice recognition error");
    setIsRecording(false);
  };

  // ✅ Request Microphone Permission (Android only)
  const requestMicrophonePermission = async () => {
    console.log("platform.os", Platform.OS);
    if (Platform.OS !== "android") return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          message:
            "This app needs access to your microphone so you can record voice comments.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      console.log(granted);
      console.log(PermissionsAndroid.RESULTS.GRANTED);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn("Permission error:", err);
      return false;
    }
  };

  const toggleRecording = async () => {
    try {
      if (isRecording) {
        await Voice.stop();
        setIsRecording(false);
      } else {
        const hasPermission = await requestMicrophonePermission();
        console.log("abc");
        if (!hasPermission) {
          Alert.alert(
            "Permission Denied",
            "Microphone permission is required to record voice."
          );
          return;
        }
        setError("");
        setIsRecording(true);
        console.log("Voice module:", Voice);

        await Voice.start("en-US");
        console.log("3");
      }
    } catch (err) {
      console.log("Voice error:", err);
      setError(JSON.stringify(err));
      setIsRecording(false);
    }
  };

  // ✅ Redux handlers
  const handleSelect = (field, value) => {
    dispatch(setInspectionData({ field, value }));
  };

  const handleTextChange = (field, value) => {
    dispatch(setInspectionData({ field, value }));
  };

  // ✅ API submission
  const handleSubmit = async () => {
    try {
      if (!inspectionData.vin || inspectionData.vin.length !== 17) {
        Alert.alert(
          "❌ Invalid VIN",
          "VIN must be exactly 17 characters long."
        );
        return;
      }

      if (!inspectionData.make || !inspectionData.model) {
        Alert.alert("❌ Missing Fields", "Please fill Make and Model.");
        return;
      }

      const finalPayload = {
        vin: inspectionData.vin,
        make: inspectionData.make,
        carModel: inspectionData.model, // backend expects "carModel" not "model"
        year: inspectionData.year || "string",
        engineNumber: inspectionData.engineNumber || "string",
        mileAge: Number(inspectionData.mileAge) || 0,
        registrationPlate: inspectionData.registrationPlate,
        registrationExpiry: inspectionData.registrationExpiry,
        buildDate: inspectionData.buildDate,
        complianceDate: inspectionData.complianceDate,
        overallRating: 0,
        inspectorEmail: "muhammadanasrashid18@gmail.com",
        frontImage: inspectionData.frontImage || {
          original: "s3://bucket/cars/front.jpg",
          analyzed: "s3://bucket/cars/front_annotated.jpg",
          damages: [],
        },
        rearImage: inspectionData.rearImage || {
          original: "s3://bucket/cars/rear.jpg",
          analyzed: "s3://bucket/cars/rear_annotated.jpg",
          damages: [],
        },
        leftImage: inspectionData.leftImage || {
          original: "s3://bucket/cars/left.jpg",
          analyzed: "s3://bucket/cars/left_annotated.jpg",
          damages: [],
        },
        rightImage: inspectionData.rightImage || {
          original: "s3://bucket/cars/right.jpg",
          analyzed: "s3://bucket/cars/right_annotated.jpg",
          damages: [],
        },
        odometer: inspectionData.odometer || "45200",
        fuelType: inspectionData.fuelType || "Petrol",
        driveTrain: inspectionData.driveTrain || "AWD",
        transmission: inspectionData.transmission || "Automatic",
        bodyType: inspectionData.bodyType || "Sedan",
        color: inspectionData.color || "Blue",
        frontWheelDiameter: inspectionData.frontWheelDiameter || 17,
        rearWheelDiameter: inspectionData.rearWheelDiameter || 17,
        keysPresent: inspectionData.keysPresent ?? true,
        serviceBookPresent: inspectionData.serviceBookPresent ?? true,
        serviceHistoryPresent: inspectionData.serviceHistoryPresent ?? true,
        tyreConditionFrontLeft: inspectionData.tyreConditionFrontLeft || "Good",
        tyreConditionFrontRight:
          inspectionData.tyreConditionFrontRight || "Good",
        tyreConditionRearRight: inspectionData.tyreConditionRearRight || "Fair",
        tyreConditionRearLeft: inspectionData.tyreConditionRearLeft || "Fair",
        damagePresent: inspectionData.damagePresent === "Yes" ? true : false,
        roadTest: inspectionData.roadTest === "Yes" ? true : false,
        roadTestComments: inspectionData.roadTestComments,
        generalComments: inspectionData.generalComments,
      };

      const cleanPayload = JSON.parse(JSON.stringify(finalPayload));

      if (inspectionData._id) {
        await axios.put(
          `${API_BASE_URL}/inspections/${inspectionData._id}`,
          cleanPayload,
          {
            headers: { "Content-Type": "application/json", accept: "*/*" },
          }
        );
      } else {
        await axios.post(`${API_BASE_URL}/inspections`, cleanPayload, {
          headers: { "Content-Type": "application/json", accept: "*/*" },
        });
      }

      dispatch(resetInspection());
      Alert.alert("✅ Success", "Inspection created successfully!");
      navigation.navigate("MainTabs");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        err.message;
      console.error("❌ Submit failed:", errorMsg);
      Alert.alert("❌ Error", errorMsg);
    }
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

        <ScrollView style={tw`px-6`} contentContainerStyle={tw`pb-20`}>
          {/* Damage */}
          <View style={tw`mt-4`}>
            <Text style={tw`text-gray-500 mb-1`}>
              Is There Any Damage Present
            </Text>
            <View style={tw`flex-row justify-between`}>
              {["Yes", "No"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={tw.style(
                    "flex-1 items-center justify-center border rounded-lg py-6 mx-1",
                    damagePresent === option
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300 bg-white"
                  )}
                  onPress={() => handleSelect("damagePresent", option)}
                >
                  <Text style={tw`text-gray-700`}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Road Test */}
          <View style={tw`mt-4`}>
            <Text style={tw`text-gray-500 mb-1`}>Road Test</Text>
            <View style={tw`flex-row justify-between`}>
              {["Yes", "No"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={tw.style(
                    "flex-1 items-center justify-center border rounded-lg py-6 mx-1",
                    roadTest === option
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300 bg-white"
                  )}
                  onPress={() => handleSelect("roadTest", option)}
                >
                  <Text style={tw`text-gray-700`}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Comments */}
          <View style={tw`mt-4`}>
            <Text style={tw`text-gray-500 mb-1`}>Road Test Comments</Text>
            <TextInput
              value={roadTestComments}
              onChangeText={(value) =>
                handleTextChange("roadTestComments", value)
              }
              placeholder="Enter comments"
              style={tw`border border-gray-300 rounded-lg p-3 bg-white h-20`}
              multiline
            />
          </View>

          {/* General Comments + Voice */}
          <View style={tw`mt-4`}>
            <Text style={tw`text-gray-500 mb-1`}>General Comments</Text>

            <TextInput
              value={generalComments}
              onChangeText={(value) =>
                handleTextChange("generalComments", value)
              }
              placeholder="Enter comments"
              style={tw`border border-gray-300 rounded-lg p-3 bg-white h-20`}
              multiline
            />

            {/* 🎤 Voice Button */}
            <View style={tw`flex-row justify-center mt-3`}>
              <TouchableOpacity
                onPress={toggleRecording}
                style={{
                  backgroundColor: isRecording ? "red" : "green",
                  padding: 14,
                  borderRadius: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={isRecording ? redmic : greenmic}
                  style={{ width: 30, height: 30, tintColor: "white" }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {error ? (
              <Text style={tw`text-red-500 text-xs mt-2 text-center`}>
                {error}
              </Text>
            ) : null}
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View
          style={tw`absolute bottom-0 left-0 right-0 px-4 pb-4 bg-white mb-8`}
        >
          <TouchableOpacity
            style={tw`bg-green-700 py-2 rounded-xl`}
            onPress={handleSubmit}
          >
            <Text style={tw`text-white text-center text-lg font-semibold`}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
