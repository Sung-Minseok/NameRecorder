import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	Button,
	Dimensions,
	TouchableOpacity,
	FlatList,
	Image,
	Modal,
	Alert,
	Platform,
} from "react-native";

import { getStatusBarHeight } from "react-native-status-bar-height";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";


//redux
import { useDispatch, useSelector } from "react-redux";
import { setPhotoList } from "../../redux/record";

const pictureDirName = "expopTest1/";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const BACKGROUNDCOLOR = "#F4ECE6";
export default function AlbumScreen(props) {
	const [hasPermission, setHasPermission] = useState(null);
	const [albums, setAlbums] = useState(null);
	const [photos, setPhotos] = useState(null);
	const [currentPhoto, setCurrentPhoto] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const dispatch = useDispatch();
	const reduxState = useSelector((state) => state);

	useEffect(() => {
		(async () => {
			const res = await MediaLibrary.requestPermissionsAsync();
			setHasPermission(res.granted);
			ensureDirExists();
			_getPhotoList();
		})();
	}, []);


	const ensureDirExists = async () => {
		const dir = FileSystem.documentDirectory + pictureDirName;
		const dirInfo = await FileSystem.getInfoAsync(dir);
		if (!dirInfo.exists) {
			console.log("directory doesn't exist, creating...");
			await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
		} else {
			console.log("directory alreay exists");
		}
	};

	const _getPhotoList = async () => {
		const photoList = await FileSystem.readDirectoryAsync(
			FileSystem.documentDirectory + pictureDirName
		);
		// console.log(photoList)
		dispatch(setPhotoList(photoList));
		setPhotos(photoList);
	};


	const PhotoContainer = (item) => {
		const uri =
			FileSystem.documentDirectory +
			pictureDirName +
			decodeURI(item.item);
		return (
			<View
				style={{
					borderBottomWidth: 1,
					borderRightWidth: 1,
					borderColor: "grey",
				}}
			>
				<TouchableOpacity
					onPress={() => {
						setModalVisible(true);
						setCurrentPhoto(uri);
					}}
				>
					<Image
						resizeMode="cover"
						style={{
							width: DEVICE_WIDTH / 3,
							height: (DEVICE_WIDTH / 3 - 10) * 1.75,
						}}
						source={{ uri: uri }}
					/>
				</TouchableOpacity>
			</View>
		);
	};

	const PhotoModal = () => {
		return (
			<View style={styles.modalContainer}>
				<View style={styles.modalHeader}>
					<TouchableOpacity
						onPress={() => {
							setModalVisible(false);
						}}
					>
						<View style={{height:32, flexDirection:'row', alignItems: 'center', justifyContent: 'center'}}>
							<Image source={require('../../assets/images/photo/x.png')}/>
							<Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 5 }}>
								창 닫기
							</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							FileSystem.deleteAsync(currentPhoto);
							Alert.alert("알림", "사진 삭제완료.")
							_getPhotoList();
							setModalVisible(false)
							
						}}
					>
						<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
							<Image source={require('../../assets/images/photo/trash.png')} />
							<Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 5 }}>
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
						source={{ uri: currentPhoto }}
					/>
				</View>
			</View>
		);
	};

	if (hasPermission === null) {
		return (
			<View>
				<Text>No access to Album</Text>
			</View>
		);
	}
	if (hasPermission === false) {
		return (
			<View>
				<Text>No access to Album</Text>
			</View>
		);
	}
	// console.log(albums);
	return (
		<View
			style={{
				flex: 1,
				// alignItems: "center",
				justifyContent: "flex-start",
				flexDirection: "column",
				backgroundColor: "white",
				marginTop: 5,
				borderWidth: 2,
				borderColor: "grey",
			}}
		>
			<FlatList
				data={reduxState.record.photoListState}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <PhotoContainer item={item} />}
				extraData={reduxState.record.photoListState}
				numColumns={3}
				key={"h"}
			/>
			<Modal visible={modalVisible} transparent={false}>
				<PhotoModal item={currentPhoto} />
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

	modalContainer: {
		flex: 1,
		alignItems: "center",
		alignContent: "center",
		justifyContent: "center",
		paddingTop: Platform.OS==='ios'?getStatusBarHeight():0,
		backgroundColor: "rgba(0,0,0,0.1)",
	},
	modalHeader: {
		flexDirection: 'row',
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
		paddingHorizontal: 10
	},
});
