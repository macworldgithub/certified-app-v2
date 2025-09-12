import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Device from "expo-device";
import API_BASE_URL from "../../utils/config";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const navigation = useNavigation();
  const route = useRoute();

  const { email, nextStep } = route.params || {};

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      Alert.alert("Error", "Please enter all 6 digits");
      return;
    }

    try {
      setLoading(true);

      const deviceId =
        Device.osInternalBuildId?.toString() ||
        Device.modelId?.toString() ||
        Device.deviceName ||
        "unknown-device-id";

      let url = `${API_BASE_URL}/auth/verify-signup`;
      let payload = { email, otp: enteredOtp };

      if (nextStep === "/auth/verify-otp") {
        url = `${API_BASE_URL}/auth/verify-otp`;
        payload = { email, otp: enteredOtp, deviceId };
      }

      console.log("📦 OTP Payload:", payload);
      console.log("🌍 OTP URL:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("✅ OTP Response:", data);

      if (
        response.ok &&
        (data.status === "EMAIL_VERIFIED" || data.status === "OTP_VERIFIED")
      ) {
        Alert.alert("Success", data.message || "OTP Verified successfully!");
        navigation.replace("MainTabs");
      } else {
        Alert.alert("Error", data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("❌ OTP Verification error:", error);
      Alert.alert("Error", "Unable to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={tw`flex-1 bg-white`}
    >
      {/* Back Button */}
      <TouchableOpacity
        style={tw`absolute top-10 left-4 z-10`}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      {/* OTP UI */}
      <View style={tw`flex-1 justify-start items-center mt-20 px-6`}>
        <Text style={tw`text-xl font-bold mb-2`}>OTP Verification</Text>
        <Text style={tw`text-center text-gray-600 mb-6`}>
          Enter the 6-digit code sent to {email || "your email"}
        </Text>

        <View style={tw`flex-row justify-between w-full px-2 mb-6 mr-8`}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              style={[
                tw`border-2 text-center text-xl rounded-lg w-12 h-12 mx-1`,
                digit ? tw`border-green-600` : tw`border-gray-300`,
              ]}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={(text) => handleChange(text, index)}
              value={digit}
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={tw`bg-green-600 w-full py-3 rounded-xl mb-4`}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={tw`text-white text-center font-semibold text-base`}>
            {loading ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OTPVerification;
