//22-06-15

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

export default function AdminFingerBoard(props) {
	useEffect(() => {
		(async () => {
			getPhoto();
		})();
	}, [modalVisible]);

	const [modalVisible, setModalVisible] = useState(false);

	const Item = ({ item }) => {
        let date_before = new Date(item.date);
		let date = date_before.getMonth() + 1 + "/" + date_before.getDate();
        return(
		<TouchableOpacity
			onPress={() => {
				setBoardItem(item);
				// console.log(boardItem)
				getPhoto();
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
				{/* <View
          style={{
            borderRightWidth: 1,
            flex: 0.75,
            justifyContent: "center",
            alignItems: "center",
            height: 40,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "500" }}>{"번호"}</Text>
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
                <View
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
							color: item.check === false ? "black" : "blue",
						}}
					>
						{item.check === false ? "대기중" : "답변완료"}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);}

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
						<Text style={{ fontSize: 18 }}>{boardItem.title}</Text>
						<Text
							style={{
								fontSize: 20,
								fontWeight: "bold",
								alignItems: "flex-start",
								justifyContent: "center",
                // width: DEVICE_WIDTH-20,
								borderBottomWidth: 1.5,
								borderBottomColor: "grey",
							}}
						>
							{"별도 문의사항"}
						</Text>
						<Text style={{ fontSize: 18 }}>
							{boardItem.contents == ""
								? "없음"
								: boardItem.contents}
						</Text>
					</View>
					<View
						style={{
							borderTopWidth: 2,
              borderColor:'grey',
							flexDirection: "row",
							width: DEVICE_WIDTH,
							justifyContent: "space-around",
							alignItems: "center",
							marginTop: 20,
						}}
					>
						<Text style={{ fontSize: 18, fontWeight:'bold' }}>왼손</Text>
						<Text style={{ fontSize: 18, fontWeight:'bold' }}>오른손</Text>
					</View>
					<FlatList
						data={photoList}
						extraData={photoList}
						renderItem={renderItem2}
						keyExtractor={(item) => item}
						numColumns={2}
					/>
				</View>
			</View>
		);
	};
	const Item2 = ({ url }) => (
		<View>
			<Image
				style={{
					width: DEVICE_WIDTH * 0.45,
					height: DEVICE_WIDTH * 0.6,
					margin: 5,
				}}
				source={{ uri: url }}
			/>
			{/* <Text>{'sss'}</Text> */}
		</View>
	);
	const renderItem2 = ({ item }) => <Item2 url={item} />;

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
		const boardRef = collection(db.getFirestore(), "fingerprint");
		const q = query(boardRef,orderBy("date", "desc"));
		const querySnapshot = await db.getDocs(q);
		let list = [];
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			// console.log(doc.id, " => ", doc.data());
			list.push(doc.data());
		});
		setBoardList(list);
	};
	
	const getPhoto = async () => {
		// const uid = auth.getAuth().currentUser.uid;
		const s = storage.getStorage();
		const listRef = storage.ref(s, userUID + "/" + boardItem.title);
		const folderList = storage.listAll(listRef);
		const list = await Promise.all(
			(
				await folderList
			).items.map((e) => {
				return storage.getDownloadURL(storage.ref(e));
			})
		);
		console.log(list);
		setPhotoList(list);
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
							flex: 3,
							justifyContent: "center",
							alignItems: "center",
							height: 40,
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: "bold" }}>
							상담 고객명
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
							배정
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
			<Modal 
        visible={modalVisible}
        onShow={()=>getPhoto()}
      >
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
