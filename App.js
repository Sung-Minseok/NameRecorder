import * as React from "react";
import { Dimensions, LogBox, Text, TextInput } from "react-native";
import MainContainer from "./navigation/MainContainer";

//redux
import { Provider as StoreProvider } from "react-redux";
import store from "./redux/store";

//firebase
import Firebase from './Firebase';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.autoCorrect = false;
TextInput.defaultProps.allowFontScaling = false;

LogBox.ignoreLogs(["Setting a timer","AsyncStorage has been extracted"])

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

// blueColor = "#2D89DF"
// 터콰이즈 = "#0bcacc"
function App() {
  // console.log(Firebase)
  
  return (
    <StoreProvider store={store}>
      <MainContainer />
    </StoreProvider>
  );
}

export default App;
