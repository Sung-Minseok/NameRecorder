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

import { auth, db, storage } from "../../Firebase";

import { getStatusBarHeight } from "react-native-status-bar-height";
import { useSelector } from "react-redux";
import { collection, orderBy, query, where } from "firebase/firestore";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const BACKGROUNDCOLOR = "#F4ECE6";

export default function AdminUser(props) {
	const [modalVisible, setModalVisible] = useState(false);

	const Item = ({ item }) => {
		return (
			<TouchableOpacity
				onPress={() => {
					setBoardItem(item);
					// setModalVisible(true);
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
					<View
						style={{
							borderRightWidth: 1,
							flex: 1.5,
							justifyContent: "center",
							alignItems: "center",
							height: 40,
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: "500" }}>
							{item.name}
						</Text>
					</View>
					<View
						style={{
							borderRightWidth: 1,
							flex: 3,
							justifyContent: "center",
							alignItems: "center",
							height: 40,
						}}
					>
						<Text
							style={{
								fontSize: 18,
								fontWeight: "500",
							}}
						>
							{item.email}
						</Text>
					</View>
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
								color: item.admin === 0 ? "blue" : item.admin === 1 ? "green" : "black",
							}}
						>
							{item.admin}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	const BoardModal = () => {
		// getPhoto();
		return (
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
				<View
					style={{
						borderWidth: 2,
						borderColor: "grey",
						width: DEVICE_WIDTH,
						alignItems: "center",
						justifyContent: "center",
						paddingBottom: DEVICE_WIDTH * 0.3,
					}}
				>
					<View
						style={{
							alignItems: "flex-start",
							justifyContent: "flex-start",
							width: DEVICE_WIDTH * 0.95,
						}}
					>
						<Text
							style={{
								fontSize: 20,
								fontWeight: "bold",
								alignItems: "flex-start",
								alignSelf: "flex-start",
								// width: DEVICE_WIDTH-20,
								borderBottomWidth: 1.5,
								borderBottomColor: "grey",
							}}
						>
							{"상담 고객명"}
						</Text>
					</View>
				</View>
			</View>
		);
	};

	const OS = Platform.OS;
	const reduxState = useSelector((state) => state);
	const [boardList, setBoardList] = useState([]);
	const [boardItem, setBoardItem] = useState("");
	const [photoList, setPhotoList] = useState([]);
	const [userUID, setUserUID] = useState("");
	useEffect(() => {
		// console.log(props)
		getInfo();
	}, []);

	const renderItem = ({ item }) => <Item item={item} />;

	const getInfo = async () => {
		const uid = auth.getAuth().currentUser.uid;
		setUserUID(uid);
		const boardRef = collection(db.getFirestore(), "users");
		const q = query(
			boardRef,
			orderBy("admin", "asc")
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
					상담 신청목록
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
					// height: 500,
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
					{/* <View
            style={{
              borderRightWidth: 2,
              flex: 0.75,
              justifyContent: "center",
              alignItems: "center",
              height: 40,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>번호</Text>
          </View> */}
					<View
						style={{
							borderRightWidth: 2,
							flex: 1.5,
							justifyContent: "center",
							alignItems: "center",
							height: 40,
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: "bold" }}>
							회원명
						</Text>
					</View>
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
							아이디
						</Text>
					</View>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							height: 40,
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: "bold" }}>
							등급
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
			<Modal visible={modalVisible}>
				<BoardModal />
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
