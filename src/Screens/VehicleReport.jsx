import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import debounce from "lodash.debounce";
import axios from "axios";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import AppIcon from "../components/AppIcon";
import { Buffer } from "buffer";
// import { Alert } from "react-native";

export default function VehicleReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const email = "muhammadanasrashid18@gmail.com"; // same as InspectionList
  const limit = 10;

  // ✅ Fetch inspections (same API logic as InspectionList)
  const fetchInspections = async (search, pageNumber = 1, append = false) => {
    try {
      if (pageNumber === 1 && !append) setLoading(true);
      if (pageNumber > 1) setLoadingMore(true);

      let url = `https://apiv2.certifiedinspect.com.au/inspections?email=${encodeURIComponent(
        email
      )}&sortBy=createdAt&sortOrder=desc&page=${pageNumber}&limit=${limit}`;

      if (search && search.trim().length > 0) {
        url += `&q=${encodeURIComponent(search)}`;
      }

      const res = await fetch(url, { headers: { accept: "application/json" } });
      const json = await res.json();
      const items = json.items || [];

      setData((prev) => (append ? [...prev, ...items] : items));
      setHasMore(pageNumber < json.pages);
    } catch (err) {
      console.error("Error fetching inspections:", err);
      Alert.alert("Error", "Failed to fetch inspections. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // ✅ Initial fetch
  useEffect(() => {
    fetchInspections(query, 1, false);
  }, []);

  // ✅ Debounced search
  const debouncedFetch = useCallback(
    debounce((text) => {
      setPage(1);
      fetchInspections(text, 1, false);
    }, 500),
    []
  );

  const handleChange = (text) => {
    setQuery(text);
    debouncedFetch(text);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchInspections(query, nextPage, true);
    }
  };

  const handleDownloadPDF = async (id) => {
    try {
      setDownloadingId(id);

      const url = `https://apiv2.certifiedinspect.com.au/inspections/${id}/pdf`;

      console.log("📥 Downloading from:", url);

      // Fetch PDF
      const response = await axios.get(url, {
        responseType: "arraybuffer",
        headers: { Accept: "application/pdf" },
      });

      // Convert to base64
      const base64Data = Buffer.from(response.data, "binary").toString(
        "base64"
      );

      // Save file path (Download directory)
      const filePath = `${RNFS.DownloadDirectoryPath}/inspection_${id}.pdf`;

      // Write PDF
      await RNFS.writeFile(filePath, base64Data, "base64");
      console.log("✅ PDF saved to:", filePath);

      // Open PDF in viewer
      await FileViewer.open(filePath);
      Alert.alert("✅ Success", "Report downloaded and opened successfully!");
    } catch (error) {
      console.error("Error downloading PDF:", error.message);

      if (error.response?.status === 404) {
        Alert.alert(
          "Not Found",
          "No inspection report found for this vehicle."
        );
      } else if (error.response?.status === 500) {
        Alert.alert(
          "Server Error",
          "The server failed to generate the report."
        );
      } else {
        Alert.alert("❌ Error", "Failed to download report. Please try again.");
      }
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={tw`flex-1 bg-white`}>
        {loading ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" color="#00cc66" />
            <Text style={tw`text-gray-600 mt-2`}>Loading reports...</Text>
          </View>
        ) : (
          <ScrollView
            style={tw`px-2`}
            contentContainerStyle={tw`pb-20 px-4`}
            showsVerticalScrollIndicator={true}
            onScrollEndDrag={loadMore}
          >
            {/* Header */}
            <View
              style={[
                tw`flex-row justify-between items-center mb-4`,
                Platform.OS === "android" ? tw`pt-6` : tw`pt-0`,
              ]}
            >
              <Text style={tw`text-green-700 text-lg font-bold`}>
                Vehicle Reports
              </Text>
              <AppIcon name="user-circle" size={24} color="#474745ff" />
            </View>

            {/* Stats */}
            <View style={tw`flex-row justify-between mb-6`}>
              <View
                style={tw`bg-white rounded-xl shadow p-4 flex-1 mx-1 items-center`}
              >
                <Text style={tw`text-blue-600 text-lg font-bold`}>
                  {data.length}
                </Text>
                <Text style={tw`text-gray-500 text-xs text-center`}>
                  Reports
                </Text>
              </View>
              <View
                style={tw`bg-white rounded-xl shadow p-4 flex-1 mx-1 items-center`}
              >
                <Text style={tw`text-blue-600 text-lg font-bold`}>
                  {(
                    data.reduce((sum, r) => sum + (r.overallRating || 0), 0) /
                    (data.length || 1)
                  ).toFixed(1)}
                </Text>
                <Text style={tw`text-gray-500 text-xs text-center`}>
                  Avg Rating
                </Text>
              </View>
              <View
                style={tw`bg-white rounded-xl shadow p-4 flex-1 mx-1 items-center`}
              >
                <Text style={tw`text-blue-600 text-lg font-bold`}>
                  {data.reduce((sum, r) => sum + (r.mileAge || 0), 0)}
                </Text>
                <Text style={tw`text-gray-500 text-xs text-center`}>
                  Total Mileage
                </Text>
              </View>
            </View>

            {/* Reports List */}
            {data.map((item, index) => (
              <View key={index} style={tw`bg-white rounded-xl shadow p-4 mb-4`}>
                <View style={tw`flex-row justify-between items-center`}>
                  <View style={tw`flex-row items-center`}>
                    <Text style={tw`text-green-800 font-bold mb-2`}>
                      {item.make} {item.Model} ({item.year})
                    </Text>
                  </View>
                  <Text style={tw`text-yellow-500 font-bold`}>
                    {item.overallRating || " "}/10
                  </Text>
                </View>

                <Text style={tw`text-gray-500 text-xs mt-1`}>
                  VIN: {item.vin}
                </Text>
                <Text style={tw`text-gray-500 text-xs`}>
                  Inspected: {item.createdAt?.split("T")[0]}
                </Text>
                <Text style={tw`text-gray-500 text-xs`}>
                  Inspector: {item.inspectorEmail}
                </Text>

                <View style={tw`border-b border-gray-200 my-2`} />

                {/* Buttons */}
                <View style={tw`flex-row justify-between mt-3`}>
                  <TouchableOpacity
                    style={tw`items-center`}
                    onPress={() => handleDownloadPDF(item._id)}
                  >
                    <AppIcon name="download" size={16} color="#999" />
                    <Text style={tw`text-gray-500 text-xs`}>
                      {downloadingId === item._id ? "Downloading..." : "Export"}
                    </Text>
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

            {loadingMore && (
              <ActivityIndicator
                size="small"
                style={tw`my-4`}
                color="#22c55e"
              />
            )}
          </ScrollView>
        )}

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
              <TouchableOpacity
                style={tw`flex-row items-center py-3`}
                onPress={() => setShareModalVisible(false)}
              >
                <AppIcon name="whatsapp" size={20} color="green" />
                <Text style={tw`ml-3 text-gray-800`}>WhatsApp</Text>
              </TouchableOpacity>
              <View style={tw`border-b border-gray-200`} />
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

