import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Dimensions, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import Recording from "../../components/Recording";
import Recording_functional from "../../components/Recording_functional";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781"
const BACKGROUNDCOLOR = "#F4ECE6"
export default function RecordingScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
        backgroundColor: 'white',
        paddingTop: 15
      }}
    >
      <Recording/>
      {/* <Recording_functional/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 16,
  },
  menuTab: {
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.35,
    height: 40,
    borderBottomColor: "grey",
    borderBottomWidth: 3,
    // paddingVertical: 5
  },
  menuTabActive: {
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.35,
    height: 40,
    borderBottomColor: POINTCOLOR,
    borderBottomWidth: 3,
    // paddingVertical: 5
  },
  menuTabText: {
    fontSize: 20,
  },
  menuTabTextActive: {
    fontSize: 20,
    color: POINTCOLOR,
  },
});
