import { sendSignInLinkToEmail } from "firebase/auth";
import { doc, getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { auth, db } from "../../Firebase";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");

  const register = async () => {
    await auth
      .createUserWithEmailAndPassword(auth.getAuth(), email, password)
      .then((authUser) => {
        auth.updateProfile(authUser.user, {
          displayName: name,
        });
        try {
          // db.addDoc(db.collection(db.getFirestore(), "users"), {
          //   email: authUser.user.email,
          //   name: name,
          //   phoneNum: phone,
          //   birth: birth,
          //   recordNum: 5,
          // });
          db.setDoc(doc(db.getFirestore(),"users",authUser.user.email),
          {
            email: authUser.user.email,
              name: name,
              phoneNum: phone,
              birth: birth,
              recordNum: 5,
          })
        } catch (error) {
          console.log("DB Error : " + error);
        }
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={stlyes.container}>
      <Text style={{ marginBottom: 50, fontSize: 20, fontWeight: "bold" }}>
        회원가입 {auth.getAuth().currentUser.displayName}
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
        <Input
          placeholder="전화번호"
          textContentType="telephoneNumber"
          value={phone}
          onChangeText={(text) => setPhone(text)}
        />
        <Input
          placeholder="생년월일(8자리 숫자)"
          textContentType="name"
          value={birth}
          onChangeText={(text) => setBirth(text)}
        />

        <Button raised onPress={() => register()} title="회원가입" />
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
