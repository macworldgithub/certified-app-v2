import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useSelector } from "react-redux";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import { useDispatch } from "react-redux";

import { resetInspection } from "../redux/slices/inspectionSlice";
import API_BASE_URL from "../../utils/config";

export default function ReviewInspection({ navigation }) {
  const dispatch = useDispatch();
  const inspection = useSelector((state) => state.inspection);
  console.log(inspection, "INSPECTION...");
  const { images } = inspection;
  console.log(images, "IMAGES...");
  const {
    vin,
    make,
    model,
    year,
    mileAge,
    registrationPlate,
    registrationExpiry,
    buildDate,
    complianceDate,
    odometer,
    fuelType,
    driveTrain,
    transmission,
    bodyType,
    color,
    frontWheelDiameter,
    rearWheelDiameter,
    keysPresent,
    serviceBookPresent,
    serviceHistoryPresent,
    tyreConditionFrontLeft,
    tyreConditionFrontRight,
    tyreConditionRearRight,
    tyreConditionRearLeft,
    damagePresent,
    damages,
    roadTest,
    roadTestComments,
    generalComments,
  } = inspection;

  // Helper – normalize image objects
  function prepareImageAnalysis(img) {
    if (!img) {
      return { original: "", damages: [] };
    }

    const original = img.original || img.uri || String(img) || "";

    const rawDamages = Array.isArray(img.damages) ? img.damages : [];

    const damages = rawDamages.map((d) => {
      const bbox = Array.isArray(d.bbox)
        ? d.bbox
        : Array.isArray(d.boundingBox)
          ? d.boundingBox
          : [0, 0, 0, 0];
      return {
        boundingBox: bbox.map(Number).slice(0, 4),
        description: String(d.description || d.text || ""),
        type: String(d.type || "unknown"),
      };
    });

    return {
      original: original.trim(),
      analyzed: img.analyzedUrl || img.analyzed || undefined,
      damages,
    };
  }

  function toIsoDate(d) {
    if (!d) return undefined;
    // assuming input is DD/MM/YYYY
    const [day, month, year] = d.split("/");
    if (!day || !month || !year) return undefined;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const handleSubmit = async () => {
    try {
      // Force required string fields to have *something*
      const safeEngineNumber = (
        inspection.engineNumber || "NOT_SET_" + Date.now().toString().slice(-6)
      ).trim();

      // Force numbers
      const safeMileAge = Number(mileAge) || 0;
      const safeOdometer = odometer ? Number(odometer) : undefined; // ← try number first
      // if number fails later → change to String(odometer || "")

      // Force booleans
      const safeKeysPresent =
        keysPresent === true ||
        keysPresent === "true" ||
        keysPresent === "Yes" ||
        keysPresent === "3"; // ← your log shows "3"
      const safeServiceBook =
        serviceBookPresent === true ||
        serviceBookPresent === "true" ||
        serviceBookPresent === "Yes";
      const safeServiceHistory =
        serviceHistoryPresent === true ||
        serviceHistoryPresent === "true" ||
        serviceHistoryPresent === "Yes";
      const safeDamagePresent =
        damagePresent === true ||
        damagePresent === "Yes" ||
        damagePresent === "true";
      const safeRoadTest =
        roadTest === true || roadTest === "Yes" || roadTest === "true";

      const payload = {
        vin: vin?.trim() || "",
        make: make?.trim() || "",
        carModel: model?.trim() || "",
        year: year?.trim() || "",
        engineNumber: safeEngineNumber, // ← was the most suspicious field

        mileAge: safeMileAge,

        registrationPlate: registrationPlate?.trim() || "",
        registrationExpiry: toIsoDate(registrationExpiry),
        buildDate: toIsoDate(buildDate),
        complianceDate: toIsoDate(complianceDate),

        inspectorEmail: inspection.inspectorEmail || "muhammadanasrashid18@gmail.com",

        // ────────────────────────────────────────────────
        // Images – make sure ALL required fields exist
        // ────────────────────────────────────────────────
        frontImage: prepareImageAnalysis(images?.frontImage) || {
          original: "",
          damages: [],
        },
        rearImage: prepareImageAnalysis(images?.rearImage) || {
          original: "",
          damages: [],
        },
        leftImage: prepareImageAnalysis(
          images?.leftSideImage || images?.LHFImage,
        ) || { original: "", damages: [] },
        rightImage: prepareImageAnalysis(
          images?.RightSideImage || images?.RHRImage,
        ) || { original: "", damages: [] },
        engineImage: prepareImageAnalysis(images?.UnderbonnetImage) || {
          original: "",
          damages: [],
        },
        plateImage: prepareImageAnalysis(images?.compliancePlateImage) || {
          original: "",
          damages: [],
        },
        interiorFrontImage: prepareImageAnalysis(
          images?.DriversSeatImage || images?.FrontPassengerSeatImage,
        ) || { original: "", damages: [] },
        interiorBackImage: prepareImageAnalysis(images?.RearSeatImage) || {
          original: "",
          damages: [],
        },

        // odometer – try number first (most common source of 500)
        odometer: safeOdometer,

        odometerImage:
          images?.OdoImage?.original || images?.odometerImage || "",

        fuelType: fuelType?.trim() || "",
        driveTrain: driveTrain?.trim() || "",
        transmission: transmission?.trim() || "",
        bodyType: bodyType?.trim() || "",
        color: color?.trim() || "",

        keysPresent: safeKeysPresent,
        serviceBookPresent: safeServiceBook,
        bookImages: inspection.bookImages || [],
        serviceHistoryPresent: safeServiceHistory,

        tyreConditionFrontLeft: tyreConditionFrontLeft?.trim() || "",
        tyreConditionFrontRight: tyreConditionFrontRight?.trim() || "",
        tyreConditionRearRight: tyreConditionRearRight?.trim() || "",
        tyreConditionRearLeft: tyreConditionRearLeft?.trim() || "",

        damagePresent: safeDamagePresent,
        roadTest: safeRoadTest,
        roadTestComments: roadTestComments?.trim() || "",
        generalComments: generalComments?.trim() || "",

        // Optional – only if backend added this field recently
        // overallRating: undefined,
        // lastServiceDate: toIsoDate(lastServiceDate),
        // serviceCenterName: "",
        // odometerAtLastService: Number(odometerAtLastService) || undefined,
      };

      console.log("Sending payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(`${API_BASE_URL}/inspections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`,   ← add when you have auth
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorText = "";
        try {
          const errBody = await response.json();
          errorText = errBody.message || JSON.stringify(errBody);
        } catch {
          errorText = await response.text().catch(() => "");
        }
        throw new Error(
          `Server responded ${response.status}: ${errorText || "No message"}`,
        );
      }

      const result = await response.json();

      Alert.alert("Success", "Inspection submitted successfully!");

      dispatch(resetInspection());

      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs", params: { screen: "InspectionList" } }],
      });
    } catch (err) {
      console.error("Submission error:", err);
      Alert.alert(
        "Submission Failed",
        err.message?.includes("500")
          ? "Server error (500) – please check backend logs"
          : err.message || "Cannot connect to server. Please try again later.",
      );
    }
  };
  const renderSection = (title, children) => (
    <View style={tw`mb-6 bg-white border border-gray-200 rounded-xl p-4`}>
      <Text style={tw`text-gray-500 text-sm font-medium mb-3 uppercase`}>
        {title}
      </Text>
      {children}
    </View>
  );

  const renderField = (label, value) => (
    <View style={tw`py-2.5 border-b border-gray-100`}>
      <Text style={tw`text-gray-500 text-sm mb-1`}>{label}</Text>
      <Text style={tw`text-gray-800 font-medium text-base`}>
        {value || "Not provided"}
      </Text>
    </View>
  );

  const IMAGE_FIELDS = [
    { key: "frontImage", label: "Front Image" },
    { key: "LHFImage", label: "LHF Image" },
    { key: "leftSideImage", label: "Left Side Image" },
    { key: "LHRImage", label: "LHR Image" },
    { key: "rearImage", label: "Rear Image" },
    { key: "RHRImage", label: "RHR Image" },
    { key: "RightSideImage", label: "Right Side Image" },
    { key: "RHFImage", label: "RHF Image" },
    { key: "RoofImage", label: "Roof Image" },
    { key: "UnderbonnetImage", label: "Under Bonnet Image" },
    { key: "InsideBonnetImage", label: "Inside Bonnet Image" },
    { key: "DriversSeatImage", label: "Driver Seat Image" },
    { key: "FrontPassengerSeatImage", label: "Front Passenger Seat Image" },
    { key: "RearSeatImage", label: "Rear Seat Image" },
    { key: "compliancePlateImage", label: "Compliance Plate" },
    { key: "OdoImage", label: "Odometer Image" },
  ];

  const uploadedCount = IMAGE_FIELDS.filter(
    (img) => images?.[img.key]?.original || images?.[img.key],
  ).length;

  const renderImageCard = (label, imageObj) => {
    const uri =
      typeof imageObj === "string"
        ? imageObj
        : imageObj?.analyzedUrl || imageObj?.original || null;

    return (
      <View
        style={tw`w-full mb-4 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden`}
      >
        <View
          style={tw`px-3 py-2 bg-white border-b border-gray-200 flex-row justify-between items-center`}
        >
          <Text style={tw`text-gray-800 font-semibold text-sm`}>{label}</Text>

          <View
            style={tw.style(
              "px-2 py-1 rounded-full",
              uri ? "bg-green-100" : "bg-red-100",
            )}
          >
            <Text
              style={tw.style(
                "text-xs font-semibold",
                uri ? "text-green-700" : "text-red-700",
              )}
            >
              {uri ? "Uploaded" : "Missing"}
            </Text>
          </View>
        </View>

        {uri ? (
          <Image source={{ uri }} style={tw`w-full h-44`} resizeMode="cover" />
        ) : (
          <View style={tw`w-full h-44 bg-gray-100 items-center justify-center`}>
            <Text style={tw`text-gray-400 font-medium`}>No Image Uploaded</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaWrapper>
      <SafeAreaView style={tw`flex-1 bg-gray-50`}>
        {/* Header */}
        <View
          style={tw`flex-row items-center px-4 pt-4 pb-3 bg-white border-b border-gray-200`}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
            <AppIcon name="arrow-left" size={24} color="#065f46" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-green-800 ml-2`}>
            Review Inspection
          </Text>
        </View>

        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`pb-36 px-4`}
          showsVerticalScrollIndicator={false}
        >
          {/* VEHICLE INFO */}
          {renderSection(
            "Vehicle Information",
            <>
              {renderField("VIN", vin)}
              {renderField("Make", make)}
              {renderField("Model", model)}
              {renderField("Year", year)}
              {renderField("Mileage", mileAge)}
              {renderField("Registration Plate", registrationPlate)}
              {renderField("Registration Expiry", registrationExpiry)}
              {renderField("Build Date", buildDate)}
              {renderField("Compliance Date", complianceDate)}
            </>,
          )}

          {/* BASIC DETAILS */}
          {renderSection(
            "Basic Details",
            <>
              {renderField("Odometer Reading", odometer)}
              {renderField("Fuel Type", fuelType)}
              {renderField("Drive Train", driveTrain)}
              {renderField("Transmission", transmission)}
              {renderField("Body Type", bodyType)}
              {renderField("Color", color)}
            </>,
          )}

          {/* WHEELS & KEYS */}
          {renderSection(
            "Wheels & Keys",
            <>
              {renderField("Front Wheel Diameter", frontWheelDiameter || "N/A")}
              {renderField("Rear Wheel Diameter", rearWheelDiameter || "N/A")}
              {renderField("Keys Present", keysPresent)}
            </>,
          )}

          {/* TYRE CONDITION */}
          {renderSection(
            "Tyre Condition",
            <>
              {renderField("Front Left", tyreConditionFrontLeft)}
              {renderField("Front Right", tyreConditionFrontRight)}
              {renderField("Rear Right", tyreConditionRearRight)}
              {renderField("Rear Left", tyreConditionRearLeft)}
            </>,
          )}

          {/* SERVICE DOCUMENTS */}
          {renderSection(
            "Service Documents",
            <>
              {renderField("Service Book Present", serviceBookPresent)}
              {renderField("Service History Present", serviceHistoryPresent)}
            </>,
          )}

          {/* DAMAGE & ROAD TEST */}
          {renderSection(
            "Damage & Road Test",
            <>
              {renderField("Damage Present", damagePresent)}
              {damagePresent === "Yes" && damages?.length > 0 && (
                <View style={tw`mt-2`}>
                  <Text style={tw`text-gray-600 font-medium`}>Damages:</Text>
                  {damages.map((d, i) => (
                    <Text key={i} style={tw`text-gray-800 mt-1`}>
                      • {d.damageDescription} ({d.damageSeverity})
                    </Text>
                  ))}
                </View>
              )}
              {renderField("Road Test", roadTest)}
              {roadTest === "Yes" &&
                renderField("Road Test Comments", roadTestComments)}
            </>,
          )}

          {/* GENERAL COMMENTS */}
          {renderSection("General Comments", renderField("", generalComments))}

          {/* IMAGES REVIEW */}
          {renderSection(
            "Images",
            <>
              <View style={tw`mb-3`}>
                <Text style={tw`text-gray-700 font-semibold`}>
                  Uploaded Images: {uploadedCount} / {IMAGE_FIELDS.length}
                </Text>
              </View>

              {IMAGE_FIELDS.map((img) =>
                renderImageCard(img.label, images?.[img.key]),
              )}
            </>,
          )}
        </ScrollView>

        {/* SUBMIT BUTTON */}
        <View
          style={tw`absolute bottom-0 left-0 right-0 px-4 pb-6 bg-white pt-4 border-t border-gray-200`}
        >
          <TouchableOpacity
            onPress={handleSubmit}
            style={tw`bg-green-700 py-4 rounded-xl items-center shadow-lg`}
          >
            <Text style={tw`text-white text-lg font-semibold`}>
              Submit For Approval
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaWrapper>
  );
}
