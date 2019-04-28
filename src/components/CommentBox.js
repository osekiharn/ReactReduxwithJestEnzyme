import React from 'react'
import { connect } from 'react-redux';
import * as actions from 'actions'

class CommentBox extends React.Component {
  state = { comment: '' }
  handleChange(e) {
    this.setState({ comment: e.target.value })
  }
  handleSubmit = (event) => {
    event.preventDefault();
    // TODO: call an action creator
    // And save the comment
    this.props.saveComment(this.state.comment)
    this.setState({ comment: '' })
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <h4>Add a comment</h4>
          <textarea
            value={this.state.comment}
            onChange={this.handleChange.bind(this)}
          />
          <div>
            <button>Submit Comment</button>
          </div>
        </form>
        <button className="fetch-comments" onClick={this.props.fetchComment}>Fetch Comment</button>
      </div>
    )
  }
}

export default connect(null, actions)(CommentBox)
