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
	ScrollView,
} from "react-native";

import * as Font from "expo-font";
import * as Hangul from "hangul-js";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {RadioButton} from 'react-native-paper';
//Data
import * as Data from "../../assets/Data/NameData.js";
import RadioButtonRN from "radio-buttons-react-native"
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
	const [currentName, setCurrentName] = useState("");
	const [birth, setBirth] = useState("");
	const [birthDisplay, setBirthDisplay] = useState("00000000")
	const [firstName, setFirstName] = useState(["", "", "", ""]);
	const [secondName, setSecondName] = useState(["", "", "", ""]);
	const [thirdName, setThirdName] = useState(["", "", "", ""]);
	const [yearName, setYearName] = useState("");
	const [core1, setCore1] = useState("ㅏ");
	const [core2, setCore2] = useState("ㅏ");
	const [cons, setCons] = useState(["","","","",""]);
	const [buttonChecked, setButtonChecked] = useState("male")
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

	const radioButton = [
		{
			label: '남성',
			accessibilityLabel: 'male'
		},
		{
			label: '여성',
			accessibilityLabel: 'female'
		}
	];

	const vowel1 = Data.vowel1;
	const vowel2 = Data.vowel2;
	const year1 = Data.year1;
	const year2 = Data.year2;

	const check1 = Data.check1;
	const check2 = Data.check2;
	const check3 = Data.check3;
	const getConstantVowel = (kor) => {
		let sum = 0;
		const f = [
			"ㄱ",
			"ㄲ",
			"ㄴ",
			"ㄷ",
			"ㄸ",
			"ㄹ",
			"ㅁ",
			"ㅂ",
			"ㅃ",
			"ㅅ",
			"ㅆ",
			"ㅇ",
			"ㅈ",
			"ㅉ",
			"ㅊ",
			"ㅋ",
			"ㅌ",
			"ㅍ",
			"ㅎ",
		];
		const s = [
			"ㅏ",
			"ㅐ",
			"ㅑ",
			"ㅒ",
			"ㅓ",
			"ㅔ",
			"ㅕ",
			"ㅖ",
			"ㅗ",
			"ㅘ",
			"ㅙ",
			"ㅚ",
			"ㅛ",
			"ㅜ",
			"ㅝ",
			"ㅞ",
			"ㅟ",
			"ㅠ",
			"ㅡ",
			"ㅢ",
			"ㅣ",
		];
		const t = [
			"",
			"ㄱ",
			"ㄲ",
			"ㄳ",
			"ㄴ",
			"ㄵ",
			"ㄶ",
			"ㄷ",
			"ㄹ",
			"ㄺ",
			"ㄻ",
			"ㄼ",
			"ㄽ",
			"ㄾ",
			"ㄿ",
			"ㅀ",
			"ㅁ",
			"ㅂ",
			"ㅄ",
			"ㅅ",
			"ㅆ",
			"ㅇ",
			"ㅈ",
			"ㅊ",
			"ㅋ",
			"ㅌ",
			"ㅍ",
			"ㅎ",
		];

		const ga = 44032;
		let uni = kor.charCodeAt(0);

		uni = uni - ga;

		let fn = parseInt(uni / 588);
		let sn = parseInt((uni - fn * 588) / 28);
		let tn = parseInt(uni % 28);
		sum = vowel1[f[fn]] + vowel2[s[sn]] + vowel1[t[tn]];
		return {
			f: f[fn],
			s: s[sn],
			t: t[tn],
			x: sum,
		};
	};
	const result1 = Data.result1;
	const result2 = Data.result2;

	const processResult = (pos, x, y) => {
		if (x == "") {
			return "";
		}
		let a = check1[y];
		let b = check2[x];
		if (pos == 1) {
			return result1[a][b];
		} else {
			return result2[a][b];
		}
	};

	const processName2 = (vowel, y1, y2) => {
		let vPos = vowel["x"] % 2 == 0 ? -1 : 1;
		let posLeft = check3[y1] * vPos;
		let posRight = check3[y2] * vPos;
		let left1 = processResult(posLeft, vowel["f"], y1);
		let left2 = processResult(posLeft, vowel["t"], y1);
		let right1 = processResult(posRight, vowel["f"], y2);
		let right2 = processResult(posRight, vowel["t"], y2);

		return [left1, left2, right1, right2];
	};

	const processName = (text) => {
		let birth2 = birth;
		birth2 = birth2.substring(0, 4);
		let birth3 = birth.substring(4, 8);
		let birthCheck = 4
		if(Data.season23.includes(Number(birth2))){
			console.log("입춘일 변경")
			birthCheck = 3
		}else if(Data.season25.includes(Number(birth2))){
			console.log("입춘일 변경")
			birthCheck = 5
		}

		if(birth3[1]==1){
			console.log("출생년도 -1")
			birth2 = birth2 - 1
		}else if(birth3[1]==2 && Number(birth3.substring(2,4))<birthCheck){
			console.log("출생년도 -1")
			birth2 = birth2 - 1
		}
		setBirthDisplay(birth2)
		let y1 = year1[birth2.toString()[3]];
		let y2 = year2[((birth2 - 1683) % 12)];
		let year = y1 + y2;
		setYearName(year);
		console.log(year);

		let name = "";
		if (text.length > 2) {
			name = text.substring(0, 3);
		} else {
			name = text;
		}
		let first = getConstantVowel(name[0]);
		let second = getConstantVowel(name[1]);
		let third = {
			f: "",
			s: "",
			t: "",
			x: 0,
		};
		let f = processName2(first, y1, y2);
		let s = processName2(second, y1, y2);
		let t = ["","","",""];
		if(name.length === 3){
			third = getConstantVowel(name[2]);
			t = processName2(third, y1, y2);
		}
		console.log("f : " + f);
		console.log("s : " + s);
		console.log("t : " + t);
		setCore1(s[0]);
		setCore2(s[2]);

		const convert = {
			목: 0,
			화: 2,
			토: 4,
			금: 6,
			수: 8,
			"": -1
		}
		let nameCons = [first['f'],first['t'],second['f'],second['t'],third['f'],third['t']]
		let nameCons2 = [Data.check2[nameCons[0]],Data.check2[nameCons[1]],Data.check2[nameCons[2]],Data.check2[nameCons[3]],Data.check2[nameCons[4]],Data.check2[nameCons[5]]]
		let nameCons3 = [convert[nameCons2[0]],convert[nameCons2[1]],convert[nameCons2[2]],convert[nameCons2[3]],convert[nameCons2[4]],convert[nameCons2[5]]]
		console.log("nameCons : "+ nameCons3)
		let pn = [];
		for( let i=0; i<5; i++){
			if(nameCons3[i+1]===-1){
				pn.push("")
				if(i!=4){
					pn.push(checkPN(nameCons3[i], nameCons3[i+2]))
					i++
				}
			}else{
				pn.push(checkPN(nameCons3[i], nameCons3[i+1]))
			}
		}
		console.log("PN : "+ pn)
		setCons(pn)
		setFirstName(f);
		setSecondName(s);
		setThirdName(t);

		return [first, second, third];
	};
	
	

	const checkPN = (a, b) => {
		if(a-b === 2 || a-b === 8){
			return 'p1'
		}else if(a-b === -2 || a-b=== -8){
			return 'p2'
		}else if(a-b === -6){
			return 'n1'
		}else if(a-b === 4 || a-b === 6){
			return 'n2'
		}else if(a-b === 0){
			return 's'
		}else{
			return 'x'
		}
	}

	const clickItem = () => {
		if(currentName==="" || currentName.length<2){
			return Alert.alert("알림","이름을 입력해주세요.")
		}
		if(!Hangul.isCompleteAll(currentName)){
			return Alert.alert("알림","이름을 정확히 입력해주세요.")
		}
		let pattern = /^[0-9]+$/;
		if(!pattern.test(birth) || birth.length != 8 || birth.substring(0,4)-1683 < 1){
			return Alert.alert("알림","생년월일을 확인해주세요.")
		} 
		
		const name_af = processName(currentName);
		console.log(name_af);
		setMainModalVisible(true);
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
				<Text style={{ fontSize: 22, fontWeight: "bold" }}>
					{"결과를 위해 이름, 생년월일, 성별을 정확히 입력해주세요."}
				</Text>
			</View>
			<View
				style={{
					width: DEVICE_WIDTH * 0.8,
					flex: 1,
					marginVertical: 10,
				}}
			>
				<Text style={{ fontSize: 25, fontWeight: "bold" }}>성명</Text>
				<TextInput
					placeholder="이름을 입력해주세요."
					style={{
						fontSize: 20,
						borderBottomWidth: 2,
						borderColor: GROUNDCOLOR,
					}}
					onChangeText={(text) => {
						setCurrentName(text);
					}}
					value={currentName}
				></TextInput>
				<Text style={{ fontSize: 25, fontWeight: "bold", marginTop:20 }}>
					생년월일
				</Text>
				<TextInput
					placeholder="예시) 19880912"
					style={{
						fontSize: 20,
						borderBottomWidth: 2,
						borderColor: GROUNDCOLOR,
					}}
					onChangeText={(text) => {
						setBirth(text);
					}}
					value={birth}
				></TextInput>
				<RadioButtonRN
					data={radioButton}
					activeColor={GROUNDCOLOR}
					style={{flexDirection: 'row', justifyContent: 'space-between'}}
					textStyle={{fontSize: 18, fontWeight: 'bold', fontFamily: 'SquareRound', alignSelf: 'center'}}
					boxStyle={{borderWidth:2, width: DEVICE_WIDTH*0.35, borderColor: GROUNDCOLOR}}
					selectedBtn={(e)=> {
						setButtonChecked(e.accessibilityLabel)
					}}
				/>
				<TouchableOpacity
					style={{alignItems: 'center', justifyContent:'center', marginTop: 30}}
					onPress={() => {
						clickItem();
					}}
				>
					<View style={{width: DEVICE_WIDTH*0.5,height: DEVICE_WIDTH*0.12, borderWidth:2, borderColor: GROUNDCOLOR,backgroundColor:GROUNDCOLOR, borderRadius:5, justifyContent:'center',alignItems:'center'}}>
						<Text style={{fontSize: 22, fontFamily: 'SquareRound', fontWeight:'bold', color:'white'}}>확인하기</Text>
					</View>
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
							height:
								Platform.OS === "ios"
									? DEVICE_HEIGHT * 0.07 +
									  getStatusBarHeight()
									: DEVICE_HEIGHT * 0.07,
							// padding: 10,
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
									setBirth("");
									setYearName("");
									setCurrentName("");
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
								성명학
							</Text>
						</View>
						<View style={{ flex: 1 }} />
					</View>
					<ScrollView>
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
							<Text style={{ fontSize: 40, fontWeight: "bold" }}>
								{birthDisplay+
									"-" +
									yearName +
									"년생"}
							</Text>
						</View>
						<View
							style={{
								alignItems: "center",
								justifyContent: "space-between",
								flex: 1,
								// borderWidth: 1,
								// borderColor: GROUNDCOLOR,
								width: DEVICE_WIDTH,
							}}
						>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-around",
									alignItems: "center",
									width: DEVICE_WIDTH,
									height: DEVICE_HEIGHT * 0.1,
									borderWidth: 2,
									borderColor: GROUNDCOLOR,
									flex: 1,
								}}
							>
								<View
									style={{
										justifyContent: "center",
										alignItems: "center",
										flex: 1,
									}}
								>
									<View
										style={{
											flex: 1,
											borderRightWidth: 2,
											borderBottomWidth: 2,
											width: DEVICE_WIDTH * 0.3,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text style={{ fontSize: 30 }}>
											{firstName[0]}
										</Text>
									</View>
									<View
										style={{
											flex: 1,
											borderRightWidth: 2,
											width: DEVICE_WIDTH * 0.3,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text style={{ fontSize: 30 }}>
											{firstName[1]}
										</Text>
									</View>
								</View>
								<View
									style={{
										justifyContent: "center",
										alignItems: "center",
										flex: 1,
									}}
								>
									<Text
										style={{
											fontSize: 40,
											fontWeight: "bold",
										}}
									>
										{currentName[0]}
									</Text>
									<View style={{position: 'absolute', right: 10}}>
										<Text style={{fontSize: 35, fontWeight:'500', color: cons[0]==='p1'||cons[0]==='p2'? 'blue': cons[0]==='n1'||cons[0]==='n2'?'red':'black'}}>
										{cons[0]===''?'－':('p1'||'n1')? '↑': '↓'}
										</Text>
									</View>
								</View>
								<View
									style={{
										justifyContent: "center",
										alignItems: "center",
										flex: 1,
									}}
								>
									<View
										style={{
											flex: 1,
											borderLeftWidth: 2,
											borderBottomWidth: 2,
											width: DEVICE_WIDTH * 0.3,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text style={{ fontSize: 30 }}>
											{firstName[2]}
										</Text>
									</View>
									<View
										style={{
											flex: 1,
											borderLeftWidth: 2,
											width: DEVICE_WIDTH * 0.3,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text style={{ fontSize: 30 }}>
											{firstName[3]}
										</Text>
									</View>
								</View>
							</View>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-around",
									alignItems: "center",
									width: DEVICE_WIDTH,
									height: DEVICE_HEIGHT * 0.1,
									borderWidth: 2,
									borderColor: GROUNDCOLOR,
									flex: 1,
								}}
							>
								<View
									style={{
										justifyContent: "center",
										alignItems: "center",
										flex: 1,
									}}
								>
									<View
										style={{
											flex: 1,
											borderRightWidth: 2,
											borderBottomWidth: 2,
											width: DEVICE_WIDTH * 0.3,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text style={{ fontSize: 30 }}>
											{secondName[0]}
										</Text>
									</View>
									<View
										style={{
											flex: 1,
											borderRightWidth: 2,
											width: DEVICE_WIDTH * 0.3,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text style={{ fontSize: 30 }}>
											{secondName[1]}
										</Text>
									</View>
								</View>
								<View
									style={{
										justifyContent: "center",
										alignItems: "center",
										flex: 1,
									}}
								>
									<Text
										style={{
											fontSize: 40,
											fontWeight: "bold",
										}}
									>
										{currentName[1]}
									</Text>
									<View style={{position: 'absolute', right: 10}}>
										<Text style={{fontSize: 35, fontWeight:'500', color: cons[2]==='p1'||cons[2]==='p2'? 'blue': cons[2]==='n1'||cons[2]==='n2'?'red':'black'}}>
										{cons[2]===''?'－':('p1'||'n1')? '↑': '↓'}
										</Text>
									</View>
									<View style={{position: 'absolute', right: 10, bottom: 40}}>
										<Text style={{fontSize: 35, fontWeight:'500', color: cons[1]==='p1'||cons[1]==='p2'? 'blue': cons[1]==='n1'||cons[1]==='n2'?'red':'black'}}>
										{cons[1]===''?'－':('p1'||'n1')? '↑': '↓'}
										</Text>
									</View>
								</View>
								<View
									style={{
										justifyContent: "center",
										alignItems: "center",
										flex: 1,
									}}
								>
									<View
										style={{
											flex: 1,
											borderLeftWidth: 2,
											borderBottomWidth: 2,
											width: DEVICE_WIDTH * 0.3,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text style={{ fontSize: 30 }}>
											{secondName[2]}
										</Text>
									</View>
									<View
										style={{
											flex: 1,
											borderLeftWidth: 2,
											width: DEVICE_WIDTH * 0.3,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text style={{ fontSize: 30 }}>
											{secondName[3]}
										</Text>
									</View>
								</View>
							</View>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-around",
									alignItems: "center",
									width: DEVICE_WIDTH,
									height: DEVICE_HEIGHT * 0.1,
									borderWidth: 2,
									borderBottomWidth: 4,
									borderColor: GROUNDCOLOR,
									flex: 1,
								}}
							>
								<View
									style={{
										justifyContent: "center",
										alignItems: "center",
										flex: 1,
									}}
								>
									<View
										style={{
											flex: 1,
											borderRightWidth: 2,
											borderBottomWidth: 2,
											width: DEVICE_WIDTH * 0.3,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text style={{ fontSize: 30 }}>
											{thirdName[0]}
										</Text>
									</View>
									<View
										style={{
											flex: 1,
											borderRightWidth: 2,
											width: DEVICE_WIDTH * 0.3,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text style={{ fontSize: 30 }}>
											{thirdName[1]}
										</Text>
									</View>
								</View>
								<View
									style={{
										justifyContent: "center",
										alignItems: "center",
										flex: 1,
									}}
								>
									<Text
										style={{
											fontSize: 40,
											fontWeight: "bold",
										}}
									>
										{currentName[2]}
									</Text>
									<View style={{position: 'absolute', right: 10}}>
										<Text style={{fontSize: 35, fontWeight:'500', color: cons[4]==='p1'||cons[4]==='p2'? 'blue': cons[4]==='n1'||cons[4]==='n2'?'red':'black'}}>
										{cons[4]===''?'－':('p1'||'n1')? '↑': '↓'}
										</Text>
									</View>
									<View style={{position: 'absolute', right: 10, bottom: 40}}>
										<Text style={{fontSize: 35, fontWeight:'500', color: cons[3]==='p1'||cons[3]==='p2'? 'blue': cons[3]==='n1'||cons[3]==='n2'?'red':'black'}}>
										{cons[3]===''?'－':('p1'||'n1')? '↑': '↓'}
										</Text>
									</View>
								</View>
								<View
									style={{
										justifyContent: "center",
										alignItems: "center",
										flex: 1,
									}}
								>
									<View
										style={{
											flex: 1,
											borderLeftWidth: 2,
											borderBottomWidth: 2,
											width: DEVICE_WIDTH * 0.3,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text style={{ fontSize: 30 }}>
											{thirdName[2]}
										</Text>
									</View>
									<View
										style={{
											flex: 1,
											borderLeftWidth: 2,
											width: DEVICE_WIDTH * 0.3,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text style={{ fontSize: 30 }}>
											{thirdName[3]}
										</Text>
									</View>
								</View>
							</View>
						</View>
						<View style={{ marginBottom: 30 }}>
							<Text style={{ fontSize: 20, fontWeight: "bold" }}>
								{"상생 중심 에너지 : " + core1}
							</Text>
							<Text
								style={{
									fontSize: 17,
									marginVertical: 5,
									marginHorizontal: 5,
								}}
							>
								{
									Data.coreName[core1.toString()][
										core2.toString()
									]["main"]
								}
							</Text>
							<Text style={{ fontSize: 20, fontWeight: "bold" }}>
								{"상생 보조 에너지 : " + core2}
							</Text>
							<Text
								style={{
									fontSize: 17,
									marginVertical: 5,
									marginHorizontal: 5,
								}}
							>
								{
									Data.coreName[core1.toString()][
										core2.toString()
									]["sub"]
								}
							</Text>
							<Text style={{ fontSize: 20, fontWeight: "bold" }}>
								{"상극 중심 에너지 : " + core1}
							</Text>
							<Text
								style={{
									fontSize: 17,
									marginVertical: 5,
									marginHorizontal: 5,
								}}
							>
								{
									Data.coreNameNeg[core1.toString()]
								}
							</Text>
						</View>
					</ScrollView>
				</View>
			</Modal>
			{/* <Modal visible={subModalVisible} transparent={true}>
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
						</TouchableOpacity>
					</View>
				</View>
			</Modal> */}
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
