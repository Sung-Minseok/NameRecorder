import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Button,
	Dimensions,
	TouchableOpacity,
	Platform,
	Alert,
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

//redux
import { useSelector, useDispatch } from "react-redux";
import { setPhotoList } from "../../redux/record";
import { Image } from "react-native-elements";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";

const pictureDirName = "expopTest1/";

export default function LightScreen(props) {
	//redux
	const dispatch = useDispatch();
	const reduxState = useSelector((state) => state);

	const [hasPermission, setHasPermission] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [flash, setFlash] = useState(Camera.Constants.FlashMode.torch);
	const [cam, setCam] = useState(null);
	const OS = Platform.OS;

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			const res = await MediaLibrary.requestPermissionsAsync();
			setHasPermission(status === "granted" || res.granted);
		})();
	}, []);

	const snap = async () => {
		if (cam) {
			const photo = await cam.takePictureAsync();
			let fileName_arr = photo.uri.split("/");
			const fileName = fileName_arr[fileName_arr.length - 1];
			const newURI =
				FileSystem.documentDirectory +
				pictureDirName +
				encodeURI(fileName);
			console.log(photo);
			// console.log(fileName)
			console.log("new uri : " + newURI);
			await FileSystem.copyAsync({
				from: photo.uri,
				to: newURI,
			});
			updatePhotoList();
			Alert.alert("알림", "사진 저장완료");
		}
	};

	const updatePhotoList = async () => {
		const photoList = await FileSystem.readDirectoryAsync(
			FileSystem.documentDirectory + pictureDirName
		);
		// console.log(photoList)
		dispatch(setPhotoList(photoList));
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
				width: DEVICE_WIDTH,
				alignItems: "center",
				justifyContent: "flex-start",
				flexDirection: "column",
				backgroundColor: "white",
				paddingTop: 5,
			}}
		>
			{reduxState.record.cameraLoadState && (
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
				>
					<View style={styles.captureButton}>
						<TouchableOpacity
							onPress={() => {
								setType(
									type === Camera.Constants.Type.back
										? Camera.Constants.Type.front
										: Camera.Constants.Type.back
								);
							}}
						>
							<View
								style={{
									height: 50,
									width: 50,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Image
									source={require("../../assets/images/photo/flipIcon.png")}
									style={{
										width: 30,
										height: 30,
										tintColor: "white",
									}}
								/>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								console.log("caputred");
								snap();
							}}
						>
							<View
								style={{
									height: 50,
									width: 50,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Image
									source={require("../../assets/images/photo/cameraIcon.png")}
									style={{
										width: 50,
										height: 45,
										tintColor: "white",
									}}
								/>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								setFlash(
									flash === Camera.Constants.FlashMode.torch
										? Camera.Constants.FlashMode.off
										: Camera.Constants.FlashMode.torch
								);
							}}
						>
							<View
								style={{
									height: 50,
									width: 50,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Image
									source={require("../../assets/images/photo/flashIcon.png")}
									style={{
										width: 30,
										height: 30,
										tintColor: "yellow",
									}}
								/>
							</View>
						</TouchableOpacity>
					</View>
				</Camera>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "#ecf0f1",
		// padding: 10,
	},
	camera: {
		flex: 1,
		width: DEVICE_WIDTH,
	},
	captureButton: {
		width: DEVICE_WIDTH,
		height: DEVICE_HEIGHT * 0.12,
		backgroundColor: "black",
		// borderRadius: 100,
		borderWidth: 2,
		position: "absolute",
		bottom: 0,
		opacity: 0.5,
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
		paddingHorizontal: 25,
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
});
