import * as React from "react";
import { Dimensions, View, SafeAreaView } from "react-native";
import MainContainer from "./navigation/MainContainer";
import StackContainer from "./navigation/StackContainer";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

// blueColor = "#2D89DF"
// 터콰이즈 = "#0bcacc"

function App() {
  return (
    // <SafeAreaView style={{ flex: 1 }}>
    //   <MainContainer />
    // </SafeAreaView>
      <MainContainer />
  );
}

export default App;
