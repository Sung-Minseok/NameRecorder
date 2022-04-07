import { sendSignInLinkToEmail } from "firebase/auth";
import { doc, getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { auth, db } from "../../Firebase";


//redux
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, setExampleString } from "../../redux/record";

const Register = ({ navigation }) => {

  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");

  const register = async () => {
    const credential = auth.EmailAuthProvider.credential(email, password);
    auth
      .linkWithCredential(auth.getAuth().currentUser, credential)
      .then(async (usercred) => {
        const user = usercred.user;
        console.log("계정 연결 성공", user);
        auth.updateProfile(user, {
          displayName: name,
        });
        try {
          const docRef = db.doc(
            db.getFirestore(),
            "users",
            user.uid
          );
          const docSnap= await db.getDoc(docRef);
          
          db.setDoc(doc(db.getFirestore(), "users", user.uid), {
            email: user.email,
            name: name,
            // phoneNum: phone,
            birth: birth,
            recordNum: docSnap.data().recordNum,
          });
        } catch (error) {
          console.log("DB Error : " + error);
        }
        dispatch(setCurrentUser(name))
        Alert.alert("알림","회원가입 완료.")
        navigation.navigate("홈")
      })
      .catch((error) => {
        console.log("계정 연결 오류", error);
        if(error.toString().includes("email-already-in-use")){
          Alert.alert("회원가입 오류","이미 존재하는 아이디(이메일)입니다.")
        }else{
          Alert.alert("회원가입 오류","아이디 형식(이메일)을 확인해주세요.")
        }        
      });
  };

  return (
    <View style={stlyes.container}>
      <Text style={{ marginBottom: 50, fontSize: 20, fontWeight: "bold" }}>
        회원가입
      </Text>
      <View style={stlyes.inputContainer}>
        <Input
          placeholder="이름"
          textContentType="name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder="아이디(이메일)"
          textContentType="name"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="비밀번호"
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {/* <Input
          placeholder="전화번호"
          textContentType="telephoneNumber"
          value={phone}
          onChangeText={(text) => setPhone(text)}
        /> */}
        <Input
          placeholder="생년월일(8자리 숫자)"
          textContentType="name"
          value={birth}
          onChangeText={(text) => setBirth(text)}
        />

        <Button style={{backgroundColor:"black"}} raised onPress={() => register()} title="회원가입" />
      </View>
    </View>
  );
};

export default Register;

const stlyes = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  inputContainer: {
    width: 300,
  },
  button: { width: 200, marginTop: 10 },
});
