import React, { Component } from "react";
import {
  Alert,
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

const RecordModal = (props) => {
  const _onPress = () => {
    console.log();
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalCon}>
        <View style={styles.modalHeader}>
          <Text style={{ fontSize: 20, color: "white" }}>파일이름 작성</Text>
        </View>
        <View style={styles.modalContents}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => {
                var specialRule = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
                if (specialRule.test(text)) {
                  Alert.alert("파일명에는 특수문자를 사용할 수 없습니다.");
                } else {
                  props.onChangeText(text.trimRight());
                }
              }}
              value={props.value}
            ></TextInput>
          </View>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity onPress={() => props.onPressConfirm()}>
              <View style={styles.button}>
                <Text style={{ color: "white", fontSize: 17 }}>확인</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.onPressCancle()}>
              <View style={styles.button2}>
                <Text style={{ color: "white", fontSize: 17 }}>취소</Text>
              </View>
            </TouchableOpacity>
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
    backgroundColor: "#fff",
    // paddingVertical: 30,
    // paddingHorizontal: 10,
    width: DEVICE_WIDTH * 0.7,
    height: DEVICE_WIDTH * 0.5,
    alignItems: "center",
  },
  modalHeader: {
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    width: DEVICE_WIDTH * 0.7,
    height: DEVICE_WIDTH * 0.12,
    backgroundColor: GROUNDCOLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContents: {
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.7,
    height: DEVICE_WIDTH * 0.38,
  },
  textInputContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.7,
    height: DEVICE_WIDTH * 0.23,
    flexDirection: "row",
    paddingTop: 10,
    marginHorizontal: 10,
  },
  textInput: {
    borderColor: GROUNDCOLOR,
    borderWidth: 2,
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
    backgroundColor: "grey",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.23,
    height: DEVICE_WIDTH * 0.1,
    marginHorizontal: DEVICE_WIDTH * 0.05,
  },
});
