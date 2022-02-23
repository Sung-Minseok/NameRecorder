import * as React from "react";
import { Dimensions } from "react-native";
import MainContainer from "./navigation/MainContainer";

//redux
import { Provider as StoreProvider } from "react-redux";
import store from "./redux/store";

//firebase
import Firebase from './Firebase';


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
