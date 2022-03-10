import * as React from "react";
import { View, Text, useWindowDimensions, StyleSheet, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import * as FileSystem from "expo-file-system";
import * as Font from "expo-font";

// import TabBar from "../TabBar";
//routes
import FlashScreen from "../../components/FingerPrintScreens/FlashScreen";
import AlbumScreen from "../../components/FingerPrintScreens/AlbumScreen";
import FingerScreen from "../../components/FingerPrintScreens/FingerScreen";

//redux
import { useSelector, useDispatch } from "react-redux";
import { setCameraLoad } from "../../redux/record";

const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const BACKGROUNDCOLOR = "#F4ECE6";
const DirName = "expopTest1/";

const renderScene2 = (props) => {
	// console.log(props)
	switch (props.route.key) {
		case "first":
			return <FlashScreen {...props} />;
		case "second":
			return <AlbumScreen {...props} />;
		case "third":
			return <FingerScreen {...props} />;
		default:
			return null;
	}
};

export default function FingerPrintScreen({ navigation }) {
	//redux
	const dispatch = useDispatch();
	const reduxState = useSelector((state) => state);
  	const DEVICE_WIDTH = Dimensions.get("window").width;
	const layout = useWindowDimensions();
	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: "first", title: "돋보기/\n손전등" },
		{ key: "second", title: "사진 확인" },
		{ key: "third", title: "지문 찍기" },
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
		navigation.addListener("focus", () => {
			console.log("focus");
			dispatch(setCameraLoad(true));
		});
		navigation.addListener("blur", () => {
			console.log("blur");
			dispatch(setCameraLoad(false));
		});
	}, []);
	if (!fontLoaded) {
		return <View></View>;
	}
	return (
		<TabView
			navigationState={{ index, routes }}
			renderScene={renderScene2}
			onIndexChange={(idx) => {
				setIndex(idx);
				if(idx === 0){
          dispatch(setCameraLoad(true))
        }else{
          dispatch(setCameraLoad(false))
        }
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
