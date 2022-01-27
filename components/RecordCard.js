import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
} from "react-native";
import * as Icons from "./Icons.js";
import OptionsMenu from "react-native-option-menu";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;

const RecordCard = ({ item, onPress }) => {
  const _onPress = (item) => {
    console.log(item);
  };

  const data = [
    {
      value: "1",
    },
    {
      value: "2",
    },
    {
      value: "3",
    },
  ];
  console.log(item)
  return (
    <View style={styles.card_container}>
      <TouchableHighlight onPressOut={() => _onPress(item)}>
        <Image source={Icons.PLAY_BUTTON.module} />
      </TouchableHighlight>
      <View style={styles.card_recordinfo}>
        <Text>파일이름 : aaaa</Text>
        <Text>생성 시간 : 2021.01.16 12:31</Text>
        <Text>파일 길이 : 00:20:01</Text>
      </View>
      <View style={styles.card_buttonContainer}>
        <Text>Play</Text>
        <Text>Stop</Text>
      </View>
      <OptionsMenu
          button={require("../assets/images/more_button.png")}
          buttonStyle={{
            width: 20,
            height: 20,
            // margin: 0,
            resizeMode: "contain",
          }}
          destructiveIndex={1}
          options={["수정", "삭제", "취소"]}
          actions={[()=>console.log('edit'), ()=>console.log('delete')]}
        />
    </View>
  );
};

export default RecordCard;
const styles = StyleSheet.create({
  card_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#C5C7C9",
    height: DEVICE_HEIGHT / 8.0,
    width: DEVICE_WIDTH - 40,
    marginHorizontal: 20,
  },
  card_recordinfo: {
    flex: 4,
    // alignItems: "center",
    flexDirection: "column",
  },
  card_buttonContainer: {
    flex: 1,
    alignItems: "center",
  },
});
