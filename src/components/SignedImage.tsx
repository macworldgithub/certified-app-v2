import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import tw from "tailwind-react-native-classnames";

import { signUrl } from "../../utils/inspectionFunctions";

const SignedImage = ({ s3Key, onPress, style }) => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (s3Key) {
      (async () => {
        try {
          const signed = await signUrl(s3Key);
          if (isMounted) setUrl(signed);
        } catch (err) {
          console.error("❌ Failed to fetch signed URL:", err);
        }
      })();
    }

    return () => {
      isMounted = false;
    };
  }, [s3Key]);

  if (!url) {
    return (
      <View
        style={[
          tw`w-full h-32 rounded-lg mt-2 justify-center items-center bg-gray-100`,
          style,
        ]}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={() => onPress?.(url)}>
      <Image
        source={{ uri: url }}
        style={[tw`w-full h-32 rounded-lg mt-2`, style]}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

export default SignedImage;
