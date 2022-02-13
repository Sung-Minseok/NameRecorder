import React, {useState, useEffect} from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Font from "expo-font";
import * as Icons from "./Icons.js";
import RecordModal from "./RecordModal.js";
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const BACKGROUND_COLOR = "#F4ECE6";
const LIVE_COLOR = "#FF0000";
const DISABLED_OPACITY = 0.5;
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const DirName = "expoTest4/";

export default function Recording() {
  const [recording, setRecording] = useState({a: null});
  const [sound, setSound] = useState(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [shouldPlayAtEndOfSeek, SetShouldPlayAtEndOfSeek] = useState(false);
  const [haveRecordingPermissions, setHaveRecordingPermissions] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaybackAllowed, setIsPlaybackAllowed] = useState(false);
  const [muted, setMuted] = useState(false);
  const [soundPosition, setSoudnPosition] = useState(null);
  const [soundDuration, setSoundDuration] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(null);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [recordList, setRecordList] = useState(null);
  const [volume, setVolume] = useState(1.0);
  const [rate, setRate] = useState(1.0);
  const [modalVisible, setModalVisible] = useState(false);
  const [fileName, setFileName] = useState("");

  const recordingSettings = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;

  useEffect(async () => {
    await Font.loadAsync({
      "cutive-mono-regular": require("../assets/fonts/CutiveMono-Regular.ttf"),
      SquareRound: require("../assets/fonts/NanumSquareRound.otf"),
    });
    setFontLoaded(true);
    _askForPermissions();
  });

  const _askForPermissions = async () => {
    const response = await Audio.requestPermissionsAsync();
    setHaveRecordingPermissions(response.status === "granted");
  };

  const _updateScreenForSoundStatus = (status) => {
    var _a;
    if (isLoaded) {
      setSoundDuration(
        (_a = status.durationMillis) !== null && _a !== void 0 ? _a : null
      );
      setSoudnPosition(status.positionMillis);
      setShouldPlay(status.shouldPlay);
      setIsPlaying(status.isPlaying);
      setRate(status.rate);
      setMuted(status.isMuted);
      setVolume(status.volume);
      setIsPlaybackAllowed(true);
    } else {
      setSoundDuration(null);
      setSoudnPosition(null);
      setIsPlaybackAllowed(false);
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  const _updateScreenForRecordingStatus = (status) => {
    if (status.canRecord) {
      setIsRecording(status.isRecording);
      setRecordingDuration(status.durationMillis);
    } else if (status.isDoneRecording) {
      setIsRecording(false);
      setRecordingDuration(status.durationMillis);
      if (!isLoading) {
        _stopRecordingAndEnablePlayback();
      }
    }
  };

  const _onRecordPressed = () => {
    if (isRecording) {
      _stopRecordingAndEnablePlayback();
    } else {
      _stopPlaybackAndBeginRecording();
    }
  };

  const _onPlayPausePressed = () => {
    if (sound != null) {
      if (isPlaying) {
        sound.pauseAsync();
      } else {
        sound.playAsync();
      }
    }
  };
  const _onStopPressed = () => {
    if (sound != null) {
      sound.stopAsync();
    }
  };
  const _onMutePressed = () => {
    if (sound != null) {
      sound.setIsMutedAsync(!muted);
    }
  };
  const _onVolumeSliderValueChange = (value) => {
    if (sound != null) {
      sound.setVolumeAsync(value);
    }
  };
  const _onSeekSliderValueChange = (value) => {
    if (sound != null && !isSeeking) {
      setIsSeeking(true);
      SetShouldPlayAtEndOfSeek(shouldPlay);
      sound.pauseAsync();
    }
  };
  const _onSeekSliderSlidingComplete = async (value) => {
    if (sound != null) {
      setIsSeeking(false);
      const seekPosition = value * (soundDuration || 0);
      if (shouldPlayAtEndOfSeek) {
        sound.playFromPositionAsync(seekPosition);
      } else {
        sound.setPositionAsync(seekPosition);
      }
    }
  };

  // 기존 constructor 이후
  const _stopPlaybackAndBeginRecording = async () => {
    setIsLoading((isLoading) => true);
    console.log("isloading : "+isLoading)
    if (sound !== null) {
      await sound.unloadAsync();
      sound.setOnPlaybackStatusUpdate(null);
      setSound(null);
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
    if (recording !== null) {
      recording.setOnRecordingStatusUpdate(null);
      setRecording(null);
    }
    const new_recording = new Audio.Recording();
    await new_recording.prepareToRecordAsync(recordingSettings);
    new_recording.setOnRecordingStatusUpdate(_updateScreenForRecordingStatus(new_recording));
    // setRecording(new_recording);
    setRecording((recording) => 'asdfasdf');
    console.log('recording : '+recording)
    await new_recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    setIsLoading(false);
  };

  const _stopRecordingAndEnablePlayback = async () => {
    setIsLoading(true);
    if (!recording) {
      return;
    }
    try {
      await recording.stopAndUnloadAsync();
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
      setIsLoading(false);
      return;
    }
    const info = await FileSystem.getInfoAsync(recording.getURI() || "");

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    const { sound, status } = await recording.createNewLoadedSoundAsync(
      {
        isLooping: true,
        isMuted: muted,
        volume: volume,
        rate: rate,
        // shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
      _updateScreenForSoundStatus(status)
    );
    sound = sound;
    setIsLoading(false);
    console.log("recording stop");
  };

  const _getSeekSliderPosition = () => {
    if (sound != null && soundPosition != null && soundDuration != null) {
      return soundPosition / soundDuration;
    }
    return 0;
  };
  const _getMMSSFromMillis = (millis) => {
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
  };
  const _getPlaybackTimestamp = () => {
    if (sound != null && soundPosition != null && soundDuration != null) {
      return `${_getMMSSFromMillis(soundPosition)} / ${_getMMSSFromMillis(
        soundDuration
      )}`;
    }
    return "";
  };
  const _getRecordingTimestamp = () => {
    if (recordingDuration != null) {
      return `${_getMMSSFromMillis(recordingDuration)}`;
    }
    return `${_getMMSSFromMillis(0)}`;
  };

  const _saveButtonPressed = () => {
    const date = new Date();
    setFileName(
      date.getFullYear() +
        "년" +
        (date.getMonth() + 1) +
        "월" +
        date.getDate() +
        "일 " +
        date.getHours() +
        "시" +
        date.getMinutes() +
        "분"
    );
    setModalVisible(true);
    console.log(fileName);
    if (recording === !null) {
      console.log(recording.getURI());
    }
  };

  const _saveRecording = async () => {
    console.log(
      "filename : " +
        FileSystem.documentDirectory +
        DirName +
        encodeURI(fileName) +
        ".caf"
    );
    if (fileName.trim() === "") {
      // return alert("파일 이름을 입력해주세요!");
    }
    await FileSystem.copyAsync({
      from: recording.getURI(),
      to:
        FileSystem.documentDirectory +
        DirName +
        encodeURI(fileName) +
        ".caf",
    });
    setModalVisible(false);
  };

  if (!fontLoaded) {
    return React.createElement(View, { style: styles.emptyContainer });
  }
  if (!haveRecordingPermissions) {
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
          opacity: isLoading ? DISABLED_OPACITY : 1.0,
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
            alignItems: "center",
            // borderWidth: 1,
            marginTop: 50,
            // height: DEVICE_HEIGHT*0.5,
          },
        },

        React.createElement(
          Animated.View,
          {
            style: styles.recordButtonContainer,
          },
          React.createElement(
            View,
            {
              style: {
                backgroundColor: "white",
                width: DEVICE_WIDTH * 0.52,
                height: DEVICE_WIDTH * 0.52,
                borderRadius: 300,
                borderWidth: 1,
                borderColor: "#FA622B",
                alignItems: "center",
                justifyContent: "center",
              },
            },
            React.createElement(
              View,
              {
                style: {
                  backgroundColor: "#B71313",
                  width: DEVICE_WIDTH * 0.45,
                  height: DEVICE_WIDTH * 0.45,
                  borderRadius: 300,
                  alignItems: "center",
                  justifyContent: "center",
                },
              },
              React.createElement(
                TouchableHighlight,
                {
                  underlayColor: "BACKGROUND_COLOR",
                  style: styles.wrapper,
                  onPress: () => _onRecordPressed(),
                  disabled: isLoading,
                },
                React.createElement(Image, {
                  style: { backgroundColor: "transparent" },
                  source: Icons.RECORD_BUTTON2.module,
                })
              )
            )
          )
        ),

        React.createElement(
          View,
          {
            style: [
              styles.recordingDataContainer,
              { opacity: isRecording ? 1.0 : 0.0 },
            ],
          },
          React.createElement(Image, {
            style: { marginHorizontal: 5 },
            source: Icons.RECORDING.module,
          }),
          <Text style={{ fontFamily: "SquareRound", fontSize: 17 }}>
            녹음중...
          </Text>
        )
      ),

      // 컨테이너2
      React.createElement(
        View,
        {
          style: {
            flexDirection: "column",
            height: DEVICE_HEIGHT * 0.3,
            // flex: 1
          },
        },

        // 재생 라인
        React.createElement(
          View,
          { style: styles.playbackContainer },
          React.createElement(Slider, {
            style: styles.playbackSlider,
            // trackImage: Icons.TRACK_1.module,
            thumbImage: Icons.THUMB_1.module,
            minimumTrackTintColor: GROUNDCOLOR,
            maximumTrackTintColor: "grey",
            value: () => _getSeekSliderPosition(),
            onValueChange: () => _onSeekSliderValueChange(),
            onSlidingComplete: () => _onSeekSliderSlidingComplete(),
            disabled: !isPlaybackAllowed || isLoading,
          }),
          !isPlaybackAllowed || isLoading
            ? React.createElement(
                Text,
                {
                  style: [
                    styles.playbackTimestamp,
                    { fontFamily: "SquareRound", fontSize: 15 },
                  ],
                },
                _getRecordingTimestamp()
              )
            : React.createElement(
                Text,
                {
                  style: [
                    styles.playbackTimestamp,
                    { fontFamily: "SquareRound", fontSize: 15 },
                  ],
                },
                _getPlaybackTimestamp()
              )
        ),

        // 재생, 정지 버튼
        React.createElement(
          View,
          {
            style: [
              {
                opacity:
                  !isPlaybackAllowed && !isLoading
                    ? DISABLED_OPACITY
                    : 1.0,
              },
              styles.buttonsContainerBase,
            ],
          },

          React.createElement(
            View,
            { style: styles.playStopContainer },
            React.createElement(
              TouchableHighlight,
              {
                underlayColor: BACKGROUND_COLOR,
                style: styles.wrapper,
                underlayColor: "white",
                onPress: () => _onPlayPausePressed(),
                disabled: !isPlaybackAllowed || isLoading,
              },
              React.createElement(Image, {
                style: styles.image,
                source: isPlaying
                  ? Icons.PAUSE_BUTTON.module
                  : Icons.PLAY_BUTTON.module,
              })
            )
            // React.createElement(
            //   TouchableHighlight,
            //   {
            //     underlayColor: BACKGROUND_COLOR,
            //     style: styles.wrapper,
            //     onPress: this._onStopPressed,
            //     disabled:
            //       !this.state.isPlaybackAllowed || this.state.isLoading,
            //   },
            //   React.createElement(Image, {
            //     style: styles.image,
            //     source: Icons.STOP_BUTTON.module,
            //   })
            // )
          )
        ),
        // 저장, 볼륨 버튼
        React.createElement(
          View,
          {
            style: {
              flexDirection: "row",
              marginLeft: 10,
              marginRight: 10,
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              bottom: 10,
              alignSelf: "center",
            },
          },
          React.createElement(
            View,
            { style: styles.volumeContainer },
            React.createElement(
              TouchableHighlight,
              {
                underlayColor: "white",
                style: styles.wrapper,
                onPress: ()=> _onMutePressed(),
                disabled: !isPlaybackAllowed || isLoading,
              },
              React.createElement(Image, {
                style: styles.image,
                source: muted
                  ? Icons.MUTED_BUTTON.module
                  : Icons.UNMUTED_BUTTON.module,
              })
            ),
            React.createElement(Slider, {
              style: styles.volumeSlider,
              // trackImage: Icons.TRACK_1.module,
              thumbImage: Icons.THUMB_2.module,
              minimumTrackTintColor: GROUNDCOLOR,
              maximumTrackTintColor: "grey",
              value: 1,
              onValueChange: () => _onVolumeSliderValueChange(),
              disabled: !isPlaybackAllowed || isLoading,
            })
          ),
          React.createElement(
            View,
            {
              style: [
                {
                  opacity:
                    !isPlaybackAllowed && !isLoading
                      ? DISABLED_OPACITY
                      : 1.0,
                },
                styles.saveButton,
              ],
            },
            React.createElement(
              TouchableHighlight,
              {
                underlayColor: "white",
                style: styles.wrapper,
                onPress: () => _saveButtonPressed(),
                disabled:
                  !isPlaybackAllowed && !isLoading,
              },
              React.createElement(
                View,
                {
                  style: {
                    borderRadius: 7,
                    backgroundColor: GROUNDCOLOR,
                    width: DEVICE_WIDTH * 0.35,
                    height: DEVICE_WIDTH * 0.12,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                },
                React.createElement(
                  Text,
                  {
                    style: {
                      fontSize: 20,
                      color: "white",
                      fontFamily: "SquareRound",
                    },
                  },
                  "저장"
                )
              )
            )
          )
        )
      )
    ),
    React.createElement(
      TouchableHighlight,
      {
        underlayColor: BACKGROUND_COLOR,
        style: {
          position: "absolute",
          top: 5,
          right: 5,
        },
        onPress: () => alert("업데이트 예정."),
      },
      React.createElement(
        View,
        {
          style: {
            borderRadius: 7,
            backgroundColor: GROUNDCOLOR,
            width: DEVICE_WIDTH * 0.23,
            height: DEVICE_WIDTH * 0.1,
            alignItems: "center",
            justifyContent: "center",
          },
        },
        React.createElement(
          Text,
          {
            style: {
              fontSize: 20,
              color: "white",
              fontFamily: "SquareRound",
            },
          },
          "사용방법"
        )
      )
    ),
    // Modal
    React.createElement(
      Modal,
      {
        visible: modalVisible,
        useNativeDriver: true,
        hideModalContentWhileAnimating: true,
        transparent: true,
      },
      <RecordModal
        onPressCancle={() => setModalVisible(false)}
        onChangeText={(text) => setFileName(text)}
        value={fileName}
        saveRecording={()=>_saveRecording()}
      />
    )
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: "stretch",
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "white",
    height: DEVICE_HEIGHT,
    // marginBottom: 70,
  },
  recordButtonContainer: {
    borderRadius: 300,
    width: DEVICE_WIDTH * 0.6,
    height: DEVICE_WIDTH * 0.6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#ff6781",
    borderWidth: 1,
    borderColor: "#FDB79E",
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
    // flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // minHeight: Icons.RECORDING.height,
    // maxHeight: Icons.RECORDING.height,
    marginTop: 20,
  },
  recordingDataRowContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: Icons.RECORDING.height,
    maxHeight: Icons.RECORDING.height,
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
    // borderWidth: 1
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
    // backgroundColor: 'white',
    tintColor: GROUNDCOLOR,
  },
  saveButton: {
    alignSelf: "center",
  },
  buttonsContainerBase: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH,
    // paddingTop: 10,
    paddingHorizontal: 30,
    // borderWidth:1
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
    justifyContent: "center",
    // minWidth: ((Icons.PLAY_BUTTON.width + Icons.STOP_BUTTON.width) * 3.0) / 2.0,
    // maxWidth: ((Icons.PLAY_BUTTON.width + Icons.STOP_BUTTON.width) * 3.0) / 2.0,
  },
  volumeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
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
