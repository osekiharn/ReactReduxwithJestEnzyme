# Advanced React and Redux: 2018 Edition

## Section 3 Higher Order Component

### Introduction 

HOC is a normal react component that is specifically made to help up resuse code inside of our application.

So if you have ever put together some component in an app and then found yourself kind of copy pasting code around from that component to another and you have some amount of code duplication between components.
that is a perfect use case for HOC.

There are tools to allow us to duplicate code or to reuse code of a application.

`Component + HOC =  Enhanced or Composed Component (Additional functionality or data + component)`

### App Overview

requireAuthHOC + commentBox

### Staps for Building a HOC

The goal of this highre order component that we're going to make is to restrict access to the post route.
If the user is not signed in and the user tries to go to this route we're going to redirect them back over to the home route automatically.

#### Steps

- Write the logic you want to reuse into a component
- Create a HOC file and add the HOC scaffold.
- Move the reuseable logic into the HOC
- Pass props/config/behavior through to child component

`CommentBox.js`

```js
function mapStateToProps(state) {
  return {
    auth: state.auth
  }
}
```

### Forced Navigation with React Router

sign in していなかったら、'/' へリダイレクトさせる

```js
  // Our component just got rendered
  componentDidMount() {
    this.shouldNavigateAway()
  }

  // Our component just got update
  componentDidUpdate() {
    this.shouldNavigateAway()
  }

  shouldNavigateAway() {
    if (!this.props.auth) {
      this.props.history.push('/')
    }
  }
```


### Creating The HOC

HOC の基本的な構造 `{...this.props}` でpropsを子コンポーネントへそのまま渡す

```js
import React, { Component } from 'react'

export default (ChildComponent) => {
  class ComposedComponent extends Component {
    render() {
      return <ChildComponent {...this.props} />
    }
  }
  return ComposedComponent;
}
```

```js
import React, { Component } from 'react'
import { connect } from 'react-redux';

export default (ChildComponent) => {
  class ComposedComponent extends Component {
  // Our component just got rendered
  componentDidMount() {
    this.shouldNavigateAway()
  }

  // Our component just got update
  componentDidUpdate() {
    this.shouldNavigateAway()
  }

  shouldNavigateAway() {
    if (!this.props.auth) {
      this.props.history.push('/')
    }
  }
    render() {
      return <ChildComponent {...this.props} />
    }
  }
  
  function mapStateToProps(state) {
    return {
      auth: state.auth
    }
  }

  return connect(mapStateToProps)(ComposedComponent);
}
```

```js
export default connect(null, actions)(requireAuth(CommentBox))
```