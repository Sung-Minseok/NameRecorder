import * as React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Tab from "./Tab";

const { width } = Dimensions.get("screen");

const TabBar = ({ state, navigation }) => {
  const { routes } = state;

  const handlePress = (activeTab, index) => {
    if (state.index !== index) {
      setSelected(activeTab);
      navigation.navigate(activeTab);
    }
  };

  return (
    <View style={styles.container}>
      {routes.map((route) => (
        <Tab
          tab={route}
          onPress={() => handlePress(route.name, index)}
          key={route.key}
          navigation = {navigation}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default TabBar;
