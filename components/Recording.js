import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Modal,
  TextInput,
  Animated,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Font from "expo-font";
import * as Icons from "./Icons.js";
import RecordModal from "./RecordModal.js";
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;
const BACKGROUND_COLOR = "white";
const LIVE_COLOR = "#FF0000";
const DISABLED_OPACITY = 0.5;
const RATE_SCALE = 3.0;

const DirName = "expoTest3/";

export default class Recording extends React.Component {
  constructor(props) {
    super(props);
    this._askForPermissions = async () => {
      const response = await Audio.requestPermissionsAsync();
      this.setState({
        haveRecordingPermissions: response.status === "granted",
      });
    };
    this._saveButtonPressed = this._saveButtonPressed.bind(this);
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
      modalVisible: false,
      fileName: "",
      animateValue : new Animated.Value(0),
      animateLoop : false,
    };
    this.recordingSettings = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;
    // UNCOMMENT THIS TO TEST maxFileSize:
    /* this.recordingSettings = {
          ...this.recordingSettings,
          android: {
            ...this.recordingSettings.android,
            maxFileSize: 12000,
          },
        };*/
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
    const animation = Animated.timing(
      this.state.animateValue, {
        toValue: 1,
        duration: 1000,
        delay: 1000,
        useNativeDriver: false,
      }
    );
    Animated.loop(
      animation,{
        iterations: this.state.animateLoop
      }
    ).start();
  }

  async ensureDirExists() {
    const dir = FileSystem.documentDirectory + DirName;
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      console.log("directory doesn't exist, creating...");
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    } else {
      console.log("directory alreay exists");
    }
  }

  async _stopPlaybackAndBeginRecording() {
    this.setState({
      isLoading: true,
      animateLoop: true,
    });
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);
    this.recording = recording;
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    this.setState({
      isLoading: false,
      animateLoop: true,
    });
  }
  async _stopRecordingAndEnablePlayback() {
    this.setState({
      isLoading: true,
      animateLoop: false,
    });
    if (!this.recording) {
      return;
    }
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // On Android, calling stop before any data has been collected results in
      // an E_AUDIO_NODATA error. This means no audio data has been written to
      // the output file is invalid.
      if (error.code === "E_AUDIO_NODATA") {
        console.log(
          `Stop was called too quickly, no data has yet been received (${error.message})`
        );
      } else {
        console.log("STOP ERROR: ", error.code, error.name, error.message);
      }
      this.setState({
        isLoading: false,
      });
      return;
    }
    const info = await FileSystem.getInfoAsync(this.recording.getURI() || "");
    // console.log(this.recording.getURI());

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    const { sound, status } = await this.recording.createNewLoadedSoundAsync(
      {
        isLooping: true,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        // shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
      this._updateScreenForSoundStatus
    );
    this.sound = sound;
    this.setState({
      isLoading: false,
    });
    this.state.currentRecord = `${info.uri}`;
    console.log("recording stop");
  }

  _getSeekSliderPosition() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return this.state.soundPosition / this.state.soundDuration;
    }
    return 0;
  }
  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);
    const padWithZero = (number) => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return padWithZero(minutes) + ":" + padWithZero(seconds);
  }
  _getPlaybackTimestamp() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.soundPosition
      )} / ${this._getMMSSFromMillis(this.state.soundDuration)}`;
    }
    return "";
  }
  _getRecordingTimestamp() {
    if (this.state.recordingDuration != null) {
      return `${this._getMMSSFromMillis(this.state.recordingDuration)}`;
    }
    return `${this._getMMSSFromMillis(0)}`;
  }

  _saveButtonPressed() {
    const date = new Date();
    console.log(date.getFullYear());
    this.setState({
      fileName:
        date.getFullYear() +
        "년" +
        (date.getMonth() + 1) +
        "월" +
        date.getDate() +
        "일 " +
        date.getHours() +
        ":" +
        date.getMinutes(),
    });

    this.setState({ modalVisible: true });
    console.log(this.state.fileName);
    if (this.recording === !null) {
      console.log(this.recording.getURI());
    }
  }

  async _saveRecording() {
    console.log(
      "filename : " +
        FileSystem.documentDirectory +
        DirName +
        encodeURI(this.state.fileName) +
        ".caf"
    );
    if (this.state.fileName.trim() === "") {
      return alert("파일 이름을 입력해주세요!");
    }
    await FileSystem.copyAsync({
      from: this.recording.getURI(),
      to:
        FileSystem.documentDirectory +
        DirName +
        encodeURI(this.state.fileName) +
        ".caf",
    });
    this.setState({ modalVisible: false });
  }

  


  render() {
    const animationStyles = {
      borderColor: this.state.animateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#2D89DF', 'red']
      })
    };

    if (!this.state.fontLoaded) {
      return React.createElement(View, { style: styles.emptyContainer });
    }
    if (!this.state.haveRecordingPermissions) {
      return React.createElement(
        View,
        { style: styles.container },
        React.createElement(View, null),
        React.createElement(
          Text,
          {
            style: [
              styles.noPermissionsText,
              { fontFamily: "cutive-mono-regular" },
            ],
          },
          "You must enable audio recording permissions in order to use this app."
        ),
        React.createElement(View, null)
      );
    }

    return React.createElement(
      View,
      {
        style: [
          {
            opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
          },
          styles.container,
        ],
      },
      React.createElement(
        View,
        { style: styles.recordingContainer },

        // 녹음 버튼 + 녹음시간 숫자
        // 컨테이너 1
        React.createElement(
          View,
          {
            style: {
              flexDirection: "column",
              flex: 3,
              justifyContent: "center",
            },
          },
          React.createElement(
            Animated.View,
            {
              style: 
                this.state.animateLoop ? [styles.recordButtonContainer, animationStyles] : [styles.recordButtonContainer],
              
            },
            React.createElement(
              TouchableHighlight,
              {
                underlayColor: BACKGROUND_COLOR,
                style: styles.wrapper,
                onPress: this._onRecordPressed,
                disabled: this.state.isLoading,
              },
              React.createElement(Image, {
                style: styles.image,
                source: Icons.RECORD_BUTTON.module,
              })
            )
          ),
          React.createElement(
            View,
            { style: styles.recordingDataContainer },
            React.createElement(
              Text,
              {
                style: [
                  styles.recordingTimestamp,
                  { fontFamily: "cutive-mono-regular" },
                ],
              },
              this._getRecordingTimestamp()
            )
          )
        ),

        // 컨테이너2
        React.createElement(
          View,
          { style: { flexDirection: "column", flex: 1 } },

          // 재생 라인
          React.createElement(
            View,
            { style: styles.playbackContainer },
            React.createElement(Slider, {
              style: styles.playbackSlider,
              trackImage: Icons.TRACK_1.module,
              thumbImage: Icons.THUMB_1.module,
              value: this._getSeekSliderPosition(),
              onValueChange: this._onSeekSliderValueChange,
              onSlidingComplete: this._onSeekSliderSlidingComplete,
              disabled: !this.state.isPlaybackAllowed || this.state.isLoading,
            }),
            React.createElement(
              Text,
              {
                style: [
                  styles.playbackTimestamp,
                  { fontFamily: "cutive-mono-regular" },
                ],
              },
              this._getPlaybackTimestamp()
            )
          ),

          // 볼륨, 재생, 정지 버튼
          React.createElement(
            View,
            {
              style: styles.buttonsContainerBase,
            },
            React.createElement(
              View,
              { style: styles.volumeContainer },
              React.createElement(
                TouchableHighlight,
                {
                  underlayColor: BACKGROUND_COLOR,
                  style: styles.wrapper,
                  onPress: this._onMutePressed,
                  disabled:
                    !this.state.isPlaybackAllowed || this.state.isLoading,
                },
                React.createElement(Image, {
                  style: styles.image,
                  source: this.state.muted
                    ? Icons.MUTED_BUTTON.module
                    : Icons.UNMUTED_BUTTON.module,
                })
              ),
              React.createElement(Slider, {
                style: styles.volumeSlider,
                trackImage: Icons.TRACK_1.module,
                thumbImage: Icons.THUMB_2.module,
                value: 1,
                onValueChange: this._onVolumeSliderValueChange,
                disabled: !this.state.isPlaybackAllowed || this.state.isLoading,
              })
            ),

            React.createElement(
              View,
              { style: styles.playStopContainer },
              React.createElement(
                TouchableHighlight,
                {
                  underlayColor: BACKGROUND_COLOR,
                  style: styles.wrapper,
                  onPress: this._onPlayPausePressed,
                  disabled:
                    !this.state.isPlaybackAllowed || this.state.isLoading,
                },
                React.createElement(Image, {
                  style: styles.image,
                  source: this.state.isPlaying
                    ? Icons.PAUSE_BUTTON.module
                    : Icons.PLAY_BUTTON.module,
                })
              ),
              React.createElement(
                TouchableHighlight,
                {
                  underlayColor: BACKGROUND_COLOR,
                  style: styles.wrapper,
                  onPress: this._onStopPressed,
                  disabled:
                    !this.state.isPlaybackAllowed || this.state.isLoading,
                },
                React.createElement(Image, {
                  style: styles.image,
                  source: Icons.STOP_BUTTON.module,
                })
              )
            )
          )
        ),

        // 저장 버튼
        React.createElement(
          View,
          {
            style: [
              {
                opacity:
                  !this.state.isPlaybackAllowed && !this.state.isLoading
                    ? DISABLED_OPACITY
                    : 1.0,
              },
              styles.saveButton,
            ],
          },
          React.createElement(
            TouchableHighlight,
            {
              underlayColor: BACKGROUND_COLOR,
              style: styles.wrapper,
              onPress: () => this._saveButtonPressed(),
              disabled: !this.state.isPlaybackAllowed && !this.state.isLoading,
            },
            React.createElement(Image, {
              style: { width: 300, height: 50 },
              source: Icons.SAVE_BUTTON.module,
            })
          )
        )
      ),
      // Modal
      React.createElement(
        Modal,
        {
          visible: this.state.modalVisible,
          useNativeDriver: true,
          hideModalContentWhileAnimating: true,
          transparent: true,
        },
        <RecordModal
          onPressCancle={() => this.setState({ modalVisible: false })}
          onChangeText={(text) => this.setState({ fileName: text })}
          value={this.state.fileName}
          saveRecording={this._saveRecording.bind(this)}
        />
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
    minHeight: DEVICE_HEIGHT - 100,
    maxHeight: DEVICE_HEIGHT - 100,
    // paddingBottom: 70,
  },
  recordButtonContainer: {
    borderWidth: 5,
    borderColor: "#2D89DF",
    borderRadius: 300,
    width: DEVICE_WIDTH / 1.5,
    height: DEVICE_WIDTH / 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  noPermissionsText: {
    textAlign: "center",
  },
  wrapper: {},
  halfScreenContainer: {
    // flex: 1,
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // alignSelf: "stretch",
    // borderWidth:1
  },
  recordingDataContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: Icons.RECORDING.height,
    maxHeight: Icons.RECORDING.height,
    marginTop: 10,
  },
  recordingDataRowContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: Icons.RECORDING.height,
    maxHeight: Icons.RECORDING.height,
    borderWidth: 1,
    marginTop: 10,
  },
  playbackContainer: {
    // flex: 1,
    // flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    paddingHorizontal: 30,
  },
  playbackSlider: {
    alignSelf: "stretch",
  },
  liveText: {
    color: LIVE_COLOR,
  },
  recordingTimestamp: {
    paddingLeft: 0,
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
  saveButton: {
    paddingBottom: 20,
  },
  buttonsContainerBase: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: DEVICE_WIDTH,
    paddingTop: 30,
    paddingHorizontal: 30,
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
