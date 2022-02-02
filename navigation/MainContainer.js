import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
// Screens
import HomeScreen from "./screens/HomeScreen";
import RecordListscreen from "./screens/RecordListScreen";
import RecordingScreen from "./screens/RecordingScreen";

// Screen names
const homeName = "Home";
const recordListName = "RecordList";
const recordName = "Recording";

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
              } else if (rn === recordListName) {
                iconName = focused ? "settings" : "settings-outline";
              } else if (rn === recordName) {
                iconName = focused ? "record" : "record-outline";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "grey",
            tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
            tabBarStyle: { padding: 10, height: 70 },
            tabBarHideOnKeyboard: true,
          })}
        >
          <Tab.Screen name={homeName} component={HomeScreen} />
          <Tab.Screen name={recordListName} component={RecordListscreen} />
          <Tab.Screen name={recordName} component={RecordingScreen} />
        </Tab.Navigator>
      </NavigationContainer>
  );
}
