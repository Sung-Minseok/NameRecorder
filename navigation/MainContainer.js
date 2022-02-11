import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
// Screens
import HomeScreen from "./screens/HomeScreen";
import RecordScreen from "./screens/RecordScreen";
import TabBar from "./TabBar";
import Header from "./Header";
// Colors
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const BACKGROUNDCOLOR = "#F4ECE6";

// Screen names
const homeName = "홈";
const recordName = "녹음";

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
      <NavigationContainer>
        <Tab.Navigator
          tabBar={(props) => <TabBar {...props} />}
          initialRouteName={homeName}
          screenOptions={({ route }) => ({
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: GROUNDCOLOR,
            },
            // tabBarIcon: ({ focused, color, size }) => {
            //   let iconName;
            //   let rn;

            //   if (rn === homeName) {
            //     iconName = focused ? "home" : "home-outline";
            //   } else if (rn === recordName) {
            //     iconName = focused ? "home" : "home-outline";
            //   }
            //   return <Ionicons name={iconName} size={size} color={color} />;

            // },
            tabBarInactiveBackgroundColor: GROUNDCOLOR,
            tabBarActiveBackgroundColor: GROUNDCOLOR,
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "grey",
            tabBarLabelStyle: {
              paddingBottom: 10,
              fontSize: 12,
              alignSelf: "center",
            },
            // tabBarStyle: { height: 70 },
            tabBarHideOnKeyboard: true,
            headerShown: true,
            header: (props) => <Header {...props} />,
          })}
        >
          <Tab.Screen name={homeName} component={HomeScreen} />
          <Tab.Screen name={recordName} component={RecordScreen} />
        </Tab.Navigator>
      </NavigationContainer>
  );
}
