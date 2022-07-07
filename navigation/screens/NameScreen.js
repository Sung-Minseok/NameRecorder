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
} from "react-native";

import * as Font from "expo-font";
import * as Hangul from "hangul-js";
// Screen Size
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

//colors
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";

import { auth, db } from "../../Firebase";

//redux
import { useDispatch, useSelector } from "react-redux";
import { doc } from "firebase/firestore";
import { TextInput } from "react-native-gesture-handler";

export default function NameScreen({ navigation }) {
	const [fontLoaded, setFontLoaded] = useState(false);
	const dispatch = useDispatch();
	const reduxState = useSelector((state) => state);
	// const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userName, setUserName] = useState("");
	const [mainModalVisible, setMainModalVisible] = useState(false);
	const [subModalVisible, setSubModalVisible] = useState(false);
	const [data, setData] = useState([]);
	const [category, setCategory] = useState("");
	const [currentName, setCurrentName] = useState("");
    const [birth, setBirth] = useState("");
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

    // const process_name = () => {

    // }
	const aaa = {
		'ㄱ': 1,
		'ㄴ': 1,
		'ㄷ': 2,
		'ㄹ': 2,
		'ㅁ': 3,
		'ㅂ': 3,
		'ㅅ': 2,
		'ㅇ': 1,
		'ㅈ': 3,
		'ㅊ': 4,
		'ㅋ': 2,
		'ㅌ': 3,
		'ㅍ': 4,
		'ㅎ': 3,
		'ㄲ': 2,
		'ㄸ': 4,
		'ㅃ': 6,
		'ㅆ': 4,
		'ㅉ': 5
	}
	const bbb = {
		'ㅏ': 2,
		'ㅑ': 3,
		'ㅓ': 2,
		'ㅕ': 3,
		'ㅗ': 2,
		'ㅛ': 3,
		'ㅜ': 2,
		'ㅠ': 3,
		'ㅡ': 1,
		'ㅣ': 1,
		'ㅢ': 2,
		'ㅚ': 3,
		'ㅘ': 4,
		'ㅙ': 5,
		'ㅟ': 3,
		'ㅝ': 4,
		'ㅞ': 5
	}

	const clickItem = (item) => {
		let name = "";
		if (currentName.length > 2) {
			name = currentName.substring(0, 3);
		} else {
			name = currentName;
		}
		const af_name = Hangul.d(name, true);
		console.log(bbb[af_name[1][1]]);

        let birth2 = "";
        birth2 = birth.substring(0,4);
        console.log(birth2)
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
					{"성명학"}
				</Text>
			</View>
			<View style={styles.buttonContainer}>
				<Text>메인 기능 들어갈 부분</Text>
				<TextInput
                    placeholder="이름을 입력해주세요."
					style={styles.textInput}
					onChangeText={(text) => {
						setCurrentName(text);
					}}
					value={currentName}
				></TextInput>
                <TextInput
                    placeholder="생년월일을 입력해주세요(예: 19880912)"
					style={styles.textInput}
					onChangeText={(text) => {
						setBirth(text);
					}}
					value={birth}
				></TextInput>
				<TouchableOpacity
					onPress={() => {
						clickItem();
					}}
				>
					<Text>버튼</Text>
				</TouchableOpacity>
			</View>
			<Modal visible={mainModalVisible}>
				<View style={styles.container}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							width: DEVICE_WIDTH,
							height: DEVICE_HEIGHT * 0.07,
							padding: 10,
							paddingHorizontal: 10,
							backgroundColor: GROUNDCOLOR,
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
