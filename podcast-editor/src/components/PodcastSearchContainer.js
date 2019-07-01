import React, {Component} from 'react';

class PodcastSearchContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: 'zero to',
      podcasts: [],
      tracks: {}
    };
  }

  componentDidMount() {
    this.handlePodcastSearch()
  }

  onChangeText = (ev) => {
    this.setState({
      searchTerm: ev.target.value,
    })
  }

  handlePodcastSearch = async () => {
    const { searchTerm } = this.state
    if (searchTerm) {
      const result = await fetch(`https://itunes.apple.com/search?entity=podcast&term=${encodeURI(searchTerm)}`)
      const resultJSON = await result.json()
      const podcasts = resultJSON.results
      this.setState({
        podcasts
      })
    }
  }


  handlePodcastClick = (pod) => async () => {
    const { feedUrl } = pod
    const result = await fetch(feedUrl)
    const resultXML = await result.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(resultXML, "text/xml")
    let tracks = {}
    doc.querySelectorAll('item')
      .forEach(item => {
        const key = item.querySelector('guid').textContent
        const title = item.querySelector('title').textContent
        const description = item.querySelector('description').textContent
        const audioTrack = item.querySelector('enclosure').getAttribute('url')
        const imageNode = item.getElementsByTagName('itunes:image')[0]
        const image = imageNode
          ? imageNode.getAttribute('href')
          : pod.artworkUrl100
        tracks[key] = {
          title,
          description,
          audioTrack,
          image
        }
      })
    this.setState({
      tracks
    })
  }

  handleTrackClick = (track) => () => {
    const { audioTrack } = track
    this.setState({
      audioTrack: null
    }, () => this.setState({
      audioTrack
    }))
    this.props.history.push({
      pathname: '/edit',
      state: { track }
    })
  }

  renderPodcast(pod) {
    return (
      <div key={pod.trackId} className={'pod-item'} onClick={this.handlePodcastClick(pod)}>
        <img src={pod.artworkUrl100} className={'pod-item-img'}/>
        <div className={'pod-item-title'}>{pod.trackName}</div>
      </div>
    )
  }

  renderTrack(key) {
    const { tracks } = this.state
    const track = tracks[key]
    return (
      <div key={key} className={'track-container'} onClick={this.handleTrackClick(track)}>
        <img src={track.image} className={'track-image'}/>
        <div>
          <div className={'track-title'}>{track.title}</div>
          <div className={'track-description'}>{track.description}</div>
        </div>
      </div>
    )
  }
  render() {
    return (
      <div>
        <input type="text" value={this.state.searchTerm} onChange={this.onChangeText}/>
        <button onClick={this.handlePodcastSearch}>Search Podcasts</button>
        {
          this.state.audioTrack
            ? <audio controls autoPlay>
                <source src={this.state.audioTrack} type="audio/mpeg" />
              </audio>
            : null
        }

        <div className={'split-container'}>
          <div className={'pod-container'}>
            {
              this.state.podcasts.map(pod => this.renderPodcast(pod))
            }
          </div>
          <div className={'pod-tracks-container'}>
            {
              Object.keys(this.state.tracks).map(key => this.renderTrack(key))
            }
          </div>
        </div>
      </div>
    );
  }
}

PodcastSearchContainer.propTypes = {};

export default PodcastSearchContainer;
