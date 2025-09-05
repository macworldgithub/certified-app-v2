import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import tw from "tailwind-react-native-classnames";

export default function NewBooking() {
  const [vehicleId, setVehicleId] = useState("");
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [date, setDate] = useState("");
  const [instruction, setInstruction] = useState("");

  return (
   <ScrollView
            style={tw`flex-1 bg-white pt-10 px-4`}
            contentContainerStyle={tw`pb-20`}
            showsVerticalScrollIndicator={true}
        > 
      <Text style={tw`text-green-700 text-lg font-bold text-center mb-4`}>
        New Transport Booking
      </Text>
      <View style={tw`border-b border-gray-300 mb-4`} />

      {/* Vehicle ID */}
      <Text style={tw`font-bold mb-1`}>Vehicle ID / Inspection Report</Text>
      <TextInput
        value={vehicleId}
        onChangeText={setVehicleId}
        placeholder="Enter vehicle ID or select report"
        style={tw`border border-gray-300 rounded-md p-3 mb-4`}
      />

      {/* Pick Location */}
      <Text style={tw`font-bold mb-1`}>Pick Location *</Text>
      <TextInput
        value={pickup}
        onChangeText={setPickup}
        placeholder="Enter pickup address"
        style={tw`border border-gray-300 rounded-md p-3 mb-4`}
      />

      {/* Delivery Location */}
      <Text style={tw`font-bold mb-1`}>Enter Delivery Location *</Text>
      <TextInput
        value={delivery}
        onChangeText={setDelivery}
        placeholder="Enter delivery address"
        style={tw`border border-gray-300 rounded-md p-3 mb-4`}
      />

      {/* Delivered Date */}
      <Text style={tw`font-bold mb-1`}>Delivered Date</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
        style={tw`border border-gray-300 rounded-md p-3 mb-4`}
      />

      {/* Special Instruction */}
      <Text style={tw`font-bold mb-1`}>Special Instruction</Text>
      <TextInput
        value={instruction}
        onChangeText={setInstruction}
        placeholder="Any special handling requirements....."
        style={tw`border border-gray-300 rounded-md p-3 h-24 mb-6`}
        multiline
      />

      {/* Submit Button */}
      <TouchableOpacity style={tw`bg-green-600 p-4 rounded-md`}>
        <Text style={tw`text-white text-center font-semibold`}>
          Submit Booking Request
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
