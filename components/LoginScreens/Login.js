import { async } from "@firebase/util";
import { sendSignInLinkToEmail } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Linking, Alert } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { auth, db } from "../../Firebase";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, setExampleString } from "../../redux/record";

const Login = ({navigation}) => {

  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(()=>{
      _getDynamicLink();
      const unsubscribe = auth.getAuth().onAuthStateChanged((authUser)=>{
        //   console.log(authUser)
          if(authUser) {
            navigation.navigate("홈")
          }
      });
      
      return unsubscribe;
  }, [])

  const _getDynamicLink = () => {
    console.log('getLink()')
    // const url = "https://jmwschool.page.link/newUser/Bgs2pU4KsWfTRddEdSXSuFpAOnj2"
    // if(url!=null && url.includes("https://jmwschool.page.link")){
    //   const paramArray = url.split('/');
    //   const userUID = paramArray[paramArray.length-1];
    //   console.log(userUID)
    //   navigation.navigate("회원가입");
    // }
    Linking.getInitialURL().then((url)=> {
      console.log(url)
      if(url!=null && url.includes("https://jmwschool.page.link")){
        const paramArray = url.split('/');
        const userUID = paramArray[paramArray.length-1];
        console.log(userUID)

        const recomendUserData = +_getFirebaseDB(userUID);
        try {
          db.setDoc(doc(db.getFirestore(), "users", userUID), {
            recordNum: recomendUserData.uid + 5,
          });
        } catch (error) {
          console.log("DB Error : " + error);
        }
        // navigation.navigate("회원가입");
      }
      
    })
  }

  const _getFirebaseDB = async (uid) => {
    const docRef = db.doc(
      db.getFirestore(),
      "users",
      uid
    );
    const docSnap = await db.getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    return docSnap.data();
  };

  const register = () => {
      navigation.navigate("회원가입")
  }

  const signIn = async () => {
    await auth.signInWithEmailAndPassword(
        auth.getAuth(),
        email,
        password
      )
      .then((authUser)=>{
        console.log(authUser)
        dispatch(setCurrentUser(authUser.user.displayName))
      })
      .catch((error)=>alert("아이디/비밀번호를 확인해주세요."));
  }
  return (
    <View style={stlyes.container}>
      <Image
        source={require("../../assets/LoginLogo.png")}
        style={{ width: 200, height: 200, marginBottom: 30 }}
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
