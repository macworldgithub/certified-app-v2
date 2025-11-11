// components/SafeAreaWrapper.tsx
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-react-native-classnames";

interface Props {
  children: React.ReactNode;
}

const SafeAreaWrapper: React.FC<Props> = ({ children }) => {
  return (
    <SafeAreaView style={tw`flex-1 bg-white`} edges={["top", "left", "right"]}>
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaWrapper;
