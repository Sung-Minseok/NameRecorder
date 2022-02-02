import React, { Component, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import * as Filesystem from "expo-file-system";
import * as Font from "expo-font";
import * as Icons from "./Icons.js";
import OptionsMenu from "react-native-option-menu";
import TextTicker from "react-native-text-ticker";
import { withSafeAreaInsets } from "react-native-safe-area-context";
import { isLoaded } from "expo-font";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const DirName = "expoTest3/";
const RecordCard = (props) => {
  const [soundObj, setSoundObj] = useState(null);
  const [playbackObj, setPlaybackObj] = useState(null);
  const [fileDate, setFileDate] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileDuration, setFileDuration] = useState("");
  const [fileUri, setFileUri] = useState("");
  const [isFontLoading, setIsFontLoading] = useState(false);

  const _loadFont = async () => {
    await Font.loadAsync({
      SquareRound: require("../assets/fonts/NanumSquareRound.otf"),
      CutiveMono: require("../assets/fonts/CutiveMono-Regular.ttf"),
      Jua: require("../assets/fonts/Jua-Regular.ttf"),
    });
    setIsFontLoading(true);
  };

  const _getFileInfo = async () => {
    let name_arr = props.item.uri.split("/");
    const name = name_arr[name_arr.length - 1];
    const info = await Filesystem.getInfoAsync(
      Filesystem.documentDirectory + DirName + name
    );
    const _date = new Date(info.modificationTime * 1000);
    setFileDate(
      _date.toLocaleDateString("ko") +
        " " +
        _date.toLocaleTimeString("en", { hour12: false }).slice(0, 5)
    );
    let size = (info.size / 1000000).toString();
    setFileSize(size.slice(0, -4) + "Mb");
    setFileName(decodeURI(name));
    setFileDuration(_getMMSSFromMillis(props.item.durationMillis));
    setFileUri(Filesystem.documentDirectory + DirName + name);
  };
  _getFileInfo();
  _loadFont();

  const _playButtonPressed = async () => {
    console.log(props.item);
    if (soundObj === null) {
      const playbackObj = new Audio.Sound();
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
      await playbackObj.loadAsync(
        { uri: fileUri },
        { shouldPlay: true },
        { isLooping: true }
      );
      const status = await playbackObj.setIsLoopingAsync(true);
      console.log("start playing");
      return setPlaybackObj(playbackObj), setSoundObj(status);
    }

    if (soundObj.isLoaded) {
      await playbackObj.setStatusAsync({ shouldPlay: false });
      const status = await playbackObj.setIsLoopingAsync(false);
      console.log("stop playing");
      return setPlaybackObj(playbackObj), setSoundObj(null);
    }
  };

  const _modifyFile = async () => {
    console.log(props.item);
    const newURI = Filesystem.documentDirectory + DirName + "file4.caf";
    if (fileUri === newURI) {
      return console.log("이미 존재하는 파일 이름입니다.");
    }
    await Filesystem.moveAsync({
      from: fileUri,
      to: newURI,
    });
    _updateList();
    console.log("edit file name");
  };

  const _deleteFile = async () => {
    await Filesystem.deleteAsync(fileUri);
    _updateList();
    console.log("delete file successfully");
  };

  const _updateList = async () => {
    const recordList = await Filesystem.readDirectoryAsync(
      Filesystem.documentDirectory + DirName
    );
    const soundList = await Promise.all(
      Object.values(recordList).map((e) => {
        const soundObj = new Audio.Sound();
        return soundObj.loadAsync({
          uri: Filesystem.documentDirectory + DirName + e,
        });
      })
    );
    props.updateList(soundList);
  };
  const OFFSET = DEVICE_HEIGHT/20;
  const _getMMSSFromMillis = (millis) => {
    const totalSeconds = millis / 1000;
    const milliSeconds = millis % 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);
    const padWithZero = (number) => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return (
      padWithZero(minutes) +
      ":" +
      padWithZero(seconds) +
      ":" +
      padWithZero(milliSeconds).slice(0, 2)
    );
  };

  if (!isFontLoading) {
    return <View></View>;
  }

  return (
    <View style={styles.card_container}>
      <TouchableOpacity onPressOut={() => _playButtonPressed(props.item)}>
        <View style={{width: DEVICE_HEIGHT/35, height: DEVICE_HEIGHT/15, alignContent: 'center', justifyContent: 'center'}}>
          <View
            style={{
              // borderWidth: 1,
              width: DEVICE_HEIGHT / 15,
              height: DEVICE_HEIGHT / 35,
              borderRadius: 5,
              backgroundColor: soundObj === null ? "grey" : "#2D89DF",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              transform: [{ rotate: "270deg" }, {translateX : 0}, {translateY: -DEVICE_HEIGHT/50}],
            }}
          >
            <Text
              style={{
                color: "white",
                // width: DEVICE_HEIGHT / 15,
                fontFamily: "SquareRound",
                // transform: [{ rotate: "-90deg" }],
              }}
            >
              {soundObj === null ? "Stop" : "Play"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.card_recordinfo}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: DEVICE_WIDTH / 2 }}>
            <TextTicker
              style={{ fontSize: 22, fontFamily: "SquareRound" }}
              duration={10000}
              roop
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}
            >
              {fileName}
            </TextTicker>
          </View>
          <View style={styles.card_buttonContainer}>
            {/* <Text>Play</Text>
            <Text>Stop</Text> */}
          </View>
          <OptionsMenu
            button={require("../assets/images/more_button.png")}
            buttonStyle={{
              width: 20,
              height: 20,
              // margin: 0,
              resizeMode: "contain",
            }}
            destructiveIndex={1}
            options={["수정", "삭제", "취소"]}
            actions={[() => _modifyFile(), () => _deleteFile()]}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 10
            // borderWidth: 2,
          }}
        >
          <Text style={{ color: "#6B747B", fontFamily: "SquareRound" }}>
            {fileDate}
          </Text>
          <Text style={{ flex: 1, paddingLeft: 20, color: "#6B747B" }}>
            {fileSize}
          </Text>
          <Text style={{ color: "#6B747B" }}>{fileDuration}</Text>
        </View>
      </View>
    </View>
  );
};

export default RecordCard;
const styles = StyleSheet.create({
  card_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 5,
    borderBottomWidth: 1,
    borderColor: "#C5C7C9",
    height: DEVICE_HEIGHT / 9,
    width: DEVICE_WIDTH - 40,
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  card_recordinfo: {
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "column",
    paddingLeft: 10,
    // borderWidth: 1,
    // marginHorizontal: 10,
  },
  card_buttonContainer: {
    flex: 1,
    alignItems: "center",
  },
});
