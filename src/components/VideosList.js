import React, { Component } from "react"
import { fetchVideos, SearchBar } from "./index"
import Accordion from "react-bootstrap/Accordion"
import Button from "react-bootstrap/Button"
import VideoRow from "./VideoRow"

export default class VideosList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //add a secret.js file and exempt it in the gitignore
      apiKey: "dfWxR1Zi",
      apiSecret: "GQu8ge5BUEWZIM5g9jVnyowx",
      videos: [],
      limit: 10,
      offset: 0,
      view: "list",
      loading: true
    }
  }

  searchResults = videos => {
    this.setState({ videos, view: "search" })
  }

  updateVideos = videos => {
    this.setState({ videos: this.state.videos.concat(videos), loading: false })
  }

  componentDidMount() {
    fetchVideos(this.state.limit, 0, this.updateVideos)
  }

  handleClick = e => {
    this.setState({ offset: this.state.offset + 10 }, () => {
      fetchVideos(this.state.limit, this.state.offset, this.updateVideos)
    })
  }

  render() {
    let { videos, view, loading } = this.state
    return (
      <div>
        <SearchBar searchResults={this.searchResults} />
        {!loading && (
          <Accordion>
            {videos.map((video, index) => (
              <VideoRow
                key={index}
                eventKey={index}
                title={video.title}
                mediaID={video.key}
              />
            ))}
          </Accordion>
        )}
        {loading && <h4 className="fetching-msg">Fetching your videos...</h4>}
        {view === "list" && !loading && (
          <Button block variant="secondary" onClick={this.handleClick}>
            More Videos
          </Button>
        )}
      </div>
    )
  }
}
