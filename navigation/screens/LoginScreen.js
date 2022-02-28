import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  TextInput,
  Linking
} from "react-native";
import * as Font from "expo-font";

import Login from "../../components/LoginScreens/Login";
import Register from "../../components/LoginScreens/Register";
//firebase
import Firebase, { auth } from "../../Firebase";

// Screen Size
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

//colors
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setExampleString } from "../../redux/record";
import { set } from "react-native-reanimated";

export default function LoginScreen({ navigation }) {
  const [init, setInit] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);

  const [fontLoaded, setFontLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);

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
    _getDynamicLink();
    auth.getAuth().onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  const _getDynamicLink = () => {
    console.log('getLink()')
    Linking.getInitialURL().then((url)=> {
      console.log(url)
    })
  }

  const _registerSubmit = async () => {
    try {
      if(email=="" || password=="") return alert("아이디/비밀번호를 입력해주세요")
      let data;
      console.log("login : " + isLoggedIn);
      if (newAccount) {
        data = await auth.createUserWithEmailAndPassword(
          auth.getAuth(),
          email,
          password
        );
      } else {
        data = await auth.signInWithEmailAndPassword(
          auth.getAuth(),
          email,
          password
        );
        // setIsLoggedIn(auth.getAuth().currentUser.email);
      }
      console.log(data);
    } catch (error) {
      alert("error");
      console.log(error);
    }
  };

  const _logOut = async () =>{
    await auth.getAuth().signOut(auth)
    setEmail("")
    setPassword("")
  }


  return (
    // <Login/>
    <Register/>
    // <View style={styles.container}>
    //   <Text>현재 유저 : {!isLoggedIn ? "null" : auth.getAuth().currentUser.email}</Text>
    //   {!isLoggedIn && (
    //     <View>
    //       <TextInput
    //         style={{ width: 200, height: 30, borderWidth: 1 }}
    //         placeholder="Email"
    //         onChangeText={(text) => setEmail(text)}
    //       />
    //       <TextInput
    //         style={{ width: 200, height: 30, borderWidth: 1 }}
    //         placeholder="Password"
    //         onChangeText={(text) => setPassword(text)}
    //       />
    //     </View>
    //   )}

    //   <View style={{ flexDirection: "row" }}>
    //     <TouchableOpacity onPress={() => _registerSubmit()}>
    //       <View style={{ width: 100, height: 30, borderWidth: 1 }}>
    //         <Text>{newAccount ? "회원가입" : "로그인"}</Text>
    //       </View>
    //     </TouchableOpacity>
    //     <TouchableOpacity onPress={() => _logOut()}>
    //       <View style={{ width: 100, height: 30, borderWidth: 1 }}>
    //         <Text>로그아웃</Text>
    //       </View>
    //     </TouchableOpacity>
    //   </View>
    //   <TouchableOpacity
    //     underlayColor={"transparent"}
    //     onPress={() => {
    //       Alert.alert("추후 업데이트");
    //     }}
    //     style={styles.menuButton2}
    //   >
    //     <View>
    //       <Text style={styles.menuText2}>문의 하기</Text>
    //     </View>
    //   </TouchableOpacity>
    // </View>
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
