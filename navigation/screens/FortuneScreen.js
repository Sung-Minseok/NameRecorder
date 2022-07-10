import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	Alert,
	Share,
	Linking,
	Modal,
	Image,
	Platform,
} from "react-native";
import * as Font from "expo-font";
import ExpoFastImage from "expo-fast-image";

import { getStatusBarHeight } from "react-native-status-bar-height";

// Screen Size
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

//colors
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";

import DATA from "../../assets/Data/FortuneData.js";
import { auth, db } from "../../Firebase";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, setExampleString } from "../../redux/record";
import { doc } from "firebase/firestore";

export default function FortuneScreen({ navigation }) {
	const [fontLoaded, setFontLoaded] = useState(false);
	const dispatch = useDispatch();
	const reduxState = useSelector((state) => state);
	// const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userName, setUserName] = useState("");
	const [mainModalVisible, setMainModalVisible] = useState(false);
	const [subModalVisible, setSubModalVisible] = useState(false);
	const [data, setData] = useState([]);
	const [category, setCategory] = useState("");
	useEffect(async () => {
		_loadFont();
	}, []);

	const _loadFont = async () => {
		await Font.loadAsync({
			SquareRound: require("../../assets/fonts/NanumSquareRound.otf"),
			CutiveMono: require("../../assets/fonts/CutiveMono-Regular.ttf"),
			Jua: require("../../assets/fonts/Jua-Regular.ttf"),
		});
		setFontLoaded(true);
	};

	const clickItem = (item) => {
		setCategory(item);
		const num = Math.floor(Math.random() * 384);
		console.log(item);
		setData(DATA[num][item]);
		console.log(num);
		setSubModalVisible(true);
		console.log("submodal on");
		setTimeout(() => {
			setSubModalVisible(false);
			console.log("submodal off");
			setMainModalVisible(true);
			console.log("mainmodal on");
		}, 3000);
	};

	return (
		<View style={styles.container}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					width: DEVICE_WIDTH,
					height: DEVICE_HEIGHT * 0.15,
					padding: 10,
					paddingHorizontal: 10,
					borderWidth: 2,
					borderColor: GROUNDCOLOR,
				}}
			>
				<Text style={{ fontSize: 26, fontWeight: "bold" }}>
					{"오늘의 어떤 운세를\n보기를 원하시나요?"}
				</Text>
			</View>
			<View style={styles.buttonContainer}>
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => {
							console.log("click item");
							clickItem("연애");
						}}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>연애</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => {
							console.log("click item");
							clickItem("사업");
						}}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>사업</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => {
							console.log("click item");
							clickItem("소망");
						}}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>소망</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => {
							console.log("click item");
							clickItem("승진");
						}}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>승진</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => {
							console.log("click item");
							clickItem("시험");
						}}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>시험</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => {
							console.log("click item");
							clickItem("매매");
						}}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>매매</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => {
							console.log("click item");
							clickItem("개업");
						}}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>개업</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => {
							console.log("click item");
							clickItem("소송");
						}}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>소송</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => {
							console.log("click item");
							clickItem("증권");
						}}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>증권</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => {
							console.log("click item");
							clickItem("여행");
						}}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>여행</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => {
							console.log("click item");
							clickItem("길한방향");
						}}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>길한방향</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => {
							Alert.alert("알림","업데이트 예정")
						}}
					>
						<View
							style={{
								backgroundColor: POINTCOLOR,
								height: DEVICE_HEIGHT * 0.06,
								width: DEVICE_WIDTH * 0.35,
								borderRadius: 10,
								alignItems: "center",
								justifyContent: "center",
								margin: 10,
							}}
						>
							<Text style={styles.menuText}>이용방법</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
			<Modal visible={mainModalVisible}>
				<View style={styles.container}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							width: DEVICE_WIDTH,
							height: Platform.OS==="ios"? DEVICE_HEIGHT * 0.07 + getStatusBarHeight() : DEVICE_HEIGHT * 0.07,
							padding: 10,
							paddingHorizontal: 10,
							backgroundColor: GROUNDCOLOR,
							paddingTop: Platform.OS === "ios" ? getStatusBarHeight() : 0,
						}}
					>
						<View style={{ flex: 1 }}>
							<TouchableOpacity
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}
								onPress={() => {
									setMainModalVisible(false);
								}}
							>
								<Image
									style={{ tintColor: "white" }}
									source={require("../../assets/images/back_icon.png")}
								/>
								<Text
									style={{
										fontSize: 20,
										fontWeight: "500",
										color: "white",
										fontFamily: "SquareRound",
									}}
								>
									뒤로가기
								</Text>
							</TouchableOpacity>
						</View>
						<View
							style={{
								flex: 1,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text
								style={{
									fontSize: 23,
									color: "white",
									fontWeight: "700",
									fontFamily: "SquareRound",
								}}
							>
								운세
							</Text>
						</View>
						<View style={{ flex: 1 }} />
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							width: DEVICE_WIDTH,
							height: DEVICE_HEIGHT * 0.15,
							padding: 10,
							paddingHorizontal: 10,
							borderWidth: 2,
							borderColor: GROUNDCOLOR,
						}}
					>
						<Text style={{ fontSize: 26, fontWeight: "bold" }}>
							{"오늘의 " + category + " 운세"}
						</Text>
					</View>
					<View style={styles.buttonContainer}>
						<Text
							style={{
								fontSize: 22,
								fontWeight: "600",
								fontFamily: "SquareRound",
							}}
						>
							{data}
						</Text>
					</View>
				</View>
			</Modal>
			<Modal visible={subModalVisible} transparent={true}>
				<View style={styles.modalContainer}>
					<View style={styles.modalCon}>
						<TouchableOpacity
							onPress={() => {
								console.log("subModalOn");
							}}
						>
							<Image
								style={{ width: 300, height: 300 }}
								source={require("../../assets/images/dice.gif")}
							/>
							{/* <ExpoFastImage
				uri={require('../../assets/images/dice.gif')}
				style={{width: 300, height: 300}}
			/> */}
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "white",
	},
	buttonContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	userButton: {
		backgroundColor: "white",
		height: DEVICE_HEIGHT * 0.06,
		width: DEVICE_WIDTH * 0.3,
		borderWidth: 2,
		borderColor: GROUNDCOLOR,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	menuButton: {
		backgroundColor: GROUNDCOLOR,
		height: DEVICE_HEIGHT * 0.06,
		width: DEVICE_WIDTH * 0.35,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		margin: 10,
	},
	shareButton: {
		backgroundColor: POINTCOLOR,
		height: DEVICE_HEIGHT * 0.06,
		width: DEVICE_WIDTH * 0.65,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		margin: 10,
	},
	menuButton2: {
		backgroundColor: "white",
		height: DEVICE_HEIGHT * 0.06,
		width: DEVICE_WIDTH * 0.3,
		borderWidth: 2,
		borderColor: GROUNDCOLOR,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		margin: 10,
		position: "absolute",
		bottom: 0,
		right: 0,
	},
	menuButton3: {
		backgroundColor: "grey",
		height: DEVICE_HEIGHT * 0.06,
		width: DEVICE_WIDTH * 0.4,
		borderWidth: 2,
		borderColor: "grey",
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		margin: 10,
		position: "absolute",
		bottom: 0,
		left: 0,
	},
	menuText: {
		fontSize: 20,
		color: "white",
		fontFamily: "SquareRound",
		fontWeight: "bold",
	},
	menuText2: {
		fontSize: 20,
		color: "black",
		fontFamily: "SquareRound",
		fontWeight: "bold",
	},
	menuText3: {
		fontSize: 20,
		color: "white",
		fontFamily: "SquareRound",
		fontWeight: "bold",
	},
	modalContainer: {
		flex: 1,
		alignItems: "center",
		alignContent: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalCon: {
		borderRadius: 10,
		// borderWidth: 2,
		borderColor: GROUNDCOLOR,
		// backgroundColor: "#fff",
		// paddingVertical: 30,
		// paddingHorizontal: 10,
		width: 300,
		height: 300,
		justifyContent: "center",
		alignItems: "center",
	},
	modalContents: {
		alignItems: "center",
		justifyContent: "center",
		width: DEVICE_WIDTH * 0.7,
		height: DEVICE_WIDTH * 0.2,
	},
});
