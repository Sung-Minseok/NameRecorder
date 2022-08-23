import React, { Component } from "react";
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	ScrollView,
} from "react-native";

import { getStatusBarHeight } from "react-native-status-bar-height";
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const BACKGROUNDCOLOR = "#F4ECE6";

const RecordWayModal = (props) => {
	return (
		<View style={styles.modalContainer}>
			<View style={styles.modalHeader}>
				<TouchableOpacity
					onPress={() => {
						props.onPressCancle();
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
					<Text style={{ fontSize: 18, fontWeight: "500" }}>
						{'# 자미원학당 이름 어플 녹음 방법 이름은 받은 일로 부터 1주일 안에 녹음 하는 것이 가장 효과적 입니다.\n녹음하는 시간은 밤 12시가 넘어 몸과 마음을 깨끗하게 하시고 내 새로운 이름이 가진 좋은 기운으로 잘 살아가게 해 달라고 기도하는 마음으로 녹음을 합니다. \n만약 12시를 넘겨서 안된다면 주위가 조용한 때를 골라 녹음 하시면 됩니다. \n지금 현재 이름을 녹음 하는 날을 기준으로 10살 기준 녹음 1개 입니다. \n예를들어 35세라면 어플에 3개를 녹음 하면 됩니다. \n개명신청보다 빨리 하여할 것이 이름 녹음 입니다. 개명 허가가 나기전 이라고 해도 내 새로운 이름을 먼저 녹음 하시는게 순서 입니다. \n이름은 36개월간 녹음을 유지 합니다. 36개월이 지난후 녹음 1개만 유지 합니다. \n이름은 많이 불려질수록 이름이 가진 좋은 기운을 사용할수 있다. \n새로운 이름이 불려지는것이 한계가 있어 이름을 어풀에 녹음하여 많이 불려지게 하는 방법을 가진 어플이 자미원학당의 어플이다.'}
					</Text>
					<Text style={{ fontSize: 20, fontWeight: "bold" }}>
						1. 녹음 기능을 클릭합니다.
					</Text>
					<Image
						style={{
							flex: 1,
							width: DEVICE_WIDTH - 20,
							height: DEVICE_HEIGHT * 0.8,
						}}
						resizeMode="stretch"
						source={require("../../assets/images/RecordWay/way1.png")}
					/>
				</View>
				<View>
					<Text style={{ fontSize: 20, fontWeight: "bold" }}>
						2. 녹음하기를 클릭합니다.
					</Text>
					<Image
						style={{
							flex: 1,
							width: DEVICE_WIDTH - 20,
							height: DEVICE_HEIGHT * 0.8,
						}}
						resizeMode="stretch"
						source={require("../../assets/images/RecordWay/way2.png")}
					/>
				</View>
				<View>
					<Text style={{ fontSize: 20, fontWeight: "bold" }}>
						3. 중간에 빨간색 녹음시작 버튼을 클릭하고 이름을
						녹음해주세요. "홍길동"
					</Text>
					<Image
						style={{
							flex: 1,
							width: DEVICE_WIDTH - 20,
							height: DEVICE_HEIGHT * 0.8,
						}}
						resizeMode="stretch"
						source={require("../../assets/images/RecordWay/way3.png")}
					/>
				</View>
				<View>
					<Text style={{ fontSize: 20, fontWeight: "bold" }}>
						4. 녹음이 완료되면 다시 빨간색 녹음완료 버튼을
						눌러주세요.
					</Text>
					<Image
						style={{
							flex: 1,
							width: DEVICE_WIDTH - 20,
							height: DEVICE_HEIGHT * 0.8,
						}}
						resizeMode="stretch"
						source={require("../../assets/images/RecordWay/way4.png")}
					/>
				</View>
				<View>
					<Text style={{ fontSize: 20, fontWeight: "bold" }}>
						{
							"5. 녹음이 잘되었는지 재생하기를 눌러서 녹음된 내용을 들어보세요.\n만약 잘못 녹음되었다면 녹음시작을 다시 눌러서 녹음하세요."
						}
					</Text>
					<Image
						style={{
							flex: 1,
							width: DEVICE_WIDTH - 20,
							height: DEVICE_HEIGHT * 0.8,
						}}
						resizeMode="stretch"
						source={require("../../assets/images/RecordWay/way5.png")}
					/>
				</View>
				<View>
					<Text style={{ fontSize: 20, fontWeight: "bold" }}>
						{
							"6. 녹음이 잘 되었다면 아래쪽에 저장을 누르고, 녹음파일명을 적고 확인을 눌러주세요."
						}
					</Text>
					<Image
						style={{
							flex: 1,
							width: DEVICE_WIDTH - 20,
							height: DEVICE_HEIGHT * 0.8,
						}}
						resizeMode="stretch"
						source={require("../../assets/images/RecordWay/way6.png")}
					/>
					<Image
						style={{
							flex: 1,
							width: DEVICE_WIDTH - 20,
							height: DEVICE_HEIGHT * 0.8,
						}}
						resizeMode="stretch"
						source={require("../../assets/images/RecordWay/way7.png")}
					/>
				</View>
				<View>
					<Text style={{ fontSize: 20, fontWeight: "bold" }}>
						{
							"7. 녹음목록으로 오면 현재 녹음된 목록들이 정지중으로 보입니다.\n정지중을 누르면 재생중으로 바뀌며 녹음된 파일이 작동됩니다."
						}
					</Text>
					<Image
						style={{
							flex: 1,
							width: DEVICE_WIDTH - 20,
							height: DEVICE_HEIGHT * 0.8,
						}}
						resizeMode="stretch"
						source={require("../../assets/images/RecordWay/way8.png")}
					/>
				</View>
				<View>
					<Text style={{ fontSize: 20, fontWeight: "bold" }}>
						{
							"8. 볼륨을 +를 해서 현재 녹음된 파일이 잘 돌아가는지 확인하고, -1로 다시 변경하시면 됩니다."
						}
					</Text>
					<Image
						style={{
							flex: 1,
							width: DEVICE_WIDTH - 20,
							height: DEVICE_HEIGHT * 0.8,
						}}
						resizeMode="stretch"
						source={require("../../assets/images/RecordWay/way9.png")}
					/>
				</View>
			</ScrollView>
		</View>
	);
};

export default RecordWayModal;

const styles = StyleSheet.create({
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
});
