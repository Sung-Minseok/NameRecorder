import React from "react";
import {
  Dimensions,
  Image,
  Slider,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Font from "expo-font";
import * as Permissions from "expo-permissions";
import * as Icons from "./Icons.js";
// const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height-70;
const BACKGROUND_COLOR = "#FFF8ED";
const LIVE_COLOR = "#FF0000";
const DISABLED_OPACITY = 0.5;
const RATE_SCALE = 3.0;
export default class Recording extends React.Component {
  constructor(props) {
    super(props);
    this._askForPermissions = async () => {
      const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
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
          shouldCorrectPitch: status.shouldCorrectPitch,
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
    this._trySetRate = async (rate, shouldCorrectPitch) => {
      if (this.sound != null) {
        try {
          await this.sound.setRateAsync(rate, shouldCorrectPitch);
        } catch (error) {
          // Rate changing could not be performed, possibly because the client's Android API is too old.
        }
      }
    };
    this._onRateSliderSlidingComplete = async (value) => {
      this._trySetRate(value * RATE_SCALE, this.state.shouldCorrectPitch);
    };
    this._onPitchCorrectionPressed = () => {
      this._trySetRate(this.state.rate, !this.state.shouldCorrectPitch);
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
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
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
  }
  async _stopPlaybackAndBeginRecording() {
    this.setState({
      isLoading: true,
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
    });
  }
  async _stopRecordingAndEnablePlayback() {
    this.setState({
      isLoading: true,
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
    console.log(`FILE INFO: ${JSON.stringify(info)}`);
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
        shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
      this._updateScreenForSoundStatus
    );
    this.sound = sound;
    this.setState({
      isLoading: false,
    });
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
  render() {
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
      { style: styles.container },
      React.createElement(
        View,
        {
          style: [
            styles.halfScreenContainer,
            {
              opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
            },
          ],
        },
        React.createElement(View, null),
        React.createElement(
          View,
          { style: styles.recordingContainer },
          React.createElement(View, null),
          React.createElement(
            TouchableHighlight,
            {
              underlayColor: "white",
              style: styles.wrapper,
              onPress: this._onRecordPressed,
              disabled: this.state.isLoading,
            },
            React.createElement(Image, {
              style: styles.image,
              source: Icons.RECORD_BUTTON.module,
            })
          ),
          React.createElement(
            View,
            { style: styles.recordingDataContainer },
            React.createElement(View, null),
            React.createElement(
              Text,
              {
                style: [styles.liveText, { fontFamily: "cutive-mono-regular" }],
              },
              this.state.isRecording ? "LIVE" : ""
            ),
            React.createElement(
              View,
              { style: styles.recordingDataRowContainer },
              React.createElement(Image, {
                style: [
                  styles.image,
                  { opacity: this.state.isRecording ? 1.0 : 0.0 },
                ],
                source: Icons.RECORDING.module,
              }),
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
            ),
            React.createElement(View, null)
          ),
          React.createElement(View, null)
        ),
        React.createElement(View, null)
      ),
      React.createElement(
        View,
        {
          style: [
            styles.halfScreenContainer,
            {
              opacity:
                !this.state.isPlaybackAllowed || this.state.isLoading
                  ? DISABLED_OPACITY
                  : 1.0,
            },
          ],
        },
        React.createElement(View, null),
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
        React.createElement(
          View,
          {
            style: [styles.buttonsContainerBase, styles.buttonsContainerTopRow],
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
                disabled: !this.state.isPlaybackAllowed || this.state.isLoading,
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
                disabled: !this.state.isPlaybackAllowed || this.state.isLoading,
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
                disabled: !this.state.isPlaybackAllowed || this.state.isLoading,
              },
              React.createElement(Image, {
                style: styles.image,
                source: Icons.STOP_BUTTON.module,
              })
            )
          ),
          React.createElement(View, null)
        ),
        React.createElement(
          View,
          {
            style: [
              styles.buttonsContainerBase,
              styles.buttonsContainerBottomRow,
            ],
          },
          React.createElement(Text, { style: styles.timestamp }, "Rate:"),
          React.createElement(Slider, {
            style: styles.rateSlider,
            trackImage: Icons.TRACK_1.module,
            thumbImage: Icons.THUMB_1.module,
            value: this.state.rate / RATE_SCALE,
            onSlidingComplete: this._onRateSliderSlidingComplete,
            disabled: !this.state.isPlaybackAllowed || this.state.isLoading,
          }),
          React.createElement(
            TouchableHighlight,
            {
              underlayColor: BACKGROUND_COLOR,
              style: styles.wrapper,
              onPress: this._onPitchCorrectionPressed,
              disabled: !this.state.isPlaybackAllowed || this.state.isLoading,
            },
            React.createElement(
              Text,
              { style: [{ fontFamily: "cutive-mono-regular" }] },
              "PC: ",
              this.state.shouldCorrectPitch ? "yes" : "no"
            )
          )
        ),
        React.createElement(View, null)
      ),
    //   3번째 컨테이너 
      React.createElement(
        View,
        {
          style: [
            styles.halfScreenContainer,
          ],
        },
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
    paddingBottom: 70
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
