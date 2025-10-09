import React from "react";
import { Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function AppIcon({ name, size = 24, color = "#000" }) {
  // const iconName =
  //   Platform.OS === "android" ? name : `${name}-outline`;
    const iconName = Platform.OS === "android" ? name : name;


  return <FontAwesome name={iconName} size={size} color={color} />;
}
