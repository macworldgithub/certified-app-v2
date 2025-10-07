import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { setImages } from "../redux/slices/inspectionSlice";
import mime from "mime";
import API_BASE_URL from "../../utils/config";
import axios from "axios";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import { API_BASE_URL_Prod } from "../../utils/config";
import ImageViewing from "react-native-image-viewing";
import { Header ,ImageComparison ,ImageActions ,LoadingIndicator,AnalyzeDeleteButtons,DamageSection,NextButton} from "../components/InspectionComponent";




export default function RearImage({ navigation }) {
  const dispatch = useDispatch();
  const { images: savedImages } = useSelector((state) => state.inspection);
  const inspection = useSelector((state) => state.inspection);

  const partKey = "rearImage";

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState(null);
  const [images, setLocalImages] = useState(savedImages || {});
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  const saveImagesToRedux = (updatedImages) => {
    setLocalImages(updatedImages);
    dispatch(setImages(updatedImages));
  };

  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaWrapper>
      <View style={tw`flex-1 bg-white`}>
        <ScrollView style={tw`flex-1 px-4`} contentContainerStyle={tw`pb-32`}>
          <Header title="Rear Image" onBack={handleBack} />
          <Text style={tw`text-lg font-bold text-green-800 mb-6`}>Rear Image</Text>

          <ImageComparison
            partKey={partKey}
            images={images}
            setPreviewUri={setPreviewUri}
            setPreviewVisible={setPreviewVisible}
          />

          {uploading && <LoadingIndicator label="Uploading..." />}
          {analyzing && <LoadingIndicator label="Analyzing..." />}

          <ImageActions
            partKey={partKey}
            images={images}
            saveImagesToRedux={saveImagesToRedux}
            setUploading={setUploading}
            setProgress={setProgress}
          />

          <AnalyzeDeleteButtons
            partKey={partKey}
            images={images}
            saveImagesToRedux={saveImagesToRedux}
            analyzing={analyzing}
            setAnalyzing={setAnalyzing}
          />

          <DamageSection inspection={inspection} partKey={partKey} />
        </ScrollView>

        <NextButton navigation={navigation} nextScreen="LeftImage" />
      </View>
    </SafeAreaWrapper>
  );
}

