import React, {Component} from 'react';
import WaveSurfer from "wavesurfer.js";
import Hotkeys from 'react-hot-keys';
import {formatSecondsToTime} from "../utils";

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

    this.hotKeyHandlers = {
      q: this.handleZoomOut,
      w: this.handleZoomIn,
      space: this.handlePlayPause,
      left: this.handleSeekLeft,
      right: this.handleSeekRight
    }
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

    document.addEventListener(
      'click',
      () => { if(document.activeElement.toString() == '[object HTMLButtonElement]'){ document.activeElement.blur(); } }
    );
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

  handleSeekLeft = () => {
    const { currentTime, trackDuration } = this.state
    const seekTo = (currentTime - 5 < 0 ? 0 : currentTime - 5) / trackDuration
    this.wavesurfer.seekTo(seekTo)
  }

  handleSeekRight = () => {
    const { currentTime, trackDuration } = this.state
    const seekTo = (currentTime + 5 > trackDuration ? trackDuration : currentTime + 5) / trackDuration
    this.wavesurfer.seekTo(seekTo)
  }

  handleHotkeyPress = (key) => {
    this.hotKeyHandlers[key]()
  }

  handleSeekTo = (currentTime) => {
    const { trackDuration } = this.state
    const seekTo = currentTime / trackDuration
    this.wavesurfer.seekTo(seekTo)
  }

  handleAddPoll = () => {
    this.props.handleAddPoll()
  }

  handleSetEndScreen = () => {
    this.props.handleSetEndScreen()
  }

  renderFormattedProgressTime = () => {
    const { currentTime, trackDuration } = this.state
    return (
      <div>
        <div>Current: {formatSecondsToTime(currentTime)}</div>
        <div>Total: {formatSecondsToTime(trackDuration)}</div>
       </div>
    )
  }

  renderControls = () => {
    const { isReady } = this.state
    if (!isReady) return null

    return (
      <div className={'controls'}>
        <Hotkeys
          keyName="q, w, space, left, right"
          onKeyUp={this.handleHotkeyPress}
        >
          <button className={'control'} onClick={this.handlePlayPause}>Play / Pause (space)</button>
          <button className={'control'} onClick={this.handleZoomIn}>Zoom + (w)</button>
          <button className={'control'} onClick={this.handleZoomOut}>Zoom - (q)</button>
          <button className={'control'} onClick={this.handleSeekLeft}>-5 seconds (left)</button>
          <button className={'control'} onClick={this.handleSeekRight}>+5 seconds (right)</button>
          <button className={'control'} onClick={this.handleAddPoll}>Add Poll</button>
          <button className={'control'} onClick={this.handleSetEndScreen}>End Screen</button>
        </Hotkeys>
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
