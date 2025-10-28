import axios from "axios";
import mime from "mime";
import { Alert } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

import API_BASE_URL from "./config";

export const uploadToS3 = async ({
  fileUri,
  partKey,
  images,
  saveImagesToRedux,
  setUploading,
  setProgress,
}) => {
  try {
    setUploading(true);
    setProgress(0);

    const fileType = mime.getType(fileUri) || "image/jpeg";

    // STEP 1: Get presigned URL
    const presignedResp = await axios.post(
      `${API_BASE_URL}/inspections/presigned`,
      { fileType },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      }
    );

    const { url, key } = presignedResp.data;

    // STEP 2: Convert local file to blob
    const fileResp = await fetch(fileUri);
    const blob = await fileResp.blob();

    // STEP 3: Upload to S3 using PUT
    const uploadResp = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": fileType,
      },
      body: blob,
    });

    if (uploadResp.ok) {
      console.log("✅ Image uploaded successfully to S3");
      Alert.alert("Success", "Image uploaded successfully");

      // update Redux store
      const updated = {
        ...images,
        [partKey]: {
          ...images[partKey],
          original: key,
          analyzed: undefined,
          damages: [],
        },
      };
      saveImagesToRedux(updated);
    } else {
      console.error("❌ Upload failed:", uploadResp.status);
      Alert.alert("Error", "Failed to upload image to S3");
    }

    setUploading(false);
    setProgress(0);
  } catch (err) {
    console.error("❌ Upload error:", err);
    setUploading(false);
    setProgress(0);
    Alert.alert("Error", "Upload failed due to network or file issue");
  }
};

// ✅ Pick from Gallery
export const handlePickFromGallery = async ({
  partKey,
  images,
  saveImagesToRedux,
  setUploading,
  setProgress,
}) => {
  try {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 1,
    });

    if (!result.didCancel && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      await uploadToS3({
        fileUri: uri,
        partKey,
        images,
        saveImagesToRedux,
        setUploading,
        setProgress,
      });
    }
  } catch (err) {
    console.log("❌ Gallery pick failed", err);
  }
};

// ✅ Capture from Camera
export const handleImageCapture = async ({
  partKey,
  images,
  saveImagesToRedux,
  setUploading,
  setProgress,
}) => {
  try {
    const result = await launchCamera({
      mediaType: "photo",
      quality: 1,
      saveToPhotos: true,
    });

    if (!result.didCancel && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      await uploadToS3({
        fileUri: uri,
        partKey,
        images,
        saveImagesToRedux,
        setUploading,
        setProgress,
      });
    }
  } catch (err) {
    console.log("❌ Camera capture failed", err);
  }
};

const deleteFileFromS3 = async (key) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/inspections/file`, {
      params: { key },
      headers: {
        Accept: "*/*",
      },
    });

    if (response.data.status === 200) {
      console.log("✅ File deleted:", response.data);
      return response.data;
    } else {
      console.warn("⚠️ Delete failed:", response.data);
      return response.data;
    }
  } catch (error) {
    console.error(
      "❌ Error deleting file:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const handleDeleteFromS3 = async ({
  partKey,
  images,
  saveImagesToRedux,
}) => {
  if (!images[partKey]?.original) {
    Alert.alert("No Image", "No image to delete.");
    return;
  }

  try {
    const deletePromises = [];

    // Always delete original if present
    if (images[partKey]?.original) {
      deletePromises.push(
        deleteFileFromS3(images[partKey].original).catch((err) => {
          console.error("❌ Failed to delete original from S3:", err);
          return null;
        })
      );
    }

    // Delete analyzed if present
    if (images[partKey]?.analyzed) {
      deletePromises.push(
        deleteFileFromS3(images[partKey].analyzed).catch((err) => {
          console.error("❌ Failed to delete analyzed from S3:", err);
          return null;
        })
      );
    }

    // Wait for all delete requests
    await Promise.all(deletePromises);

    // Update Redux
    const updated = {
      ...images,
      [partKey]: {
        original: undefined,
        analyzed: undefined,
        damages: [],
      },
    };
    saveImagesToRedux(updated);

    Alert.alert("✅ Success", "Image(s) deleted successfully.");
  } catch (err) {
    console.error("❌ Unexpected delete error:", err);
    Alert.alert("Error", "Something went wrong while deleting the image.");
  }
};

export const signUrl = async (awsKey) => {
  try {
    const signResp = await axios.get(
      `${API_BASE_URL}/inspections/signed-url-you`,
      {
        params: { key: awsKey }, // ✅ sends key as query param
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      }
    );

    // Your backend returns { status, url }
    return signResp.data.url; // ✅ use "url", not "signedUrl"
  } catch (err) {
    console.error("❌ Sign URL error:", err);
    Alert.alert("Error", "Failed to get signed URL");
    return null;
  }
};

// ✅ Analyze uploaded image
//   const analyzeInspection = async (key) => {
//     try {
//       console.log("🔑 Passing key to analyze:", key);

//       const analyzeResp = await axios.post(
//         `${API_BASE_URL}/inspections/analyze`,
//         { key },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             accept: "*/*",
//           },
//         }
//       );

//     //   console.log("🔍 Analyze Response:", analyzeResp.data);

//       const { analysedImageUrl, damages } = analyzeResp.data;

//     //   Alert.alert(
//     //     "Analysis Complete",
//     //     damages?.length > 0
//     //       ? `Damages detected: ${JSON.stringify(damages)}`
//     //       : "No damages found!"
//     //   );

//       return analyzeResp.data;
//     } catch (err) {
//       console.error("❌ Analyze error:", err);
//       Alert.alert("Error", "Image analysis failed");
//       return null;
//     }
//   };

// export const handleAnalyzeImage = async ({
//   partKey,
//   images,
//   saveImagesToRedux,
//   setAnalyzing,
// }) => {
//   if (!images[partKey]?.original) {
//     Alert.alert("No Image", "Please upload an image first.");
//     return;
//   }

//   try {
//     setAnalyzing(true);

//     const analysis = await analyzeInspection(images[partKey].original);

//     if (analysis) {
//       const updated = {
//         ...images,
//         [partKey]: {
//           ...images[partKey],
//           analyzed: analysis.analysedImageKey,
//           damages: analysis.damages || [],
//         },
//       };

//       saveImagesToRedux(updated);
//     }
//   } catch (err) {
//     console.error("❌ Analysis error:", err);
//     Alert.alert("Error", "Failed to analyze image. Please try again.");
//   } finally {
//     setAnalyzing(false);
//   }
// };

// ✅ Analyze uploaded image
const analyzeInspection = async (key) => {
  try {
    console.log("🔑 Passing key to analyze:", key);

    const analyzeResp = await axios.post(
      `${API_BASE_URL}/inspections/analyze`,
      { key },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      }
    );

    console.log("🔍 Analyze Response:", analyzeResp.data);

    // ✅ Return full response
    return analyzeResp.data;
  } catch (err) {
    console.error("❌ Analyze error:", err);
    Alert.alert("Error", "Image analysis failed");
    return null;
  }
};

export const handleAnalyzeImage = async ({
  partKey,
  images,
  saveImagesToRedux,
  setAnalyzing,
}) => {
  if (!images[partKey]?.original) {
    Alert.alert("No Image", "Please upload an image first.");
    return;
  }

  try {
    setAnalyzing(true);

    const analysis = await analyzeInspection(images[partKey].original);

    if (analysis) {
      // ✅ Store both key and URL in Redux
      const updated = {
        ...images,
        [partKey]: {
          ...images[partKey],
          analyzed: analysis.analysedImageKey,
          analyzedUrl: analysis.analysedImageUrl, // ✅ Add URL for frontend display
          damages: analysis.damages || [],
        },
      };

      saveImagesToRedux(updated);

      Alert.alert(
        "Analysis Complete",
        analysis.damages?.length
          ? `Detected damages: ${analysis.damages
              .map((d) => d.type)
              .join(", ")}`
          : "No damages found!"
      );
    }
  } catch (err) {
    console.error("❌ Analysis error:", err);
    Alert.alert("Error", "Failed to analyze image. Please try again.");
  } finally {
    setAnalyzing(false);
  }
};
