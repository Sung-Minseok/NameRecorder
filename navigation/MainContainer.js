import * as React from "react";
import { View, Text } from "react-native-web";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
// Screens
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import RecordScreen from "./screens/RecordScreen";
import Record2 from "./screens/Record2";

// Screen names
const homeName = "Home";
const settingsName = "Settings";
const recordName = "Record";
const record2 = "Record2";

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName={homeName}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let rn;

              if (rn === homeName) {
                iconName = focused ? "home" : "home-outline";
              } else if (rn === settingsName) {
                iconName = focused ? "settings" : "settings-outline";
              } else if (rn === recordName) {
                iconName = focused ? "record" : "record-outline";
              }else if (rn === record2) {
                iconName = focused ? "record" : "record-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "grey",
            tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
            tabBarStyle: { padding: 10, height: 70 },
          })}
        >
          <Tab.Screen name={homeName} component={HomeScreen} />
          <Tab.Screen name={settingsName} component={SettingsScreen} />
          <Tab.Screen name={recordName} component={RecordScreen} />
          <Tab.Screen name={record2} component={Record2} />
        </Tab.Navigator>
      </NavigationContainer>
  );
}
