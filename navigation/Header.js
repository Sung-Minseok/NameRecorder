import React, { useState } from "react";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import * as Font from "expo-font";
import * as Icons from "../components/Icons.js";
import Tab from "./Tab";

const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const { width } = Dimensions.get("screen");

const Header = (props) => {
    const [isFontLoading, setIsFontLoading] = useState(false);
  const _loadFont = async () => {
    await Font.loadAsync({
      SquareRound: require("../assets/fonts/NanumSquareRound.otf"),
      CutiveMono: require("../assets/fonts/CutiveMono-Regular.ttf"),
      Jua: require("../assets/fonts/Jua-Regular.ttf"),
    });
    setIsFontLoading(true);
  };

  _loadFont();

  if (!isFontLoading) {
    return <View></View>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.childContainer}>
        <Text style={{ color: "white", fontSize: 22, fontFamily: 'SquareRound' }}>{props.route.name}</Text>
        {props.route.name != "홈" && (
          <View style={{ position: "absolute", left: 0 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => props.navigation.navigate("홈")}
            >
              <Image
                style={{ tintColor: "white" }}
                source={Icons.BACK_ICON.module}
              ></Image>
              <Text style={{ color: "white", fontSize: 20, fontFamily: 'SquareRound' }}>뒤로가기</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50 + getStatusBarHeight(),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GROUNDCOLOR,
  },
  childContainer: {
    height: 50,
    marginTop: getStatusBarHeight(),
    width: width,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GROUNDCOLOR,
  },
});

export default Header;
