import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Dimensions, TouchableOpacity } from "react-native";
import Recording from "./Recording";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781"
const BACKGROUNDCOLOR = "#F4ECE6"
export default function RecordingScreen(props) {
  return (
    <View
      style={styles.container}
    >
      <Recording {...props}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    backgroundColor: 'white',
    paddingTop: 10
  },
});
