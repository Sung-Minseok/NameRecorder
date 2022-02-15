import React, { Component } from 'react';
import { Text, View } from 'react-native';
import * as Font from "expo-font";

class BlinkingText extends Component {
  constructor(props) {
    super(props);
    this.state = {showText: true};
 
    // Change the state every second 
    setInterval(() => {
      this.setState(previousState => {
        return { showText: !previousState.showText };
      });
    }, 
    // Define any blinking time.
    700);
  }

  componentDidMount() {
    (async () => {
      await Font.loadAsync({
        "cutive-mono-regular": require("../assets/fonts/CutiveMono-Regular.ttf"),
        SquareRound: require("../assets/fonts/NanumSquareRound.otf"),
      });
    })();
  }

 
  render() {
    let display = this.state.showText ? this.props.text : '               ';
    return (
      <Text style = {{ fontSize : 20, fontFamily: 'SquareRound' }}>{display}</Text>
    );
  }
}

export default BlinkingText;