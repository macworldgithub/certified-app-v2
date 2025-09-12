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
import axios from "axios";
import API_BASE_URL from "../../utils/config";

export default function VerifyResetOTP({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  // handle input change
  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // verify OTP
  const handleVerifyOTP = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      Alert.alert("Error", "Please enter all 6 digits");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/auth/verify-reset-password-otp`,
        { email, otp: enteredOtp }
      );

      if (response.status === 201) {
        Alert.alert("Success", "OTP verified successfully!");
        navigation.navigate("ResetPassword", { email });
      } else {
        Alert.alert("Error", "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("❌ VerifyResetOTP error:", error.response?.data || error.message);
      Alert.alert("Error", "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={tw`flex-1 bg-white`}
    >
      {/* OTP UI */}
      <View style={tw`flex-1 justify-start items-center mt-20 px-6`}>
        <Text style={tw`text-xl font-bold mb-2`}>Verify Reset OTP</Text>
        <Text style={tw`text-center text-gray-600 mb-6`}>
          Enter the 6-digit code sent to {email}
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
          onPress={handleVerifyOTP}
          disabled={loading}
        >
          <Text style={tw`text-white text-center font-semibold text-base`}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Text>
        </TouchableOpacity>      
      </View>
    </KeyboardAvoidingView>
  );
}
