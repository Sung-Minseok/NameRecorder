import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Touchable,
} from "react-native";
import * as Font from "expo-font";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
export default function HomeScreen({ navigation }) {
  const [fontLoaded, setFontLoaded] = useState(false);

  const _loadFont = async () => {
    await Font.loadAsync({
      SquareRound: require("../../assets/fonts/NanumSquareRound.otf"),
      CutiveMono: require("../../assets/fonts/CutiveMono-Regular.ttf"),
      Jua: require("../../assets/fonts/Jua-Regular.ttf"),
    });
    setFontLoaded(true);
  };

  useEffect(() => {
    _loadFont();
  });
  return (
    <View style={styles.container}>
      <Text
        onPress={() => alert("aaaa")}
        style={{ fontSize: 26, fontWeight: "bold" }}
      >
        Home Screen(마크들어갈 위치)
      </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.menuButton}>
          <TouchableHighlight
            underlayColor={"transparent"}
            onPress={() => navigation.navigate("녹음")}
          >
            <Text style={styles.menuText}>녹음기능</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.menuButton}>
          <TouchableHighlight
            underlayColor={"transparent"}
            onPress={() => alert("추후 업데이트")}
          >
            <Text style={styles.menuText}>오늘의 운세</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.menuButton}>
          <TouchableHighlight
            underlayColor={"transparent"}
            onPress={() => alert("추후 업데이트")}
          >
            <Text style={styles.menuText}>돋보기 & 손전등</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.menuButton}>
          <TouchableHighlight
            underlayColor={"transparent"}
            onPress={() => alert("추후 업데이트")}
          >
            <Text style={styles.menuText}>성명학 상담신청</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.menuButton}>
          <TouchableHighlight
            underlayColor={"transparent"}
            onPress={() => alert("추후 업데이트")}
          >
            <Text style={styles.menuText}>모든 가능하게 하는 힘</Text>
          </TouchableHighlight>
        </View>
      </View>
      <TouchableHighlight underlayColor={'transparent'} onPress={()=>{alert('업데이트 예정')}} style={styles.menuButton2}>
        <View>
          <Text style={styles.menuText2}>문의 하기</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  menuButton: {
    backgroundColor: GROUNDCOLOR,
    height: DEVICE_HEIGHT * 0.06,
    width: DEVICE_WIDTH * 0.65,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  menuButton2: {
    backgroundColor: "white",
    height: DEVICE_HEIGHT * 0.06,
    width: DEVICE_WIDTH * 0.3,
    borderWidth: 2,
    borderColor: GROUNDCOLOR,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  menuText: {
    fontSize: 20,
    color: "white",
    fontFamily: "SquareRound",
    fontWeight: "bold",
  },
  menuText2: {
    fontSize: 20,
    color: "black",
    fontFamily: "SquareRound",
    fontWeight: "bold",
  },
});
