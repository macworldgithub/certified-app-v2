import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { StyleSheet } from "react-native";

export default function Onboarding({ navigation }) {
  return (
    <ImageBackground
      source={require("../../assets/OnBoard.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      {/* Dark overlay */}
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.4)",
          ...StyleSheet.absoluteFillObject,
        }}
      />

      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: (StatusBar.currentHeight || 20) + 10,
          paddingHorizontal: 24,
          justifyContent: "flex-end",
        }}
      >
        {/* Bottom content */}
        <View style={{ marginBottom: 48, paddingLeft: 10, paddingRight: 10 }}>
          {/* Title */}
          <Text
            style={{
              color: "#fff",
              fontSize: 28,
              fontWeight: "bold",
              lineHeight: 38,
            }}
          >
            Inspect Your Car{"\n"}With AI
          </Text>

          {/* Subtitle */}
          <Text
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 14,
              marginTop: 8,
            }}
          >
            The best event we have prepared for you
          </Text>

          {/* Progress bar */}
          <View style={{ flexDirection: "row", marginTop: 24 }}>
            <View
              style={{
                height: 4,
                width: 32,
                backgroundColor: "#fff",
                borderRadius: 999,
                marginRight: 8,
              }}
            />
            <View
              style={{
                height: 4,
                width: 8,
                backgroundColor: "rgba(255,255,255,0.5)",
                borderRadius: 999,
                marginRight: 8,
              }}
            />
            <View
              style={{
                height: 4,
                width: 8,
                backgroundColor: "rgba(255,255,255,0.5)",
                borderRadius: 999,
              }}
            />
          </View>

          {/* Next button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#0A6B4E",
              marginTop: 24,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
            }}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [
                  { name: "Signin" },
                ],
              });
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
              Next
            </Text>
          </TouchableOpacity>

          {/* Sign In text */}
          <Text
            style={{
              color: "white",
              textAlign: "center",
              marginTop: 16,
            }}
          >
            Already have an account?{" "}
            <Text
              style={{ color: "white", fontWeight: "600" }}
              onPress={() => navigation.navigate("Signin")}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({});
