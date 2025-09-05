import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const inspectionsSummary = [
  { label: 'Inspection', value: 247 },
  { label: 'Accuracy', value: '92%' },
  { label: 'Avg score', value: 8.4 },
];

const quickActions = [
  { title: 'New Inspection', subtitle: 'Start AI-powered walkround', icon: 'camera' },
  { title: 'View Reports', subtitle: 'Access inspection reports', icon: 'file-alt' },
  { title: 'Transport', subtitle: 'Coordinate vehicle movement', icon: 'truck' },
];

const recentInspections = [
  { car: '2020 Toyota Camry', date: '2024-01-15', status: 'Completed', score: '8.5/10' },
  { car: '2021 Honda Civic', date: '2024-01-14', status: 'In Progress', score: null },
  { car: '2022 BMW X5', date: '2024-01-13', status: 'In Progress', score: null },
];

export default function Home() {
  const navigation = useNavigation();

  return (
    <ScrollView
      style={tw`flex-1 bg-white pt-10 px-2`}
      contentContainerStyle={tw`pb-20 px-4`}
      showsVerticalScrollIndicator={true}
    >
      {/* Header */}
      <View style={tw`flex-row justify-between items-center`}>
        <View>
          <Text style={tw`text-lg font-bold text-green-800`}>Certified Inspect</Text>
          <Text style={tw`text-gray-500`}>AI-Powered Vehicle Inspections</Text>
        </View>
        <TouchableOpacity>
          <FontAwesome5 name="user-circle" size={24} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={tw`flex-row justify-between mt-4`}>
        {inspectionsSummary.map((item, index) => (
          <View
            key={index}
            style={tw`items-center border border-gray-300 rounded-lg p-3 flex-1 mx-1`}
          >
            <Text style={tw`text-xl font-bold text-blue-600`}>{item.value}</Text>
            <Text style={tw`text-gray-500`}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={tw`text-green-800 font-bold text-lg mt-6`}>Quick Actions</Text>
      {quickActions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={tw`flex-row items-center bg-white p-4 mt-2 rounded-xl shadow`}
          onPress={() => {
            if (action.title === 'New Inspection') navigation.navigate('Inspection');
            if (action.title === 'View Reports') navigation.navigate('VehicleReport');
            if (action.title === 'Transport') navigation.navigate('TransportActive');
          }}
        >
          <FontAwesome5 name={action.icon} size={24} color="#FFC302" />
          <View style={tw`ml-4`}>
            <Text style={tw`font-semibold text-green-500`}>{action.title}</Text>
            <Text style={tw`text-gray-500`}>{action.subtitle}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Recent Inspections */}
      <Text style={tw`text-green-800 font-bold text-lg mt-6`}>Recent Inspections</Text>
      {recentInspections.map((inspection, index) => (
        <View key={index} style={tw`bg-white p-4 mt-3 rounded-xl shadow`}>
          <View style={tw`flex-row justify-between`}>
            <View>
              <Text style={tw`font-semibold`}>{inspection.car}</Text>
              <Text style={tw`text-gray-500`}>{inspection.date}</Text>
            </View>
            <View style={tw`items-end`}>
              <Text
                style={[
                  tw`text-xs font-bold px-2 py-1 rounded-full`,
                  inspection.status === 'Completed'
                    ? tw`bg-green-100 text-green-700`
                    : tw`bg-yellow-100 text-yellow-700`,
                ]}
              >
                {inspection.status}
              </Text>
              {inspection.score && (
                <Text style={tw`text-xs text-gray-500 mt-1`}>Score: {inspection.score}</Text>
              )}
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
