import React, {Component} from 'react';
import { get } from 'lodash'
import './PodcastEditContainer.css'
import Wave from "./Wave";
import { db } from "../firebase";
import {convertTimeToFirebaseKey, formatSecondsToTime, sanitize} from "../utils";

class PodcastEditContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      isAddingPoll: false,
      isSettingEndScreen: false,
      poll: {},
      endScreen: {}
    }
  }

  async componentDidMount() {
    const track = get(this, 'props.location.state.track', null)
    const { key } = track
    const snapshot = await db.ref(`comments/${key}`).once('value')
    if (snapshot.exists()) {
      const data = snapshot.val()
      const arrayData = Object.keys(data).map(key => ({
        key: key / 1000000,
        comment: data[key]
      }))
      this.setState({
        comments: arrayData
      })
    }
  }

  handleCommentClick = (data) => () => {
    this.waveRef.handleSeekTo(data.key)
  }

  handleAddPoll = () => {
    this.setState({
      isAddingPoll: true
    })
  }

  handleSetEndScreen = () => {
    this.setState({
      isSettingEndScreen: true,
    })
  }

  handlePollChange(name, value) {
    this.setState((oldState) => ({
      poll: {
        ...oldState.poll,
        [name]: value
      }
    }))
  }

  submitPoll = async () => {
    const { poll } = this.state
    const { currentTime } = this.waveRef.state
    const track = get(this, 'props.location.state.track', null)
    const { key } = track
    if (poll.name && poll.option1 && poll.option2) {
      await db.ref(`interactions/${sanitize(key)}`).update({
        [convertTimeToFirebaseKey(currentTime)]: poll
      })
      this.setState({
        poll: {},
        isAddingPoll: false
      })
    }
  }

  handleEndScreenSelect = (trackNo, trackId) => {
    console.log(trackNo, trackId)
    this.setState((oldState) => ({
      endScreen: {
        ...oldState.endScreen,
        [trackNo]: trackId
      }
    }))
  }

  handleSubmitEndScreen = async () => {
    const { endScreen } = this.state
    const track = get(this, 'props.location.state.track', null)
    const { key } = track
    await db.ref(`endScreens/${sanitize(key)}`).set(endScreen)
    this.setState({
      isSettingEndScreen: false,
      endScreen: {}
    })
  }

  renderSetEndScreen = () => {
    console.log(this.state)
    const tracks = get(this, 'props.location.state.podcastTracks', {})
    return (
      <div>
        <hr/>
        <div>
          <span>First Suggestion:</span>
          <select name="" id="" onChange={ev => this.handleEndScreenSelect('track1', ev.target.value)}>
            {
              Object.keys(tracks).map(key => {
                const item = tracks[key]
                return (
                  <option key={key} value={key}>{item.title}</option>
                )
              })
            }
          </select>
        </div>
        <div>
          <span>Second Suggestion:</span>
          <select name="" id="" onChange={ev => this.handleEndScreenSelect('track2', ev.target.value)}>
            {
              Object.keys(tracks).map(key => {
                const item = tracks[key]
                return (
                  <option key={key} value={key}>{item.title}</option>
                )
              })
            }
          </select>
          <button onClick={this.handleSubmitEndScreen}>Submit</button>
        </div>
        <hr/>
      </div>
    )
  }

  renderAddPoll = () => {
    const { currentTime } = this.waveRef.state
    return (
      <div>
        <hr/>
        <div className='option'>
          <span>Poll Question: </span>
          <input placeholder='Poll question' onChange={(ev) => this.handlePollChange('name', ev.target.value)}/>
        </div>
        <div className='option'>
          <span>Option 1: </span>
          <input type="text" placeholder='Option...' onChange={(ev) => this.handlePollChange('option1', ev.target.value)}/>
        </div>
        <div className='option'>
          <span>Option 2: </span>
          <input type="text" placeholder='Option...' onChange={(ev) => this.handlePollChange('option2', ev.target.value)}/>
        </div>
        <div className='option'>
          <button onClick={this.submitPoll}>Submit poll at {formatSecondsToTime(currentTime)}</button>
        </div>
        <hr/>
      </div>
    )
  }

  render() {
    const track = get(this, 'props.location.state.track', null)
    if (!track) return null

    const { title, description, image, audioTrack } = track
    return (
      <div className={'container'}>
        <div className={'details-container'}>
          <div>
            <img src={image} className={'image'}/>
          </div>
          <div>
            <div className={'title'}>{title}</div>
            <div className={'description'}>{description}</div>
          </div>
        </div>
        <div>
          <Wave track={audioTrack} ref={ref => this.waveRef = ref} handleAddPoll={this.handleAddPoll} handleSetEndScreen={this.handleSetEndScreen}/>
        </div>
        <div>
          {
            this.state.isAddingPoll
              ? this.renderAddPoll()
              : null
          }
        </div>
        <div>
          {
            this.state.isSettingEndScreen
              ? this.renderSetEndScreen()
              : null
          }
        </div>
        <div>Comments:</div>
        <div>
          {
            this.state.comments.map(data => (
              <div key={data.key} onClick={this.handleCommentClick(data)}>
                {formatSecondsToTime(data.key)} - {data.comment}
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

PodcastEditContainer.propTypes = {};

export default PodcastEditContainer;
