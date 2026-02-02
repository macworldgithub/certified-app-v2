import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import AppIcon from "../components/AppIcon";
import API_BASE_URL from "../../utils/config";

export default function ViewInspection() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/inspections/${id}`);
        const json = await res.json();
        setInspection(json);
      } catch (err) {
        console.error("Error fetching inspection:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInspection();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaWrapper>
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      {/* 🔙 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AppIcon name="arrow-left" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inspection Details</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* 🚘 Vehicle Summary */}
        <View style={styles.card}>
          <Text style={styles.title}>
            {inspection.make} {inspection.carModel}
          </Text>
          <Text style={styles.subTitle}>VIN: {inspection.vin}</Text>

          <View style={styles.row}>
            <Info label = "Year" value={inspection.year} />
            <Info label="Mileage" value={`${inspection.mileAge} km`} />
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Rating: {inspection.overallRating || "N/A"}
            </Text>
          </View>
        </View>

        {/* 📄 Registration */}
        <Section title="Registration">
          <Info label="Plate" value={inspection.registrationPlate} />
          <Info label="Expiry" value={inspection.registrationExpiry} />
          <Info label="Build Date" value={inspection.buildDate} />
          <Info label="Compliance Date" value={inspection.complianceDate} />
        </Section>

        {/* ⚙️ Technical */}
        <Section title="Technical Details">
          <Info label="Fuel Type" value={inspection.fuelType} />
          <Info label="Transmission" value={inspection.transmission} />
          <Info label="Drive Train" value={inspection.driveTrain} />
          <Info label="Body Type" value={inspection.bodyType} />
          <Info label="Color" value={inspection.color} />
          <Info label="Engine No." value={inspection.engineNumber} />
        </Section>

        {/* 🛞 Tyres */}
        <Section title="Tyre Condition">
          <Info label="Front Left" value={inspection.tyreConditionFrontLeft} />
          <Info label="Front Right" value={inspection.tyreConditionFrontRight} />
          <Info label="Rear Left" value={inspection.tyreConditionRearLeft} />
          <Info label="Rear Right" value={inspection.tyreConditionRearRight} />
        </Section>

        {/* 🧰 Service History */}
        <Section title="Service History">
          <Info label="Service Book" value={inspection.serviceBookPresent} />
          <Info label="History Available" value={inspection.serviceHistoryPresent} />
          <Info label="Last Service" value={inspection.lastServiceDate} />
          <Info label="Service Center" value={inspection.serviceCenterName} />
          <Info label="Odometer at Service" value={inspection.odometerAtLastService} />
        </Section>

        {/* 📝 Comments */}
        <Section title="Inspector Notes">
          <Text style={styles.comment}>
            {inspection.generalComments || "No comments"}
          </Text>
        </Section>

        {/* 📅 Meta */}
        <Text style={styles.meta}>
          Inspected on {new Date(inspection.createdAt).toLocaleString()}
        </Text>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

/* 🔹 Reusable Components */
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Info = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || "—"}</Text>
  </View>
);

/* 🎨 Styles */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#f8fafc",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  subTitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748b",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  badge: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: "#166534",
    fontWeight: "600",
    fontSize: 13,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: "#64748b",
  },
  value: {
    fontSize: 13,
    color: "#0f172a",
    fontWeight: "500",
  },
  comment: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
  },
  meta: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
    color: "#94a3b8",
  },
});
