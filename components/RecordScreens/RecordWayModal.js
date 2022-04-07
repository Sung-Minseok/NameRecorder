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
            <Image source={require("../../assets/images/photo/x.png")} />
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
            3. 중간에 빨간색 녹음시작 버튼을 클릭하고 이름을 녹음해주세요. "홍길동"
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
            4. 녹음이 완료되면 다시 빨간색 녹음완료 버튼을 눌러주세요.
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
            {"5. 녹음이 잘되었는지 재생하기를 눌러서 녹음된 내용을 들어보세요.\n만약 잘못 녹음되었다면 녹음시작을 다시 눌러서 녹음하세요."}

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
            {"6. 녹음이 잘 되었다면 아래쪽에 저장을 누르고, 녹음파일명을 적고 확인을 눌러주세요."}

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
            {"7. 녹음목록으로 오면 현재 녹음된 목록들이 정지중으로 보입니다.\n정지중을 누르면 재생중으로 바뀌며 녹음된 파일이 작동됩니다."}

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
            {"8. 볼륨을 +를 해서 현재 녹음된 파일이 잘 돌아가는지 확인하고, -1로 다시 변경하시면 됩니다."}

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
