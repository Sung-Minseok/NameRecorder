import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Screens
import HomeScreen from "./screens/HomeScreen";
import RecordScreen from "./screens/RecordScreen";

// Screen names
const homeName = "Home";
const recordName = "Record";

const Stack = createNativeStackNavigator();
export default function MainContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={homeName}>
        <Stack.Screen name={homeName} component={HomeScreen} />
        <Stack.Screen name={recordName} component={RecordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
