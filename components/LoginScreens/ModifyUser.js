import { reauthenticateWithCredential, sendSignInLinkToEmail } from "firebase/auth";
import { doc, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { auth, db } from "../../Firebase";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, setExampleString } from "../../redux/record";

const GROUNDCOLOR = "#0bcacc";
// Screen Size
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const ModifyUser = ({ navigation }) => {
	const dispatch = useDispatch();
	const reduxState = useSelector((state) => state);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [birth, setBirth] = useState("");
	const [phone, setPhone] = useState("");
	const [uid, setUid] = useState("");
	const [modalVisible, setModalVisible] = useState(false);

	useEffect(() => {
		getInfo();
	}, []);

	const deleteAccount = async () => {
		const user = auth.getAuth().currentUser;
    const credential = auth.EmailAuthProvider.credential(
      user.email,
      password
    )
    
    const result = await reauthenticateWithCredential(
      user,
      credential
    ).then(()=>{
      auth.deleteUser(user)
			.then(() => {
				Alert.alert("계정삭제", "회원 탈퇴가 완료되었습니다.");
				dispatch(setCurrentUser("비회원"));
        setModalVisible(false);
				navigation.navigate("홈");
			})
			.catch((error) => {
				console.log(error);
        Alert.alert("회원탈퇴 오류")
			});
    }).catch((error)=>{
      console.log(error);
      Alert.alert("알림","비밀번호를 다시 확인해주세요.")
    })
		
	};

	const updateInfo = async () => {
		const user = auth.getAuth().currentUser;
		try {
			db.updateDoc(doc(db.getFirestore(), "users", user.uid), {
				email: email,
				name: name,
				phoneNum: phone,
				birth: birth,
			});
		} catch (error) {
			console.log("DB Error : " + error);
		}
		auth.updateProfile(user, { displayName: name });
		dispatch(setCurrentUser(name));
		navigation.navigate("홈");
	};

	const getInfo = async () => {
		const uid = auth.getAuth().currentUser.uid;
		const docRef = db.doc(db.getFirestore(), "users", uid);
		const docSnap = await db.getDoc(docRef);
		if (docSnap.exists()) {
			console.log("Document data:", docSnap.data());
		} else {
			console.log("No such document!");
		}
		setEmail(docSnap.data().email);
		setName(docSnap.data().name);
		setBirth(docSnap.data().birth);
		setUid(uid);
	};

	return (
		<View style={styles.container}>
			<Text
				style={{ marginBottom: 50, fontSize: 24, fontWeight: "bold" }}
			>
				회원정보 수정
			</Text>
			<View style={styles.inputContainer}>
				<Input
					placeholder="이름"
					textContentType="name"
					value={name}
					onChangeText={(text) => setName(text)}
				/>
				<Input
					placeholder="아이디(이메일)"
					textContentType="name"
					value={email}
					editable={false}
				/>
				{/* <Input
          placeholder="비밀번호"
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        /> */}
				{/* <Input
          placeholder="전화번호"
          textContentType="telephoneNumber"
          value={phone}
          onChangeText={(text) => setPhone(text)}
        /> */}
				<Input
					placeholder="생년월일(8자리 숫자)"
					textContentType="name"
					value={birth}
					onChangeText={(text) => setBirth(text)}
				/>
				<Text style={styles.uid}>회원UID : {uid}</Text>

				<Button raised onPress={() => updateInfo()} title="수정완료" />
				<Text> </Text>
				<Button
					raised
					onPress={() => setModalVisible(true)}
					title="회원탈퇴"
				/>
				<Modal
					visible={modalVisible}
					transparent={true}
					useNativeDriver={true}
					// hideModalContentWhileAnimating={true}
				>
					<View style={styles.modalContainer2}>
						<View style={styles.modalCon2}>
							<View style={styles.modalHeader2}>
								<Text style={{ fontSize: 20, color: "white" }}>
									비밀번호 입력
								</Text>
							</View>
							<View style={styles.modalContents}>
								<View style={styles.textInputContainer}>
									<TextInput
										style={styles.textInput}
										onChangeText={(text) => {
											setPassword(text);
										}}
										value={password}
									></TextInput>
								</View>
								<View style={styles.modalButtonContainer}>
									<TouchableOpacity
										onPress={() => {
											console.log("button clicked");
                      deleteAccount();
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
											setPassword("");
                      setModalVisible(false)
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
			</View>
		</View>
	);
};

export default ModifyUser;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
	inputContainer: {
		width: 300,
	},
	uid: {
		color: "grey",
		fontSize: 12,
		paddingHorizontal: 10,
		paddingBottom: 30,
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
  modalButtonContainer: {
		alignItems: "center",
		justifyContent: "space-between",
		// width: DEVICE_WIDTH * 0.7,
		height: DEVICE_WIDTH * 0.15,
		flexDirection: "row",
		marginHorizontal: 20,
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
});
