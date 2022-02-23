import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";
import * as Font from "expo-font";

// Screen Size
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

//colors
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";

import { auth } from "../../Firebase";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setExampleString } from "../../redux/record";
import { set } from "react-native-reanimated";

export default function HomeScreen({ navigation }) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    _loadFont();
    const unsubscribe = auth.getAuth().onAuthStateChanged((authUser) => {
      //   console.log(authUser)
      if (!authUser) {
        navigation.navigate("로그인");
      }
    });
    _getUserName();
    return unsubscribe;
  }, []);

  const _loadFont = async () => {
    await Font.loadAsync({
      SquareRound: require("../../assets/fonts/NanumSquareRound.otf"),
      CutiveMono: require("../../assets/fonts/CutiveMono-Regular.ttf"),
      Jua: require("../../assets/fonts/Jua-Regular.ttf"),
    });
    setFontLoaded(true);
  };

  const _logOut = async () => {
    auth.getAuth().signOut();
    Alert.alert("로그아웃 완료");
    console.log("로그아웃");
  };

  const _getUserName = async () => {
    let username;
    if (auth.getAuth().currentUser == null) {
      username = "로그인을 해주세요.";
    } else {
      username = auth.getAuth().currentUser.displayName+"님 로그인.";
    }
    console.log(username)
    setUserName(username)
  };

  const _share = async () =>{
    Share.share({
      message: "share messages"
    })
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: DEVICE_WIDTH,
          padding: 10
        }}
      >
        <Text
          onPress={() => alert("aaaa")}
          style={{ fontSize: 26, fontWeight: "bold" }}
        >
          {userName}
        </Text>
        <TouchableOpacity onPressOut={() => _logOut()}>
          <Text>로그아웃</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          underlayColor={"transparent"}
          onPress={() => navigation.navigate("녹음")}
        >
          <View style={styles.menuButton}>
            <Text style={styles.menuText}>녹음기능</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          underlayColor={"transparent"}
          onPress={() => Alert.alert("추후 업데이트")}
        >
          <View style={styles.menuButton}>
            <Text style={styles.menuText}>오늘의 운세</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          underlayColor={"transparent"}
          onPress={() => navigation.navigate("지문")}
        >
          <View style={styles.menuButton}>
            <Text style={styles.menuText}>돋보기 & 손전등</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          underlayColor={"transparent"}
          onPress={() => Alert.alert("추후 업데이트")}
        >
          <View style={styles.menuButton}>
            <Text style={styles.menuText}>성명학 상담신청</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          underlayColor={"transparent"}
          onPress={() => Alert.alert("추후 업데이트")}
        >
          <View style={styles.menuButton}>
            <Text style={styles.menuText}>모든 가능하게 하는 힘</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          underlayColor={"transparent"}
          onPress={() => navigation.navigate("로그인")}
        >
          <View style={styles.menuButton}>
            <Text style={styles.menuText}>로그인/회원가입</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          underlayColor={"transparent"}
          onPress={() => _share()}
        >
          <View style={styles.menuButton}>
            <Text style={styles.menuText}>앱 공유하기</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        underlayColor={"transparent"}
        onPress={() => {
          Alert.alert("추후 업데이트");
        }}
        style={styles.menuButton2}
      >
        <View>
          <Text style={styles.menuText2}>문의 하기</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white" },
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
