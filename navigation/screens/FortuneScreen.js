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
} from "react-native";
import * as Font from "expo-font";

// Screen Size
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

//colors
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";

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

	return (
		<View style={styles.container}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					width: DEVICE_WIDTH,
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
						onPress={() => console.log("click item")}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>연애</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => console.log("click item")}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>사업</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => console.log("click item")}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>소망</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => console.log("click item")}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>승진</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => console.log("click item")}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>시험</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => console.log("click item")}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>매매</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => console.log("click item")}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>개업</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => console.log("click item")}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>소송</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => console.log("click item")}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>증권</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => console.log("click item")}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>여행</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => console.log("click item")}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>길한방향</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => console.log("click item")}
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
});
