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
	Keyboard,
	ScrollView,
	KeyboardAvoidingView,
	StatusBar,
} from "react-native";
// import Modal from "react-native-modal"
import { auth, db } from "../../Firebase";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useSelector } from "react-redux";
import { collection, doc, orderBy, query, where } from "firebase/firestore";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const BACKGROUNDCOLOR = "#F4ECE6";

export default function AdminBoard({ navigation }) {
	const OS = Platform.OS;
	const reduxState = useSelector((state) => state);
	const [boardList, setBoardList] = useState([]);
	const [boardItem, setBoardItem] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [text, setText] = useState("");
	const [reply, setReply] = useState("");
	const [contentHeight, setContentHeight] = useState(150);
	const [date, setDate] = useState("00:00");
	useEffect(() => {
		// console.log(props)
		getInfo();
	}, []);

	const Item = ({ item }) => {
		let date_before = new Date(item.date);
		let date = date_before.getMonth() + 1 + "/" + date_before.getDate();
		return (
			<TouchableOpacity
				onPress={() => {
					console.log("set board item & reply");
					setBoardItem(item);
					setReply(item.reply);
					let data_date = new Date(boardItem.date);
					let date =
						data_date.getMonth() +
						1 +
						"/" +
						data_date.getDate() +
						" " +
						data_date.getHours() +
						":" +
						data_date.getMinutes();
					setDate(date);
					setModalVisible(true);
				}}
			>
				<View
					style={{
						borderBottomWidth: 1,
						height: 40,
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{/* <View style={{borderRightWidth:1, flex:0.75, justifyContent:'center', alignItems:'center', height:40}}>
          <Text style={{fontSize: 18, fontWeight:'500'}}>{'번호'}</Text>
        </View> */}
					<View
						style={{
							borderRightWidth: 1,
							flex: 3,
							justifyContent: "center",
							alignItems: "center",
							height: 40,
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: "500" }}>
							{item.title}
						</Text>
					</View>
					<View
						style={{
							borderRightWidth: 1,
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							height: 40,
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: "500" }}>
							{date}
						</Text>
					</View>
					{/* <View
						style={{
                            borderRightWidth: 1,
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							height: 40,
						}}
					>
						<Text
							style={{
								fontSize: 18,
								fontWeight: "500",
								color: item.replier_uid === "" ? "black" : "blue",
							}}
						>
							{item.replier_uid === "" ? "미정" : "완료"}
						</Text>
					</View> */}
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							height: 40,
						}}
					>
						<Text
							style={{
								fontSize: 18,
								fontWeight: "500",
								color: item.reply === "" ? "black" : "blue",
							}}
						>
							{/* {item.check === false ? "대기중" : "답변완료"} */}
							{item.reply === "" ? "대기중" : "답변완료"}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	const renderItem = ({ item }) => <Item item={item} />;

	const getInfo = async () => {
		console.log("get board information");
		const uid = auth.getAuth().currentUser.uid;
		const boardRef = collection(db.getFirestore(), "board");
		const q = query(
			boardRef,
			// where("uid", "==", uid),
			orderBy("date", "desc")
		);
		const querySnapshot = await db.getDocs(q);
		let list = [];
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			// console.log(doc.id, " => ", doc.data());
			list.push(doc.data());
		});
		setBoardList(list);
	};

	const submitReply = async () => {
		const date = boardItem.date;
		const boardRef = collection(db.getFirestore(), "board");
		const q = query(boardRef, where("date", "==", date));
		const querySnapshot = await db.getDocs(q);
		const docID =
			querySnapshot.docs[0]["_document"]["key"]["path"]["segments"][6];
		console.log(docID);
		try {
			db.updateDoc(doc(db.getFirestore(), "board", docID), {
				reply: reply,
			});
		} catch (error) {
			console.log("DB Error : " + error);
		}
		Alert.alert("알림", "답변이 등록되었습니다.");
	};

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
			<StatusBar hidden />
			<View
				style={{
					alignItems: "center",
					justifyContent: "space-between",
					flexDirection: "row",
					paddingVertical: 10,
					width: DEVICE_WIDTH * 0.95,
				}}
			>
				<Text style={{ fontSize: 24, fontWeight: "600", flex: 1 }}>
					문의글 목록
				</Text>
				<TouchableOpacity
					onPress={() => {
						getInfo();
					}}
				>
					<Text
						style={{
							marginRight: 5,
							borderWidth: 2,
							backgroundColor: GROUNDCOLOR,
							borderColor: GROUNDCOLOR,
							borderRadius: 5,
							padding: 3,
							alignSelf: "center",
							fontSize: 17,
							fontWeight: "700",
							color: "white",
						}}
					>
						새로고침
					</Text>
				</TouchableOpacity>
			</View>
			<View
				style={{
					borderWidth: 2,
					borderColor: "black",
					width: DEVICE_WIDTH * 0.95,
					// height: DEVICE_HEIGHT,
					flexDirection: "column",
					flex: 1,
				}}
			>
				<View
					style={{
						borderBottomWidth: 2,
						height: 40,
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{/* <View style={{borderRightWidth:2, flex:0.75, justifyContent:'center', alignItems:'center', height:40}}>
            <Text style={{fontSize: 18, fontWeight:'bold'}}>번호</Text>
          </View> */}
					<View
						style={{
							borderRightWidth: 2,
							flex: 3,
							justifyContent: "center",
							alignItems: "center",
							height: 40,
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: "bold" }}>
							제목
						</Text>
					</View>
					<View
						style={{
							borderRightWidth: 2,
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							height: 40,
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: "bold" }}>
							작성일
						</Text>
					</View>
					{/* <View
						style={{
							borderRightWidth: 2,
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							height: 40,
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: "bold" }}>
							배정
						</Text>
					</View> */}
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							height: 40,
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: "bold" }}>
							답변
						</Text>
					</View>
				</View>
				<FlatList
					data={boardList}
					keyExtractor={(item) => item.title}
					renderItem={renderItem}
					extraData={boardList}
				/>
			</View>
			<KeyboardAvoidingView
				behavior={Platform.select({ ios: "padding" })}
			>
				<Modal visible={modalVisible}>
					<View style={styles.modalContainer}>
						<View style={styles.modalHeader}>
							<TouchableOpacity
								onPress={() => {
									setModalVisible(false);
								}}
							>
								<View
									style={{
										height: 32,
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "flex-start",
										marginLeft: 10,
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
							// keyboardShouldPersistTaps='handled'
							style={{
								borderWidth: 2,
								// borderColor: "grey",
								width: DEVICE_WIDTH,
								// alignItems: "center",
								// justifyContent: "center",
								paddingBottom: DEVICE_WIDTH * 0.3,
								// height: DEVICE_HEIGHT,
							}}
						>
							<TouchableWithoutFeedback
								onPress={Keyboard.dismiss}
							>
								<View
									style={{
										height: 30,
										alignItems: "center",
										justifyContent: "center",
										width: DEVICE_WIDTH,
										flexDirection: "row",
										borderBottomWidth: 2,
									}}
								>
									<Text
										style={{
											height: 30,
											fontSize: 20,
											fontWeight: "bold",
											alignItems: "flex-start",
											alignSelf: "flex-start",
											paddingLeft: 5,
											borderRightWidth: 2,
											borderColor: "grey",
											flex: 2,
										}}
									>
										작성자
									</Text>
									<Text
										style={{
											height: 30,
											fontSize: 18,
											flex: 3,
											borderRightWidth: 2,
											alignSelf: "center",
										}}
									>
										{boardItem.user}
									</Text>
									<Text
										style={{
											height: 30,
											fontSize: 20,
											fontWeight: "bold",
											alignItems: "flex-start",
											justifyContent: "center",
											borderRightWidth: 2,
											borderColor: "grey",
											flex: 2,
										}}
									>
										작성일
									</Text>
									<Text
										style={{
											height: 30,
											fontSize: 18,
											flex: 3,
										}}
									>
										{date}
									</Text>
								</View>
								<View
									style={{
										height: 30,
										width: DEVICE_WIDTH,
										paddingLeft: 5,
										alignItems: "flex-start",
										justifyContent: "center",
										borderBottomWidth: 2,
									}}
								>
									<Text
										style={{
											fontSize: 20,
											fontWeight: "bold",
										}}
									>
										{boardItem.title}
									</Text>
								</View>
								<View
									style={{
										width: DEVICE_WIDTH,
										borderBottomWidth: 2,
										height: DEVICE_HEIGHT * 0.5,
										borderBottomColor: "grey",
									}}
								>
									<Text
										style={{
											paddingLeft: 5,
											paddingRight: 5,
											fontSize: 20,
										}}
									>
										{boardItem.contents == ""
											? "없음"
											: boardItem.contents}
									</Text>
								</View>
								<View
									style={{
										height: 40,
										width: DEVICE_WIDTH,
										paddingLeft: 5,
										alignItems: "center",
										justifyContent: "space-between",
										borderBottomWidth: 2,
										flexDirection: "row",
										paddingRight: 15,
									}}
								>
									<Text
										style={{
											fontSize: 20,
											fontWeight: "bold",
										}}
									>
										{"답변 내용"}
									</Text>
									<TouchableOpacity
										onPress={() => {
											submitReply();
										}}
									>
										<Text
											style={{
												marginRight: 5,
												borderWidth: 2,
												backgroundColor: GROUNDCOLOR,
												borderColor: GROUNDCOLOR,
												borderRadius: 5,
												padding: 3,
												alignSelf: "center",
												fontSize: 17,
												fontWeight: "700",
												color: "white",
											}}
										>
											답변 등록/수정
										</Text>
									</TouchableOpacity>
								</View>
								<View
									style={{
										width: DEVICE_WIDTH,
										// borderBottomWidth: 2,
										height: DEVICE_HEIGHT * 0.5,
										borderBottomColor: "grey",
									}}
								>
									{/* <Text
							style={{
								paddingLeft: 5,
								paddingRight: 5,
								fontSize: 20,
							}}
						>
							{boardItem.reply == "" ? "" : boardItem.reply}
						</Text> */}
									<TextInput
										style={{
											// width: DEVICE_WIDTH * 0.9,
											// height: DEVICE_HEIGHT * 0.3,
											// contentHeight < DEVICE_HEIGHT * 0.3
											//   ? DEVICE_HEIGHT * 0.3
											//   : contentHeight,
											// borderWidth: 1,
											paddingLeft: 5,
											paddingRight: 5,
											fontSize: 20,
										}}
										placeholder={
											"답변 내용이없습니다.\n답변을 등록해주세요."
										}
										multiline={true}
										onChangeText={(text) => {
											setReply(text);
										}}
										// onContentSizeChange={(e) => {
										// 	setContentHeight(
										// 		e.nativeEvent.contentSize.height
										// 	);
										// }}
										value={reply}
									/>
								</View>
							</TouchableWithoutFeedback>
						</ScrollView>
					</View>
				</Modal>
			</KeyboardAvoidingView>
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
	item: {
		backgroundColor: "#f9c2ff",
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
	},
	title: {
		fontSize: 32,
	},
	modalContainer: {
		flex: 1,
		alignItems: "center",
		alignContent: "center",
		// justifyContent: "center",
		paddingTop: Platform.OS === "ios" ? getStatusBarHeight() : 0,
		paddingBottom: Platform.OS === "ios" ? 40 : 0,
		// backgroundColor: "rgba(0,0,0,0.1)",
		backgroundColor: "white",
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
		paddingHorizontal: 5,
	},
});
