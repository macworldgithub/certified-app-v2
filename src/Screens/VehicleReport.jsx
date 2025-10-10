
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import tw from "tailwind-react-native-classnames";
import SafeAreaWrapper from "../components/SafeAreaWrapper";

// ✅ ADDED: Import AppIcon
import AppIcon from "../components/AppIcon";

export default function VehicleReport() {
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);

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

 const handleDownloadPDF = async (vin) => {
    try {
      setDownloading(true);
      const url = `https://apiv2.certifiedinspect.com.au/inspections/${vin}/pdf`;

      const response = await axios.get(url, {
        responseType: "arraybuffer", // PDF binary data
        headers: {
          Accept: "application/pdf",
        },
      });

      // ✅ Save PDF locally
      const filePath = `${RNFS.DownloadDirectoryPath}/inspection_${vin}.pdf`;
      await RNFS.writeFile(filePath, response.data, "base64");

      Alert.alert("Success", "Report downloaded successfully!");
      console.log("PDF saved at:", filePath);

      // ✅ Open PDF
      await FileViewer.open(filePath);
    } catch (error) {
      console.error("Error downloading PDF:", error.message);
      Alert.alert("Error", "Failed to download report.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={tw`flex-1 bg-white`}>
        <ScrollView
          style={tw`px-2`}
          contentContainerStyle={tw`pb-20 px-4`}
          showsVerticalScrollIndicator={true}
        >
          {/* Header */}
          <View
            style={[
              tw`flex-row justify-between items-center mb-4`,
              Platform.OS === "android" ? tw`pt-6` : tw`pt-0`,
            ]}
          >
            <Text style={tw`text-green-700 text-lg font-bold`}>
              Vehicles Reports
            </Text>
            <AppIcon name="user-circle" size={24} color="#474745ff" />
          </View>

          {/* Stats */}
          <View style={tw`flex-row justify-between mb-6`}>
            <View
              style={tw`bg-white rounded-xl shadow p-4 flex-1 mx-1 items-center`}
            >
              <Text style={tw`text-blue-600 text-lg font-bold`}>3</Text>
              <Text style={tw`text-gray-500 text-xs text-center`}>Reports</Text>
            </View>
            <View
              style={tw`bg-white rounded-xl shadow p-4 flex-1 mx-1 items-center`}
            >
              <Text style={tw`text-blue-600 text-lg font-bold`}>9.2</Text>
              <Text style={tw`text-gray-500 text-xs text-center`}>Avg Score</Text>
            </View>
            <View
              style={tw`bg-white rounded-xl shadow p-4 flex-1 mx-1 items-center`}
            >
              <Text style={tw`text-blue-600 text-lg font-bold`}>4</Text>
              <Text style={tw`text-gray-500 text-xs text-center`}>Total Issues</Text>
            </View>
          </View>

          {/* Reports List */}
          {reports.map((item, index) => (
            <View key={index} style={tw`bg-white rounded-xl shadow p-4 mb-4`}>
              {/* Title + Score */}
              <View style={tw`flex-row justify-between items-center`}>
                <View style={tw`flex-row items-center`}>
                  <AppIcon name="info" size={24} color="#facc15" />
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
                  <AppIcon name="warning" size={16} color="#facc15" />
                  <Text style={tw`text-gray-500 text-xs ml-1`}>
                    {item.issues} Market: {item.marketPrice}
                  </Text>
                </View>
                <Text style={tw`text-blue-600 text-xs`}>
                  Adjusted: {item.adjustedPrice}
                </Text>
              </View>

              {/* ✅ UPDATED: Action Buttons (using AppIcon) */}
              <View style={tw`flex-row justify-between mt-3`}>
                <TouchableOpacity style={tw`items-center`}>
                  <AppIcon name="download" size={16} color="#999" />
                  <Text style={tw`text-gray-500 text-xs`}>Export</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`items-center`}
                  onPress={() => setShareModalVisible(true)}
                >
                  <AppIcon name="share" size={16} color="#999" />
                  <Text style={tw`text-gray-500 text-xs`}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity style={tw`items-center`}>
                  <AppIcon name="eye" size={16} color="#999" />
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
                onPress={() => setShareModalVisible(false)}
              >
                <AppIcon name="whatsapp" size={20} color="green" />
                <Text style={tw`ml-3 text-gray-800`}>WhatsApp</Text>
              </TouchableOpacity>

              <View style={tw`border-b border-gray-200`} />

              {/* Copy Link Option */}
              <TouchableOpacity
                style={tw`flex-row items-center py-3`}
                onPress={() => setShareModalVisible(false)}
              >
                <AppIcon name="link" size={20} color="black" />
                <Text style={tw`ml-3 text-gray-800`}>Copy link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaWrapper>
  );
}
