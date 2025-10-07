import React, { useState } from "react";
import {
  View,
  Text,

  ScrollView,

} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import { setImages } from "../redux/slices/inspectionSlice";

import SafeAreaWrapper from "../components/SafeAreaWrapper";

import { Header ,ImageComparison ,ImageActions ,LoadingIndicator,AnalyzeDeleteButtons,DamageSection,NextButton} from "../components/InspectionComponent";


export default function RightImage({ navigation }) {
  const dispatch = useDispatch();
  const { images: savedImages } = useSelector((state) => state.inspection);
  const inspection = useSelector((state) => state.inspection);

  const partKey = "rightImage";
  const [images, setLocalImages] = useState(savedImages || {});
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState(null);

  const saveImagesToRedux = (updatedImages) => {
    setLocalImages(updatedImages);
    dispatch(setImages(updatedImages));
  };

  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaWrapper>
      <View style={tw`flex-1 bg-white`}>
        <ScrollView style={tw`flex-1 px-4`} contentContainerStyle={tw`pb-32`}>
          
          <Header title="Right Image" onBack={handleBack} />
          <Text style={tw`text-lg font-bold text-green-800 mb-6`}>Right Image</Text>

          {/* Image Comparison */}
          <ImageComparison
            partKey={partKey}
            images={images}
            setPreviewUri={setPreviewUri}
            setPreviewVisible={setPreviewVisible}
          />

          {/* Uploading / Analyzing indicators */}
          {uploading && <LoadingIndicator label="Uploading..." />}
          {analyzing && <LoadingIndicator label="Analyzing..." />}

          {/* Gallery & Camera actions */}
          <ImageActions
            partKey={partKey}
            images={images}
            saveImagesToRedux={saveImagesToRedux}
            setUploading={setUploading}
            setProgress={setProgress}
          />

          {/* Analyze + Delete */}
          <AnalyzeDeleteButtons
            partKey={partKey}
            images={images}
            saveImagesToRedux={saveImagesToRedux}
            analyzing={analyzing}
            setAnalyzing={setAnalyzing}
          />

          {/* Damages */}
          <DamageSection inspection={inspection} partKey={partKey} />

        </ScrollView>

        {/* Next */}
        <NextButton navigation={navigation} nextScreen="BodyChecklist" />
      </View>
    </SafeAreaWrapper>
  );
}

