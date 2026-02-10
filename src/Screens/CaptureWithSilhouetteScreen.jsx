import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import backArrowIcon from "../../assets/backarrow.png";
import { INSPECTION_FLOW } from "../../utils/InspectionFlowConfig";
import { setImages } from "../redux/slices/inspectionSlice";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
export default function CaptureWithSilhouetteScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const inspection = useSelector((state) => state.inspection);

  const stepIndex = route?.params?.stepIndex ?? 0;
  const step = INSPECTION_FLOW[stepIndex];
  const isCompliancePlate = step.key === "compliancePlateImage";
  const isOdometer = step.key === "OdoImage";

  const isComplianceOrOdo = isCompliancePlate || isOdometer;

  const cameraRef = useRef(null);
  const device = useCameraDevice("back");

  const [hasPermission, setHasPermission] = useState(false);
  console.log(hasPermission);
  const [uploading, setUploading] = useState(false);
  const [damageModalVisible, setDamageModalVisible] = useState(false);
  const [lastUploadedKey, setLastUploadedKey] = useState(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const permission = await Camera.requestCameraPermission();
      console.log("Camera permission status:", permission);
      setHasPermission(permission === "authorized" || permission === "granted");
    };

    requestPermissions();
  }, []);

  const uploadToS3 = async (fileUri) => {
    try {
      const fileType = "image/jpeg";
      console.log(fileType);
      // 1) Get presigned URL
      const presignedResp = await fetch(
        `https://apiv2-backend.certifiedinspect.com.au/inspections/presigned`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileType }),
        },
      );
      console.log(presignedResp, "RES");
      if (!presignedResp.ok) throw new Error("Failed to get presigned URL");

      const { url: presignedUrl, key } = await presignedResp.json();

      // 2) Convert local file to blob
      const imgResp = await fetch(fileUri);
      const blob = await imgResp.blob();

      // 3) Upload blob to S3
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": fileType },
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      return key;
    } catch (err) {
      console.log("uploadToS3 error:", err);
      throw err;
    }
  };

  const saveOriginalToRedux = (partKey, uploadedKey) => {
    const updated = {
      ...(inspection.images || {}),
      [partKey]: {
        ...(inspection.images?.[partKey] || {}),
        original: uploadedKey,
      },
    };

    dispatch(setImages(updated));
  };

  const capturePhoto = async () => {
    try {
      if (!cameraRef.current) {
        Alert.alert("Camera Error", "Camera not ready");
        return;
      }

      setUploading(true);

      const photo = await cameraRef.current.takePhoto({ flash: "off" });

      const uri = `file://${photo.path}`;

      const uploadedKey = await uploadToS3(uri);

      saveOriginalToRedux(step.key, uploadedKey);

      setLastUploadedKey(uploadedKey);
      setDamageModalVisible(true);
    } catch (err) {
      Alert.alert("Capture Failed", err.message);
    } finally {
      setUploading(false);
    }
  };

  const goNextCapture = () => {
    const nextIndex = stepIndex + 1;

    if (nextIndex >= INSPECTION_FLOW.length) {
      Alert.alert("Inspection Completed", "All required images captured.");
      navigation.navigate("InspectionWizardStepSix");
      return;
    }

    navigation.replace("CaptureWithSilhouette", { stepIndex: nextIndex });
  };

  const handleNoDamage = () => {
    setDamageModalVisible(false);
    setLastUploadedKey(null);
    goNextCapture();
  };

  const handleYesDamage = () => {
    setDamageModalVisible(false);

    navigation.navigate("ImageReview", {
      partKey: step.key,
      title: step.title,
      stepIndex,
    });
  };

  if (!device) {
    return (
      <SafeAreaWrapper>
        <View style={tw`flex-1 items-center justify-center bg-black`}>
          <Text style={tw`text-white text-lg`}>Loading camera...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (!hasPermission) {
    return (
      <SafeAreaWrapper>
        <View style={tw`flex-1 items-center justify-center bg-black px-6`}>
          <Text style={tw`text-white text-lg font-bold mb-3`}>
            Camera Permission Required
          </Text>
          <Text style={tw`text-gray-400 text-center mb-5`}>
            Please allow camera permission to capture inspection photos.
          </Text>
          <TouchableOpacity
            onPress={Camera.openSettings}
            style={tw`bg-green-600 px-6 py-3 rounded-xl`}
          >
            <Text style={tw`text-white text-center font-bold`}>
              Open Settings
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={tw`flex-1 bg-black`}>
        {/* Header */}
        <View style={tw`flex-row items-center justify-between px-4 py-4 z-20`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`w-11 h-11 text-color items-center justify-center`}
          >
            {/* <Ionicons name="arrow-back" size={22} color="white" /> */}
            <Image
              source={backArrowIcon}
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
              // tintColor="black"
            />
          </TouchableOpacity>

          <Text style={tw`text-white text-lg font-bold`}>{step.title}</Text>

          <View style={tw`w-10 h-10`} />
        </View>

        {/* Camera + Silhouette */}
        <View style={tw`flex-1 px-4 pb-4`}>
          <View style={tw`flex-1 rounded-3xl overflow-hidden bg-black`}>
            {/* CAMERA */}
            <Camera
              ref={cameraRef}
              style={tw`flex-1`}
              device={device}
              isActive={true}
              photo={true}
            />

            {/* SILHOUETTE OVERLAY */}
            <Image
              source={step.silhouette}
              style={tw`absolute inset-0 w-full h-full opacity-60`}
              resizeMode="contain"
            />

            {/* UPLOADING OVERLAY */}
            {uploading && (
              <View
                style={tw`absolute inset-0 bg-black bg-opacity-60 items-center justify-center`}
              >
                <ActivityIndicator size="large" color="#22c55e" />
                <Text style={tw`text-white mt-3 font-semibold`}>
                  Uploading...
                </Text>
              </View>
            )}
          </View>
          <Text style={tw`text-gray-300 text-center mt-4`}>
            Align the vehicle with the silhouette and capture a clear image.
          </Text>
        </View>

        {/* Bottom Capture & Skip Buttons */}
        <View style={tw`px-4 pb-6`}>
          {/* Capture Button */}
          <TouchableOpacity
            onPress={capturePhoto}
            disabled={uploading}
            style={tw.style(
              "bg-green-600 py-4 rounded-2xl flex-row items-center justify-center",
              uploading && "opacity-50",
            )}
          >
            <Ionicons name="camera-outline" size={22} color="white" />
            <Text style={tw`text-white font-bold text-base ml-2`}>
              Capture Photo
            </Text>
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity
            onPress={goNextCapture}
            disabled={uploading}
            style={tw`bg-gray-700 py-4 rounded-2xl flex-row items-center justify-center mt-3`}
          >
            <Ionicons name="arrow-forward-outline" size={22} color="white" />
            <Text style={tw`text-white font-bold text-base ml-2`}>
              Skip Step
            </Text>
          </TouchableOpacity>

          <Text style={tw`text-gray-400 text-center text-xs mt-4`}>
            Step {stepIndex + 1} of {INSPECTION_FLOW.length}
          </Text>
        </View>

        {/* Damage Modal */}
        <Modal visible={damageModalVisible} transparent animationType="fade">
          <View style={tw`flex-1 bg-black bg-opacity-70 justify-center px-5`}>
            <View style={tw`bg-white rounded-3xl p-6 shadow-2xl`}>
              {/* Header */}
              <View style={tw`flex-row justify-between items-center mb-3`}>
                <Text style={tw`text-lg font-bold text-gray-900`}>
                  Damage Check
                </Text>

                <TouchableOpacity onPress={() => setDamageModalVisible(false)}>
                  <Ionicons name="close-outline" size={22} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <Text style={tw`text-gray-600 mb-6 leading-5`}>
                {isComplianceOrOdo
                  ? "Image uploaded successfully."
                  : "Please confirm whether there is any visible damage in this photo."}
              </Text>

              {isComplianceOrOdo ? (
                <TouchableOpacity
                  onPress={() => {
                    setDamageModalVisible(false);
                    setLastUploadedKey(null);
                    goNextCapture();
                  }}
                  style={tw`bg-black py-4 rounded-2xl mb-3`}
                >
                  <Text style={tw`text-center font-bold text-white text-base`}>
                    Continue
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={handleNoDamage}
                    style={tw`bg-black py-4 rounded-2xl mb-3`}
                  >
                    <Text
                      style={tw`text-center font-bold text-white text-base`}
                    >
                      No Damage
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleYesDamage}
                    style={tw`bg-black py-4 rounded-2xl mb-3`}
                  >
                    <Text
                      style={tw`text-center font-bold text-white text-base`}
                    >
                      Yes, Damage Found
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Retake */}
              <TouchableOpacity
                onPress={() => {
                  setDamageModalVisible(false);
                  setLastUploadedKey(null);
                }}
                style={tw`py-3`}
              >
                <Text style={tw`text-center text-gray-500 font-semibold`}>
                  Retake Photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaWrapper>
  );
}
