import React, {Component} from 'react';
import { get } from 'lodash'
import './PodcastEditContainer.css'
import Wave from "./Wave";

class PodcastEditContainer extends Component {
  constructor(props) {
    super(props);
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
          <Wave track={audioTrack} />
        </div>
      </div>
    );
  }
}

PodcastEditContainer.propTypes = {};

export default PodcastEditContainer;
