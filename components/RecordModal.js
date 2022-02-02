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
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;

const RecordModal = (props) => {
  const _onPress = () => {
    console.log();
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalCon}>
        <Text style={{ fontSize: 20, paddingHorizontal: 10 }}>파일이름 작성</Text>
        <TextInput
          style={styles.textInputContainer}
          onChangeText={(text) => {
            props.onChangeText(text);
          }}
          value={props.value}
        ></TextInput>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <TouchableOpacity onPress={() => props.onPressCancle()}>
            <Text style={{ fontSize: 20, paddingHorizontal: 10 }}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.saveRecording()}>
            <Text style={{ fontSize: 20 }}>확인</Text>
          </TouchableOpacity>
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
    paddingTop: 70,
  },
  modalCon: {
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingVertical: 30,
    paddingHorizontal: 10,
    width: DEVICE_WIDTH * 0.7,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  textInputContainer: {
    borderColor: "black",
    borderWidth: 1,
    width: DEVICE_WIDTH * 0.5,
    height: 40
  },
});
