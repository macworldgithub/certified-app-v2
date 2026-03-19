import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  TextInput,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useSelector, useDispatch } from "react-redux";
import AppIcon from "../components/AppIcon";
import SafeAreaWrapper from "../components/SafeAreaWrapper";

import {
  resetInspection,
  setInspectionData,
} from "../redux/slices/inspectionSlice";
import API_BASE_URL from "../../utils/config";
import SignedImage from "../components/SignedImage";

export default function ReviewInspection({ navigation }) {
  const dispatch = useDispatch();
  const [editingField, setEditingField] = useState(null);
  const inspection = useSelector((state) => state.inspection);
  console.log(inspection, "INSPECTION...");
  const { images } = inspection;
  console.log(images, "IMAGES...");
  const {
    _id,
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
    frontLeftWheelCondition,
    frontRightWheelCondition,
    rearLeftWheelCondition,
    rearRightWheelCondition,
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
    if (d.includes("-")) return d; // already in ISO format

    const parts = d.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    } else if (parts.length === 2) {
      const [month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-01`;
    }
    return undefined;
  }

  const handleSubmit = async () => {
    try {
      const safeEngineNumber = (
        inspection.engineNumber || "NOT_SET_" + Date.now().toString().slice(-6)
      ).trim();

      const safeMileAge = Number(mileAge) || 0;
      const safeOdometer = odometer ? Number(odometer) : undefined;

      const safeDamagePresent =
        damagePresent === true ||
        damagePresent === "Yes" ||
        damagePresent === "true";

      const safeRoadTest =
        roadTest === true || roadTest === "Yes" || roadTest === "true";

      const safeBookImages = (inspection.bookImages || [])
        .map((img) => {
          if (typeof img === "string") return img;
          if (img?.key) return img.key;
          return null;
        })
        .filter(Boolean);

      // ✅ ALL IMAGE KEYS (single source of truth)
      const IMAGE_KEYS = [
        "frontImage",
        "LHFImage",
        "leftImage",
        "LHRImage",
        "rearImage",
        "RHRImage",
        "rightImage",
        "RHFImage",
        "RoofImage",
        "UnderbonnetImage",
        "InsideBonnetImage",
        "DriversSeatImage",
        "FrontPassengerSeatImage",
        "RearSeatImage",
        "compliancePlateImage",
        "OdoImage",
        "InfotainmentImage",
        "KeysImage",
      ];

      // ✅ Build images dynamically
      const imagePayload = {};

      IMAGE_KEYS.forEach((key) => {
        imagePayload[key] = prepareImageAnalysis(images?.[key]) || {
          original: "",
          damages: [],
        };
      });

      const payload = {
        vin: vin?.trim() || "",
        make: make?.trim() || "",
        carModel: model?.trim() || "",
        year: year?.trim() || "",
        engineNumber: safeEngineNumber,

        mileAge: safeMileAge,

        registrationPlate: registrationPlate?.trim() || "",
        registrationExpiry: toIsoDate(registrationExpiry),
        buildDate: toIsoDate(buildDate),
        complianceDate: toIsoDate(complianceDate),

        inspectorEmail:
          inspection.inspectorEmail || "muhammadanasrashid18@gmail.com",

        // ✅ THIS IS THE MAIN FIX
        ...imagePayload,

        odometer: safeOdometer,

        odometerImage:
          images?.OdoImage?.original || images?.odometerImage || "",

        fuelType: fuelType?.trim() || "",
        driveTrain: driveTrain?.trim() || "",
        transmission: transmission?.trim() || "",
        bodyType: bodyType?.trim() || "",
        color: color?.trim() || "",

        frontWheelDiameter: frontWheelDiameter?.trim() || "",
        rearWheelDiameter: rearWheelDiameter?.trim() || "",
        keysPresent: keysPresent?.trim() || "1",

        serviceBookPresent:
          serviceBookPresent === "Yes" ||
          serviceBookPresent === true ||
          serviceBookPresent === "true",
        bookImages: safeBookImages,
        serviceHistoryPresent:
          serviceHistoryPresent === "Yes" ||
          serviceHistoryPresent === true ||
          serviceHistoryPresent === "true",
        lastServiceDate: toIsoDate(inspection.lastServiceDate) || "",
        odometerAtLastService: Number(inspection.odometerAtLastService) || 0,
        serviceCenterName: inspection.serviceCenterName?.trim() || "",
        serviceRecordDocumentKey:
          inspection.serviceRecordDocumentKey?.trim() || "",

        // spareWheelCondition: inspection.spareWheelCondition?.trim() || "",

        tyreConditionFrontLeft:
          frontLeftWheelCondition?.trim() ||
          tyreConditionFrontLeft?.trim() ||
          "",
        tyreConditionFrontRight:
          frontRightWheelCondition?.trim() ||
          tyreConditionFrontRight?.trim() ||
          "",
        tyreConditionRearRight:
          rearRightWheelCondition?.trim() ||
          tyreConditionRearRight?.trim() ||
          "",
        tyreConditionRearLeft:
          rearLeftWheelCondition?.trim() || tyreConditionRearLeft?.trim() || "",

        damagePresent: safeDamagePresent,
        roadTest: safeRoadTest,
        roadTestComments: roadTestComments?.trim() || "",
        generalComments: generalComments?.trim() || "",
      };

      const isEdit = !!_id;
      const apiUrl = isEdit
        ? `${API_BASE_URL}/inspections/${_id}`
        : `${API_BASE_URL}/inspections`;
      const apiMethod = isEdit ? "PUT" : "POST";

      console.log("=== API CALL TRIGGERED ===");
      console.log("Method:", apiMethod);
      console.log("Endpoint URL:", apiUrl);
      console.log("Payload VIN:", payload.vin);
      console.log("Is Edit Mode:", isEdit);
      console.log("==========================");

      const response = await fetch(apiUrl, {
        method: apiMethod,
        headers: {
          "Content-Type": "application/json",
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

      await response.json();

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
          : err.message || "Cannot connect to server.",
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

  // Editable text field — dispatches to Redux on change
  const renderEditField = (label, field, value, keyboardType = "default") => {
    const isEditing = editingField === field;
    const [tempValue, setTempValue] = useState(value || "");

    return (
      <View style={tw`py-2 border-b border-gray-100`}>
        <View style={tw`flex-row justify-between items-center mb-1`}>
          <Text style={tw`text-gray-400 text-xs`}>{label}</Text>

          <View style={tw`flex-row items-center`}>
            {!isEditing ? (
              <TouchableOpacity onPress={() => setEditingField(field)}>
                <AppIcon name="edit" size={16} color="#6B7280" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  dispatch(setInspectionData({ field, value: tempValue }));
                  setEditingField(null);
                }}
                style={tw`ml-2`}
              >
                <AppIcon name="check" size={18} color="#059669" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TextInput
          value={isEditing ? tempValue : value || ""}
          editable={isEditing}
          onChangeText={(text) => setTempValue(text)}
          keyboardType={keyboardType}
          placeholder={`Enter ${label}`}
          placeholderTextColor="#9CA3AF"
          style={tw.style(
            "text-base py-1",
            isEditing ? "text-gray-800 font-medium" : "text-gray-500",
          )}
        />
      </View>
    );
  };

  // Toggle field — shows option buttons (e.g. Pass/Fail, Yes/No)
  const renderToggleField = (
    label,
    field,
    value,
    options = ["Pass", "Fail"],
  ) => {
    const isEditing = editingField === field;
    const [tempValue, setTempValue] = useState(value);

    return (
      <View style={tw`py-2.5 border-b border-gray-100`}>
        <View style={tw`flex-row justify-between items-center mb-2`}>
          <Text style={tw`text-gray-400 text-xs`}>{label}</Text>

          <View style={tw`flex-row items-center`}>
            {!isEditing ? (
              <TouchableOpacity onPress={() => setEditingField(field)}>
                <AppIcon name="edit" size={16} color="#6B7280" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  dispatch(setInspectionData({ field, value: tempValue }));
                  setEditingField(null);
                }}
                style={tw`ml-2`}
              >
                <AppIcon name="check" size={18} color="#059669" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={tw`flex-row flex-wrap`}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              disabled={!isEditing}
              onPress={() => setTempValue(opt)}
              style={tw.style(
                "mr-2 px-4 py-1.5 rounded-full border",
                tempValue === opt
                  ? "bg-green-700 border-green-700"
                  : "bg-white border-gray-300",
                !isEditing && "opacity-50",
              )}
            >
              <Text
                style={tw.style(
                  "text-sm font-medium",
                  tempValue === opt ? "text-white" : "text-gray-600",
                )}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const IMAGE_FIELDS = [
    { key: "frontImage", label: "Front Image" },
    { key: "LHFImage", label: "LHF Image" },
    { key: "leftImage", label: "Left Side Image" },
    { key: "LHRImage", label: "LHR Image" },
    { key: "rearImage", label: "Rear Image" },
    { key: "RHRImage", label: "RHR Image" },
    { key: "RightImage", label: "Right Side Image" },
    { key: "RHFImage", label: "RHF Image" },
    { key: "RoofImage", label: "Roof Image" },
    { key: "UnderbonnetImage", label: "Under Bonnet Image" },
    { key: "InsideBonnetImage", label: "Inside Bonnet Image" },
    { key: "DriversSeatImage", label: "Driver Seat Image" },
    { key: "FrontPassengerSeatImage", label: "Front Passenger Seat Image" },
    { key: "RearSeatImage", label: "Rear Seat Image" },
    { key: "compliancePlateImage", label: "Compliance Plate" },
    { key: "OdoImage", label: "Odometer Image" },
    { key: "InfotainmentImage", label: "Infotainment Image" },
    { key: "KeysImage", label: "Keys Image" },
  ];

  const uploadedCount = IMAGE_FIELDS.filter(
    (img) => images?.[img.key]?.original || images?.[img.key],
  ).length;

  const renderImageCard = (label, imageObj) => {
    const s3Key =
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
              s3Key ? "bg-green-100" : "bg-red-100",
            )}
          >
            <Text
              style={tw.style(
                "text-xs font-semibold",
                s3Key ? "text-green-700" : "text-red-700",
              )}
            >
              {s3Key ? "Uploaded" : "Missing"}
            </Text>
          </View>
        </View>

        {s3Key ? (
          <SignedImage
            s3Key={s3Key}
            style={tw`w-full h-44 mt-0 rounded-none`}
            resizeMode="cover"
          />
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
              {renderEditField("VIN", "vin", vin)}
              {renderEditField("Make", "make", make)}
              {renderEditField("Model", "model", model)}
              {renderEditField("Year", "year", year)}
              {renderEditField(
                "Registration Plate",
                "registrationPlate",
                registrationPlate,
              )}
              {renderEditField(
                "Registration Expiry",
                "registrationExpiry",
                registrationExpiry,
              )}
              {renderEditField("Build Date", "buildDate", buildDate)}
              {renderEditField(
                "Compliance Date",
                "complianceDate",
                complianceDate,
              )}
            </>,
          )}

          {/* BASIC DETAILS */}
          {renderSection(
            "Basic Details",
            <>
              {renderEditField(
                "Odometer Reading",
                "mileAge",
                odometer || mileAge,
                "numeric",
              )}
              {renderToggleField("Fuel Type", "fuelType", fuelType, [
                "Petrol",
                "Diesel",
                "Electric",
                "Hybrid",
              ])}
              {renderToggleField("Drive Train", "driveTrain", driveTrain, [
                "FWD",
                "RWD",
                "AWD",
                "4WD",
              ])}
              {renderToggleField("Transmission", "transmission", transmission, [
                "Automatic",
                "Manual",
              ])}
              {renderEditField("Body Type", "bodyType", bodyType)}
              {renderEditField("Color", "color", color)}
            </>,
          )}

          {/* WHEELS & KEYS */}
          {renderSection(
            "Wheels & Keys",
            <>
              {renderEditField(
                "Front Wheel Diameter",
                "frontWheelDiameter",
                frontWheelDiameter,
              )}
              {renderEditField(
                "Rear Wheel Diameter",
                "rearWheelDiameter",
                rearWheelDiameter,
              )}
              {renderToggleField("Keys Present", "keysPresent", keysPresent, [
                "1",
                "2",
                "3",
              ])}
            </>,
          )}

          {/* TYRE CONDITION */}
          {/* {renderSection(
            "Tyre Condition",
            <>
              {renderToggleField(
                "Front Left",
                "tyreConditionFrontLeft",
                tyreConditionFrontLeft,
              )}
              {renderToggleField(
                "Front Right",
                "tyreConditionFrontRight",
                tyreConditionFrontRight,
              )}
              {renderToggleField(
                "Rear Right",
                "tyreConditionRearRight",
                tyreConditionRearRight,
              )}
              {renderToggleField(
                "Rear Left",
                "tyreConditionRearLeft",
                tyreConditionRearLeft,
              )}
            </>,
          )} */}

          {/* WHEEL CONDITION */}
          {renderSection(
            "Wheel Condition",
            <>
              {renderToggleField(
                "Front Left",
                "frontLeftWheelCondition",
                frontLeftWheelCondition,
              )}
              {renderToggleField(
                "Front Right",
                "frontRightWheelCondition",
                frontRightWheelCondition,
              )}
              {renderToggleField(
                "Rear Right",
                "rearRightWheelCondition",
                rearRightWheelCondition,
              )}
              {renderToggleField(
                "Rear Left",
                "rearLeftWheelCondition",
                rearLeftWheelCondition,
              )}
            </>,
          )}

          {/* SERVICE DOCUMENTS */}
          {renderSection(
            "Service Documents",
            <>
              {renderToggleField(
                "Service Book Present",
                "serviceBookPresent",
                serviceBookPresent,
                ["Yes", "No"],
              )}
              {renderToggleField(
                "Service History Present",
                "serviceHistoryPresent",
                serviceHistoryPresent,
                ["Yes", "No"],
              )}
            </>,
          )}

          {/* DAMAGE & ROAD TEST */}
          {renderSection(
            "Damage & Road Test",
            <>
              {renderToggleField(
                "Damage Present",
                "damagePresent",
                damagePresent,
                ["Yes", "No"],
              )}
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
              {renderToggleField("Road Test", "roadTest", roadTest, [
                "Yes",
                "No",
              ])}
              {roadTest === "Yes" &&
                renderEditField(
                  "Road Test Comments",
                  "roadTestComments",
                  roadTestComments,
                )}
            </>,
          )}

          {/* GENERAL COMMENTS */}
          {renderSection(
            "General Comments",
            renderEditField("Comments", "generalComments", generalComments),
          )}

          {/* IMAGES REVIEW */}
          {renderSection(
            "Images",
            <>
              <View style={tw`mb-3`}>
                <Text style={tw`text-gray-700 font-semibold`}>
                  Uploaded Images: {uploadedCount} / {IMAGE_FIELDS.length}
                </Text>
              </View>

              {IMAGE_FIELDS.map((img) => {
                let imageObj = images?.[img.key];
                if (!imageObj && img.key === "OdoImage") {
                  imageObj = inspection?.odometerImage;
                }
                if (!imageObj && img.key === "compliancePlateImage") {
                  imageObj = images?.VINPlate;
                }
                return renderImageCard(img.label, imageObj);
              })}
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
              {inspection._id ? "Save Changes" : "Submit For Approval"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaWrapper>
  );
}
