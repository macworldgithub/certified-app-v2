import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import tw from "tailwind-react-native-classnames";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function TransportCompleted({ navigation }) {
    const [activeTab, setActiveTab] = useState("Completed");

    return (
        <ScrollView
            style={tw`flex-1 bg-white pt-10`}
            contentContainerStyle={tw`pb-20 px-2`}
            showsVerticalScrollIndicator={true}
        >
            {/* Header */}
            <View style={tw`flex-row justify-between items-center px-5 py-3`}>
                <Text style={tw`text-green-700 text-lg font-bold`}>
                    Vehicles Transport
                </Text>
                <TouchableOpacity>
                    <FontAwesome5 name="user-circle" size={24} color="#9ca3af" />
                </TouchableOpacity>
            </View>

            {/* New Booking Button */}
            <TouchableOpacity
                style={tw`bg-green-700 py-3 mx-5 rounded-lg mb-3`}
                onPress={() => navigation.navigate("NewBooking")}
            >
                <Text style={tw`text-white text-center font-bold`}>
                    +New Booking
                </Text>
            </TouchableOpacity>

            {/* Tabs */}
            <View style={tw`flex-row border-b border-gray-200 px-5`}>
                <TouchableOpacity
                    style={tw`flex-1 py-2`}
                    onPress={() => navigation.navigate("TransportActive")}
                >
                    <Text style={tw`text-center text-gray-500`}>Active(2)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={tw`flex-1 py-2`}
                    onPress={() => setActiveTab("Completed")}
                >
                    <Text
                        style={tw`text-center ${
                            activeTab === "Completed"
                                ? "text-green-700 font-bold border-b-2 border-green-700 pb-1"
                                : "text-gray-500"
                        }`}
                    >
                        Completed(1)
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Booking Cards */}
            <ScrollView style={tw`bg-gray-100 p-5`}>
                <View style={tw`bg-white rounded-lg shadow p-5 mb-5`}>
                    {/* Title Row */}
                    <View style={tw`flex-row justify-between items-center`}>
                        <View>
                            <Text style={tw`text-green-700 font-bold text-base`}>
                                2020 Toyota Camry
                            </Text>
                            <Text style={tw`text-gray-500 text-xs`}>ID: T001</Text>
                        </View>
                        <Text style={tw`bg-green-500 text-white px-3 py-1 rounded text-xs`}>
                            Complete
                        </Text>
                    </View>

                    {/* Locations */}
                    <View style={tw`mt-4`}>
                        <View style={tw`flex-row items-center mb-2`}>
                            <Ionicons name="location-sharp" size={16} color="green" />
                            <Text style={tw`ml-2 text-gray-700`}>Sydney, NSW</Text>
                        </View>
                        <View style={tw`flex-row items-center`}>
                            <Ionicons name="location-sharp" size={16} color="black" />
                            <Text style={tw`ml-2 text-gray-700`}>Melbourne, VIC</Text>
                        </View>
                    </View>
                    <View style={tw`border-t border-gray-200 my-3`} />

                    {/* Driver Info */}
                    <View style={tw`flex-row justify-between items-center mt-4`}>
                        <View style={tw`flex-row items-center`}>
                            <Text style={tw`ml-2 text-gray-500 text-xs`}>
                                Driver: James Wilson
                            </Text>
                        </View>
                        <View style={tw`flex-row items-center`}>
                            <MaterialIcons name="access-time" size={16} color="gray" />
                            <Text style={tw`ml-2 text-gray-500 text-xs`}>
                                ETA: 2024-01-16
                            </Text>
                        </View>
                    </View>
                    <View style={tw`flex-row mt-2`}>
                        <Ionicons name="call" size={16} color="green" />
                        <Text style={tw`ml-2 text-green-600`}>+61 400 123 456</Text>
                    </View>

                    {/* Divider */}
                    <View style={tw`border-t border-gray-200 my-4`} />

                    {/* Tracking Updates */}
                    <Text style={tw`font-bold text-gray-700 mb-3`}>
                        Tracking Updates
                    </Text>
                    <View>
                        <Text style={tw`text-green-600`}>● Departed Sydney - 09:00</Text>
                        <Text style={tw`text-green-600`}>● Goulburn Rest Stop - 12:30</Text>
                        <Text style={tw`text-blue-500`}>● Albury Checkpoint - 16:45</Text>
                        <Text style={tw`text-green-600`}>● Melbourne Delivery - 16:45</Text>
                    </View>
                </View>
            </ScrollView>
        </ScrollView>
    );
}
