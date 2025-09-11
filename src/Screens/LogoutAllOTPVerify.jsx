import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function LogoutAllOTPVerify() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleVerifyLogoutAll = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please sign in again.");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        "http://192.168.0.105:5000/user/logout-all/verify",
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.status === "LOGOUT_ALL_SUCCESS") {
        Alert.alert("Success", res.data.message);
        await AsyncStorage.clear();

        navigation.reset({
          index: 0,
          routes: [{ name: "Signin" }],
        });
      }
    } catch (err) {
      console.error("Logout All Verify Error:", err.response?.data || err.message);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to verify OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={tw`flex-1 justify-center items-center px-6`}>
        {/* Heading */}
        <Text style={tw`text-xl font-bold text-green-700 mb-2`}>
          Verify Logout All
        </Text>
        <Text style={tw`text-gray-600 text-center mb-6`}>
          Enter the OTP sent to your email to logout from all devices.
        </Text>

        {/* OTP Input Box */}
        <TextInput
          placeholder="Enter 6-digit OTP"
          keyboardType="numeric"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          style={tw`w-3/4 border border-gray-300 rounded-xl px-4 py-3 text-center text-lg tracking-widest mb-6`}
        />

        {/* Verify Button */}
        <TouchableOpacity
          style={tw`bg-green-600 w-3/4 py-3 rounded-xl shadow`}
          onPress={handleVerifyLogoutAll}
          disabled={loading}
        >
          <Text style={tw`text-white text-center text-base font-bold`}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
