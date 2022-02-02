import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import RecordList from "../../components/RecordList";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;

export default function RecordListscreen({ navigation }) {
  return (
    <View
      style={styles.recordListContainer}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <View style={styles.menuTab}>
          <TouchableOpacity
            onPress={() => {
              console.log("녹음하기");
              navigation.navigate("Recording");
            }}
          >
            <Text style={styles.menuTabText}>녹음하기</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menuTabActive}>
          <TouchableOpacity
            onPress={() => {
              console.log("재생목록");
            }}
          >
            <Text style={styles.menuTabTextActive}>재생목록</Text>
          </TouchableOpacity>
        </View>
      </View>
      <RecordList />
    </View>
  );
}

const styles = StyleSheet.create({
  recordListContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    backgroundColor: "white",
    paddingTop: 15
  },
  menuTab: {
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.35,
    height: 40,
    borderBottomColor: "grey",
    borderBottomWidth: 3,
    // marginTop: 15
    // paddingVertical: 5
  },
  menuTabActive: {
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.35,
    height: 40,
    borderBottomColor: "#2D89DF",
    borderBottomWidth: 3,
    // marginTop: 15
    // paddingVertical: 5
  },
  menuTabText: {
    fontSize: 20,
  },
  menuTabTextActive: {
    fontSize: 20,
    color: "#2D89DF",
  },
});
