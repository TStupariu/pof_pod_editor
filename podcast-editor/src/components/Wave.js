import React, {Component} from 'react';
import WaveSurfer from "wavesurfer.js";

class Wave extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      currentTime: 0,
      trackDuration: 0,
      pxPerSecRation: 0,
    }
    this.wavesurfer = null
  }

  componentDidMount() {
    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'grey',
      progressColor: 'red',
    })
    const { track } = this.props

    this.wavesurfer.load(track)
    this.wavesurfer.on('ready', this.onReady)
    this.wavesurfer.on('audioprocess', this.onAudioProcess)
    this.wavesurfer.on('seek', this.onSeek)
    this.wavesurfer.on('interaction', this.onInteraction)
  }

  onReady = () => {
    const trackDuration = this.wavesurfer.getDuration()
    const { width } = document.querySelector('canvas')
    this.setState({
      isReady: true,
      trackDuration: parseFloat(Math.round(trackDuration * 100) / 100).toFixed(2),
      pxPerSecRation: width / trackDuration
    })
  }

  onAudioProcess = (currentTime) => {
    this.setState({
      currentTime
    })
  }

  onInteraction = () => {
    // console.log(this.wavesurfer.getCurrentTime())
  }

  onSeek = (percentage) => {
    const { trackDuration } = this.state
    const currentTime = trackDuration * percentage
    this.setState({
      currentTime
    })
  }

  handlePlayPause = () => {
    this.wavesurfer.playPause()
  }

  handleZoomIn = () => {
    const { pxPerSecRation } = this.state
    this.wavesurfer.zoom(pxPerSecRation * 2)
    this.setState({
      pxPerSecRation: pxPerSecRation * 2
    })
  }

  handleZoomOut = () => {
    const { pxPerSecRation } = this.state
    this.wavesurfer.zoom(pxPerSecRation / 2)
    this.setState({
      pxPerSecRation: pxPerSecRation / 2
    })
  }

  renderFormattedProgressTime = () => {
    const { currentTime, trackDuration } = this.state
    const formCurrent = parseFloat(Math.round(currentTime * 100) / 100).toFixed(2)
    return (
      <div>{formCurrent} / {trackDuration}</div>
    )
  }
  renderControls = () => {
    const { isReady } = this.state
    if (!isReady) return null

    return (
      <div className={'controls'}>
        <button className={'control'} onClick={this.handlePlayPause}>Play / Pause</button>
        <button className={'control'} onClick={this.handleZoomIn}>Zoom +</button>
        <button className={'control'} onClick={this.handleZoomOut}>Zoom -</button>
      </div>
    )
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
        <div>{this.renderFormattedProgressTime()}</div>
        <div id='waveform' />
        {
          this.renderControls()
        }
      </div>
    );
  }
}

export default Wave;
