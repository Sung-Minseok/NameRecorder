import React, { Component, createContext } from "react";
import { Alert, Text, View } from "react-native";
import * as MediaLibrary from "expo-media-library";

const AudioContext = createContext();
export class AudioProvider extends Component {
  constructor(props) {
    super(props);
  }

  permissionAlert = () => {
    Alert.alert("Permission Required", "This app needs to read audio files!", [
      {
        text: "확인",
        onPress: () => this.getPermission(),
      },
      {
        text: "취소",
        onPress: () => this.permissionAlert(),
      },
    ]);
  };

  getAudioFiles = async () => {
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
    });
    console.log(media);
  };
  getPermission = async () => {
    // {
    //     "canAskAgain": true,
    //     "expires": "never",
    //     "granted": false,
    //     "status": "undetermined",
    //   }
    const permission = await MediaLibrary.getPermissionsAsync();
    if (permission.granted) {
      // we want to get all the aduio files
      this.getAudioFiles();
    }

    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();

      if (status === "denied" && canAskAgain) {
        //we re going to display alert that user must allow this permission
        this.permissionAlert();
      }

      if (status === "granted") {
        // we want to get all the audio files
        this.getAudioFiles();
      }

      if (status === "denied" && !canAskAgain) {
        //we want to display some error to the user
      }
    }
  };
  componentDidMount() {
    this.getPermission();
  }

  render() {
    return (
      <AudioContext.Provider value={{}}>
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}
