import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const BACKGROUNDCOLOR = "#F4ECE6";

const RecordModal = () => {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalCon}>
        <View style={styles.modalContents}>
          <View style={styles.textInputContainer}>
            <Text style={{ fontSize: 20,fontWeight: '500' , color: "black" }}>파일 삭제중...</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RecordModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCon: {
    borderRadius: 10,
    borderWidth:2,
    borderColor: GROUNDCOLOR,
    backgroundColor: "#fff",
    // paddingVertical: 30,
    // paddingHorizontal: 10,
    width: DEVICE_WIDTH * 0.7,
    height: DEVICE_WIDTH * 0.2,
    justifyContent: 'center',
    alignItems: "center",
  },
  modalContents: {
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.7,
    height: DEVICE_WIDTH * 0.2,
  },
  textInputContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.7,
    height: DEVICE_WIDTH * 0.2,
    flexDirection: "row",
    marginHorizontal: 10,
  },
  textInput: {
    borderColor: GROUNDCOLOR,
    // borderWidth: 2,
    borderRadius: 4,
    width: DEVICE_WIDTH * 0.65,
    height: DEVICE_WIDTH * 0.13,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  modalButtonContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    // width: DEVICE_WIDTH * 0.7,
    height: DEVICE_WIDTH * 0.15,
    flexDirection: "row",
    marginHorizontal: 20,
  },
  button: {
    fontSize: 20,
    // borderWidth: 1,
    // borderColor: 'grey',
    borderRadius: 5,
    backgroundColor: GROUNDCOLOR,
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.23,
    height: DEVICE_WIDTH * 0.1,
    marginHorizontal: DEVICE_WIDTH * 0.05,
  },
  button2: {
    fontSize: 20,
    // borderWidth: 1,
    // borderColor: 'grey',
    borderRadius: 5,
    backgroundColor: 'grey',
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.23,
    height: DEVICE_WIDTH * 0.1,
    marginHorizontal: DEVICE_WIDTH * 0.05,
  },
});
