import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import { useDispatch } from "react-redux";
import { setAuthData } from "../redux/slices/authSlice";
import API_BASE_URL from "../../utils/config";

const Signin = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignin = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const deviceId =
        Device.osInternalBuildId?.toString() ||
        Device.modelId?.toString() ||
        Device.deviceName ||
        "unknown-device-id";

      const payload = { email: trimmedEmail, password, deviceId };

      console.log("📦 Payload for /auth/login:", payload);

      // const res = await axios.post(`${API_BASE_URL}:5000/auth/login`, payload);
      const res = await axios.post(`${API_BASE_URL}/auth/login`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Response:", res.data);

      const { status, message, nextStep, email: userEmail } = res.data;

      if (status === "EMAIL_NOT_VERIFIED") {
        // User ne signup kiya but email verify nahi hui
        Alert.alert("Email Not Verified", message);
        navigation.navigate("OTPVerification", {
          email: userEmail,
          nextStep, // /auth/verify-signup
          deviceId,
        });
        return;
      }

      if (status === "OTP_REQUIRED") {
        // Naya device, OTP chahiye
        Alert.alert("Device Verification", message);
        navigation.navigate("OTPVerification", {
          email: userEmail,
          nextStep, // /auth/verify-device
          deviceId,
        });
        return;
      }

      // if (status === "LOGIN_SUCCESS") {
      //   Alert.alert("Success", message);
      //   navigation.replace("MainTabs");
      //   return;
      // }

      if (status === "LOGIN_SUCCESS") {
        const { token, user } = res.data;

        try {
          // Redux update
          dispatch(setAuthData({ token, user }));

          // AsyncStorage update
          await AsyncStorage.setItem("authToken", token);
          await AsyncStorage.setItem("userData", JSON.stringify(user));

          console.log("✅ User data saved:", { token, user });
        } catch (storageErr) {
          console.error("❌ AsyncStorage Save Error:", storageErr);
        }

        Alert.alert("Success", message);
        navigation.replace("MainTabs");
        return;
      }

      Alert.alert("Login Failed", message || "Unknown error occurred.");
    } catch (err) {
      console.error("❌ Signin Error:", err.response?.data || err.message);
      const status = err.response?.status;
      const errorMsg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      if (status === 401) {
        Alert.alert("Invalid Credentials", errorMsg);
      } else {
        Alert.alert("Login Error", errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={tw`flex-grow justify-start px-6 pt-10`}
      >
        <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>
          Sign in to
        </Text>
        <Text style={tw`text-2xl font-bold text-gray-900 mb-4`}>
          your account
        </Text>

        <Text style={tw`text-sm text-gray-600 mb-6`}>
          Don’t have an account?{" "}
          <Text
            style={tw`text-green-500 font-semibold`}
            onPress={() => navigation.navigate("Signup")}
          >
            Sign Up
          </Text>
        </Text>

        {/* Email Input */}
        <View
          style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-1 mb-4 bg-gray-100`}
        >
          <FontAwesome name="envelope" size={16} color="#6B7280" />
          <TextInput
            style={tw`flex-1 ml-2 text-sm text-gray-900`}
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View
          style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-1 mb-4 bg-gray-100`}
        >
          <FontAwesome name="lock" size={16} color="#6B7280" />
          <TextInput
            style={tw`flex-1 ml-2 text-sm text-gray-900`}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={16}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        {/* Remember Me & Forgot Password */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={tw`flex-row items-center`}
          >
            <View
              style={tw`w-4 h-4 mr-2 border border-gray-400 rounded items-center justify-center`}
            >
              {rememberMe && (
                <FontAwesome name="check" size={10} color="#007941" />
              )}
            </View>
            <Text style={tw`text-sm text-gray-700`}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("ForgotPass")}>
            <Text
              style={tw`text-sm text-green-500 font-semibold`}
              onPress={() => navigation.navigate("ForgotPass")}
            >
              Forgot Password
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={tw`bg-green-600 py-3 rounded-xl mb-6`}
          onPress={handleSignin}
          disabled={loading}
        >
          <Text style={tw`text-white text-center font-semibold`}>
            {loading ? "Signing in..." : "Sign in"}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={tw`flex-row items-center mb-6`}>
          <View style={tw`flex-1 h-px bg-gray-300`} />
          <Text style={tw`px-2 text-sm text-gray-400`}>or sign in with</Text>
          <View style={tw`flex-1 h-px bg-gray-300`} />
        </View>

        {/* Social Buttons */}
        <View style={tw`mb-4`}>
          <TouchableOpacity
            style={tw`flex-row items-center justify-center border rounded-xl py-3 bg-white mb-3`}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/color/48/google-logo.png",
              }}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
            <Text style={tw`text-sm`}>Sign in with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-row items-center justify-center border rounded-xl py-3 bg-white mb-3`}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/color/48/facebook-new.png",
              }}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
            <Text style={tw`text-sm`}>Sign in with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-row items-center justify-center border rounded-xl py-3 bg-white`}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/ios-filled/50/mac-os.png",
              }}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
            <Text style={tw`text-sm`}>Sign in with Apple</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signin;
