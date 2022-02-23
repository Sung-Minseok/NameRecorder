import { async } from "@firebase/util";
import { sendSignInLinkToEmail } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { auth } from "../../Firebase";

const Login = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(()=>{
      const unsubscribe = auth.getAuth().onAuthStateChanged((authUser)=>{
        //   console.log(authUser)
          if(authUser) {
            navigation.navigate("홈")
          }
      });

      return unsubscribe;
  }, [])

  const register = () => {
      navigation.navigate("회원가입")
  }

  const signIn = async () => {
    await auth.signInWithEmailAndPassword(
        auth.getAuth(),
        email,
        password
      )
      .then((authUser)=>console.log(authUser))
      .catch((error)=>alert(error));
  }
  return (
    <View style={stlyes.container}>
      <Image
        source={{
          uri: "https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png",
        }}
        style={{ width: 200, height: 200 }}
      />
      <View style={stlyes.inputContainer}>
        <Input
          placeholder="아이디(이메일)"
          autoFocus
          textContentType="emailAddress"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="비밀번호"
          secureTextEntry
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <Button
        containerStyle={stlyes.button}
        onPress={() => signIn()}
        title="로그인"
      />
      <Button
        containerStyle={stlyes.button}
        onPress={() => register()}
        type="outline"
        title="회원가입"
      />
    </View>
  );
};

export default Login;

const stlyes = StyleSheet.create({
    container: {
        flex:1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    inputContainer: {
        width: 300
    },
    button: { width: 200, marginTop: 10,}
});
