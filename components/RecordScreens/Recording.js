import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Modal,
  TouchableOpacity,
  Animated,
  Alert,
  Share,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Font from "expo-font";
import * as Icons from "../Icons";
import RecordModal from "./RecordModal";
import BlinkingText from "../BlinkingText";
import * as actions from "../../redux/record";
import { connect } from "react-redux";
import { auth, db } from "../../Firebase";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const BACKGROUND_COLOR = "#F4ECE6";
const LIVE_COLOR = "#FF0000";
const DISABLED_OPACITY = 0.5;
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const DirName = "expoTest4/";

class Recording extends React.Component {
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
      console.log(this.state.isPlaying);
      if (this.sound != null) {
        if (this.state.isPlaying) {
          this.sound.pauseAsync();
        } else {
          if (this._getSeekSliderPosition() == 1) {
            this.sound.stopAsync();
          }
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
        console.log(value);
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
      animateValue: new Animated.Value(0),
      animateLoop: false,
      recordList: null,
      recordCount: 0,
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
        "cutive-mono-regular": require("../../assets/fonts/CutiveMono-Regular.ttf"),
        SquareRound: require("../../assets/fonts/NanumSquareRound.otf"),
      });
      this.setState({ fontLoaded: true });
    })();
    this._askForPermissions();
    const animation = Animated.timing(this.state.animateValue, {
      toValue: 1,
      duration: 1000,
      delay: 1000,
      useNativeDriver: false,
    });
    Animated.loop(animation, {
      iterations: this.state.animateLoop,
    }).start();
    this._getRecordCount();
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
        isLooping: false,
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

  async _getRecordCount() {
    const docRef = db.doc(
      db.getFirestore(),
      "users",
      auth.getAuth().currentUser.uid
    );
    const docSnap = await db.getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    const recordNum = docSnap.data().recordNum;
    this.setState({
      recordCount: recordNum,
    });
  }

  _saveButtonPressed() {
    const date = new Date();
    this.setState({
      fileName:
        date.getFullYear() +
        "년" +
        (date.getMonth() + 1) +
        "월" +
        date.getDate() +
        "일 " +
        date.getHours() +
        "시" +
        date.getMinutes() +
        "분",
    });

    this.setState({ modalVisible: true });
    console.log(this.state.fileName);
    if (this.recording === !null) {
      console.log(this.recording.getURI());
    }
  }

  async _saveRecording() {
    let newURI =
      FileSystem.documentDirectory +
      DirName +
      encodeURI(this.state.fileName) +
      ".caf";
    console.log("new : " + newURI);
    const pattern = /\([0-9]+\)/;
    const pattern2 = /[0-9]+/;
    let file_name = this.state.fileName;
    let fileNum = 0;

    if (this.state.fileName.trim() === "") {
      return alert("파일 이름을 입력해주세요!");
    }

    while (
      await FileSystem.getInfoAsync(newURI).then((e) => {
        return e.exists;
      })
    ) {
      if (file_name.match(pattern) === null) {
        file_name = file_name + "(1)";
      } else {
        fileNum = parseInt(file_name.match(pattern).toString().match(pattern2));
        fileNum++;
        file_name = file_name.replace(/\([0-9]+\)/, "(" + fileNum + ")");
      }
      newURI =
        FileSystem.documentDirectory + DirName + encodeURI(file_name) + ".caf";
      if (
        !(await FileSystem.getInfoAsync(newURI).then((e) => {
          return e.exists;
        }))
      ) {
        break;
      }
    }

    await FileSystem.copyAsync({
      from: this.recording.getURI(),
      to: newURI,
    });
    this.setState({ modalVisible: false });
    this.props.jumpTo("first");
  }

  async _createLink() {
    if(auth.getAuth().currentUser.isAnonymous){
      return Alert.alert("비회원 사용자","홈화면에서 [회원가입]을 진행해주세요.")
    }
    const UID = auth.getAuth().currentUser.uid;
    console.log("user : " + UID);
    try {
      const payload = {
        dynamicLinkInfo: {
          domainUriPrefix: "https://jmwschool.page.link",
          // link: `https://jmwschool.page.link/newUser/njUdT0j9VuR7cSLCAekUEzAQS6z2`,
          link: `https://jmwschool.page.link/newUser/${UID}`,
          androidInfo: {
            androidPackageName: "host.exp.jmwschool",
          },
          iosInfo: {
            iosBundleId: "host.exp.jmwschool",
          },
          // socialMetaTagInfo: {
          //   socailTitle: 'Test the title',
          //   socialDescription: 'Testing the description.'
          // }
        },
      };
      const url = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyAj2uJrWehb1MqSPb00eFFXk4BR_g4zDJU`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      // console.log(response.json().then((e)=>console.log(e)))
      const json = await response.json();
      const result = await Share.share({
        message: json.shortLink,
        url: json.shortLink,
        title: `Checkout my apps: asdf`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("action if");
        } else {
          console.log("action else");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("dismissed");
      }
    } catch (error) {
      console.log("Linking Errors: " + error);
    }
  };

  //redux function
  _setRecordList = (list) => {
    this.setState(() => {
      return {
        recordList: list,
      };
    });
  };

  render() {
    const { storeRecordUsedCnt, storeRecordNum } = this.props;
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
        {
          style: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: DEVICE_WIDTH,
            borderBottomWidth: 2,
            // borderTopWidth: 0,
            borderColor: "grey",
            paddingBottom: 10,
            paddingHorizontal: 15,
          },
        },
        React.createElement(
          Text,
          {
            style: {
              fontSize: 20,

              fontWeight: "bold",
            },
          },
          "사용가능 녹음 파일 : " +
            (storeRecordNum - storeRecordUsedCnt > 0
              ? storeRecordNum - storeRecordUsedCnt
              : 0)
        ),
        React.createElement(
          TouchableOpacity,
          {
            underlayColor: "BACKGROUND_COLOR",
            onPress: () => this._createLink(),
          },
          React.createElement(
            View,
            {
              style: {
                backgroundColor: "white",
                height: DEVICE_HEIGHT * 0.05,
                width: DEVICE_WIDTH * 0.25,
                borderWidth: 2,
                borderColor: GROUNDCOLOR,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              },
            },
            <Text
              style={{
                fontSize: 20,
                color: "black",
                fontFamily: "SquareRound",
                fontWeight: "300",
              }}
            >
              공유하기
            </Text>
          )
        )
      ),

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
            TouchableOpacity,
            {
              underlayColor: "BACKGROUND_COLOR",
              style: styles.wrapper,
              onPress: this._onRecordPressed,
              disabled: this.state.isLoading,
            },
            React.createElement(
              View,
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
                  React.createElement(Image, {
                    style: { backgroundColor: "transparent", marginTop: 30 },
                    source: Icons.RECORD_BUTTON2.module,
                  }),
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      fontFamily: "SquareRound",
                      margin: 10,
                    }}
                  >
                    {!this.state.isRecording ? "녹음 시작" : "녹음 완료"}
                  </Text>
                )
              )
            )
          ),

          React.createElement(
            View,
            {
              style: [
                styles.recordingDataContainer,
                { opacity: this.state.isRecording ? 1.0 : 0.0 },
              ],
            },
            React.createElement(Image, {
              style: { marginHorizontal: 5 },
              source: Icons.RECORDING.module,
            }),
            <BlinkingText text="녹음중 ..." />
          )
        ),

        // 컨테이너2
        React.createElement(
          View,
          {
            style: {
              flexDirection: "column",
              height: DEVICE_HEIGHT * 0.3,
              flex: 2,
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
              value: this._getSeekSliderPosition(),
              onValueChange: this._onSeekSliderValueChange,
              onSlidingComplete: this._onSeekSliderSlidingComplete,
              disabled: !this.state.isPlaybackAllowed || this.state.isLoading,
            }),
            !this.state.isPlaybackAllowed || this.state.isLoading
              ? React.createElement(
                  Text,
                  {
                    style: [
                      styles.playbackTimestamp,
                      { fontFamily: "SquareRound", fontSize: 15 },
                    ],
                  },
                  this._getRecordingTimestamp()
                )
              : React.createElement(
                  Text,
                  {
                    style: [
                      styles.playbackTimestamp,
                      { fontFamily: "SquareRound", fontSize: 15 },
                    ],
                  },
                  this._getPlaybackTimestamp()
                )
          ),

          // 재생, 정지 버튼
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
                styles.buttonsContainerBase,
              ],
            },

            React.createElement(
              View,
              { style: styles.playStopContainer },
              React.createElement(
                TouchableOpacity,
                {
                  underlayColor: BACKGROUND_COLOR,
                  style: { justifyContent: "center", alignItems: "center" },
                  underlayColor: "white",
                  onPress: this._onPlayPausePressed,
                  disabled:
                    !this.state.isPlaybackAllowed || this.state.isLoading,
                },
                // React.createElement(Image, {
                //   style: styles.image,
                //   source: this.state.isPlaying
                //     ? Icons.PAUSE_BUTTON.module
                //     : Icons.PLAY_BUTTON.module,
                // })
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
                  <Text
                    style={{
                      fontSize: 20,
                      color: "white",
                      fontFamily: "SquareRound",
                    }}
                  >
                    {"재생 하기"}
                  </Text>
                )
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
                // trackImage: Icons.TRACK_1.module,
                thumbImage: Icons.THUMB_2.module,
                minimumTrackTintColor: GROUNDCOLOR,
                maximumTrackTintColor: "grey",
                value: 1,
                onValueChange: this._onVolumeSliderValueChange,
                disabled: !this.state.isPlaybackAllowed || this.state.isLoading,
              })
            ),
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
                  underlayColor: "white",
                  style: styles.wrapper,
                  onPress: () => {
                    if (storeRecordNum - storeRecordUsedCnt <= 0) {
                      return Alert.alert(
                        "녹음파일 부족",
                        "녹음 가능한 파일 개수가 없습니다.\n 우측 상단의 [공유하기]버튼을 통해 녹음파일을 늘려주세요."
                      );
                    }
                    this._saveButtonPressed();
                  },
                  disabled:
                    !this.state.isPlaybackAllowed && !this.state.isLoading,
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
                    "저   장"
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
            top: DEVICE_HEIGHT * 0.09,
            left: 20,
          },
          onPress: () => Alert.alert("알림", "업데이트 예정."),
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

//redux setting
const mapStateToProps = (state) => ({
  storeRecordList: state.record.recordListState,
  storeRecordUsedCnt: state.record.recordUsedCntState,
  storeRecordNum: state.record.recordNumState,
});
const mapDispatchToProps = (dispatch) => ({
  setStoreRecordList: (list) => dispatch(actions.setRecordList(list)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Recording);
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
    // height: DEVICE_HEIGHT,
    // marginBottom: 70,
  },
  recordButtonContainer: {
    borderRadius: 300,
    width: DEVICE_WIDTH * 0.6,
    height: DEVICE_WIDTH * 0.6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    // backgroundColor: "#ff6781",
    backgroundColor: "#B71313",
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
