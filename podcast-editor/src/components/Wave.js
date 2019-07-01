import React, {Component} from 'react';
import WaveSurfer from "wavesurfer.js";

class Wave extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'grey',
      progressColor: 'red'
    })
    const { track } = this.props

    this.wavesurfer.load(track)

    this.wavesurfer.on('ready', () => console.log('READY'))
  }

  render() {
    return (
      <div>
        <div id='waveform' />
      </div>
    );
  }
}

export default Wave;
