import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";

import SafeAreaWrapper from "../components/SafeAreaWrapper";
import { setImages } from "../redux/slices/inspectionSlice";
import { INSPECTION_FLOW } from "../../utils/InspectionFlowConfig";

import {
  Header,
  ImageComparison,
  LoadingIndicator,
  AnalyzeDeleteButtons,
  DamageSection,
  NextButton,
} from "../components/InspectionComponent";

export default function ImageReviewScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const inspection = useSelector((state) => state.inspection);

  const { partKey, title, stepIndex } = route.params;

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const images = inspection.images || {};

  const saveImagesToRedux = (updated) => {
    dispatch(setImages(updated));
  };

  const handleNext = () => {
    const nextIndex = stepIndex + 1;

    if (nextIndex >= INSPECTION_FLOW.length) {
      navigation.navigate("MainTabs");
      return;
    }

    navigation.replace("CaptureWithSilhouette", { stepIndex: nextIndex });
  };

  return (
    <SafeAreaWrapper>
      <View style={tw`flex-1 bg-gray-50`}>
        <ScrollView contentContainerStyle={tw`pb-32 px-4 pt-4`}>
          <Header title={title || "Image Review"} onBack={() => navigation.goBack()} />

          <ImageComparison
            partKey={partKey}
            images={images}
            previewUri={previewUri}
            setPreviewUri={setPreviewUri}
            previewVisible={previewVisible}
            setPreviewVisible={setPreviewVisible}
          />

          {analyzing && <LoadingIndicator label="Analyzing Image" />}

          <AnalyzeDeleteButtons
            partKey={partKey}
            images={images}
            saveImagesToRedux={saveImagesToRedux}
            analyzing={analyzing}
            setAnalyzing={setAnalyzing}
          />

          <DamageSection inspection={inspection} partKey={partKey} />
        </ScrollView>

        <NextButton onNext={handleNext} />
      </View>
    </SafeAreaWrapper>
  );
}
