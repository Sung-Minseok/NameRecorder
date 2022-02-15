import * as React from "react";
import { View, Text, useWindowDimensions, StyleSheet } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import RecordingScreen from "./RecordingScreen";
import RecordListscreen from "./RecordListScreen";
import * as FileSystem from "expo-file-system";
import * as Font from "expo-font";
//redux
import { useSelector, useDispatch } from "react-redux";
import { setTabView } from "../../redux/record";

const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const BACKGROUNDCOLOR = "#F4ECE6";
const DirName = "expoTest4/";

const FirstRoute = () => <RecordListscreen />;
const SecondRoute = () => <RecordingScreen />;
const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const renderScene2 = (props) => {
  // console.log(props)
  switch (props.route.key) {
    case 'first':
      return <RecordListscreen {...props}/>;
    case 'second':
      return <RecordingScreen {...props}/>;
    default:
      return null;
  }
}

export default function RecordScreen({ navigation }) {
  //redux
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "녹음목록" },
    { key: "second", title: "녹음하기" },
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

  const ensureDirExists = async () => {
    const dir = FileSystem.documentDirectory + DirName;
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      console.log("directory doesn't exist, creating...");
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    } else {
      console.log("directory alreay exists");
    }
  };

  React.useEffect(() => {
    ensureDirExists();
    _loadFont();
  });
  if(!fontLoaded){
    return <View></View>
  }
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene2}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
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
