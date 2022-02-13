import React from "react";
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
import * as Font from "expo-font";
import * as Icons from "./Icons.js";
import RecordCard from "./RecordCard.js";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;
const BACKGROUND_COLOR = "#FFF8ED";
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const LIVE_COLOR = "#FF0000";
const DISABLED_OPACITY = 0.5;
const RATE_SCALE = 3.0;
const DirName = "expoTest4/";
export default class RecordList extends React.Component {
  constructor(props) {
    super(props);
    this._askForPermissions = async () => {
      const response = await Audio.requestPermissionsAsync();
      this.setState({
        haveRecordingPermissions: response.status === "granted",
      });
    };
    this._updateScreenForSoundStatus = (status) => {
      var _a;
      if (status.isLoaded) {
        this.setState({
          soundDuration:
            (_a = status.durationMillis) !== null && _a !== void 0 ? _a : null,
          soundPosition: status.positionMillis,
          shouldPlay: status.shouldPlay,
          isPlaying: status.isPlaying,
          rate: status.rate,
          muted: status.isMuted,
          volume: status.volume,
          //   shouldCorrectPitch: status.shouldCorrectPitch,
          isPlaybackAllowed: true,
        });
      } else {
        this.setState({
          soundDuration: null,
          soundPosition: null,
          isPlaybackAllowed: false,
        });
        if (status.error) {
          console.log(`FATAL PLAYER ERROR: ${status.error}`);
        }
      }
    };
    this._updateScreenForRecordingStatus = (status) => {
      if (status.canRecord) {
        this.setState({
          isRecording: status.isRecording,
          recordingDuration: status.durationMillis,
        });
      } else if (status.isDoneRecording) {
        this.setState({
          isRecording: false,
          recordingDuration: status.durationMillis,
        });
        if (!this.state.isLoading) {
          this._stopRecordingAndEnablePlayback();
        }
      }
    };
    this._onRecordPressed = () => {
      if (this.state.isRecording) {
        this._stopRecordingAndEnablePlayback();
      } else {
        this._stopPlaybackAndBeginRecording();
      }
    };
    this._onPlayPausePressed = () => {
      if (this.sound != null) {
        if (this.state.isPlaying) {
          this.sound.pauseAsync();
        } else {
          this.sound.playAsync();
        }
      }
    };
    this._onStopPressed = () => {
      if (this.sound != null) {
        this.sound.stopAsync();
      }
    };
    this._onMutePressed = () => {
      if (this.sound != null) {
        this.sound.setIsMutedAsync(!this.state.muted);
      }
    };
    this._onVolumeSliderValueChange = (value) => {
      if (this.sound != null) {
        this.sound.setVolumeAsync(value);
      }
    };
    this._onSeekSliderValueChange = (value) => {
      if (this.sound != null && !this.isSeeking) {
        this.isSeeking = true;
        this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
        this.sound.pauseAsync();
      }
    };
    this._onSeekSliderSlidingComplete = async (value) => {
      if (this.sound != null) {
        this.isSeeking = false;
        const seekPosition = value * (this.state.soundDuration || 0);
        if (this.shouldPlayAtEndOfSeek) {
          this.sound.playFromPositionAsync(seekPosition);
        } else {
          this.sound.setPositionAsync(seekPosition);
        }
      }
    };
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.state = {
      haveRecordingPermissions: false,
      isLoading: false,
      isPlaybackAllowed: false,
      muted: false,
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isRecording: false,
      fontLoaded: false,
      currentRecord: "",
      recordList: null,
      //   shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
    };
    this.recordingSettings = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;
    this.audioList = [];
  }
  componentDidMount() {
    (async () => {
      await Font.loadAsync({
        "cutive-mono-regular": require("../assets/fonts/CutiveMono-Regular.ttf"),
      });
      this.setState({ fontLoaded: true });
    })();
    this._askForPermissions();
    this._getRecordList();
  }

  async _getRecordList() {
    console.log("getRecordList");
    const recordList = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory + DirName
    );
    const soundList = await Promise.all(
      Object.values(recordList).map((e) => {
        const soundObj = new Audio.Sound();
        // console.log(e);
        return soundObj.loadAsync({
          uri: FileSystem.documentDirectory + DirName + encodeURI(e),
        });
      })
    );
    this.audioList = soundList;
    this.setState({ audioList: soundList });
  }

  _updateRecordList(soundList) {
    console.log("update RecordList and Rerendering");
    this.audioList = soundList;
    this.setState({ audioList: soundList });
  }

  _setChangeVolume(value) {
    if (value > 8) value = 8;
    if (value < 0) value = -1;
    this.setState({
      volume: value,
    });
  }
  render() {
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
          data: this.audioList,
          keyExtractor: (item) => item.uri,
          renderItem: ({ item }) => (
            <RecordCard
              item={item}
              updateList={this._updateRecordList.bind(this)}
              // volume = {this.state.volume/10}
            />
          ),
        }),
        React.createElement(
          TouchableOpacity,
          {
            onPress: () => {
              this._getRecordList();
            },
            style: { position: "absolute", bottom: 5, right: 10 },
          },
          React.createElement(
            View,
            {
              style: {
                backgroundColor: GROUNDCOLOR,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "grey",
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              },
            },
            // <Text style={{ color: "white", fontSize: 17 }}>새로고침</Text>
            <Image
              style={{ tintColor: "white" }}
              source={Icons.REFRESH_ICON.module}
            ></Image>
          )
        )
      )
    );
  }
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
    paddingHorizontal:10
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
