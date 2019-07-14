import React, {Component} from 'react';
import { get } from 'lodash'
import './PodcastEditContainer.css'
import Wave from "./Wave";
import { db } from "../firebase";
import {formatSecondsToTime} from "../utils";

class PodcastEditContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: []
    }
  }

  async componentDidMount() {
    const track = get(this, 'props.location.state.track', null)
    const { key } = track
    const snapshot = await db.ref(`comments/${key}`).once('value')
    const data = snapshot.val()
    const arrayData = Object.keys(data).map(key => ({
      key: key / 1000000,
      comment: data[key]
    }))
    this.setState({
      comments: arrayData
    })
  }

  handleCommentClick = (data) => () => {
    this.waveRef.handleSeekTo(data.key)
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
          <Wave track={audioTrack} ref={ref => this.waveRef = ref}/>
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
