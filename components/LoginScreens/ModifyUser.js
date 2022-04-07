import { sendSignInLinkToEmail } from "firebase/auth";
import { doc, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { auth, db } from "../../Firebase";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, setExampleString } from "../../redux/record";

const ModifyUser = ({ navigation }) => {

  
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [uid, setUid] = useState("");

  useEffect(()=>{
    getInfo()
  },[])

  const updateInfo = async () => {
    const user = auth.getAuth().currentUser
    try {
      db.updateDoc(doc(db.getFirestore(), "users", user.uid), {
        email: email,
        name: name,
        phoneNum: phone,
        birth: birth,
      });
    } catch (error) {
      console.log("DB Error : " + error);
    }
    auth.updateProfile(user, {displayName: name})
    dispatch(setCurrentUser(name))
    navigation.navigate("홈");
  };

  const getInfo = async () => {
    const uid = auth.getAuth().currentUser.uid
    const docRef = db.doc(
      db.getFirestore(),
      "users",
      uid
    );
    const docSnap = await db.getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
    setEmail(docSnap.data().email)
    setName(docSnap.data().name)
    setPhone(docSnap.data().phoneNum)
    setBirth(docSnap.data().birth)
    setUid(uid)
  }

  return (
    <View style={stlyes.container}>
      <Text style={{ marginBottom: 50, fontSize: 20, fontWeight: "bold" }}>
        회원정보 수정
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
        />
        {/* <Input
          placeholder="비밀번호"
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        /> */}
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
        <Text style={stlyes.uid}>회원ID : {uid}</Text>

        <Button raised onPress={() => updateInfo()} title="수정완료" />
      </View>
    </View>
  );
};

export default ModifyUser;

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
  uid: {
    color: "grey",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingBottom: 30
  }
});
