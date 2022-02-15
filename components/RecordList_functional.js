import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

//component
import * as Font from "expo-font";
import * as Icons from "./Icons.js";
import RecordCard from "./RecordCard.js";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setExampleString, setRecordList } from "../redux/record";
import { useEffect } from "react";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;
const BACKGROUND_COLOR = "#FFF8ED";
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const LIVE_COLOR = "#FF0000";
const DISABLED_OPACITY = 0.5;
const RATE_SCALE = 3.0;
const DirName = "expoTest4/";

export default function RecordList() {
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);

  const _getRecordList = async () => {
    console.log("getRecordList");
    const recordList = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory + DirName
    );
    const soundList = await Promise.all(
      Object.values(recordList).map((e) => {
        const soundObj = new Audio.Sound();
        return soundObj.loadAsync({
          uri: FileSystem.documentDirectory + DirName + encodeURI(e),
        });
      })
    );
    dispatch(setRecordList(soundList));
  };

  useEffect(() => {
    _getRecordList();
  }, []);
  return React.createElement(
    View,
    { style: styles.container },
    //   list of record
    React.createElement(
      View,
      {
        style: [styles.recordListContianer],
      },
      React.createElement(FlatList, {
        data: reduxState.record.recordListState,
        keyExtractor: (item) => item.uri,
        renderItem: ({ item }) => (
          <RecordCard item={item} />
        ),
        extraData: reduxState.record.recordListState,
        
      })
    )
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: "stretch",
  },
  container: {
    // flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: DEVICE_HEIGHT - 120,
    maxHeight: DEVICE_HEIGHT - 120,
    // paddingBottom: 10,
  },
  noPermissionsText: {
    textAlign: "center",
  },
  recordListContianer: {
    flex: 3,
    flexDirection: "column",
    width: DEVICE_WIDTH,
    paddingHorizontal: 10,
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
    borderBottomColor: "orange",
    borderBottomWidth: 3,
    // paddingVertical: 5
  },
  menuTabText: {
    fontSize: 20,
  },
  menuTabTextActive: {
    fontSize: 20,
    color: "orange",
  },
});
