import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	Alert,
	Modal,
	Image,
	TextInput,
	Platform,
	FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db, storage } from "../../Firebase";

import * as FileSystem from "expo-file-system";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Camera } from "expo-camera";
import { useSelector } from "react-redux";
import { async } from "@firebase/util";
const FingerDir = "fingerPrint2/";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const BACKGROUNDCOLOR = "#F4ECE6";
export default function FingerPrintScreen(props) {
	const [modalVisible, setModalVisible] = useState(false);
	const [nameModlaVisible, setNameModalVisible] = useState(false);
	const [photoModalVisible, setPhotoModalVisible] = useState(false);
	const [cameraModalVisible, setCameraModalVisible] = useState(false);
	const [currentFinger, setCurrentFinger] = useState("");
	const [currentName, setCurrentName] = useState("");
	const [userList, setUserList] = useState([]);
	const [hasPermission, setHasPermission] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [flash, setFlash] = useState(Camera.Constants.FlashMode.torch);
	const [cam, setCam] = useState(null);
	const OS = Platform.OS;
	const reduxState = useSelector((state) => state);
	const [fingerCount, setFingerCount] = useState(0);
	const [uid, setUid] = useState("");
	const [boardModalVisible, setBoardModalVisible] = useState(false);
	const [boardContents, setBoardContents] = useState("");
	const [birth, setBirth] = useState("");
  const [dirList, setDirList] = useState([]);
	useEffect(() => {
		// console.log(props)
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
			ensureDirExists();
			getFingerUser();
			const u = await auth.getAuth().currentUser.uid;
			setUid(u);
		})();
	}, []);
  
	const ensureDirExists = async () => {
		const dir = FileSystem.documentDirectory + FingerDir;
		const dirInfo = await FileSystem.getInfoAsync(dir);
		if (!dirInfo.exists) {
			console.log("directory doesn't exist, creating...");
			await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
		} else {
			console.log("directory alreay exists");
		}
	};

  const cleanupOldFiles = async (folder, fileId) => {
    const directoryFiles = await FileSystem.readDirectoryAsync(folder);
    const previousImages = directoryFiles.filter( file => {
      if(file.includes(fileId)){
        return true;
      }
      return false;
    })
    if(previousImages.length){
      previousImages.forEach(previousImage =>{
        FileSystem.deleteAsync(folder+previousImage)
      })
    }
  }

	// const uploadFingerPrint = async () => {
	//   const metadata = {
	//     contentType: 'image/jpg',
	//   };
	//   const s = storage.getStorage();
	//   for(var i=1; i<6; i++){
	//     const picture = await FileSystem.getInfoAsync(
	//       FileSystem.documentDirectory + FingerDir + encodeURI(currentName)+'/left'+i+'.jpg'
	//     );
	//     const file = await fetch(FileSystem.documentDirectory + FingerDir + encodeURI(currentName)+'/left'+i+'.jpg')
	//     const sRef = storage.ref(s, uid+'/'+currentName+'/'+'left'+i+'.jpg')
	//     // console.log(file)
	//     const upload = storage.uploadBytes(sRef, file, metadata)
	//   }
	//   for(var i=1; i<6; i++){
	//     const picture = await FileSystem.getInfoAsync(
	//       FileSystem.documentDirectory + FingerDir + encodeURI(currentName)+'/right'+i+'.jpg'
	//     );
	//     // console.log(picture)
	//     const sRef = storage.ref(s, uid+'/'+currentName+'/'+'right'+i+'.jpg')
	//     const upload = storage.uploadBytes(sRef, picture.uri, metadata)
	//   }
	//   console.log('upload file complete')
	// }

	const uploadPrint = async () => {
		const metadata = {
			contentType: "image/jpg",
		};
		const s = storage.getStorage();
		for (var i = 1; i < 6; i++) {
      const pattern = new RegExp('right'+i)
      const result = dirList.filter((file) => {
                return file.match(pattern)
              })
      const photo = result[result.length-1]
      console.log(photo)
			const localPath =
				FileSystem.documentDirectory +
				FingerDir +
				encodeURI(currentName+"/"+photo);
			const blob = await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.onload = function () {
					resolve(xhr.response);
				};
				xhr.onerror = function (e) {
					reject(new TypeError("Network request failed"));
				};
				xhr.responseType = "blob";
				xhr.open("GET", localPath, true);
				xhr.send(null);
			});
			const sRef = storage.ref(
				s,
				uid + "/" + currentName + "/" + "right" + i + ".jpg"
			);
			const upload = storage.uploadBytes(sRef, blob, metadata);
			// blob.close();
		}
		for (var i = 1; i < 6; i++) {
			const pattern = new RegExp('left'+i)
      const result = dirList.filter((file) => {
                return file.match(pattern)
              })
      const photo = result[result.length-1]
      console.log(photo)
			const localPath =
				FileSystem.documentDirectory +
				FingerDir +
				encodeURI(currentName+"/"+photo);
			const blob = await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.onload = function () {
					resolve(xhr.response);
				};
				xhr.onerror = function (e) {
					reject(new TypeError("Network request failed"));
				};
				xhr.responseType = "blob";
				xhr.open("GET", localPath, true);
				xhr.send(null);
			});
			const sRef = storage.ref(
				s,
				uid + "/" + currentName + "/" + "left" + i + ".jpg"
			);
			const upload = storage.uploadBytes(sRef, blob, metadata);
			// blob.close();
		}
		console.log("upload file complete");
	};

	const submitBoard = async () => {
		const uid = auth.getAuth().currentUser.uid;
		let name = "";
		const docRef = db.doc(db.getFirestore(), "users", uid);
		const docSnap = await db.getDoc(docRef);
		if (docSnap.exists()) {
			console.log("Document data:", docSnap.data());
			if (docSnap.data().name === undefined) {
				name = "비회원";
			} else {
				name = docSnap.data().name;
			}
		} else {
			console.log("No such document!");
			name = "비회원";
		}

		try {
      let today = new Date()
      const date = Date.now()
			await db.addDoc(db.collection(db.getFirestore(), "fingerprint"), {
				check: false,
				contents: boardContents,
				date: date,
				reply: "",
				replier: "",
				birth: birth,
				title: currentName,
				uid: uid,
				user: name,
				replier_name: "",
				replier_uid: "",
			});
		} catch (error) {
			console.log("DB error : " + error);
		}
		// Alert.alert("알림", "문의글 작성완료.")
		console.log("upload fingerprint board complete");
	};

	const getFingerUser = async () => {
		const users = await FileSystem.readDirectoryAsync(
			FileSystem.documentDirectory + FingerDir
		);
		const userlist = await Promise.all(
			users.map((e) => {
				return e;
			})
		);
		setUserList(userlist);
	};

  const readFingerDir = async (name) => {
    const Dir = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory+FingerDir+encodeURI(name))
    const Fingers = await Promise.all(
      Dir.map((e)=>{
        return e;
      })
    )
    const list = Fingers.sort()
    setDirList(list);
    console.log(list);
  }

	const countFingerPrint = async (name) => {
		const users = await FileSystem.readDirectoryAsync(
			FileSystem.documentDirectory + FingerDir + encodeURI(name)
		);
    console.log("length : ")
    console.log(users.length)
		const fingerprint = await Promise.all(
			users.map((e) => {
				return e;
			})
		);
		setFingerCount(fingerprint.length);
		// const count = fingerprint.length
		// return count;
	};

	const Fingers = ({ fingerName, finger, fingerURL }) => {
    const pattern = new RegExp(finger)
    const result = dirList.filter((file) => {
              return file.match(pattern)
            })
		return (
			<TouchableOpacity
				onPress={() => {
					setCurrentFinger(finger);
          console.log("dirlist : "+dirList)
          console.log(result)
					if (result.length != 0) {
						console.log("exists");
						setPhotoModalVisible(true);
					} else {
						console.log("not exists");
						setCameraModalVisible(true);
					}
					setModalVisible(false);
				}}
			>
				<View style={styles.fingerContainer}>
					<Image
						style={{
							tintColor: result.length!=0 ? GROUNDCOLOR : "black",
						}}
						source={require("../../assets/images/photo/finger.png")}
					/>
					<Text style={styles.fingerText}>{fingerName}</Text>
				</View>
			</TouchableOpacity>
		);
	};

	const PhotoModal = () => {
    const pattern = new RegExp(currentFinger)
    const result = dirList.filter((file) => {
              return file.match(pattern)
            })
    const photo = result[result.length-1]
		const URI =
			FileSystem.documentDirectory +
			FingerDir +
			encodeURI(currentName + "/" + photo);
		if (photoModalVisible == false) {
			console.log('closed')
      return (
				<View>
					<Text>Update photo...</Text>
				</View>
			);
		} else {
			return (
				<View style={styles.modalContainer}>
					<View style={styles.modalHeader}>
						<TouchableOpacity
							onPress={() => {
								setPhotoModalVisible(false);
								setModalVisible(true);
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
						<TouchableOpacity
							onPress={() => {
								FileSystem.deleteAsync(URI);
								readFingerDir(currentName)
								// Alert.alert("알림", "사진 삭제완료.");
								setModalVisible(true);
								setPhotoModalVisible(false);
							}}
						>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Image
									source={require("../../assets/images/photo/trash.png")}
								/>
								<Text
									style={{
										fontSize: 20,
										fontWeight: "bold",
										marginLeft: 5,
									}}
								>
									사진 삭제
								</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View
						style={{
							borderWidth: 2,
							borderColor: "grey",
							width: DEVICE_WIDTH,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Image
							resizeMode="cover"
							style={{
								width: DEVICE_WIDTH - 5,
								height: (DEVICE_WIDTH - 5) * 1.75,
							}}
							source={{ uri: URI }}
						/>
					</View>
				</View>
			);
		}
	};

	const snap = async () => {
		if (cam) {
			const options = { quality: 0.3 };
			const photo = await cam.takePictureAsync(options);
			const newURI =
				FileSystem.documentDirectory +
				FingerDir +
				encodeURI(currentName+"/"+currentFinger+Date.now()) +".jpg"
			console.log(photo);
			console.log("new uri : " + newURI);
			// await FileSystem.deleteAsync(newURI);
			await FileSystem.moveAsync({
				from: photo.uri,
				to: newURI,
			});
			// Alert.alert("알림", "사진 저장완료");
			readFingerDir(currentName);
			setCameraModalVisible(false);
			setPhotoModalVisible(true);
		}
	};

	const FingerPrintModal = () => {
		return (
			<View style={styles.modalContainer}>
				<View style={styles.modalHeader}>
					<TouchableOpacity
						onPress={() => {
							getFingerUser();
							setModalVisible(false);
							setCurrentName("");
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
					<TouchableOpacity
						onPress={async () => {
							//Directory 삭제
							console.log("delete directory");
							await FileSystem.deleteAsync(
								FileSystem.documentDirectory +
									FingerDir +
									encodeURI(currentName) +
									"/"
							);
							getFingerUser();
							setModalVisible(false);
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Image
								source={require("../../assets/images/photo/trash.png")}
							/>
							<Text
								style={{
									fontSize: 20,
									fontWeight: "bold",
									marginLeft: 5,
								}}
							>
								지문 삭제
							</Text>
						</View>
					</TouchableOpacity>
				</View>
				<Text
					style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}
				>
					{currentName}
				</Text>
				<View
					style={{
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-around",
						width: DEVICE_WIDTH,
					}}
				>
					<View
						style={{
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: "bold" }}>
							왼손
						</Text>
						<Fingers
							fingerName={"엄지"}
							finger={"left1"}
						/>
						<Fingers
							fingerName={"검지"}
							finger={"left2"}
						/>
						<Fingers
							fingerName={"중지"}
							finger={"left3"}
						/>
						<Fingers
							fingerName={"약지"}
							finger={"left4"}
						/>
						<Fingers
							fingerName={"소지"}
							finger={"left5"}
						/>
					</View>
					<View
						style={{
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: "bold" }}>
							오른손
						</Text>
						<Fingers
							fingerName={"엄지"}
							finger={"right1"}
						/>
						<Fingers
							fingerName={"검지"}
							finger={"right2"}
						/>
						<Fingers
							fingerName={"중지"}
							finger={"right3"}
						/>
						<Fingers
							fingerName={"약지"}
							finger={"right4"}
						/>
						<Fingers
							fingerName={"소지"}
							finger={"right5"}
						/>
					</View>
				</View>
				<TouchableOpacity
					underlayColor={"transparent"}
					onPress={async () => {
						// countFingerPrint(currentName);
						// console.log(fingerCount);
            const users = await FileSystem.readDirectoryAsync(
              FileSystem.documentDirectory + FingerDir + encodeURI(currentName)
            );
						if (users.length >= 10) {
							setModalVisible(false);
							setBoardModalVisible(true);
						} else {
							Alert.alert(
								"알림",
								"10개의 지문을 모두 등록해주세요."
							);
						}
					}}
				>
					<View style={styles.menuButton}>
						<Text style={styles.menuText}>상담등록</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	};

	if (hasPermission === null) {
		return (
			<View>
				<Text>No access to camera</Text>
			</View>
		);
	}
	if (hasPermission === false) {
		return (
			<View>
				<Text>No access to camera</Text>
			</View>
		);
	}

	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "flex-start",
				flexDirection: "column",
				backgroundColor: "white",
				paddingTop: 15,
			}}
		>
			<FlatList
				data={userList}
				extraData={userList}
				keyExtractor={(item) => item}
				renderItem={(item) => {
					return (
						<TouchableOpacity
							underlayColor={"transparent"}
							onPress={() => {
								setCurrentName(item.item);
								console.log(item.item);
								readFingerDir(item.item);
								countFingerPrint(item.item);
								setModalVisible(true);
							}}
						>
							<View style={styles.menuButton}>
								<Text style={styles.menuText}>{item.item}</Text>
							</View>
						</TouchableOpacity>
					);
				}}
			/>
			<TouchableOpacity
				underlayColor={"transparent"}
				onPress={() => setNameModalVisible(true)}
			>
				<View style={styles.addButton}>
					<Text style={styles.menuText}>지문 추가</Text>
				</View>
			</TouchableOpacity>
			<Modal visible={modalVisible}>
				<FingerPrintModal />
			</Modal>
			<Modal
				visible={nameModlaVisible}
				transparent={true}
				useNativeDriver={true}
				// hideModalContentWhileAnimating={true}
			>
				<View style={styles.modalContainer2}>
					<View style={styles.modalCon2}>
						<View style={styles.modalHeader2}>
							<Text style={{ fontSize: 20, color: "white" }}>
								이름 입력
							</Text>
						</View>
						<View style={styles.modalContents}>
							<View style={styles.textInputContainer}>
								<TextInput
									style={styles.textInput}
									onChangeText={(text) => {
										setCurrentName(text);
									}}
									value={currentName}
								></TextInput>
							</View>
							<View style={styles.modalButtonContainer}>
								<TouchableOpacity
									onPress={async () => {
										if (currentName.trim() === "") {
											return Alert.alert(
												"알림",
												"이름을 입력해주세요!"
											);
										} else {
											const dir =
												FileSystem.documentDirectory +
												FingerDir +
												encodeURI(currentName) +
												"/";
											console.log(dir);
											const dirExist =
												await FileSystem.getInfoAsync(
													FileSystem.documentDirectory +
														FingerDir +
														encodeURI(currentName) +
														"/"
												);
											if (dirExist.exists) {
												return Alert.alert(
													"알림",
													"해당 인물의 지문이 이미 등록되어있습니다."
												);
											} else {
												await FileSystem.makeDirectoryAsync(
													dir,
													{
														intermediates: true,
													}
												);
												setNameModalVisible(false);
												readFingerDir(currentName);
												setModalVisible(true);
											}
										}
									}}
								>
									<View style={styles.button}>
										<Text
											style={{
												color: "white",
												fontSize: 17,
											}}
										>
											확인
										</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => {
										setCurrentName("");
										setNameModalVisible(false);
									}}
								>
									<View style={styles.button2}>
										<Text
											style={{
												color: "white",
												fontSize: 17,
											}}
										>
											취소
										</Text>
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</Modal>

			<Modal
				visible={boardModalVisible}
				transparent={true}
				useNativeDriver={true}
				// hideModalContentWhileAnimating={true}
			>
				<View style={styles.modalContainer3}>
					<View style={styles.modalCon3}>
						<View style={styles.modalHeader3}>
							<Text style={{ fontSize: 20, color: "white" }}>
								상담정보 입력
							</Text>
						</View>
						<View style={styles.modalContents2}>
							<View style={styles.textInputContainer2}>
								<TextInput
									placeholder="생년월일 ex) 1999.05.08"
									style={styles.textInput2}
									onChangeText={(text) => {
										setBirth(text);
									}}
									value={birth}
								></TextInput>
								<TextInput
									placeholder="상담문의 내용 작성"
									style={styles.textInput2}
									onChangeText={(text) => {
										setBoardContents(text);
									}}
									value={boardContents}
								></TextInput>
							</View>
							<View style={styles.modalButtonContainer}>
								<TouchableOpacity
									onPress={async () => {
										if (birth != "") {
											// uploadFingerPrint();
											uploadPrint();
											submitBoard();
											getFingerUser();
											setBoardModalVisible(false);
										} else {
											Alert.alert(
												"알림",
												"생일을 입력해주세요."
											);
										}
										setBirth("");
										setBoardContents("");
									}}
								>
									<View style={styles.button}>
										<Text
											style={{
												color: "white",
												fontSize: 17,
											}}
										>
											확인
										</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => {
										setBoardContents("");
										setBirth("");
										setBoardModalVisible(false);
									}}
								>
									<View style={styles.button2}>
										<Text
											style={{
												color: "white",
												fontSize: 17,
											}}
										>
											취소
										</Text>
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</Modal>

			<Modal visible={cameraModalVisible} transparent={false}>
				<View style={styles.modalContainer}>
					<View style={styles.modalHeader}>
						<TouchableOpacity
							onPress={() => {
								setCameraModalVisible(false);
								setModalVisible(true);
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

					<Camera
						style={styles.camera}
						type={type}
						flashMode={flash}
						ratio={"16:9"}
						zoom={OS === "android" ? 0.6 : 0.03}
						autoFocus={Camera.Constants.AutoFocus.on}
						ref={(ref) => {
							setCam(ref);
						}}
					></Camera>

					<TouchableOpacity
						onPress={() => {
							console.log("caputred");
							snap();
						}}
						style={styles.captureButton}
					>
						<View
							style={{
								height: 40,
								alignItems: "center",
								justifyContent: "center",
								backgroundColor: "white",
								width: DEVICE_WIDTH,
							}}
						>
							<View
								style={{
									backgroundColor: "white",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								{/* <Text style={{ fontSize: 18 }}>지문 촬영</Text> */}
								<Image
									source={require("../../assets/images/photo/cameraIcon.png")}
								/>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			</Modal>
			<Modal
				visible={photoModalVisible}
				transparent={false}
			>
				<PhotoModal />
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "#ecf0f1",
		padding: 10,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	fill: {
		flex: 1,
		margin: 16,
	},
	button: {
		margin: 16,
	},
	menuTab: {
		alignItems: "center",
		justifyContent: "center",
		width: DEVICE_WIDTH * 0.35,
		height: 40,
		borderBottomColor: "grey",
		borderBottomWidth: 3,
		// paddingVertical: 5
	},
	menuTabActive: {
		alignItems: "center",
		justifyContent: "center",
		width: DEVICE_WIDTH * 0.35,
		height: 40,
		borderBottomColor: POINTCOLOR,
		borderBottomWidth: 3,
		// paddingVertical: 5
	},
	menuTabText: {
		fontSize: 20,
	},
	menuTabTextActive: {
		fontSize: 20,
		color: POINTCOLOR,
	},
	menuText: {
		fontSize: 20,
		color: "white",
		// fontFamily: "SquareRound",
		fontWeight: "bold",
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
	modalContainer: {
		flex: 1,
		alignItems: "center",
		alignContent: "center",
		// justifyContent: "center",
		paddingTop: Platform.OS === "ios" ? getStatusBarHeight() : 0,
		paddingBottom: Platform.OS === "ios" ? 40 : 0,
		backgroundColor: "rgba(0,0,0,0.1)",
	},
	modalHeader: {
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
	modalContainer2: {
		flex: 1,
		alignItems: "center",
		alignContent: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalCon2: {
		borderRadius: 10,
		backgroundColor: "#fff",
		// paddingVertical: 30,
		// paddingHorizontal: 10,
		width: DEVICE_WIDTH * 0.7,
		height: DEVICE_WIDTH * 0.5,
		alignItems: "center",
	},
	modalHeader2: {
		borderTopStartRadius: 10,
		borderTopEndRadius: 10,
		width: DEVICE_WIDTH * 0.7,
		height: DEVICE_WIDTH * 0.12,
		backgroundColor: GROUNDCOLOR,
		alignItems: "center",
		justifyContent: "center",
	},
	modalContents: {
		alignItems: "center",
		justifyContent: "center",
		width: DEVICE_WIDTH * 0.7,
		height: DEVICE_WIDTH * 0.38,
	},
	textInputContainer: {
		alignItems: "center",
		justifyContent: "center",
		width: DEVICE_WIDTH * 0.7,
		height: DEVICE_WIDTH * 0.23,
		flexDirection: "row",
		paddingTop: 10,
		marginHorizontal: 10,
	},
	modalContainer3: {
		flex: 1,
		alignItems: "center",
		alignContent: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalCon3: {
		borderRadius: 10,
		backgroundColor: "#fff",
		// paddingVertical: 30,
		// paddingHorizontal: 10,
		width: DEVICE_WIDTH * 0.8,
		height: DEVICE_WIDTH * 0.6,
		alignItems: "center",
	},
	modalHeader3: {
		borderTopStartRadius: 10,
		borderTopEndRadius: 10,
		width: DEVICE_WIDTH * 0.8,
		height: DEVICE_WIDTH * 0.12,
		backgroundColor: GROUNDCOLOR,
		alignItems: "center",
		justifyContent: "center",
	},
	modalContents2: {
		alignItems: "center",
		justifyContent: "center",
		width: DEVICE_WIDTH * 0.8,
		height: DEVICE_WIDTH * 0.6,
	},
	textInputContainer2: {
		alignItems: "center",
		justifyContent: "center",
		width: DEVICE_WIDTH * 0.7,
		height: DEVICE_WIDTH * 0.23,
		flexDirection: "column",
		// marginHorizontal: 10,
	},
	textInput2: {
		borderColor: GROUNDCOLOR,
		borderWidth: 2,
		borderRadius: 4,
		width: DEVICE_WIDTH * 0.7,
		height: DEVICE_WIDTH * 0.13,
		paddingVertical: 2,
		paddingHorizontal: 10,
		marginBottom: 20,
	},
	textInput: {
		borderColor: GROUNDCOLOR,
		borderWidth: 2,
		borderRadius: 4,
		width: DEVICE_WIDTH * 0.65,
		height: DEVICE_WIDTH * 0.13,
		paddingVertical: 2,
		paddingHorizontal: 10,
	},
	modalButtonContainer: {
		alignItems: "center",
		justifyContent: "space-between",
		// width: DEVICE_WIDTH * 0.7,
		height: DEVICE_WIDTH * 0.15,
		flexDirection: "row",
		marginHorizontal: 20,
	},
	button: {
		fontSize: 20,
		// borderWidth: 1,
		// borderColor: 'grey',
		borderRadius: 5,
		backgroundColor: GROUNDCOLOR,
		color: "white",
		alignItems: "center",
		justifyContent: "center",
		width: DEVICE_WIDTH * 0.23,
		height: DEVICE_WIDTH * 0.1,
		marginHorizontal: DEVICE_WIDTH * 0.05,
	},
	button2: {
		fontSize: 20,
		// borderWidth: 1,
		// borderColor: 'grey',
		borderRadius: 5,
		backgroundColor: "grey",
		color: "white",
		alignItems: "center",
		justifyContent: "center",
		width: DEVICE_WIDTH * 0.23,
		height: DEVICE_WIDTH * 0.1,
		marginHorizontal: DEVICE_WIDTH * 0.05,
	},
	addButton: {
		backgroundColor: POINTCOLOR,
		height: DEVICE_HEIGHT * 0.06,
		width: DEVICE_WIDTH * 0.65,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		margin: 10,
	},
	fingerContainer: {
		marginBottom: 5,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: GROUNDCOLOR,
		borderRadius: 5,
		paddingTop: 3,
		paddingHorizontal: 15,
	},
	fingerText: {
		fontWeight: "bold",
	},
	camera: {
		flex: 1,
		width: DEVICE_WIDTH,
	},
});
