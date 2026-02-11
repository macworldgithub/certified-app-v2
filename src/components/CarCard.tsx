import React, { memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";

type CarCardProps = {
  id: string;
  vin: string;
  make: string;
  carModel: string;
  year: number | string;
  mileage: number | string;
  inspectorEmail?: string;
  thumbnailUri?: string;
  rating?: number | null;
  onPress?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onRating?: (id: string, vin: string) => void;
  style?: any;
};

const CarCard: React.FC<CarCardProps> = ({
  id,
  vin,
  make,
  carModel,
  year,
  mileage,
  inspectorEmail,
  thumbnailUri,
  rating,
  onPress,
  onDelete,
  onEdit,
  onRating,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress?.(id)}
      style={[styles.container, style]}
      accessibilityRole="button"
      accessibilityLabel={`${make} ${carModel} ${year}`}
    >
      {/* Left Thumbnail */}
      <View style={styles.left}>
        {thumbnailUri ? (
          <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>{make?.[0] || "C"}</Text>
          </View>
        )}
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.title}>
            {make} ({year})
          </Text>
        </View>
        <Text style={styles.sub}>VIN: {vin}</Text>
        {Platform.OS === "android" ? (
          <>
            <Text style={styles.mileage}>Mileage: {mileage} km</Text>
            {inspectorEmail ? (
              <Text style={styles.inspector}>{inspectorEmail}</Text>
            ) : null}
          </>
        ) : (
          <View>
            <Text style={styles.mileage}>Mileage: {mileage} km</Text>
            {inspectorEmail ? (
              <Text style={styles.inspector}>{inspectorEmail}</Text>
            ) : null}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onDelete?.(id)}
            style={[styles.actionBtn, { backgroundColor: "#2f855a" }]}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onEdit?.(id)}
            style={[styles.actionBtn, { backgroundColor: "#2f855a" }]}
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onRating?.(id, vin)}
            style={[styles.actionBtn, { backgroundColor: "#2f855a" }]}
          >
            <Text style={styles.actionText}>Rating</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(CarCard);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  left: { marginRight: 12 },
  thumbnail: { width: 72, height: 56, borderRadius: 6, resizeMode: "cover" },
  placeholder: {
    width: 72,
    height: 56,
    borderRadius: 6,
    backgroundColor: "#eef2f6",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { fontSize: 20, fontWeight: "700", color: "#64748b" },
  body: { flex: 1 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 15, fontWeight: "700", color: "#0f172a" },
  sub: { marginTop: 6, color: "#475569", fontSize: 13 },
  mileage: { fontSize: 13, color: "#0f172a", fontWeight: "600" },
  inspector: { fontSize: 12, color: "#64748b" },
  ratingText: { fontSize: 14, fontWeight: "700", color: "#f59e0b" },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
});
