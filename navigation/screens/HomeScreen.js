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

export default function HomeScreen({ navigation }) {
	const [fontLoaded, setFontLoaded] = useState(false);
	const dispatch = useDispatch();
	const reduxState = useSelector((state) => state);
	// const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userName, setUserName] = useState("");
	const [initRegist, setInitRegist] = useState(false);

	useEffect(async () => {
		_loadFont();
		const unsubscribe = auth.getAuth().onAuthStateChanged((authUser) => {
			// console.log(authUser);
			if (!authUser) {
				initRegisterByAnonymous();
				console.log("3");
				setInitRegist(true);
			} else {
				dispatch(
					setCurrentUser(auth.getAuth().currentUser.displayName)
				);
				setInitRegist(true);
				Linking.getInitialURL().then(async (url) => {
					console.log(url);
					_processUrl(url);
				});

				Linking.addEventListener("url", (e) => {
					const url = e.url;
					_processUrl(url);
				});

				return () => {
					Linking.removeEventListener("url", (e) => {
						// 이벤트 해제
						console.log("remove e.url" + e.url);
					});
				};
			}
		});
		return unsubscribe;
	}, []);

	const initRegisterByAnonymous = () => {
		console.log("1");
		auth.signInAnonymously(auth.getAuth())
			.then((anonymousUser) => {
				auth.updateProfile(anonymousUser.user, {
					displayName: "비회원",
				});
				try {
					db.setDoc(
						doc(db.getFirestore(), "users", anonymousUser.user.uid),
						{
							recordNum: 10,
							recommended: 0,
						}
					);
				} catch (error) {
					console.log("DB Error : " + error);
				}
				dispatch(setCurrentUser("비회원"));
				console.log("익명 로그인.");
				console.log("익명 UID : " + auth.getAuth().currentUser.uid);
			})
			.catch((error) => {
				if (error.code === "auth/operation-not-allowed") {
					console.log("Enable anonymous in your firebase console.");
				}
				console.error(error);
			});
	};

	const _processUrl = async (url) => {
		if (url != null && url.includes("https://jmwschool.page.link")) {
			const paramArray = url.split("/");
			const userUID = paramArray[paramArray.length - 1];
			console.log(userUID);
			const docRef0 = db.doc(
				db.getFirestore(),
				"users",
				auth.getAuth().currentUser.uid
			);
			const docSnap0 = await db.getDoc(docRef0);
			if (docSnap0.exists() && docSnap0.data().recommended == 0) {
				const docRef = db.doc(db.getFirestore(), "users", userUID);
				const docSnap = await db.getDoc(docRef);
				if (docSnap.exists()) {
					console.log("Document data:", docSnap.data());
				} else {
					// doc.data() will be undefined in this case
					console.log("No such document!");
				}
				try {
					db.updateDoc(doc(db.getFirestore(), "users", userUID), {
						recordNum: docSnap.data().recordNum + 5,
					});
					db.updateDoc(
						doc(
							db.getFirestore(),
							"users",
							auth.getAuth().currentUser.uid
						),
						{
							recommended: 1,
						}
					);
				} catch (error) {
					console.log("DB Error : " + error);
					Alert.alert("DB error", error);
				}
			}
		}
	};

	const createLink = async () => {
		if (auth.getAuth().currentUser.isAnonymous) {
			return Alert.alert(
				"비회원 사용자",
				"우측 상단의 [회원가입]을 해주세요."
			);
		}
		const UID = auth.getAuth().currentUser.uid;
		console.log("user : " + UID);
		try {
			const payload = {
				dynamicLinkInfo: {
					domainUriPrefix: "https://jmwschool.page.link",
					link: `https://jmwschool.page.link/newUser/${UID}`,
					androidInfo: {
						androidPackageName: "host.exp.jmwschool",
					},
					iosInfo: {
						iosBundleId: "host.exp.jmwschool",
					},
					// socialMetaTagInfo: {
					//   socailTitle: 'Test the title',
					//   socialDescription: 'Testing the description.'
					// }
				},
			};
			const url = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyAj2uJrWehb1MqSPb00eFFXk4BR_g4zDJU`;
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			// console.log(response.json().then((e)=>console.log(e)))
			const json = await response.json();
			const result = await Share.share({
				message: "자미원학당\n이름녹음 어플",
				url: json.shortLink,
				title: `자미원학당`,
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					console.log("action if");
				} else {
					console.log("action else");
				}
			} else if (result.action === Share.dismissedAction) {
				console.log("dismissed");
			}
		} catch (error) {
			console.log("Linking Errors: " + error);
		}
	};

	const _loadFont = async () => {
		await Font.loadAsync({
			SquareRound: require("../../assets/fonts/NanumSquareRound.otf"),
			CutiveMono: require("../../assets/fonts/CutiveMono-Regular.ttf"),
			Jua: require("../../assets/fonts/Jua-Regular.ttf"),
		});
		setFontLoaded(true);
	};

	const _logOut = async () => {
		if (auth.getAuth().currentUser == null) {
			navigation.navigate("로그인");
		} else {
			auth.getAuth().signOut();
			// setIsLoggedIn(false)
			Alert.alert("알림", "로그아웃 완료");
			console.log("로그아웃");
		}
	};

	if (!initRegist) {
		return (
			<View style={styles.container}>
				<Text>Loading Page</Text>
			</View>
		);
	} else {
		return (
			<View style={styles.container}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						width: DEVICE_WIDTH,
						padding: 10,
						paddingHorizontal: 10,
						borderWidth: 2,
						borderColor: GROUNDCOLOR,
					}}
				>
					<Text style={{ fontSize: 26, fontWeight: "bold" }}>
						{reduxState.record.currentUserState + " 사용자님"}
					</Text>
					{auth.getAuth()?.currentUser?.isAnonymous ? (
						<TouchableOpacity
							onPressOut={() => navigation.navigate("로그인")}
						>
							<View style={styles.userButton}>
								<Text style={styles.menuText2}>회원가입</Text>
							</View>
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							onPressOut={() => navigation.navigate("회원정보")}
						>
							<View style={styles.userButton}>
								<Text style={styles.menuText2}>회원정보</Text>
							</View>
						</TouchableOpacity>
					)}
				</View>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => navigation.navigate("녹음")}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>녹음기능</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => navigation.navigate("운세")}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>오늘의 운세</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => 
							// navigation.navigate("성명학")
							Alert.alert("알림","업데이트 예정")
					}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>성명학 상담신청</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => navigation.navigate("돋보기")}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>돋보기 & 손전등</Text>
						</View>
					</TouchableOpacity>
					{/* <TouchableOpacity
						underlayColor={"transparent"}
						onPress={() =>
							navigation.navigate("지문")
						}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>지문 적성검사 등록</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						underlayColor={"transparent"}
						onPress={() => Alert.alert("추후 업데이트")}
					>
						<View style={styles.menuButton}>
							<Text style={styles.menuText}>
								모든 가능하게 하는 힘
							</Text>
						</View>
					</TouchableOpacity> */}
					<TouchableOpacity
						underlayColor={"transparent"}
						// onPress={() => _share()}
						onPress={() => createLink()}
					>
						<View style={styles.shareButton}>
							<Text style={styles.menuText}>앱 공유하기</Text>
						</View>
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					underlayColor={"transparent"}
					onPress={() => {
						navigation.navigate("게시판")
					}}
					style={styles.menuButton2}
				>
					<View>
						<Text style={styles.menuText2}>문의 하기</Text>
					</View>
				</TouchableOpacity>
				
				{/* <TouchableOpacity
					underlayColor={"transparent"}
					onPress={() => {
						navigation.navigate("관리자페이지");
					}}
					style={styles.menuButton3}
				>
					<View>
						<Text style={styles.menuText3}>관리자 메뉴</Text>
					</View>
				</TouchableOpacity> */}
			</View>
		);
	}
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
		width: DEVICE_WIDTH * 0.65,
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
		borderColor: 'grey',
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
