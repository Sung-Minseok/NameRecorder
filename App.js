import * as React from "react";
import { Dimensions, View } from "react-native";
import MainContainer from "./navigation/MainContainer";
import StackContainer from "./navigation/StackContainer";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

// blueColor = "#2D89DF"

function App() {
  return (
    <View style={{width: width, height: height}}>
      <MainContainer />
      {/* <StackContainer/> */}
    </View>
  );
}

export default App;
