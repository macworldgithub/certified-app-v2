import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

export default function Signup() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Name, Email and Password are required!");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://192.168.0.105:5000/auth/signup", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && (data.status === "SIGNUP_SUCCESS" || data.status === "OTP_SENT")) {
        Alert.alert("Success", data.message);
        navigation.replace("OTPVerification", {
          email: data.user.email,
          userId: data.user.id,
          otpExpiresIn: data.otpExpiresIn,
        });
      } else {
        Alert.alert("Signup Failed", data.message || "Something went wrong.");
      }

    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Unable to connect to server.");
      console.error("Signup error:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-1 px-6 py-4 pt-12 bg-white`}>
      <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>Create new</Text>
      <Text style={tw`text-2xl font-bold text-gray-900 mb-4`}>account</Text>
      <Text style={tw`text-sm text-gray-500 mb-6`}>
        Already have an account?{" "}
        <Text
          style={tw`text-green-600 font-semibold`}
          onPress={() => navigation.navigate("Signin")}
        >
          Sign In
        </Text>
      </Text>

      {/* Name Input */}
      <View
        style={tw`flex-row items-center border-gray-300 border rounded-xl px-4 py-1 mb-2`}
      >
        <Icon name="person-outline" size={20} color="gray" />
        <TextInput
          placeholder="Enter your name"
          style={tw`ml-2 flex-1 text-sm text-gray-700`}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email Input */}
      <View
        style={tw`flex-row items-center border border-gray-300 rounded-xl px-4 py-1 mb-2`}
      >
        <Icon name="mail-outline" size={20} color="gray" />
        <TextInput
          placeholder="Enter your email"
          style={tw`ml-2 flex-1 text-sm text-gray-700`}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Password Input */}
      <View
        style={tw`flex-row items-center border border-gray-300 rounded-xl px-4 py-1 mb-2`}
      >
        <Icon name="lock-closed-outline" size={20} color="gray" />
        <TextInput
          placeholder="Enter your password"
          style={tw`ml-2 flex-1 text-sm text-gray-700`}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* Phone Input (optional) */}
      <View
        style={tw`flex-row items-center border border-gray-300 rounded-xl px-4 py-1 mb-2`}
      >
        <Icon name="call-outline" size={20} color="gray" />
        <TextInput
          placeholder="Enter your phone number"
          style={tw`ml-2 flex-1 text-sm text-gray-700`}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      {/* Remember Me */}
      <View style={tw`flex-row items-center mb-6`}>
        <TouchableOpacity
          onPress={() => setRememberMe(!rememberMe)}
          style={tw`mr-2`}
        >
          <Icon
            name={rememberMe ? "checkbox-outline" : "square-outline"}
            size={24}
            color={rememberMe ? "#007941" : "gray"}
          />
        </TouchableOpacity>
        <Text style={tw`text-sm text-gray-700`}>Remember me</Text>
      </View>

      {/* Signup Button */}
      <TouchableOpacity
        style={tw`bg-green-600 py-3 rounded-xl mb-6`}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={tw`text-white text-center font-semibold`}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Terms & Policy */}
      <Text style={tw`text-xs text-gray-400 text-center px-6 mb-6`}>
        By clicking “Sign Up” you agree to Recognote's{" "}
        <Text style={tw`text-blue-600`}>Term of Use</Text> and{" "}
        <Text style={tw`text-blue-600`}>Privacy Policy</Text>
      </Text>
    </ScrollView>
  );
}
