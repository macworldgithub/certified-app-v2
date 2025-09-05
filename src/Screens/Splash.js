import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';

export default function Splash() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('Onboarding');
      });
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <Animated.View
      style={[
        tw`flex-1 justify-center items-center`,
        { backgroundColor: '#0A6B4E', opacity: fadeAnim }
      ]}
    >
      <Text style={[tw`text-4xl font-bold`, { color: '#FFC107' }]}>
        Certified Inspect
      </Text>
    </Animated.View>
  );
}
