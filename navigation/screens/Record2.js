import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

export default function Record2({ navigation }) {
  // record start / stop
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [message, setMessage] = useState("");
  const [playbackObj, setPlaybackObj] = useState(null);
  const [soundObj, setSoundObj] = useState(null);

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === 'granted'){
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
    
        setRecording(recording);
      }else{
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (error) {
      console.error('Failed to start recording', error)
    }
  }


  async function stopRecording(){
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });

    setRecordings(updatedRecordings);
  }

  function getDurationFormatted(millies) {
    const minutes = millies /1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes -minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay} : ${secondsDisplay}`;
  }

  async function handleAudioPress(audio){
    // playing audio for the first time
    if(soundObj === null){
      const playbackObj = new Audio.Sound();
      const status = await playbackObj.loadAsync({uri: audio.file}, {shouldPlay: true});
      
      return setPlaybackObj(playbackObj), setSoundObj(status);
      
    }
    // pause audio
    if(soundObj.isLoaded && soundObj.isPlaying){
      const status = await playbackObj.setStatusAsync({shouldPlay: false});
      return setPlaybackObj(playbackObj), setSoundObj(status);
      console.log('audio is already playing');
    }

    //resume audio
    // if (soundObj.isLoaded && !soundObj.isPlaying){

    // }
    console.log(soundObj);
  }
  
  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>Recording {index +1} - {recordingLine.duration}</Text>
          {/* <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button> */}
          <Button style={styles.button} onPress={() => handleAudioPress(recordingLine)} title={soundObj === null ? "Play" : "Stop"}></Button>
          <Button style={styles.button} onPress={() => handleAudioPress(recordingLine)} title="Resume"></Button>
        </View>
      )
    })
  }
  
  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      {getRecordingLines()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
    margin: 16
  },
  button: {
    margin: 16
  }
});

