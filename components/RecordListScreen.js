import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  FlatList,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Font from "expo-font";
import * as Icons from "./Icons.js";
import { Button } from "react-native-web";
import RecordCard from "./RecordCard.js";

import * as MediaLibrary from "expo-media-library";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;
const BACKGROUND_COLOR = "#FFF8ED";
const LIVE_COLOR = "#FF0000";
const DISABLED_OPACITY = 0.5;
const RATE_SCALE = 3.0;

export default class RecordListScreen extends React.Component {
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
    this.ensureDirExists();
    this._getRecordList();
  }

  async ensureDirExists() {
    const dir = FileSystem.documentDirectory + "expoTest/";
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      console.log("directory doesn't exist, creating...");
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    } else {
      console.log("directory alreay exists");
    }
  }

  async _getRecordList() {
    const recordList = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory + "expoTest/"
    );
    const soundList = await Promise.all(Object.values(recordList).map((e) => {
      const soundObj = new Audio.Sound();
      return soundObj
        .loadAsync({ uri: FileSystem.documentDirectory + "expoTest/" + e })
    }));
    // this.setState({ recordList:  soundList });
    this.audioList = soundList;
    console.log(this.audioList)
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
          style: { backgroundColor: "white" },
          data: this.audioList,
          renderItem: ({ item }) => <Text>{this.audioList[item].uri}</Text>,
        })
      )
    );
  }
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR,
    minHeight: DEVICE_HEIGHT,
    maxHeight: DEVICE_HEIGHT,
    paddingBottom: 70,
  },
  noPermissionsText: {
    textAlign: "center",
  },
  wrapper: {},
  halfScreenContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    // minHeight: DEVICE_HEIGHT / 2.0,
    // maxHeight: DEVICE_HEIGHT / 2.0,
    // backgroundColor: "black",
  },
  recordListContianer: {
    flex: 3,
    flexDirection: "column",
  },
  recordingContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: Icons.RECORD_BUTTON.height,
    maxHeight: Icons.RECORD_BUTTON.height,
    // backgroundColor: "red"
  },
  recordingDataContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: Icons.RECORD_BUTTON.height,
    maxHeight: Icons.RECORD_BUTTON.height,
    minWidth: Icons.RECORD_BUTTON.width * 3.0,
    maxWidth: Icons.RECORD_BUTTON.width * 3.0,
    // backgroundColor: "blue"
  },
  recordingDataRowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: Icons.RECORDING.height,
    maxHeight: Icons.RECORDING.height,
  },
  playbackContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: Icons.THUMB_1.height * 2.0,
    maxHeight: Icons.THUMB_1.height * 2.0,
  },
  playbackSlider: {
    alignSelf: "stretch",
  },
  liveText: {
    color: LIVE_COLOR,
  },
  recordingTimestamp: {
    paddingLeft: 20,
  },
  playbackTimestamp: {
    textAlign: "right",
    alignSelf: "stretch",
    paddingRight: 20,
  },
  image: {
    backgroundColor: BACKGROUND_COLOR,
  },
  textButton: {
    backgroundColor: BACKGROUND_COLOR,
    padding: 10,
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonsContainerTopRow: {
    maxHeight: Icons.MUTED_BUTTON.height,
    alignSelf: "stretch",
    paddingRight: 20,
  },
  playStopContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: ((Icons.PLAY_BUTTON.width + Icons.STOP_BUTTON.width) * 3.0) / 2.0,
    maxWidth: ((Icons.PLAY_BUTTON.width + Icons.STOP_BUTTON.width) * 3.0) / 2.0,
  },
  volumeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  volumeSlider: {
    width: DEVICE_WIDTH / 2.0 - Icons.MUTED_BUTTON.width,
  },
  buttonsContainerBottomRow: {
    maxHeight: Icons.THUMB_1.height,
    alignSelf: "stretch",
    paddingRight: 20,
    paddingLeft: 20,
  },
  timestamp: {
    fontFamily: "cutive-mono-regular",
  },
  rateSlider: {
    width: DEVICE_WIDTH / 2.0,
  },
});
