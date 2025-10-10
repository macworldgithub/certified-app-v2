// InspectionList.tsx
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import debounce from "lodash.debounce";
import CarCard from "../components/CarCard";
import { useDispatch } from "react-redux";
import { setInspection } from "../redux/slices/inspectionSlice";
import SafeAreaWrapper from "../components/SafeAreaWrapper";

type CarItem = {
  _id: string;
  vin: string;
  make: string;
  carModel: string;
  year: string;
  mileAge: number;
  inspectorEmail: string;
  overallRating: number;
  createdAt: string;
};

export default function InspectionList() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<CarItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedVin, setSelectedVin] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const email = "muhammadanasrashid18@gmail.com";
  const limit = 10;

  // API call
  const fetchInspections = async (
    search?: string,
    pageNumber: number = 1,
    append: boolean = false
  ) => {
    try {
      if (pageNumber === 1 && !append) setLoading(true);
      if (pageNumber > 1) setLoadingMore(true);

      let url = `https://apiv2.certifiedinspect.com.au/inspections?email=${encodeURIComponent(
        email
      )}&sortBy=createdAt&sortOrder=desc&page=${pageNumber}&limit=${limit}`;

      if (search && search.trim().length > 0) {
        url += `&q=${encodeURIComponent(search)}`;
      }

      const res = await fetch(url, {
        headers: { accept: "application/json" },
      });

      const json = await res.json();
      const items = json.items || [];

      setData((prev) => (append ? [...prev, ...items] : items));
      setHasMore(pageNumber < json.pages);
    } catch (err) {
      console.error("Error fetching inspections:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchInspections(query, 1, false);
  }, []);

  // Debounced search
  const debouncedFetch = useCallback(
    debounce((text: string) => {
      setPage(1);
      fetchInspections(text, 1, false);
    }, 500),
    []
  );

  const handleChange = (text: string) => {
    setQuery(text);
    debouncedFetch(text);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchInspections(query, nextPage, true);
    }
  };

  // InspectionList.tsx
  
  // const handleEdit = async (id: string) => {
  //   try {
  //     const res = await fetch(
  //       `https://apiv2.certifiedinspect.com.au/inspections/${id}`,
  //       { headers: { accept: "application/json" } }
  //     );
  //     const inspection = await res.json();

  //     dispatch(setInspection(inspection)); // store in redux

  //     navigation.navigate("InspectionDetails" as never);
  //   } catch (err) {
  //     console.error("Error fetching inspection:", err);
  //   }
  // };

  const handleEdit = (vin) => {
    console.log("Pressed VIN:", vin);
    (navigation as any).navigate("EditInspectionScreen", { vin });
  };

  const handleDelete = async () => {
    if (!selectedVin) return;

    try {
      const res = await fetch(
        `https://apiv2.certifiedinspect.com.au/inspections/${selectedVin}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
          },
        }
      );

      const json = await res.json();
      console.log("Delete response:", json);

      // Remove deleted inspection from list
      setData((prev) => prev.filter((item) => item.vin !== selectedVin));

      alert(json.message || "Inspection deleted successfully!");
    } catch (err) {
      console.error("Error deleting inspection:", err);
      alert("Failed to delete inspection. Please try again.");
    } finally {
      setShowConfirmModal(false);
      setSelectedVin(null);
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Inspection List</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate("InspectionDetails" as never)}
          >
            <Text style={styles.addBtnText}>+ Inspection</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TextInput
          placeholder="Search by VIN, make, model..."
          style={styles.search}
          value={query}
          onChangeText={handleChange}
        />

        {/* List */}
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CarCard
                id={item._id}
                vin={item.vin}
                make={item.make}
                carModel={item.carModel}
                year={item.year}
                mileage={item.mileAge}
                inspectorEmail={item.inspectorEmail}
                onPress={(id) => console.log("Pressed", id)}
                onDelete={() => {
                  setSelectedVin(item.vin);
                  setShowConfirmModal(true);
                }}
                // onEdit={(id) => navigation.navigate("EditInspection", { id })}
                // onEdit={(id) => handleEdit(id)}
                onEdit={(vin) => handleEdit(vin)}
                onRating={(id) => console.log("Rating", id)}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.noData}>
                {query.length > 0
                  ? "No results found"
                  : "No inspections available"}
              </Text>
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator
                  size="small"
                  style={{ marginVertical: 16 }}
                />
              ) : null
            }
          />
        )}
        {/* 🔹 Confirmation Modal */}
        {showConfirmModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>
                Are you sure you want to delete this inspection?
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={() => {
                    setShowConfirmModal(false);
                    setSelectedVin(null);
                  }}
                >
                  <Text style={styles.cancelText}>No</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, styles.confirmBtn]}
                  onPress={handleDelete}
                >
                  <Text style={styles.confirmText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  addBtn: {
    backgroundColor: "#2f855a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: { color: "#fff", fontWeight: "600" },
  search: {
    backgroundColor: "#fff",
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  noData: {
    marginTop: 20,
    textAlign: "center",
    color: "#64748b",
  },

  // 🔹 Modal styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelBtn: {
    backgroundColor: "#e2e8f0",
  },
  confirmBtn: {
    backgroundColor: "#dc2626",
  },
  cancelText: {
    color: "#0f172a",
    fontWeight: "600",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});
