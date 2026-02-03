import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import { setInspectionData } from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import * as ImagePicker from "react-native-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_BASE_URL from "../../utils/config";
import { signUrl } from "../../utils/inspectionFunctions";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

export default function InspectionWizardStepFour({ navigation }) {
  const dispatch = useDispatch();
  const {
    serviceBookPresent,
    serviceHistoryPresent,
    bookImages = [],
    lastServiceDate,
    serviceCenterName,
    odometerAtLastService,
    serviceRecordDocumentKey,
  } = useSelector((state) => state.inspection);

  const inspectionId = useSelector((state) => state.inspection._id);

  const [showLastDatePicker, setShowLastDatePicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState({});
  const [deletingIndex, setDeletingIndex] = useState(null);

  useEffect(() => {
    const loadPreviews = async () => {
      if (!bookImages || bookImages.length === 0) {
        setPreviewUrls({});
        return;
      }
      const urls = { ...previewUrls };
      let hasNew = false;
      for (const img of bookImages) {
        const key = typeof img === "string" ? img : img.key;
        if (key && !urls[key]) {
          try {
            const signed = await signUrl(key);
            if (signed) {
              urls[key] = signed;
              hasNew = true;
            }
          } catch (err) {
            console.log("Failed to sign URL for key:", key, err);
          }
        }
      }
      if (hasNew) setPreviewUrls(urls);
    };
    loadPreviews();
  }, [bookImages]);

  const handleSelect = (field, value) => {
    dispatch(setInspectionData({ field, value }));

    if (field === "serviceBookPresent" && value === "No") {
      dispatch(setInspectionData({ field: "bookImages", value: [] }));
      setPreviewUrls({});
    }

    if (field === "serviceHistoryPresent" && value === "No") {
      dispatch(setInspectionData({ field: "lastServiceDate", value: "" }));
      dispatch(setInspectionData({ field: "serviceCenterName", value: "" }));
      dispatch(setInspectionData({ field: "odometerAtLastService", value: 0 }));
      dispatch(
        setInspectionData({ field: "serviceRecordDocumentKey", value: "" }),
      );
    }
  };

  const handleLastServiceDate = (event, selectedDate) => {
    setShowLastDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      dispatch(
        setInspectionData({ field: "lastServiceDate", value: formatted }),
      );
    }
  };

  const handleDeleteImage = (idx) => {
    const updated = [...bookImages];
    updated.splice(idx, 1);
    dispatch(setInspectionData({ field: "bookImages", value: updated }));
  };

  const handleNext = () => navigation.navigate("InspectionWizardStepSix");
  const handleBack = () => navigation.goBack();

  useEffect(() => {
    if (serviceHistoryPresent === "No") {
      dispatch(setInspectionData({ field: "serviceBookPresent", value: null }));
    }
  }, [serviceHistoryPresent]);

  const pickAndUploadImage = async (source) => {
    if (uploading) return;

    const options = {
      mediaType: "photo",
      quality: 0.8,
    };

    try {
      let result;
      if (source === "camera") {
        result = await launchCamera(options);
      } else {
        result = await launchImageLibrary(options);
      }

      if (!result || result.didCancel) {
        console.log("User cancelled image picker");
        return;
      }

      const asset = result.assets?.[0];
      if (!asset) {
        console.log("No image returned");
        return;
      }

      const imageObj = {
        key: asset.uri,
        uri: asset.uri,
        name: asset.fileName || "service-book.jpg",
        type: asset.type || "image/jpeg",
      };

      setUploading(true);

      // Simulate upload
      setTimeout(() => {
        dispatch(
          setInspectionData({
            field: "bookImages",
            value: [...bookImages, imageObj],
          }),
        );
        setUploading(false);
      }, 1000);
    } catch (error) {
      console.log("Image picker error:", error);
      setUploading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View style={tw`flex-1 bg-gray-100`}>
          <View style={tw`flex-row items-center mb-4 px-4 pt-4`}>
            <TouchableOpacity onPress={handleBack} style={tw`mr-4`}>
              <AppIcon name="arrow-left" size={24} color="#065f46" />
            </TouchableOpacity>
            <Text style={tw`text-lg font-bold text-green-800 ml-16`}>
              Inspection Wizard
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={tw`w-full h-1 bg-gray-200 rounded-full mb-4`}>
            <View style={tw`w-5/6 h-1 bg-green-600 rounded-full`} />
          </View>

          <ScrollView
            style={tw`px-4`}
            contentContainerStyle={tw`pb-40`}
            showsVerticalScrollIndicator={false}
          >
            {/* 1. Service History Present */}
            <View
              style={tw`mb-6 bg-white border border-gray-300 rounded-xl p-4`}
            >
              <Text style={tw`text-gray-400 mb-3`}>
                Is A Service History Present
              </Text>
              <View style={tw`flex-row justify-between`}>
                {["Yes", "No"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={tw.style(
                      "flex-1 items-center justify-center border rounded-xl py-5 mx-2",
                      serviceHistoryPresent === option
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 bg-white",
                    )}
                    onPress={() =>
                      handleSelect("serviceHistoryPresent", option)
                    }
                  >
                    <Text
                      style={tw.style(
                        "font-medium text-base",
                        serviceHistoryPresent === option
                          ? "text-green-700"
                          : "text-gray-500",
                      )}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Service Details - only if Yes */}
            {serviceHistoryPresent === "Yes" && (
              <View
                style={tw`mb-6 bg-white border border-gray-300 rounded-xl p-4`}
              >
                <Text style={tw`text-gray-400 mb-4 font-medium`}>
                  When Was The Last Service?
                </Text>
                <View style={tw`mb-4`}>
                  <Text style={tw`text-gray-500 mb-4 mt-4`}>
                    Upload Service Book Pages
                  </Text>

                  {uploading && (
                    <View style={tw`flex-row items-center mb-4`}>
                      <ActivityIndicator size="small" color="#16a34a" />
                      <Text style={tw`ml-2 text-green-600`}>Uploading...</Text>
                    </View>
                  )}

                  <View style={tw`flex-row mb-3`}>
                    <TouchableOpacity
                      disabled={uploading}
                      onPress={() => pickAndUploadImage("camera")}
                      style={tw`flex-1 bg-green-700 py-4 rounded-xl mr-2`}
                    >
                      <Text style={tw`text-white text-center font-medium`}>
                        Camera
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={uploading}
                      onPress={() => pickAndUploadImage("gallery")}
                      style={tw`flex-1 bg-green-700 py-4 rounded-xl`}
                    >
                      <Text style={tw`text-white text-center font-medium`}>
                        Gallery
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Image Grid */}
                  <View style={tw`flex-row flex-wrap -m-1`}>
                    {bookImages.map((item, idx) => {
                      const key = item.key;
                      const url = item.uri || item.key;

                      return (
                        <View
                          key={`${key}-${idx}`}
                          style={tw`w-28 h-32 m-1 relative bg-gray-100 rounded-xl overflow-hidden`}
                        >
                          <Image
                            source={{ uri: url }}
                            style={tw`w-full h-full`}
                            resizeMode="cover"
                          />

                          <TouchableOpacity
                            onPress={() => handleDeleteImage(idx)}
                            style={tw`absolute top-1 right-1 bg-red-600 p-1.5 rounded-full`}
                          >
                            <AppIcon name="close" size={18} color="white" />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </View>
                <Text style={tw`text-gray-500 mb-2`}>Last Service Date</Text>
                <TouchableOpacity
                  style={tw`border border-gray-300 rounded-lg p-3.5 mb-4 bg-white`}
                  onPress={() => setShowLastDatePicker(true)}
                >
                  <Text style={tw`text-gray-700`}>
                    {lastServiceDate || "Last Service"}
                  </Text>
                </TouchableOpacity>

                {showLastDatePicker && (
                  <DateTimePicker
                    value={
                      lastServiceDate ? new Date(lastServiceDate) : new Date()
                    }
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleLastServiceDate}
                  />
                )}

                <Text style={tw`text-gray-500 mb-2`}>
                  Odometer At Last Service (KMS)
                </Text>
                <TextInput
                  placeholder="Odometer"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={odometerAtLastService?.toString() || ""}
                  onChangeText={(v) =>
                    dispatch(
                      setInspectionData({
                        field: "odometerAtLastService",
                        value: Number(v) || 0,
                      }),
                    )
                  }
                  style={tw`border border-gray-300 rounded-lg p-3.5 mb-4 bg-white text-gray-700`}
                />
              </View>
            )}
          </ScrollView>

          {/* Fixed Next Button */}
          <View style={tw`absolute bottom-0 left-0 right-0 px-4 pb-6 bg-white`}>
            <TouchableOpacity
              style={tw`bg-green-700 py-3 rounded-xl shadow-md`}
              onPress={handleNext}
            >
              <Text style={tw`text-white text-center text-lg font-semibold`}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
}
