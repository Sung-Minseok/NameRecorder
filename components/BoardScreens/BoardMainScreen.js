import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
  FlatList,
  Keyboard,
  TouchableHighlight
} from "react-native";
import {
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";

import { auth, db } from "../../Firebase";

import { getStatusBarHeight } from "react-native-status-bar-height";
import { useSelector } from "react-redux";
import { async } from "@firebase/util";
const FingerDir = "fingerPrint/";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const BACKGROUNDCOLOR = "#F4ECE6";
export default function BoardMainScreen(props) {
  const OS = Platform.OS;
  const reduxState = useSelector((state) => state);
  const [contents, setContents] = useState("");
  const [title, setTitle] = useState("");
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [contentHeight, setContentHeight] = useState(150);
  useEffect(() => {
    // console.log(props)
  }, []);


  const submitBoard = async () => {
    const uid = auth.getAuth().currentUser.uid
    let name = "";
    const docRef = db.doc(
      db.getFirestore(),
      "users",
      uid
    );
    const docSnap = await db.getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      name = docSnap.data().name;
    } else {
      console.log("No such document!");
      name="비회원"
    }
    
    try {
      await db.addDoc(db.collection(db.getFirestore(), "board"), {
        check: false,
        contents: contents,
        date: '01/22',
        reply: '',
        title: title,
        uid: uid,
        user: name
      });
    } catch (error) {
      console.log("DB error : "+error)
    }
    Alert.alert("알림", "문의글 작성완료.")
  }


  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
        backgroundColor: "white",
        paddingTop: 15,
      }}
    >
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        <View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "600" }}>
              문의 글 작성
            </Text>
            <TouchableOpacity
              disabled={contents == "" || title == ""}
              onPress={() => {
                console.log("pressed");
                submitBoard();
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: contents == "" || title == "" ? "grey" : GROUNDCOLOR,
                }}
              >
                {'저장하기'}
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={{
              width: DEVICE_WIDTH * 0.9,
              height: 30,
              borderWidth: 1,
              // borderBottomWidth: 0,
              fontSize: 20,
            }}
            placeholder={"제목을 입력해주세요."}
            onChangeText={(text) => {
              setTitle(text);
            }}
            value={title}
          />
          <View style={{ width: DEVICE_WIDTH * 0.9, height: 20 }} />

          <TextInput
            style={{
              width: DEVICE_WIDTH * 0.9,
              height: DEVICE_HEIGHT * 0.3,
              // contentHeight < DEVICE_HEIGHT * 0.3
              //   ? DEVICE_HEIGHT * 0.3
              //   : contentHeight,
              borderWidth: 1,
              fontSize: 20,
            }}
            placeholder={"문의할 내용을 입력해주세요."}
            multiline={true}
            onChangeText={(text) => {
              setContents(text);
            }}
            onContentSizeChange={(e) => {
              setContentHeight(e.nativeEvent.contentSize.height);
            }}
            value={contents}
          />
        </View>
      {/* </TouchableWithoutFeedback> */}
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
});
