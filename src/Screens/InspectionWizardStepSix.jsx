import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Platform,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "react-native-image-picker";
import {
  setInspectionData,
  resetInspection,
} from "../redux/slices/inspectionSlice";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import API_BASE_URL from "../../utils/config";
import { signUrl } from "../../utils/inspectionFunctions";
import axios from "axios";

export default function InspectionWizardStepSix({ navigation }) {
  const dispatch = useDispatch();
  const inspectionData = useSelector((state) => state.inspection);
  const {
    damagePresent,
    damages = [],
    roadTest,
    roadTestComments,
    generalComments,
  } = inspectionData;
  const inspectionId = inspectionData._id;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [previewUrls, setPreviewUrls] = useState({});

  const [damageData, setDamageData] = useState({
    key: null,
    description: "",
    severity: "minor",
    repairRequired: false,
  });

  // Load all damage previews
  useEffect(() => {
    const loadPreviews = async () => {
      const urls = { ...previewUrls };
      let changed = false;

      for (const d of damages) {
        if (d.key && !urls[d.key]) {
          try {
            const signed = await signUrl(d.key);
            if (signed) {
              urls[d.key] = signed;
              changed = true;
            }
          } catch (err) {
            console.log("Failed to sign URL:", d.key);
          }
        }
      }
      if (changed) setPreviewUrls(urls);
    };

    if (damages.length > 0) loadPreviews();
  }, [damages]);

  // Upload image
  const pickAndUploadDamageImage = async () => {
    try {
      setUploading(true);
      const result = await ImagePicker.launchImageLibrary({
        mediaType: "photo",
        quality: 0.8,
      });

      if (result.didCancel || !result.assets?.[0]?.uri) {
        setUploading(false);
        return;
      }

      const uri = result.assets[0].uri;
      const res = await fetch(`${API_BASE_URL}/inspections/presigned`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileType: "image/jpeg" }),
      });
      if (!res.ok) throw new Error("Presigned failed");
      const { url: presignedUrl, key } = await res.json();

      const imgResp = await fetch(uri);
      const blob = await imgResp.blob();
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": "image/jpeg" },
      });
      if (!uploadRes.ok) throw new Error("Upload failed");

      setDamageData((prev) => ({ ...prev, key }));
      const signed = await signUrl(key);
      if (signed) setPreviewUrls((prev) => ({ ...prev, [key]: signed }));
    } catch (err) {
      Alert.alert("Upload Failed", err.message);
    } finally {
      setUploading(false);
    }
  };

  // Add Damage
  const handleAddDamage = async () => {
    if (!damageData.key || !damageData.description) {
      Alert.alert("Incomplete", "Photo and description required.");
      return;
    }

    const newDamage = {
      _id: null, // will be set by server
      key: damageData.key,
      description: damageData.description,
      severity: damageData.severity,
      repairRequired: damageData.repairRequired,
    };

    const updated = [...damages, newDamage];
    dispatch(setInspectionData({ field: "damages", value: updated }));

    setSyncing(true);
    if (inspectionId) {
      try {
        const payload = {
          damageImage: damageData.key,
          damageDescription: damageData.description,
          damageSeverity:
            damageData.severity.charAt(0).toUpperCase() +
            damageData.severity.slice(1),
          repairRequired: damageData.repairRequired ? "Yes" : "No",
        };
        const res = await fetch(
          `${API_BASE_URL}/inspections/${inspectionId}/damages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
        if (!res.ok) throw new Error("Save failed");
        const saved = await res.json();
        const final = updated.map((d) =>
          d.key === newDamage.key ? { ...d, _id: saved._id } : d,
        );
        dispatch(setInspectionData({ field: "damages", value: final }));
      } catch (err) {
        Alert.alert("Sync Failed", "Saved locally.");
        dispatch(setInspectionData({ field: "damages", value: damages }));
        const p = { ...previewUrls };
        delete p[damageData.key];
        setPreviewUrls(p);
      }
    }
    setSyncing(false);
    resetModal();
  };

  // Edit Damage
  const handleEditDamage = async () => {
    if (!damageData.key || !damageData.description) {
      Alert.alert("Incomplete", "Photo and description required.");
      return;
    }

    const old = damages[editingIndex];
    const updatedDamage = {
      ...old,
      key: damageData.key,
      description: damageData.description,
      severity: damageData.severity,
      repairRequired: damageData.repairRequired,
    };

    const optimistic = damages.map((d, i) =>
      i === editingIndex ? updatedDamage : d,
    );
    dispatch(setInspectionData({ field: "damages", value: optimistic }));

    const signed = await signUrl(damageData.key);
    if (signed) setPreviewUrls((p) => ({ ...p, [damageData.key]: signed }));

    setSyncing(true);
    if (inspectionId && old._id) {
      try {
        const payload = {
          damageImage: damageData.key,
          damageDescription: damageData.description,
          damageSeverity:
            damageData.severity.charAt(0).toUpperCase() +
            damageData.severity.slice(1),
          repairRequired: damageData.repairRequired ? "Yes" : "No",
        };
        const res = await fetch(
          `${API_BASE_URL}/inspections/${inspectionId}/damages/${old._id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
        if (!res.ok) throw new Error("Update failed");
      } catch (err) {
        Alert.alert("Update Failed", "Reverting...");
        dispatch(setInspectionData({ field: "damages", value: damages }));
      }
    }
    setSyncing(false);
    resetModal();
  };

  // Delete
  const handleDeleteDamage = async (index) => {
    const dmg = damages[index];
    setDeletingIndex(index);
    const filtered = damages.filter((_, i) => i !== index);
    dispatch(setInspectionData({ field: "damages", value: filtered }));
    const p = { ...previewUrls };
    delete p[dmg.key];
    setPreviewUrls(p);

    if (inspectionId && dmg._id) {
      try {
        const res = await fetch(
          `${API_BASE_URL}/inspections/${inspectionId}/damages/${dmg._id}`,
          { method: "DELETE" },
        );
        if (!res.ok) throw new Error("Delete failed");
      } catch (err) {
        Alert.alert("Delete Failed", "Reverting...");
        dispatch(setInspectionData({ field: "damages", value: damages }));
      }
    }
    setDeletingIndex(null);
  };

  const openEditModal = async (index) => {
    const d = damages[index];

    if (d.key && !previewUrls[d.key]) {
      try {
        const signed = await signUrl(d.key);
        if (signed) setPreviewUrls((p) => ({ ...p, [d.key]: signed }));
      } catch (_) {}
    }

    setDamageData({
      key: d.key,
      description: d.description || "",
      severity: d.severity || "minor",
      repairRequired: !!d.repairRequired,
    });

    setEditingIndex(index);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const resetModal = () => {
    setIsModalVisible(false);
    setIsEditMode(false);
    setEditingIndex(null);
    setDamageData({
      key: null,
      description: "",
      severity: "minor",
      repairRequired: false,
    });
  };
  const handleSelect = (field, value) =>
    dispatch(setInspectionData({ field, value }));
  const handleTextChange = (field, value) =>
    dispatch(setInspectionData({ field, value }));

  const handleNext = () => {
    navigation.navigate("FrontImage");
  };

  // const handleSubmit = async () => {
  //   try {
  //     console.log(
  //       "Final Inspection Data:",
  //       JSON.stringify(inspectionData, null, 2),
  //     );

  //     if (!inspectionData.vin || inspectionData.vin.length !== 17) {
  //       Alert.alert("Invalid VIN", "VIN must be 17 characters.");
  //       return;
  //     }
  //     const finalPayload = {
  //       vin: inspectionData.vin,
  //       make: inspectionData.make,
  //       carModel: inspectionData.model,
  //       year: inspectionData.year || "2025",
  //       engineNumber: inspectionData.engineNumber || "123xyz",
  //       mileAge: Number(inspectionData.mileAge) || 0,
  //       registrationPlate: inspectionData.registrationPlate || "ABC-123",
  //       registrationExpiry: inspectionData.registrationExpiry || "2026-05-12",
  //       buildDate: inspectionData.buildDate || "2020-02-01",
  //       complianceDate: inspectionData.complianceDate || "2020-04-15",
  //       overallRating: 0,
  //       inspectorEmail: "muhammadanasrashid18@gmail.com",
  //       frontImage: inspectionData.images.frontImage || {
  //         original: "s3://...",
  //         analyzed: "s3://...",
  //       },
  //       rearImage: inspectionData.images.rearImage || {
  //         original: "s3://...",
  //         analyzed: "s3://...",
  //       },
  //       leftImage: inspectionData.images.leftImage || {
  //         original: "s3://...",
  //         analyzed: "s3://...",
  //       },
  //       rightImage: inspectionData.images.rightImage || {
  //         original: "s3://...",
  //         analyzed: "s3://...",
  //       },
  //       engineImage: inspectionData.images.engineImage || {
  //         original: "s3://...",
  //         analyzed: "s3://...",
  //       },
  //       plateImage: inspectionData.images.VINPlate || {
  //         original: "s3://...",
  //         analyzed: "s3://...",
  //       },
  //       interiorFrontImage: inspectionData.images.InteriorFront || {
  //         original: "s3://...",
  //         analyzed: "s3://...",
  //       },
  //       interiorBackImage: inspectionData.images.InteriorBack || {
  //         original: "s3://...",
  //         analyzed: "s3://...",
  //       },
  //       odometer: inspectionData.odometer || "45200",
  //       odometerImage: inspectionData.odometerImage || "uploads/odometer.jpg",
  //       fuelType: inspectionData.fuelType || "Petrol",
  //       driveTrain: inspectionData.driveTrain || "AWD",
  //       transmission: inspectionData.transmission || "Automatic",
  //       bodyType: inspectionData.bodyType || "Sedan",
  //       color: inspectionData.color || "Blue",
  //       frontWheelDiameter: inspectionData.frontWheelDiameter || "17",
  //       rearWheelDiameter: inspectionData.rearWheelDiameter || "17",
  //       keysPresent: inspectionData.keysPresent ?? "true",
  //       serviceBookPresent: inspectionData.serviceBookPresent ?? "true",
  //       // bookImages: inspectionData.bookImages?.map((i) => i.key) || [],
  //       bookImages: (inspectionData.bookImages || [])
  //         .filter((i) => i && i.key) // ← Null/undefined filter
  //         .map((i) => i.key),
  //       serviceHistoryPresent: inspectionData.serviceHistoryPresent ?? "true",
  //       lastServiceDate: inspectionData.lastServiceDate || "2025-10-15",
  //       serviceCenterName: inspectionData.serviceCenterName || "Toyota Service",
  //       odometerAtLastService: inspectionData.odometerAtLastService || 45200,
  //       serviceRecordDocumentKey: inspectionData.serviceRecordDocumentKey || "",
  //       tyreConditionFrontLeft: inspectionData.tyreConditionFrontLeft || "Good",
  //       tyreConditionFrontRight:
  //         inspectionData.tyreConditionFrontRight || "Good",
  //       tyreConditionRearRight: inspectionData.tyreConditionRearRight || "Fair",
  //       tyreConditionRearLeft: inspectionData.tyreConditionRearLeft || "Fair",
  //       damagePresent: damagePresent || "Yes",
  //       damages: damages
  //         .filter((d) => d && d.key)
  //         .map((d) => ({
  //           damageImage: d.key,
  //           damageDescription: d.description || "",
  //           damageSeverity:
  //             d.severity.charAt(0).toUpperCase() + d.severity.slice(1),
  //           repairRequired: d.repairRequired ? "Yes" : "No",
  //         })),
  //       roadTest: roadTest || "Yes",
  //       roadTestComments: roadTestComments || "",
  //       generalComments: generalComments || "",
  //     };

  //     console.log("Sending Payload:", JSON.stringify(finalPayload, null, 2));
  //     if (inspectionData._id) {
  //       await axios.put(
  //         `${API_BASE_URL}/inspections/${inspectionData._id}`,
  //         finalPayload,
  //       );
  //     } else {
  //       await axios.post(`${API_BASE_URL}/inspections`, finalPayload);
  //     }

  //     dispatch(resetInspection());
  //     Alert.alert("Success", "Inspection submitted!");
  //     navigation.navigate("MainTabs");
  //   } catch (err) {
  //     const msg = err.response?.data?.message || err.message;
  //     console.error("Submit error:", msg);
  //     Alert.alert("Error", msg);
  //   }
  // };

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={tw`flex-1 bg-gray-100`}>
          {/* Header */}
          <View style={tw`flex-row items-center mb- px-4 pt-4`}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={tw`mr-4`}
            >
              <AppIcon name="arrow-left" size={24} color="#065f46" />
            </TouchableOpacity>
            <Text style={tw`text-lg font-bold text-green-800 ml-16`}>
              Inspection Wizard
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={tw`w-full h-1 bg-gray-200 rounded-full mb-4 mt-4`}>
            <View style={tw`w-6/6 h-1 bg-green-600 rounded-full`} />
          </View>

          <ScrollView style={tw`px-6`} contentContainerStyle={tw`pb-20`}>
            {/* Damage Present */}

            <View
              style={tw`mb-2 bg-white border border-gray-300 rounded-xl p-4`}
            >
              <Text style={tw`text-gray-500 mb-1`}>
                Is There Any Damage Present
              </Text>
              <View style={tw`flex-row justify-between`}>
                {["Yes", "No"].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={tw.style(
                      "flex-1 items-center justify-center border rounded-lg py-6 mx-1",
                      damagePresent === opt
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 bg-white",
                    )}
                    onPress={() =>
                      dispatch(
                        setInspectionData({
                          field: "damagePresent",
                          value: opt,
                        }),
                      )
                    }
                  >
                    <Text style={tw`text-gray-700`}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Recorded Damages */}
              {damagePresent === "Yes" && (
                <View style={tw`mt-6`}>
                  <View style={tw`flex-row justify-between items-center mb-2`}>
                    <Text style={tw`text-gray-700 font-semibold`}>
                      Recorded Damages
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setIsEditMode(false);
                        setIsModalVisible(true);
                      }}
                      style={tw`bg-green-600 px-3 py-2 rounded-lg`}
                    >
                      <Text style={tw`text-white font-semibold`}>
                        Add Damage
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {damages.length > 0 ? (
                    damages.map((d, i) => (
                      <View
                        key={d._id || d.key} // UNIQUE KEY: _id first, then key
                        style={tw`border border-gray-300 rounded-lg p-3 mb-3 relative`}
                      >
                        {deletingIndex === i && (
                          <View
                            style={tw`absolute inset-0 bg-gray-300 bg-opacity-80 rounded-lg items-center justify-center z-10`}
                          >
                            <ActivityIndicator size="small" color="#fff" />
                          </View>
                        )}

                        {previewUrls[d.key] ? (
                          <Image
                            source={{ uri: previewUrls[d.key] }}
                            style={tw`w-full h-40 rounded-lg mb-2`}
                            resizeMode="cover"
                          />
                        ) : (
                          <View
                            style={tw`w-full h-40 bg-gray-200 rounded-lg items-center justify-center mb-2`}
                          >
                            <ActivityIndicator size="small" color="#065f46" />
                          </View>
                        )}

                        <Text style={tw`font-medium`}>{d.description}</Text>
                        <Text style={tw`text-sm text-gray-600`}>
                          Severity: {d.severity}
                        </Text>
                        <Text style={tw`text-sm text-gray-600`}>
                          Repair: {d.repairRequired ? "Yes" : "No"}
                        </Text>

                        <TouchableOpacity
                          onPress={() => openEditModal(i)}
                          style={tw`absolute top-2 left-2 bg-blue-600 p-1 rounded-full`}
                        >
                          <AppIcon name="pencil" size={16} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleDeleteDamage(i)}
                          style={tw`absolute top-2 right-2 bg-red-600 p-1 rounded-full`}
                        >
                          <AppIcon name="close" size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text style={tw`text-gray-500`}>No damages recorded.</Text>
                  )}
                </View>
              )}

              {/* Road Test */}
              <View
                style={tw`mb-2 bg-white border border-gray-300 rounded-xl p-4 mt-6`}
              >
                <Text style={tw`text-gray-500 mb-1`}>Road Test</Text>
                <View style={tw`flex-row justify-between`}>
                  {["Yes", "No"].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={tw.style(
                        "flex-1 items-center justify-center border rounded-lg py-6 mx-1",
                        roadTest === option
                          ? "border-green-600 bg-green-50"
                          : "border-gray-300 bg-white",
                      )}
                      onPress={() => handleSelect("roadTest", option)}
                    >
                      <Text style={tw`text-gray-700`}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {roadTest === "Yes" && (
                <View style={tw`mt-4`}>
                  <Text style={tw`text-gray-500 mb-1`}>Road Test Comments</Text>
                  <TextInput
                    value={roadTestComments}
                    onChangeText={(v) =>
                      handleTextChange("roadTestComments", v)
                    }
                    placeholder="Enter comments"
                    style={tw`border border-gray-300 rounded-lg p-3 h-20`}
                    multiline
                  />
                </View>
              )}
            </View>
            {/* General Comments */}
            <View
              style={tw`mb-2 bg-white border border-gray-300 rounded-xl p-4`}
            >
              <Text style={tw`text-gray-500 mb-1`}>General Comments</Text>
              <TextInput
                value={generalComments}
                onChangeText={(v) => handleTextChange("generalComments", v)}
                placeholder="Enter comments"
                style={tw`border border-gray-300 rounded-lg p-3 h-20`}
                multiline
              />
            </View>
          </ScrollView>

          {/* Submit Button */}
          {/* <View style={tw`absolute bottom-0 left-0 right-0 px-4 pb-4 bg-white`}>
            <TouchableOpacity
              style={tw`bg-green-700 py-2 rounded-xl`}
              onPress={handleSubmit}
            >
              <Text style={tw`text-white text-center text-lg font-semibold`}>
                Submit
              </Text>
            </TouchableOpacity>
          </View> */}

          {/* Next Button */}
          <View style={tw`absolute bottom-0 left-0 right-0 px-4 pb-6 bg-white`}>
            <TouchableOpacity
              style={tw`bg-green-700 py-3 rounded-xl shadow-lg`}
              onPress={handleNext}
            >
              <Text style={tw`text-white text-center text-lg font-semibold`}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={tw`flex-1 justify-center bg-black bg-opacity-50 px-4`}>
          <View style={tw`bg-white rounded-xl p-5`}>
            <Text style={tw`text-lg font-bold text-center mb-4`}>
              {isEditMode ? "Edit Damage" : "Add Damage"}
            </Text>

            <TouchableOpacity
              onPress={pickAndUploadDamageImage}
              disabled={uploading}
              style={tw`bg-green-600 py-3 rounded-lg mb-3 items-center`}
            >
              {uploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={tw`text-white font-semibold`}>
                  {damageData.key ? "Change Photo" : "Upload Photo"}
                </Text>
              )}
            </TouchableOpacity>

            {damageData.key && previewUrls[damageData.key] ? (
              <Image
                source={{ uri: previewUrls[damageData.key] }}
                style={tw`w-full h-48 rounded-lg mb-3`}
                resizeMode="cover"
              />
            ) : damageData.key ? (
              <View
                style={tw`w-full h-48 bg-gray-200 rounded-lg items-center justify-center mb-3`}
              >
                <ActivityIndicator size="small" color="#065f46" />
              </View>
            ) : null}

            <TextInput
              placeholder="Description (required)"
              value={damageData.description}
              onChangeText={(t) =>
                setDamageData((p) => ({ ...p, description: t }))
              }
              style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
            />

            <Text style={tw`text-gray-700 mb-2`}>Severity</Text>
            <View style={tw`flex-row mb-3`}>
              {["minor", "moderate", "severe"].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setDamageData((p) => ({ ...p, severity: s }))}
                  style={tw.style(
                    "flex-1 mx-1 py-2 rounded-lg border items-center",
                    damageData.severity === s
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300",
                  )}
                >
                  <Text style={tw`capitalize`}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() =>
                setDamageData((p) => ({
                  ...p,
                  repairRequired: !p.repairRequired,
                }))
              }
              style={tw`flex-row items-center mb-4`}
            >
              <AppIcon
                name={damageData.repairRequired ? "check-square-o" : "square-o"}
                size={20}
                color="#065f46"
              />
              <Text style={tw`ml-2 text-gray-700`}>Repair Required</Text>
            </TouchableOpacity>

            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                onPress={resetModal}
                style={tw`bg-gray-400 px-4 py-2 rounded-lg`}
              >
                <Text style={tw`text-white`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={isEditMode ? handleEditDamage : handleAddDamage}
                disabled={syncing || !damageData.key || !damageData.description}
                style={tw.style(
                  "bg-green-700 px-4 py-2 rounded-lg",
                  (!damageData.key || !damageData.description) && "opacity-50",
                )}
              >
                {syncing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={tw`text-white`}>
                    {isEditMode ? "Update" : "Save"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaWrapper>
  );
}
