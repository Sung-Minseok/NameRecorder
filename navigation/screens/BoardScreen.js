import * as React from "react";
import {
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
  Dimensions,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import * as FileSystem from "expo-file-system";
import * as Font from "expo-font";

// import TabBar from "../TabBar";
//routes
import MyBoardScreen from "../../components/BoardScreens/MyBoardScreen";
import BoardMainScreen from "../../components/BoardScreens/BoardMainScreen";

//redux
import { useSelector, useDispatch } from "react-redux";

const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const BACKGROUNDCOLOR = "#F4ECE6";
const DirName = "expopTest1/";

const renderScene2 = (props) => {
  // console.log(props)
  switch (props.route.key) {
    case "first":
      return <BoardMainScreen {...props} />;
    case "second":
      return <MyBoardScreen {...props} />;
    default:
      return null;
  }
};

export default function BoardScreen({ navigation }) {
  //redux
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const DEVICE_WIDTH = Dimensions.get("window").width;
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "문의하기" },
    { key: "second", title: "내 문의글" },
  ]);
  const [fontLoaded, setFontLoaded] = React.useState(false);

  const _loadFont = async () => {
    await Font.loadAsync({
      SquareRound: require("../../assets/fonts/NanumSquareRound.otf"),
      CutiveMono: require("../../assets/fonts/CutiveMono-Regular.ttf"),
      Jua: require("../../assets/fonts/Jua-Regular.ttf"),
    });
    setFontLoaded(true);
  };


  React.useEffect(() => {
    _loadFont();
  }, []);
  if (!fontLoaded) {
    return <View></View>;
  }
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene2}
	  swipeEnabled={false}
      onIndexChange={(idx) => {
        setIndex(idx);
      }}
      initialLayout={{ width: DEVICE_WIDTH }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{
            backgroundColor: GROUNDCOLOR,
            border: "none",
          }}
          labelStyle={{
            fontFamily: "SquareRound",
            fontSize: 18,
          }}
          style={{
            backgroundColor: "white",
            fontWeight: "bold",
            shadowOffset: { height: 1, width: 0 },
            shadowColor: "black",
          }}
          pressColor={"transparent"}
          activeColor={GROUNDCOLOR}
          inactiveColor="grey"
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  activeTabTextColor: {
    color: POINTCOLOR,
  },
  tabTextColor: {
    color: "black",
  },
});
