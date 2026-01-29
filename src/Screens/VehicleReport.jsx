import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
  PermissionsAndroid,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import debounce from "lodash.debounce";
import axios from "axios";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import AppIcon from "../components/AppIcon";
import { Buffer } from "buffer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../utils/config";

export default function VehicleReport() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const [downloadingId, setDownloadingId] = useState(null);

  // Prediction states
  const [predictModalVisible, setPredictModalVisible] = useState(false);
  const [predictedData, setPredictedData] = useState(null);
  const [predictingId, setPredictingId] = useState(null);

  // Adjusted price states
  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [adjustedData, setAdjustedData] = useState(null);
  const [adjustingId, setAdjustingId] = useState(null);

  const email = "muhammadanasrashid18@gmail.com";
  const limit = 10;

  const fetchInspections = async (search, pageNumber = 1, append = false) => {
    try {
      if (pageNumber === 1 && !append) setLoading(true);
      if (pageNumber > 1) setLoadingMore(true);

      let url = `${API_BASE_URL}/inspections?email=${encodeURIComponent(
        email
      )}&sortBy=createdAt&sortOrder=desc&page=${pageNumber}&limit=${limit}`;

      if (search && search.trim().length > 0) {
        url += `&q=${encodeURIComponent(search)}`;
      }

      const res = await fetch(url, { headers: { accept: "application/json" } });
      const json = await res.json();
      const items = json.items || [];

      // ✅ Load locally saved data (market/adjusted)
      const saved = await AsyncStorage.getItem("vehicleReports");
      const savedReports = saved ? JSON.parse(saved) : [];

      // ✅ Merge saved values into fetched items
      const merged = items.map((item) => {
        const savedItem = savedReports.find((s) => s._id === item._id);
        return savedItem
          ? {
              ...item,
              marketValue: savedItem.marketValue,
              adjustedPrice: savedItem.adjustedPrice,
            }
          : item;
      });

      const updatedData = append ? [...data, ...merged] : merged;
      setData(updatedData);
      setHasMore(pageNumber < json.pages);
      await AsyncStorage.setItem("vehicleReports", JSON.stringify(updatedData));
    } catch (err) {
      console.error("Error fetching inspections:", err);
      Alert.alert("Error", "Failed to fetch inspections. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
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

  // ✅ Pagination
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchInspections(query, nextPage, true);
    }
  };

  useEffect(() => {
    const loadLocalData = async () => {
      try {
        const saved = await AsyncStorage.getItem("vehicleReports");
        if (saved) {
          setData(JSON.parse(saved));
        }
      } catch (e) {
        console.log("Failed to load saved reports", e);
      }
    };

    loadLocalData();
    fetchInspections(query, 1, false);
  }, []);

  // ✅ Download PDF
  // const handleDownloadPDF = async (id) => {
  //   try {
  //     setDownloadingId(id);

  //     if (Platform.OS === "android") {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //         {
  //           title: "Storage Permission",
  //           message:
  //             "Certified Inspect needs access to your storage to save reports.",
  //           buttonNeutral: "Ask Me Later",
  //           buttonNegative: "Cancel",
  //           buttonPositive: "OK",
  //         }
  //       );

  //       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //         Alert.alert(
  //           "Permission Denied",
  //           "Storage access is required to save PDF files."
  //         );
  //         setDownloadingId(null);
  //         return;
  //       }
  //     }

  //     const url = `https://apiv2.certifiedinspect.com.au/inspections/${id}/pdf`;
  //     const response = await axios.get(url, {
  //       responseType: "arraybuffer",
  //       headers: { Accept: "application/pdf" },
  //     });

  //     const base64Data = Buffer.from(response.data, "binary").toString(
  //       "base64"
  //     );
  //     const filePath = `${RNFS.DocumentDirectoryPath}/inspection_${id}.pdf`;

  //     await RNFS.writeFile(filePath, base64Data, "base64");
  //     await FileViewer.open(filePath);

  //     Alert.alert("✅ Success", "Report downloaded and opened successfully!");
  //   } catch (error) {
  //     console.error("Error downloading PDF:", error.message);
  //     if (error.response?.status === 404) {
  //       Alert.alert(
  //         "Not Found",
  //         "No inspection report found for this vehicle."
  //       );
  //     } else {
  //       Alert.alert("❌ Error", "Failed to download report. Please try again.");
  //     }
  //   } finally {
  //     setDownloadingId(null);
  //   }
  // };

  const handleDownloadPDF = async (id) => {
    try {
      console.log("🚀 Starting PDF download for inspection:", id);
      setDownloadingId(id);

      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message:
              "Certified Inspect needs access to your storage to save reports.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        console.log("🧾 Storage permission result:", granted);

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            "Permission Denied",
            "Storage access is required to save PDF files."
          );
          setDownloadingId(null);
          return;
        }
      }

      // 🔍 Log API URL
      const url = `${API_BASE_URL}/inspections/${id}/pdf`;
      console.log("🌍 API URL:", url);

      // 🔍 Start request
      const response = await axios.get(url, {
        responseType: "arraybuffer",
        headers: { Accept: "application/pdf" },
      });

      console.log("✅ PDF response received, status:", response.status);

      // 🧩 Convert to Base64
      const base64Data = Buffer.from(response.data, "binary").toString(
        "base64"
      );
      const filePath = `${RNFS.DocumentDirectoryPath}/inspection_${id}.pdf`;
      console.log("📁 File path for saving PDF:", filePath);

      await RNFS.writeFile(filePath, base64Data, "base64");
      console.log("💾 File written successfully, opening viewer...");

      await FileViewer.open(filePath);
      console.log("📖 File opened successfully!");

      Alert.alert("✅ Success", "Report downloaded and opened successfully!");
    } catch (error) {
      console.error("❌ Error downloading PDF full object:", error);

      if (error.response) {
        console.log("🔍 Error Response Status:", error.response.status);
        console.log("🔍 Error Response Data:", error.response.data);
        console.log("🔍 Error Response Headers:", error.response.headers);
      } else if (error.request) {
        console.log(
          "🚫 No response received. Error request object:",
          error.request
        );
      } else {
        console.log("⚙️ Error setting up request:", error.message);
      }

      if (error.response?.status === 404) {
        Alert.alert(
          "Not Found",
          "No inspection report found for this vehicle."
        );
      } else if (error.response?.status === 500) {
        Alert.alert(
          "Server Error (500)",
          "The server failed to generate the report. Please try again later."
        );
      } else {
        Alert.alert("❌ Error", "Failed to download report. Please try again.");
      }
    } finally {
      console.log("✅ PDF process finished.");
      setDownloadingId(null);
    }
  };

  // ✅ Predict Market Value
  const handlePredictMarketValue = async (id) => {
    try {
      setPredictingId(id);
      setPredictedData(null);

      const url = `${API_BASE_URL}/inspections/${id}/predict-price`;
      const response = await axios.get(url, {
        headers: { Accept: "application/json" },
      });

      if (response.data && response.data.prediction) {
        setPredictedData(response.data.prediction);
        setPredictModalVisible(true);

        // ✅ Update list and AsyncStorage correctly
        setData((prev) => {
          const updatedData = prev.map((item) =>
            item._id === id
              ? { ...item, marketValue: response.data.prediction.retail_price }
              : item
          );
          AsyncStorage.setItem("vehicleReports", JSON.stringify(updatedData));
          return updatedData;
        });
      } else {
        Alert.alert("No Data", "No market value prediction found.");
      }
    } catch (error) {
      console.error("Error predicting market value:", error.message);
      Alert.alert(
        "❌ Error",
        "Failed to predict market value. Please try again."
      );
    } finally {
      setPredictingId(null);
    }
  };

  // ✅ Adjusted Price
  const handleAdjustedPrice = async (id) => {
    try {
      setAdjustingId(id);
      setAdjustedData(null);

      const url = `${API_BASE_URL}/inspections/${id}/adjusted-price`;
      const response = await axios.get(url, {
        headers: { Accept: "application/json" },
      });

      if (response.data && response.data.AdjustedPrice) {
        setAdjustedData(response.data);
        setAdjustModalVisible(true);

        // ✅ Update list and AsyncStorage correctly
        setData((prev) => {
          const updatedData = prev.map((item) =>
            item._id === id
              ? { ...item, adjustedPrice: response.data.AdjustedPrice }
              : item
          );
          AsyncStorage.setItem("vehicleReports", JSON.stringify(updatedData));
          return updatedData;
        });
      } else {
        Alert.alert("No Data", "No adjusted price found for this vehicle.");
      }
    } catch (error) {
      console.error("Error fetching adjusted price:", error.message);
      Alert.alert(
        "❌ Error",
        "Failed to fetch adjusted price. Please try again."
      );
    } finally {
      setAdjustingId(null);
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={tw`flex-1 bg-gray-100`}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Vehicle Reports</Text>
        </View>

        {/* Search Bar */}
        <TextInput
          placeholder="Search by VIN, make, or model..."
          value={query}
          onChangeText={handleChange}
          style={styles.search}
          placeholderTextColor="#94a3b8"
        />

        {/* List */}
        {loading ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" color="#22c55e" />
            <Text style={tw`text-gray-600 mt-2`}>Loading reports...</Text>
          </View>
        ) : (
          <ScrollView
            style={tw`px-2`}
            contentContainerStyle={tw`pb-20 px-4`}
            showsVerticalScrollIndicator={true}
            onScrollEndDrag={loadMore}
          >
            {data.length === 0 ? (
              <Text style={tw`text-center text-gray-500 mt-4`}>
                {query.length > 0
                  ? "No results found"
                  : "No vehicle reports available"}
              </Text>
            ) : (
              data.map((item, index) => (
                <View
                  key={index}
                  style={tw`bg-white rounded-xl shadow p-4 mb-4`}
                >
                  <View style={tw`flex-row justify-between items-center`}>
                    <Text style={tw`font-bold mb-2`}>
                      {item.make} {item.Model || item.model} ({item.year})
                    </Text>
                    <Text style={tw`font-bold`}>
                      {item.overallRating ?? 0}/10
                    </Text>
                  </View>

                  <Text style={tw`text-gray-500 text-xs mt-1`}>
                    VIN: {item.vin}
                  </Text>
                  <Text style={tw`text-gray-700 text-xs`}>
                    Inspected: {item.createdAt?.split("T")[0]}
                  </Text>

                  {item.marketValue && (
                    <Text style={tw`text-gray-700 text-xs mt-1`}>
                      <Text style={tw`font-bold`}>Market Value:</Text>{" "}
                      {item.marketValue}
                    </Text>
                  )}

                  {item.adjustedPrice && (
                    <Text style={tw`text-gray-700 text-xs`}>
                      <Text style={tw`font-bold`}>Adjusted Price:</Text>{" "}
                      {item.adjustedPrice}
                    </Text>
                  )}

                  <View style={tw`border-b border-gray-200 my-2`} />

                  <View style={tw`flex-row justify-between mt-3`}>
                    <TouchableOpacity
                      style={tw`items-center`}
                      onPress={() => handleDownloadPDF(item._id)}
                    >
                      <AppIcon name="download" size={16} color="#2f855a" />
                      <Text style={tw`text-green-600 text-xs`}>
                        {downloadingId === item._id
                          ? "Downloading..."
                          : "Export"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={tw`items-center`}
                      onPress={() => handlePredictMarketValue(item._id)}
                    >
                      <AppIcon name="dollar" size={16} color="#2f855a" />
                      <Text style={tw`text-green-600 text-xs`}>
                        {predictingId === item._id
                          ? "Predicting..."
                          : "Market Value"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={tw`items-center`}
                      onPress={() => handleAdjustedPrice(item._id)}
                    >
                      <AppIcon name="balance-scale" size={16} color="#2f855a" />
                      <Text style={tw`text-green-600 text-xs`}>
                        {adjustingId === item._id
                          ? "Adjusting..."
                          : "Adjusted Price"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            {loadingMore && (
              <ActivityIndicator
                size="small"
                style={tw`my-4`}
                color="#22c55e"
              />
            )}
          </ScrollView>
        )}

        {/* Prediction Modal */}
        <Modal
          visible={predictModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setPredictModalVisible(false)}
        >
          <View
            style={tw`flex-1 bg-black bg-opacity-40 justify-center items-center`}
          >
            <View style={tw`bg-white rounded-lg p-6 w-72`}>
              {predictedData ? (
                <>
                  <Text style={tw`text-lg font-bold text-green-700 mb-3`}>
                    Market Value Prediction
                  </Text>
                  <Text style={tw`text-gray-700`}>
                    <Text style={tw`font-bold`}>Retail:</Text>{" "}
                    {predictedData.retail_price}
                  </Text>
                  <Text style={tw`text-gray-700`}>
                    <Text style={tw`font-bold`}>Wholesale:</Text>{" "}
                    {predictedData.wholesale_price}
                  </Text>
                  <Text style={tw`text-gray-700`}>
                    <Text style={tw`font-bold`}>Market Trends:</Text>{" "}
                    {predictedData.market_trends}
                  </Text>
                </>
              ) : (
                <ActivityIndicator size="small" color="#22c55e" />
              )}
              <TouchableOpacity
                style={tw`mt-4 bg-green-600 py-2 rounded-lg`}
                onPress={() => setPredictModalVisible(false)}
              >
                <Text style={tw`text-white text-center font-bold`}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Adjusted Price Modal */}
        <Modal
          visible={adjustModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setAdjustModalVisible(false)}
        >
          <View
            style={tw`flex-1 bg-black bg-opacity-40 justify-center items-center`}
          >
            <View style={tw`bg-white rounded-lg p-6 w-72`}>
              {adjustedData ? (
                <>
                  <Text style={tw`text-lg font-bold mb-3`}>
                    Adjusted Price Evaluation
                  </Text>
                  <Text style={tw`text-gray-700 mb-1`}>
                    <Text style={tw`font-bold`}>Adjusted Price:</Text>{" "}
                    {adjustedData.AdjustedPrice}
                  </Text>
                  <Text style={tw`text-gray-700 mb-1`}>
                    <Text style={tw`font-bold`}>Explanation:</Text>{" "}
                    {adjustedData.Explanation}
                  </Text>
                </>
              ) : (
                <ActivityIndicator size="small" color="#22c55e" />
              )}
              <TouchableOpacity
                style={tw`mt-4 bg-green-600 py-2 rounded-lg`}
                onPress={() => setAdjustModalVisible(false)}
              >
                <Text style={tw`text-white text-center font-bold`}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  search: {
    backgroundColor: "#fff",
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
});
