import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Icon from "react-native-vector-icons/Ionicons"; 

export default function Profile() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [promoNotifications, setPromoNotifications] = useState(false);

  return (
 <ScrollView
            style={tw`flex-1 bg-white pt-10`}
            contentContainerStyle={tw`pb-20 px-2`}
            showsVerticalScrollIndicator={true}
        >
      <Text style={tw`text-green-700 text-lg font-bold text-center`}>
        Profile
      </Text>
      <View style={tw`border-b border-gray-300 my-2`} />

      {/* Profile Picture */}
    <View style={tw`items-center`}>
  <Image
    source={require("../../assets/profile.png")}
    style={tw`w-20 h-20 rounded-full`}
  />
  <Text style={tw`text-lg font-semibold`}>Emmie Watson</Text>
  <Text style={tw`text-gray-500`}>emmie1709@gmail.com</Text>
</View>
      {/* My Account */}
      <View style={tw`bg-white m-4 p-2 rounded-lg border border-gray-200 -mb-2`}>
        <Text style={tw`text-yellow-600 font-semibold`}>My Account</Text>

        <TouchableOpacity style={tw`flex-row items-center py-2`}>
          <Icon name="person-outline" size={20} color="black" />
          <Text style={tw`ml-3 text-gray-700`}>Personal information</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-row items-center justify-between py-2`}
        >
          <View style={tw`flex-row items-center`}>
            <Icon name="globe-outline" size={20} color="black" />
            <Text style={tw`ml-3 text-gray-700`}>Language</Text>
          </View>
          <Text style={tw`text-gray-500`}>English (US)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex-row items-center py-2`}>
          <Icon name="shield-checkmark-outline" size={20} color="black" />
          <Text style={tw`ml-3 text-gray-700`}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex-row items-center py-2`}>
          <Icon name="settings-outline" size={20} color="black" />
          <Text style={tw`ml-3 text-gray-700`}>Setting</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications */}
      <View style={tw`bg-white m-4 p-2 rounded-lg border border-gray-200 -mb-2 `}>
        <Text style={tw`text-yellow-600 font-semibold`}>Notifications</Text>

        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center`}>
            <Icon name="notifications-outline" size={20} color="black" />
            <Text style={tw`ml-3 text-gray-700`}>Push Notifications</Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: "#ccc", true: "#22c55e" }}
            thumbColor={"#fff"}
          />
        </View>

        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center`}>
            <Icon name="pricetag-outline" size={20} color="black" />
            <Text style={tw`ml-3 text-gray-700`}>
              Promotional Notifications
            </Text>
          </View>
          <Switch
            value={promoNotifications}
            onValueChange={setPromoNotifications}
            trackColor={{ false: "#ccc", true: "#22c55e" }}
            thumbColor={"#fff"}
          />
        </View>
      </View>

      {/* More */}
      <View style={tw`bg-white m-4 p-2 rounded-lg border border-gray-200 -mb-2`}>
        <Text style={tw`text-yellow-600 font-semibold`}>More</Text>

        <TouchableOpacity style={tw`flex-row items-center py-3`}>
          <Icon name="help-circle-outline" size={20} color="black" />
          <Text style={tw`ml-3 text-gray-700`}>Help Center</Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex-row items-center py-3`}>
          <Icon name="log-out-outline" size={20} color="red" />
          <Text style={tw`ml-3 text-red-500 font-semibold`}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
