import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Screens
import HomeScreen from "./screens/HomeScreen";
import RecordListscreen from "./screens/RecordListScreen";
import RecordingScreen from "./screens/RecordingScreen";

// Screen names
const homeName = "Home";
const recordListName = "RecordList";
const recordName = "Recording";

const Stack = createNativeStackNavigator();
export default function MainContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={recordName}>
        <Stack.Screen name={homeName} component={HomeScreen} />
        <Stack.Screen name={recordListName} component={RecordListscreen} />
        <Stack.Screen name={recordName} component={RecordingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
