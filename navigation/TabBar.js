import * as React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Tab from "./Tab";

const { width } = Dimensions.get("screen");

const TabBar = ({ state, navigation }) => {
  const { routes } = state;
  // console.log(state.routes)
  // console.log(routes)
  const handlePress = (activeTab, index) => {
    console.log(activeTab)
    if (state.index !== index) {
      // setSelected(activeTab);
      navigation.navigate(activeTab);
    }
  };

  return (
    <View style={styles.container}>
      {routes.map((route) => (
        <Tab
          tab={route}
          onPress={() => handlePress(route.name, route.index)}
          key={route.key}
          navigation = {navigation}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 0},
});

export default TabBar;
