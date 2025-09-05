import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import tw from "tailwind-react-native-classnames";

export default function VehicleReport() {
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const reports = [
    {
      title: "2020 Toyota Camry",
      date: "2024-01-15",
      inspector: "John Smith",
      score: "8.5",
      issues: "3 Issues",
      marketPrice: "$25,000",
      adjustedPrice: "$23,000",
    },
    {
      title: "2020 Toyota Camry",
      date: "2024-01-15",
      inspector: "John Smith",
      score: "8.5",
      issues: "3 Issues",
      marketPrice: "$25,000",
      adjustedPrice: "$23,000",
    },
    {
      title: "2020 Toyota Camry",
      date: "2024-01-15",
      inspector: "John Smith",
      score: "8.5",
      issues: "3 Issues",
      marketPrice: "$25,000",
      adjustedPrice: "$23,000",
    },
  ];

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView
        style={tw`pt-10 px-2`}
        contentContainerStyle={tw`pb-20 px-4`}
        showsVerticalScrollIndicator={true}
      >
        {/* Header */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <Text style={tw`text-green-700 text-lg font-bold`}>
            Vehicles Reports
          </Text>
          <FontAwesome5 name="user-circle" size={28} color="#999" />
        </View>

        {/* Stats */}
        <View style={tw`flex-row justify-between mb-6`}>
          <View
            style={tw`bg-white rounded-xl shadow p-4 flex-1 mx-1 items-center`}
          >
            <Text style={tw`text-blue-600 text-lg font-bold`}>3</Text>
            <Text style={tw`text-gray-500 text-xs`}>Reports</Text>
          </View>
          <View
            style={tw`bg-white rounded-xl shadow p-4 flex-1 mx-1 items-center`}
          >
            <Text style={tw`text-blue-600 text-lg font-bold`}>9.2</Text>
            <Text style={tw`text-gray-500 text-xs`}>Avg Score</Text>
          </View>
          <View
            style={tw`bg-white rounded-xl shadow p-4 flex-1 mx-1 items-center`}
          >
            <Text style={tw`text-blue-600 text-lg font-bold`}>4</Text>
            <Text style={tw`text-gray-500 text-xs`}>Total Issues</Text>
          </View>
        </View>

        {/* Reports List */}
        {reports.map((item, index) => (
          <View key={index} style={tw`bg-white rounded-xl shadow p-4 mb-4`}>
            {/* Title + Score */}
            <View style={tw`flex-row justify-between items-center`}>
              <View style={tw`flex-row items-center`}>
                <MaterialIcons name="description" size={24} color="#facc15" />
                <Text style={tw`ml-2 text-green-800 font-bold`}>
                  {item.title}
                </Text>
              </View>
              <Text style={tw`text-yellow-500 font-bold`}>
                {item.score}/10
              </Text>
            </View>

            {/* Date + Inspector */}
            <Text style={tw`text-gray-500 text-xs mt-1`}>
              Inspected: {item.date}
            </Text>
            <Text style={tw`text-gray-500 text-xs`}>
              By: {item.inspector}
            </Text>

            {/* Divider */}
            <View style={tw`border-b border-gray-200 my-2`} />

            {/* Issues & Prices */}
            <View style={tw`flex-row justify-between items-center`}>
              <View style={tw`flex-row items-center`}>
                <MaterialIcons name="warning" size={16} color="#facc15" />
                <Text style={tw`text-gray-500 text-xs ml-1`}>
                  {item.issues} Market: {item.marketPrice}
                </Text>
              </View>
              <Text style={tw`text-blue-600 text-xs`}>
                Adjusted: {item.adjustedPrice}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={tw`flex-row justify-between mt-3`}>
              <TouchableOpacity style={tw`items-center`}>
                <Feather name="download" size={16} color="#999" />
                <Text style={tw`text-gray-500 text-xs`}>Export</Text>
              </TouchableOpacity>

              {/* Share Button */}
              <TouchableOpacity
                style={tw`items-center`}
                onPress={() => setShareModalVisible(true)}
              >
                <Feather name="share-2" size={16} color="#999" />
                <Text style={tw`text-gray-500 text-xs`}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={tw`items-center`}>
                <Feather name="eye" size={16} color="#999" />
                <Text style={tw`text-gray-500 text-xs`}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Share Modal */}
      <Modal
        visible={shareModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View
          style={tw`flex-1 bg-black bg-opacity-40 justify-center items-center`}
        >
          <View style={tw`bg-white rounded-lg p-6 w-60`}>
            {/* WhatsApp Option */}
            <TouchableOpacity
              style={tw`flex-row items-center py-3`}
              onPress={() => {
                // Handle WhatsApp share here
                setShareModalVisible(false);
              }}
            >
              <FontAwesome5 name="whatsapp" size={20} color="green" />
              <Text style={tw`ml-3 text-gray-800`}>WhatsApp</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={tw`border-b border-gray-200`} />

            {/* Copy Link Option */}
            <TouchableOpacity
              style={tw`flex-row items-center py-3`}
              onPress={() => {
                // Handle copy link here
                setShareModalVisible(false);
              }}
            >
              <Feather name="link" size={20} color="black" />
              <Text style={tw`ml-3 text-gray-800`}>Copy link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
