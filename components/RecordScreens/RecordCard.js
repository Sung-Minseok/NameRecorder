import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from "expo-font";
import * as Icons from "../../components/Icons";
import TextTicker from "react-native-text-ticker";



//redux
import { useSelector, useDispatch } from "react-redux";
import { setRecordList, setRecordUsedCnt } from "../../redux/record";

import DeleteModal from "./RecordListDeleteModal.js";
import ModifyModal from "./RecordListModifyModal.js";
import LoadingModal from "./RecordLoadingModal.js";
import { getItemFromAsync, setItemToAsync } from "../CustomFunctions";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const BACKGROUNDCOLOR = "#F4ECE6";

const DirName = "expoTest4/";
const RecordCard = (props) => {
  const [soundObj, setSoundObj] = useState(null);
  const [playbackObj, setPlaybackObj] = useState(null);
  const [fileDate, setFileDate] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileDuration, setFileDuration] = useState("");
  const [fileUri, setFileUri] = useState("");
  const [isFontLoading, setIsFontLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [volume, setVolume] = useState(-1);
  const [soundPosition, setSoundPosition] = useState(null);
  const [soundDuration, setSoundDuration] = useState(null);
  const [modifyModalVisible, setModifyModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState("");
  // const [fileNum, setFileNum] = useState(0);
  // const [modifyFileName, setModifyFileName] = useState("");
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);

  useEffect(() => {
    async function _getFileInfo() {
      let name_arr = props.item.uri.split("/");
      const name = name_arr[name_arr.length - 1];
      const info = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + DirName + name
      );
      const _date = new Date(info.modificationTime * 1000);
      setFileDate(
        _date.toISOString().split("T")[0] +
        " " +
        _date.toLocaleTimeString("en", { hour12: false }).slice(0, 5)
      );
      let size = (info.size / 1000000).toString();
      setFileSize(size.slice(0, -4) + "Mb");
      setFileName(decodeURI(name).slice(0, -4));
      // setValue(fileName);
      setFileDuration(_getMMSSFromMillis(props.item.durationMillis));
      const uri = await FileSystem.documentDirectory + DirName + name
      setFileUri(uri);
      var storageList = await getItemFromAsync('abc')
      if(storageList === null){
        storageList = []
      }
      // console.log(decodeURI(name).slice(0, -4))
      // console.log(storageList)
      if(storageList.includes(decodeURI(name).slice(0, -4))){
        console.log("uri : "+uri)
        if (soundObj === null) {
          const playbackObj = new Audio.Sound();
          Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: true,
            playThroughEarpieceAndroid: false,
          });
          await playbackObj.loadAsync(
            { uri: uri },
            { shouldPlay: true },
            { isLooping: true }
          );
          await playbackObj.setVolumeAsync(volume < 0 ? 0 : volume / 10);
          const status = await playbackObj.setIsLoopingAsync(true);
          console.log("start playing");
          return (
            setPlaybackObj(playbackObj),
            setSoundObj(status),
            setSoundDuration(status.durationMillis),
            setSoundPosition(2)
          );
        }
      }
    };

    _getFileInfo();
    _loadFont();
  },[]);

  const _loadFont = async () => {
    await Font.loadAsync({
      SquareRound: require("../../assets/fonts/NanumSquareRound.otf"),
      CutiveMono: require("../../assets/fonts/CutiveMono-Regular.ttf"),
      Jua: require("../../assets/fonts/Jua-Regular.ttf"),
    });
    setIsFontLoading(true);
  };

  

  const _playButtonPressed = async () => {
    var oldList = await getItemFromAsync('abc')
    if(oldList===null){
      oldList = []
    }
    // console.log(oldList)
    if (soundObj === null) {
      const playbackObj = new Audio.Sound();
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: false,
      });
      await playbackObj.loadAsync(
        { uri: fileUri },
        { shouldPlay: true },
        { isLooping: true }
      );
      await playbackObj.setVolumeAsync(volume < 0 ? 0 : volume / 10);
      const status = await playbackObj.setIsLoopingAsync(true);
      oldList.push(fileName)
      await AsyncStorage.setItem('abc',JSON.stringify(oldList)) 
      console.log("start playing");
      return (
        setPlaybackObj(playbackObj),
        setSoundObj(status),
        setSoundDuration(status.durationMillis),
        setSoundPosition(2)
      );
    }

    if (soundObj.isLoaded) {
      await playbackObj.setStatusAsync({ shouldPlay: false });
      const status = await playbackObj.setIsLoopingAsync(false);
      // var idx = oldList.indexOf(fileName)
      // console.log(idx)
      // if (idx > -1){
      //   oldList.slice(idx,1)
      // }
      oldList = oldList.filter((e)=> e !==fileName)
      await AsyncStorage.setItem('abc',JSON.stringify(oldList))
      console.log("stop playing");
      return setPlaybackObj(playbackObj), setSoundObj(null);
    }
  };

  const _modifyFile = async () => {
    // console.log(props.item);
    let newURI = FileSystem.documentDirectory + DirName + encodeURI(value) + ".caf";
    console.log("new : " + newURI)
    const pattern = /\([0-9]+\)/;
    const pattern2 = /[0-9]+/;
    let file_name = value;
    let fileNum = 0
    if (fileName === value) {
      return Alert.alert("알림", "기존 파일명과 같습니다.")
    }
    while (await FileSystem.getInfoAsync(newURI).then((e) => {
      return e.exists;
    })) {
      if (file_name.match(pattern) === null) {
        file_name = file_name+"(1)"
      } else {
        fileNum = parseInt(file_name.match(pattern).toString().match(pattern2))
        fileNum++;
        file_name = file_name.replace(/\([0-9]+\)/, "(" + fileNum + ")")
      }
      newURI = FileSystem.documentDirectory + DirName + encodeURI(file_name) + ".caf"
      if (!await FileSystem.getInfoAsync(newURI).then((e) => {
        return e.exists;
      })) {
        break;
      }
    }
  
    await FileSystem.moveAsync({
      from: fileUri,
      to: newURI,
    }).finally(()=>{
      _updateList();
      setModifyModalVisible(false);
    })
    console.log("edit file name");
  };

  const _onPressModify = async () => {
    if (soundObj != null) {
      await playbackObj.setStatusAsync({ shouldPlay: false });
      const status = await playbackObj.setIsLoopingAsync(false);
      console.log("stop playing");
      setPlaybackObj(playbackObj);
      setSoundObj(null);
    }
    setValue(fileName);
    setModifyModalVisible(true);
  };

  const _deleteFile = async () => {
    setDeleteModalVisible(false);
    setModalVisible(true)
    await FileSystem.deleteAsync(fileUri).finally(()=>{
      setTimeout(()=>{
        _updateList();
        setModalVisible(false)
      },2000)
      
      console.log("delete complete")
    });
    console.log("delete file successfully");
  };

  const _onPressDelete = async () => {
    if (soundObj != null) {
      await playbackObj.setStatusAsync({ shouldPlay: false });
      const status = await playbackObj.setIsLoopingAsync(false);
      console.log("stop playing");
      setPlaybackObj(playbackObj);
      setSoundObj(null);
    }
    setDeleteModalVisible(true);
  };

  const _updateList = async () => {
    console.log('update record list')
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
    dispatch(setRecordUsedCnt(soundList.length));
    dispatch(setRecordList(soundList));
  };

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
  const _itemOnClick = () => {
    setActive(!active);
  };

  const _volumeChange = (value) => {
    if (value <= 0) value = -1;
    if (value > 8) value = 8;
    setVolume(value);
    if (value < 0) value = 0;
    playbackObj.setVolumeAsync(value / 10);
  };


  if (!isFontLoading) {
    return <View></View>;
  }

  return (

    <View
      style={{
        // flex: 1,
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: 5,
        borderBottomWidth: 1,
        borderColor: "#C5C7C9",
        width: DEVICE_WIDTH * 0.95,
        // height: active ? DEVICE_HEIGHT * 0.17 : DEVICE_HEIGHT * 0.1,
        height: DEVICE_HEIGHT*0.17,
        paddingHorizontal: 5,
        paddingTop: 10,
      }}
    >
      <View
        style={{
          // flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            // width: DEVICE_HEIGHT / 35,
            // height: DEVICE_HEIGHT / 15,
            alignContent: "center",
            justifyContent: "center",

          }}
        >
          <TouchableOpacity onPress={() => _playButtonPressed(props.item)}>
            <View
              style={{
                width: DEVICE_WIDTH * 0.18,
                height: DEVICE_HEIGHT * 0.07,
                borderRadius: 5,
                backgroundColor: soundObj === null ? "grey" : POINTCOLOR,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "SquareRound",
                  fontSize: 20
                }}
              >
                {soundObj === null ? "정지중" : "재생중"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.card_recordinfo}>
          <TouchableOpacity onPress={() => _itemOnClick()}>
            <View style={{ flexDirection: "row" }}>
              <TextTicker
                style={{ fontSize: 22, fontFamily: "SquareRound", width: DEVICE_WIDTH * 0.74 - 10 }}
                duration={10000}
                roop
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}
              >
                {fileName}
              </TextTicker>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 10,
              }}
            >
              <Text style={{ color: "#6B747B", fontFamily: "SquareRound", fontSize: 16 }}>
                {fileDate}
              </Text>
              {/* <Text
                style={{
                  // flex: 1,
                  // paddingLeft: 20,
                  color: "#6B747B",
                  fontFamily: "SquareRound",
                  fontSize: 16,
                }}
              >
                {fileSize}
              </Text> */}
              <Text style={{ color: "#6B747B", fontFamily: "SquareRound", fontSize: 16 }}>
                {fileDuration}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {true && (
        <View
          style={{
            height: DEVICE_HEIGHT * 0.07,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            alignContent: "center",
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              flex: 1.5,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: DEVICE_HEIGHT * 0.05,
              borderRadius: 5,
            }}
          >
            {/* 볼륨 , 재생 버튼 */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                // marginLeft: 30,
                // borderWidth: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => _onPressDelete()}
                style={styles.button}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontFamily: "SquareRound",
                  }}
                >
                  {"녹음 삭제"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => _onPressModify()}
                style={styles.button}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontFamily: "SquareRound",
                  }}
                >
                  {"제목 수정"}
                </Text>
              </TouchableOpacity>
              {/* <View style={{ flex: 1 }}></View> */}
              <TouchableOpacity
                disabled={soundObj == null}
                onPress={() => {
                  _volumeChange(volume - 1);
                }}
                style={{
                  // flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    borderWidth: 1,
                    width: 30,
                    height: 30,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                    backgroundColor: "grey",
                    borderColor: "grey",
                  }}
                >
                  <Image
                    style={{ tintColor: "white" }}
                    source={Icons.VOLUME_MINUS.module}
                  ></Image>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  flex: 1.2,
                  alignSelf: "center",
                  justifyContent: "center",
                  margin: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    alignSelf: "center",
                    fontFamily: "SquareRound",
                    // color: 'white',
                  }}
                >
                  볼륨 : {volume}
                </Text>
              </View>
              <TouchableOpacity
                disabled={soundObj == null}
                onPress={() => {
                  if (volume == -1) {
                    _volumeChange(volume + 2)
                  } else {
                    _volumeChange(volume + 1);
                  }
                }}
                style={{
                  // flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    borderWidth: 1,
                    width: 30,
                    height: 30,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                    backgroundColor: "grey",
                    borderColor: "grey",
                    alignContent: "center",
                  }}
                >
                  <Image
                    style={{ tintColor: "white" }}
                    source={Icons.VOLUME_PLUS.module}
                  ></Image>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <Modal
        visible={deleteModalVisible}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        transparent={true}
      >
        <DeleteModal
          onPressCancle={() => setDeleteModalVisible(false)}
          onPressConfirm={() => _deleteFile()}
        />
      </Modal>
      <Modal
        visible={modifyModalVisible}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        transparent={true}
      >
        <ModifyModal
          onPressCancle={() => setModifyModalVisible(false)}
          onPressConfirm={() => _modifyFile()}
          value={value}
          onChangeText={(text) => setValue(text)}
        />
      </Modal>
      <Modal visible={modalVisible} transparent={true}>
        <LoadingModal/>
      </Modal>
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
    backgroundColor: BACKGROUNDCOLOR,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderColor: "#C5C7C9",
    width: DEVICE_WIDTH - 40,
    height: RecordCard.active ? DEVICE_HEIGHT / 7 : DEVICE_HEIGHT / 9,
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
  button: {
    // height: DEVICE_HEIGHT * 0.05,
    height: 30,
    flex: 1,
    backgroundColor: GROUNDCOLOR,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 7,
    marginRight: 5,

    // borderWidth: 1
  },
  volumeSliderContainer: {
    alignSelf: "stretch",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: 20,
    // paddingLeft: DEVICE_HEIGHT/50,
    paddingTop: 10,
    // paddingRight: 10
  },
  loadingModal : {
    backgroundColor: 'white',
    height: 40,
    width : 100,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: GROUNDCOLOR,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
