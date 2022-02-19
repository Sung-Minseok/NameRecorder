import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
// Screens
import HomeScreen from "./screens/HomeScreen";
import RecordScreen from "./screens/RecordScreen";
import FingerPrintScreen from "./screens/FingerPrintScreen";
import Login from "./screens/LoginScreen";
import TabBar from "./TabBar";
import Header from "./Header";
import LoginScreen from "./screens/LoginScreen";
// Colors
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const BACKGROUNDCOLOR = "#F4ECE6";

// Screen names
const homeName = "홈";
const recordName = "녹음";
const settingName = "설정";
const FingerPrintName = "지문";

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
          <Tab.Screen name={settingName} component={RecordScreen} />
          <Tab.Screen name={FingerPrintName} component={FingerPrintScreen} />
          <Tab.Screen name="로그인" component={LoginScreen} />
        </Tab.Navigator>
      </NavigationContainer>
  );
}
