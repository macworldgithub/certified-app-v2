import React, { useState } from "react";
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

export default function ResetPassword({ route, navigation }) {
  const { email } = route.params; // ✅ email passed from VerifyResetOTP
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/auth/reset-password`,
        {
          email,
          newPassword,
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Password reset successfully!");
        navigation.navigate("Signin"); // ✅ go back to signin
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", "Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={tw`flex-1 bg-white`}
    >   
      {/* Content */}
      <View style={tw`flex-1 justify-start px-6 mt-20`}>
        <Text style={tw`text-xl font-bold mb-2`}>Create New Password</Text>
        <Text style={tw`text-gray-600 mb-6`}>
          Enter and confirm your new password for {email}
        </Text>

        {/* New Password Input */}
        <TextInput
          style={tw`border-2 border-gray-300 rounded-lg p-3 mb-4 text-base`}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        {/* Confirm Password Input */}
        <TextInput
          style={tw`border-2 border-gray-300 rounded-lg p-3 mb-6 text-base`}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Reset Button */}
        <TouchableOpacity
          onPress={handleResetPassword}
          disabled={loading}
          style={tw`bg-green-600 w-full py-3 rounded-xl`}
        >
          <Text style={tw`text-white text-center font-semibold text-base`}>
            {loading ? "Resetting..." : "Reset Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
