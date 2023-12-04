import { Text, View , Button} from 'react-native'
import React, { Component } from 'react'
import Mp3Recorder from "mic-recorder-to-mp3"



export class AudioRecorded extends Component {
    state = {
        isRecording: false,
        blobURL: '',
        isBlocked: false,
        recordedFileBase64: '',
        credential: {},
        click: false,
        isAddPet: false,
      };



      startRecording = async () => {
        try {
          await Mp3Recorder.start();
          this.setState({ isRecording: true });
        } catch (error) {
          console.error('Failed to start recording:', error);
        }
      };
      
      stopRecording = async () => {
        try {
          const [buffer, blob] = await Mp3Recorder.stop().getMp3();
          const blobURL = URL.createObjectURL(blob);
          this.setState({ blobURL, isRecording: false });
      
          const audioFile = new File(buffer, `audio.mp3`, {
            type: blob.type,
            lastModified: Date.now(),
          });
      
          const base64Audio = await this.audioToBase64(audioFile);
          console.log(base64Audio);
          this.setState({ recordedFileBase64: base64Audio });
        } catch (error) {
          console.error('Failed to stop recording:', error);
        }
      };
      
      audioToBase64 = (audioFile) => {
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onerror = reject;
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(audioFile);
        });
      };


  render() {
    return (
        <View >
        
        <Button title="Start Recording" onPress={this.startRecording} disabled={this.state.isRecording} />
        <Button title="Stop Recording" onPress={this.stopRecording} disabled={!this.state.isRecording} />
  
      </View>
    )
  }
}

export default AudioRecorded