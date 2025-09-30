import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Collapsible from "react-native-collapsible";
import Icon from "react-native-vector-icons/Ionicons";
import tw from "tailwind-react-native-classnames";

const DamageList = ({ damages }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleCollapse = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <View style={[tw`p-3 rounded-lg pb-10`, { height: 250 }]} >

      <ScrollView showsVerticalScrollIndicator={false}>
        {damages.map((item, index) => (
          <View
            key={index}
            style={tw`bg-white rounded-2xl mb-3 p-3 shadow`}
          >
            <TouchableOpacity
              style={tw`flex-row justify-between items-center`}
              onPress={() => toggleCollapse(index)}
              activeOpacity={0.8}
            >
              <Text style={tw`text-base font-bold text-gray-800`}>
                {item.type.toUpperCase()}
              </Text>
              <Icon
                name={activeIndex === index ? "chevron-up" : "chevron-down"}
                size={20}
                color="#333"
              />
            </TouchableOpacity>

            <Collapsible collapsed={activeIndex !== index}>
              <View style={tw`mt-2 border-t border-gray-200 pt-2`}>
                <Text style={tw`text-sm text-gray-600 leading-5`}>
                  {item.description}
                </Text>
              </View>
            </Collapsible>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default DamageList;
