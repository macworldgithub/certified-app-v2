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
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Linking,
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
  const navigation = useNavigation();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [promoNotifications, setPromoNotifications] = useState(false);
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editOldPassword, setEditOldPassword] = useState("");
  const [editNewPassword, setEditNewPassword] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setEditName(parsed.name || "");
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };
    loadUser();
  }, []);

  const handleSaveProfile = async () => {
    if (!editName.trim() && !editNewPassword.trim()) {
      Alert.alert("Error", "Enter a name or new password to update.");
      return;
    }
    if (editNewPassword.trim() && !editOldPassword.trim()) {
      Alert.alert("Error", "Old password is required to set a new password.");
      return;
    }
    try {
      setSaveLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please sign in again.");
        return;
      }
      const body = {};
      if (editName.trim()) body.name = editName.trim();
      if (editNewPassword.trim()) {
        body.oldPassword = editOldPassword.trim();
        body.password = editNewPassword.trim();
      }
      const res = await axios.patch(`${API_BASE_URL}/user/profile`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      // Update local storage & state with new name
      const updatedUser = { ...user, name: editName.trim() };
      setUser(updatedUser);
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
      setEditOldPassword("");
      setEditNewPassword("");
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (err) {
      console.error("Profile Update Error:", err.response?.data || err.message);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to update profile.",
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userData");
      Alert.alert("Logout Successful", "You have been logged out successfully.");
      navigation.replace("Signin");
    } catch (err) {
      console.error("Logout Error:", err);
      Alert.alert("Error", "Failed to logout. Please try again.");
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
          <Text style={tw`text-lg font-semibold`}>{user?.name || "User"}</Text>

          <Text style={tw`text-gray-500`}>{user?.email || ""}</Text>
        </View>

        {/* My Account */}
        <View
          style={tw`bg-white m-4 p-2 rounded-lg border border-gray-200 mb-4`}
        >
          <Text style={tw`text-yellow-600 font-semibold`}>My Account</Text>

          <TouchableOpacity
            style={tw`flex-row items-center py-2`}
            onPress={() => setShowInfoModal(true)}
          >
            <AppIcon name="user" size={20} color="black" />
            <Text style={tw`ml-3 text-gray-700`}>Personal information</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={tw`flex-row items-center justify-between py-2`}
          >
            <View style={tw`flex-row items-center`}>
              <AppIcon name="globe" size={20} color="black" />
              <Text style={tw`ml-3 text-gray-700`}>Language</Text>
            </View>
            <Text style={tw`text-gray-500`}>English (US)</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={tw`flex-row items-center py-2`}>
            <AppIcon name="lock" size={20} color="black" />
            <Text style={tw`ml-3 text-gray-700`}>Privacy Policy</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={tw`flex-row items-center py-2`}>
            <AppIcon name="gear" size={20} color="black" />
            <Text style={tw`ml-3 text-gray-700`}>Setting</Text>
          </TouchableOpacity> */}
        </View>

        {/* Update Profile Section */}
        {/* <View
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
        </View> */}

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

          <TouchableOpacity
            style={tw`flex-row items-center py-3`}
            onPress={() => Linking.openURL('tel:+611800953304')}
          >
            <AppIcon name="phone" size={20} color="black" />
            <Text style={tw`ml-3 text-gray-700`}>Help Center</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-row items-center py-3`}
            onPress={handleLogout}
          >
            <AppIcon name="sign-out" size={20} color="red" />
            <Text style={tw`ml-3 text-red-500 font-semibold`}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Personal Information Modal */}
      <Modal
        visible={showInfoModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowInfoModal(false);
          setIsEditing(false);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => {
              setShowInfoModal(false);
              setIsEditing(false);
            }}
          />
          <ScrollView
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
            contentContainerStyle={{
              padding: 24,
              paddingBottom: 14,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a" }}>
                Personal Information
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                {/* Edit / Cancel toggle */}
                {!isEditing ? (
                  <TouchableOpacity
                    onPress={() => {
                      setEditName(user?.name || "");
                      setEditOldPassword("");
                      setEditNewPassword("");
                      setIsEditing(true);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#dcfce7",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 8,
                      marginRight: 8,
                    }}
                  >
                    <AppIcon name="pencil" size={14} color="#16a34a" />
                    <Text style={{ marginLeft: 5, color: "#16a34a", fontWeight: "600", fontSize: 13 }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setIsEditing(false)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#fee2e2",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 8,
                      marginRight: 8,
                    }}
                  >
                    <AppIcon name="times" size={14} color="#dc2626" />
                    <Text style={{ marginLeft: 5, color: "#dc2626", fontWeight: "600", fontSize: 13 }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                )}
                {/* Close X */}
                <TouchableOpacity
                  onPress={() => {
                    setShowInfoModal(false);
                    setIsEditing(false);
                  }}
                >
                  <AppIcon name="times" size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: "#e2e8f0", marginBottom: 20 }} />

            {/* Full Name */}
            <View style={{ marginBottom: 14 }}>
              <Text style={{ fontSize: 11, color: "#64748b", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>
                Full Name
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isEditing ? "#fff" : "#f8fafc",
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: isEditing ? 0 : 12,
                  borderWidth: 1,
                  borderColor: isEditing ? "#16a34a" : "#e2e8f0",
                }}
              >
                <AppIcon name="user" size={15} color="#2f855a" />
                {isEditing ? (
                  <TextInput
                    style={{ flex: 1, marginLeft: 10, fontSize: 15, color: "#0f172a", paddingVertical: 12 }}
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="Enter name"
                    placeholderTextColor="#94a3b8"
                  />
                ) : (
                  <Text style={{ marginLeft: 10, fontSize: 15, color: "#0f172a" }}>
                    {user?.name || "—"}
                  </Text>
                )}
              </View>
            </View>

            {/* Email — always read-only */}
            <View style={{ marginBottom: 14 }}>
              <Text style={{ fontSize: 11, color: "#64748b", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>
                Email Address
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#f8fafc",
                  borderRadius: 10,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                }}
              >
                <AppIcon name="envelope" size={15} color="#2f855a" />
                <Text style={{ marginLeft: 10, fontSize: 15, color: "#64748b" }}>
                  {user?.email || "—"}
                </Text>
              </View>
            </View>

            {/* Role — always read-only */}
            <View style={{ marginBottom: isEditing ? 14 : 24 }}>
              <Text style={{ fontSize: 11, color: "#64748b", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>
                Role
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#f8fafc",
                  borderRadius: 10,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                }}
              >
                <AppIcon name="id-badge" size={15} color="#2f855a" />
                <Text style={{ marginLeft: 10, fontSize: 15, color: "#64748b", textTransform: "capitalize" }}>
                  {user?.role || "—"}
                </Text>
              </View>
            </View>

            {/* Password fields — only in edit mode */}
            {isEditing && (
              <>
                <View style={{ marginBottom: 14 }}>
                  <Text style={{ fontSize: 11, color: "#64748b", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>
                    Old Password (optional)
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      borderWidth: 1,
                      borderColor: "#e2e8f0",
                    }}
                  >
                    <AppIcon name="lock" size={15} color="#2f855a" />
                    <TextInput
                      style={{ flex: 1, marginLeft: 10, fontSize: 15, color: "#0f172a", paddingVertical: 12 }}
                      value={editOldPassword}
                      onChangeText={setEditOldPassword}
                      placeholder="Current password"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry
                    />
                  </View>
                </View>

                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 11, color: "#64748b", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>
                    New Password (optional)
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      borderWidth: 1,
                      borderColor: "#e2e8f0",
                    }}
                  >
                    <AppIcon name="lock" size={15} color="#2f855a" />
                    <TextInput
                      style={{ flex: 1, marginLeft: 10, fontSize: 15, color: "#0f172a", paddingVertical: 12 }}
                      value={editNewPassword}
                      onChangeText={setEditNewPassword}
                      placeholder="New password"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry
                    />
                  </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: saveLoading ? "#86efac" : "#16a34a",
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                  onPress={handleSaveProfile}
                  disabled={saveLoading}
                >
                  <AppIcon name="save" size={16} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15, marginLeft: 8 }}>
                    {saveLoading ? "Saving..." : "Save Changes"}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Close button — only in view mode */}
            {!isEditing && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#f1f5f9",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                }}
                onPress={() => setShowInfoModal(false)}
              >
                <Text style={{ color: "#475569", fontWeight: "600", fontSize: 15 }}>
                  Close
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaWrapper>
  );
}

