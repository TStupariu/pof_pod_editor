import React, {Component} from 'react';
import WaveSurfer from "wavesurfer.js";

class Wave extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
    }
    this.wavesurfer = null
  }

  componentDidMount() {
    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'grey',
      progressColor: 'red'
    })
    const { track } = this.props

    this.wavesurfer.load(track)
    this.wavesurfer.on('ready', this.onReady)
  }

  onReady = () => {
    this.setState({
      isReady: true
    })
    this.wavesurfer.play()
  }

  handlePlayPause = () => {
    this.wavesurfer.playPause()
  }

  render() {
    const { isReady } = this.state

    return (
      <div>
        {
          isReady
            ? null
            : <div>Loading ...</div>
        }
        <div id='waveform' />
        <div className={'controls'}>
          <button className={'control'} onClick={this.handlePlayPause}>Play / Pause</button>
        </div>
      </div>
    );
  }
}

export default Wave;
