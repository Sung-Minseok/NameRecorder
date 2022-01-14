import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import Recording from "../../components/Recording";

export default function RecordScreen({ navigation }) {

  return <Recording></Recording>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
    margin: 16
  },
  button: {
    margin: 16
  }
});
