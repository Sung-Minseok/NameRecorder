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
	ScrollView,
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
	const [wayModalVisible, setWayMoadlVisible] = useState(false);
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
							// Alert.alert("알림", "업데이트 예정");
							setWayMoadlVisible(true);
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
							height:
								Platform.OS === "ios"
									? DEVICE_HEIGHT * 0.07 +
									  getStatusBarHeight()
									: DEVICE_HEIGHT * 0.07,
							padding: 10,
							paddingHorizontal: 10,
							backgroundColor: GROUNDCOLOR,
							paddingTop:
								Platform.OS === "ios"
									? getStatusBarHeight()
									: 0,
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
			<Modal visible={wayModalVisible}>
				<View style={styles.modalContainer2}>
					<View style={styles.modalHeader2}>
						<TouchableOpacity
							onPress={() => {
								setWayMoadlVisible(false);
							}}
						>
							<View
								style={{
									height: 32,
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Image
									source={require("../../assets/images/photo/x.png")}
								/>
								<Text
									style={{
										fontSize: 20,
										fontWeight: "bold",
										marginLeft: 5,
									}}
								>
									창 닫기
								</Text>
							</View>
						</TouchableOpacity>
					</View>
					<ScrollView
						style={{
							backgroundColor: "white",
							borderRightWidth: 2,
							borderLeftWidth: 2,
							borderColor: "grey",
							paddingHorizontal: 10,
						}}
					>
						<View>
							<Text style={{ fontSize: 20, fontWeight: "bold" }}>
								자미원학당의 오늘의 운세 안내
							</Text>
							<Text style={{ fontSize: 18, fontWeight: "500" }}>
								{
									"오늘의 운세는 주역의 괘를  쉽게 풀이하는 것이 어려워 이곳에 주역의 괘를 어플에 적용시켜 만든 운세보기다. \n살아 가면서 오늘의 하루가 어떨까 궁굼 하신 분은 오늘의 운세를 내가 직접 주역의 괘로 뽑아서 운세를 볼수 있도록 어플을 만들었다.\n\n"
								}
							</Text>
							<Text style={{ fontSize: 18, fontWeight: "500" }}>
								{
									"하루에 일진에 대해 점을 치는 방법은 여러 가지가 있다. \n1.기구를 이용하는것에 대표적인 것이 주사위 이며 팔괘가 적힌 산가지도 많이 사용 한다. \n2.숫자로 점을 치는것중 전화번호 차번호  카드번호 통장번호등 다양하다. \n3.시간과 나이로도 점을 칠수 있다. \n4.옷 색깔도 모두 오행이 있기 때문에 오행의 숫자로 변환하여 점을 칠수 있다. \n5.단위로도 칠수 있다. 무게나 길이가 그 대표적인 예 이다. \n6.방위로도 점을 칠수 있다. 방향에 따른 숫자가 정해져 있기 때문이다.\n\n"
								}
							</Text>
							<Text style={{ fontSize: 18, fontWeight: "500" }}>
								{
									"여기에서는 가장 손쉽게 보여 질수 있는 8면체 주사위로 점을 친다. \n먼저 나오는 숫자는 주역의 괘에서 하괘에 속하며 나중에 나는 숫자는 상괘의 괘에 해당 된다. \n易(역)은 바꾸다란 의미가 있기에 먼저 나오는 숫자가 뒤 또는 아래로 가는 하괘이며 뒤에 나오는 숫자를 상괘 또는 앞의 숫자로 간주 하는 방법 이다."
								}
							</Text>
							<Text style={{ fontSize: 18, fontWeight: "500" }}>
								{
									"하루에 점은 3가지만 치게 된다. 같은 일에 대하여는 두 번 선택하여도 첫 번째 나온 괘가 그 일의 답으로 보기 때문에 두 번 세 번 하여도 결과는 첫 번에 나온 것이 답이다. 좋은 답을 구하기 위해 연속으로 점을 친다 해도 답은 첫 번째 나온 것이 답이다.\n\n"
								}
							</Text>
							<Text style={{ fontSize: 18, fontWeight: "500" }}>
								{
									"점을 치기전 구체적인 내용을 마음속으로 생각 하고 점을 친다. \n예) 오늘 소개팅을 하는 남자는 연봉이 5천이상이다. \n예) 오늘 계약건이 성공 한다. 안한다. \n예) 오늘 동쪽으로 가면 귀인을 만난다.\n\n"
								}
							</Text>
							<Text style={{ fontSize: 18, fontWeight: "500" }}>
								{
									"이렇게 구체적으로 질문을 해야 점의 효력이 있다. \n많은 분들이 하루의 일을 주역을 이용해 오늘의 운세를 접해 보시기 바랍니다."
								}
							</Text>
						</View>
					</ScrollView>
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
	modalContainer2: {
		flex: 1,
		alignItems: "center",
		alignContent: "center",
		// justifyContent: "center",
		paddingTop: Platform.OS === "ios" ? getStatusBarHeight() : 0,
		paddingBottom: Platform.OS === "ios" ? 40 : 0,
		backgroundColor: "rgba(0,0,0,0.1)",
	},
	modalHeader2: {
		flexDirection: "row",
		borderTopStartRadius: 10,
		borderTopEndRadius: 10,
		width: DEVICE_WIDTH,
		height: DEVICE_WIDTH * 0.12,
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "space-between",
		borderTopWidth: 2,
		borderRightWidth: 2,
		borderLeftWidth: 2,
		borderColor: "grey",
		paddingHorizontal: 10,
	},
	modalContents: {
		width: DEVICE_WIDTH,
		backgroundColor: "white",
		paddingHorizontal: 10,
	},
});
