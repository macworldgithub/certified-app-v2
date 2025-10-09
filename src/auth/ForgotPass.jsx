import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons"; 
import API_BASE_URL from "../../utils/config";
import AppIcon from "../components/AppIcon";
export default function ForgotPass({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/auth/send-reset-password-otp`,
        { email }
      );

      if (response.status === 201) {
        Alert.alert("Success", "OTP sent to your email!");
        // ✅ navigate to OTP verification screen, pass email
        navigation.navigate("VerifyResetOTP", { email });
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-white p-6`}>
      <View style={tw`flex-row items-center mb-6`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <AppIcon name="arrow-left" size={24} color="#020807ff" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold text-gray-800 ml-6`}>
          Forgot Password
        </Text>
      </View>

      <Text style={tw`text-gray-800 mb-2`}>Enter your email address:</Text>
      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        onPress={handleSendOTP}
        disabled={loading}
        style={tw`bg-green-600 py-3 rounded-xl mb-6`}
      >
        <Text style={tw`text-white text-center font-semibold`}>
          {loading ? "Sending..." : "Send OTP"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
