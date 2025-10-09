// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   Switch,
//   ScrollView,
//   Alert,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import Icon from "react-native-vector-icons/Ionicons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { useNavigation } from "@react-navigation/native";
// import SafeAreaWrapper from "../components/SafeAreaWrapper";
// import API_BASE_URL from "../../utils/config";
// export default function Profile() {
//   const [pushNotifications, setPushNotifications] = useState(true);
//   const [promoNotifications, setPromoNotifications] = useState(false);
//   const navigation = useNavigation();
//   const handleLogoutAll = async () => {
//     try {
//       // Token uthao
//       const token = await AsyncStorage.getItem("authToken");

//       if (!token) { 
//         Alert.alert("Error", "No token found. Please sign in again.");
//         return;
//       }

//       // API call → /logout-all/request
//       const res = await axios.post(`${API_BASE_URL}/user/logout-all/request`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (res.data?.status === "OTP_SENT") {
//         Alert.alert("OTP Sent", res.data.message);

//         // ✅ Ab logout verify wali screen pe bhejo
//         navigation.navigate("LogoutAllOTPVerify");
//       }
//     } catch (err) {
//       console.error("Logout All Error:", err.response?.data || err.message);
//       Alert.alert(
//         "Error",
//         err.response?.data?.message || "Failed to request logout all."
//       );
//     }
//   };

//   return (
//     <SafeAreaWrapper>
//       <ScrollView
//       style={tw`flex-1 bg-white`}
//       contentContainerStyle={tw`pb-20 px-2`}
//       showsVerticalScrollIndicator={true}
//     >
//       <Text style={tw`text-green-700 text-lg font-bold text-center`}>
//         Profile
//       </Text>
//       <View style={tw`border-b border-gray-300 my-2`} />

//       {/* Profile Picture */}
//       <View style={tw`items-center`}>
//         <Image
//           source={require("../../assets/profile.png")}
//           style={tw`w-20 h-20 rounded-full`}
//         />
//         <Text style={tw`text-lg font-semibold`}>Emmie Watson</Text>
//         <Text style={tw`text-gray-500`}>emmie1709@gmail.com</Text>
//       </View>

//       {/* My Account */}
//       <View style={tw`bg-white m-4 p-2 rounded-lg border border-gray-200 -mb-2`}>
//         <Text style={tw`text-yellow-600 font-semibold`}>My Account</Text>

//         <TouchableOpacity style={tw`flex-row items-center py-2`}>
//           <Icon name="person-outline" size={20} color="black" />
//           <Text style={tw`ml-3 text-gray-700`}>Personal information</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={tw`flex-row items-center justify-between py-2`}>
//           <View style={tw`flex-row items-center`}>
//             <Icon name="globe-outline" size={20} color="black" />
//             <Text style={tw`ml-3 text-gray-700`}>Language</Text>
//           </View>
//           <Text style={tw`text-gray-500`}>English (US)</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={tw`flex-row items-center py-2`}>
//           <Icon name="shield-checkmark-outline" size={20} color="black" />
//           <Text style={tw`ml-3 text-gray-700`}>Privacy Policy</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={tw`flex-row items-center py-2`}>
//           <Icon name="settings-outline" size={20} color="black" />
//           <Text style={tw`ml-3 text-gray-700`}>Setting</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Notifications */}
//       <View
//         style={tw`bg-white m-4 p-2 rounded-lg border border-gray-200 -mb-2 mt-6`}
//       >
//         <Text style={tw`text-yellow-600 font-semibold`}>Notifications</Text>

//         <View style={tw`flex-row items-center justify-between mb-2`}>
//           <View style={tw`flex-row items-center`}>
//             <Icon name="notifications-outline" size={20} color="black" />
//             <Text style={tw`ml-3 text-gray-700`}>Push Notifications</Text>
//           </View>
//           <Switch
//             value={pushNotifications}
//             onValueChange={setPushNotifications}
//             trackColor={{ false: "#ccc", true: "#22c55e" }}
//             thumbColor={"#fff"}
//           />
//         </View>

//         <View style={tw`flex-row items-center justify-between`}>
//           <View style={tw`flex-row items-center`}>
//             <Icon name="pricetag-outline" size={20} color="black" />
//             <Text style={tw`ml-3 text-gray-700`}>
//               Promotional Notifications
//             </Text>
//           </View>
//           <Switch
//             value={promoNotifications}
//             onValueChange={setPromoNotifications}
//             trackColor={{ false: "#ccc", true: "#22c55e" }}
//             thumbColor={"#fff"}
//           />
//         </View>
//       </View>

//       {/* More */}
//       <View style={tw`bg-white m-4 p-2 rounded-lg border border-gray-200 -mb-2`}>
//         <Text style={tw`text-yellow-600 font-semibold`}>More</Text>

//         <TouchableOpacity style={tw`flex-row items-center py-3`}>
//           <Icon name="help-circle-outline" size={20} color="black" />
//           <Text style={tw`ml-3 text-gray-700`}>Help Center</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={tw`flex-row items-center py-3`}
//           onPress={handleLogoutAll}
//         >
//           <Icon name="log-out-outline" size={20} color="red" />
//           <Text style={tw`ml-3 text-red-500 font-semibold`}>Log Out</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//     </SafeAreaWrapper>
//   );
// }
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import API_BASE_URL from "../../utils/config";
import AppIcon from "../components/AppIcon";

export default function Profile() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [promoNotifications, setPromoNotifications] = useState(false);
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // ✅ Update Profile Handler
  const handleUpdateProfile = async () => {
    if (!name && !newPassword) {
      Alert.alert("Error", "Enter name or new password to update.");
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please sign in again.");
        return;
      }

      // request body
      const body = {};
      if (name) body.name = name;
      if (newPassword) {
        if (!oldPassword) {
          Alert.alert("Error", "Old password is required to set a new password.");
          return;
        }
        body.oldPassword = oldPassword;
        body.password = newPassword;
      }

      const res = await axios.patch(`${API_BASE_URL}/user/profile`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Alert.alert("Success", "Profile updated successfully!");
      console.log("Profile Updated:", res.data);
      setName("");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Profile Update Error:", err.response?.data || err.message);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("Error", "No token found. Please sign in again.");
        return;
      }

      const res = await axios.post(
        `${API_BASE_URL}/user/logout-all/request`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.status === "OTP_SENT") {
        Alert.alert("OTP Sent", res.data.message);
        navigation.navigate("LogoutAllOTPVerify");
      }
    } catch (err) {
      console.error("Logout All Error:", err.response?.data || err.message);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to request logout all."
      );
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView
        style={tw`flex-1 bg-white`}
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
        <View
          style={tw`bg-white m-4 p-2 rounded-lg border border-gray-200 -mb-2`}
        >
          <Text style={tw`text-yellow-600 font-semibold`}>My Account</Text>

          <TouchableOpacity style={tw`flex-row items-center py-2`}>
            <AppIcon name="user" size={20} color="black" />
            <Text style={tw`ml-3 text-gray-700`}>Personal information</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-row items-center justify-between py-2`}
          >
            <View style={tw`flex-row items-center`}>
              <AppIcon name="globe" size={20} color="black" />
              <Text style={tw`ml-3 text-gray-700`}>Language</Text>
            </View>
            <Text style={tw`text-gray-500`}>English (US)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={tw`flex-row items-center py-2`}>
            <AppIcon name="lock" size={20} color="black" />
            <Text style={tw`ml-3 text-gray-700`}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={tw`flex-row items-center py-2`}>
            <AppIcon name="gear" size={20} color="black" />
            <Text style={tw`ml-3 text-gray-700`}>Setting</Text>
          </TouchableOpacity>
        </View>

        {/* Update Profile Section */}
        <View
          style={tw`bg-white m-4 p-3 rounded-lg border border-gray-200 mt-6`}
        >
          <Text style={tw`text-yellow-600 font-semibold mb-2`}>
            Update Profile
          </Text>

          <TextInput
            style={tw`border border-gray-300 rounded-lg p-2 mb-2`}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={tw`border border-gray-300 rounded-lg p-2 mb-2`}
            placeholder="Old Password"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
          />

          <TextInput
            style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={tw`bg-green-600 py-3 rounded-xl`}
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            <Text style={tw`text-white text-center font-semibold`}>
              {loading ? "Updating..." : "Update Profile"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View
          style={tw`bg-white m-4 p-2 rounded-lg border border-gray-200 -mb-2 mt-2`}
        >
          <Text style={tw`text-yellow-600 font-semibold`}>Notifications</Text>

          <View style={tw`flex-row items-center justify-between mb-2`}>
            <View style={tw`flex-row items-center`}>
              <AppIcon name="bell" size={14} color="black" />
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
              <AppIcon name="percent" size={14} color="black" />
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
        <View
          style={tw`bg-white m-4 p-2 rounded-lg border border-gray-200 -mb-2 mt-8`}
        >
          <Text style={tw`text-yellow-600 font-semibold`}>More</Text>

          <TouchableOpacity style={tw`flex-row items-center py-3`}>
            <AppIcon name="phone" size={20} color="black" />
            <Text style={tw`ml-3 text-gray-700`}>Help Center</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-row items-center py-3`}
            onPress={handleLogoutAll}
          >
            <AppIcon name="sign-out" size={20} color="red" />
            <Text style={tw`ml-3 text-red-500 font-semibold`}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
