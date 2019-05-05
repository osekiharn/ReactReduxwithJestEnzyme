# Advanced React and Redux: 2018 Edition

## Section 2 Testing

`create-react-app testing`

first test

```js
function App() {
  return (
    <div className="App">
      Hi There!
    </div>
  );
}
```

```js
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  expect(div.innerHTML).toContain('Hi There!') // 追加
  ReactDOM.unmountComponentAtNode(div);
});
```

#### create react app で インストールされる stuff 

- React
- Webpack: Links together JS files
- Babel Turns ES2015/6/7 and JSX into ES5 code
- Jest Automated test runner

test　を学ぶ為に簡単な comment 保存アプリを作る

`yarn add redux react-redux`

- Look at each individual part of your application
- Imagine telling a friend 'heres what this piece of code does'
- Write a test to verify each part does what you expect.

### テストを書いていこう

So the important thing here to understand is that when we run jest it's been executed inside of our command line environment. It's been ran from the terminal.

The issue with that is that when we tried to run react in any way shape or form react always expects that it's being executed inside the browser.

command line environment
  > jest
    > JSDOM <- simulates how a browser behaves

So you can imagine that kind of fakes out the existence of the browser and fools or tricks to react library into thinking that there is in fact a browser that react is working with.



### 18. Limitting Test Knowledge

```js
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  expect(div.innerHTML).toContain('Hi There!') // 追加
  ReactDOM.unmountComponentAtNode(div);
```
このテストは理想的ではない

```js
  expect(div).toHaveAnInstanceOf(CommentBox);
```

this　would be much more ideal.

### 19. enzyme setup

`yarn add enzyme enzyme enzyme-adapter-react-16`

```js
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })
```

### 20. Enzyme Renderers

top level enzyme really gives us three additional capabilities for writing our tests

- Static: render the given component and return plain HTML
**The key thing here is that we don't have any ablity to like interact with that HTML has generated. we can't simulate clicking on something or entering any text. It's really just static HTML that allows us to make an assertion about HTML that was generated.**

- Shallow: render *just* the given component and none of its children.
**So the shallow render is used when we want to test one component by itself in isolation and not try to make any assertions about the components underneath it.**

- Full DOM: Render the component and all of its children + let us modify it afterwards.
**It then returns an object back to us that we can use to kind of interact with that component. So it can simulate click events or entering text of otherwise interacting with that component. We can use this fullDOM rendering functionality to essentially render out a full copy of our entire application and then somehow test interactions with the entire app.**

Docs: airbnb.io/enzyme

### 21. Expectations for Component Instaces

shallow を使ってテストをかく

```js
import { shallow } from 'enzyme'

expect(wrapped.find(CommentBox))
```

we're going to find every copy of commentBox inside of it.
**And when we call find it returns back to us in array. that array contains every instance of comment box that was found.**
**Don't actually care about the real instance of comment box that was found. All we care about is saying there is exactly one copy of comment box that was created.**

```js
  expect(wrapped.find(CommentBox).length).toEqual(1);
```

## 24. Absolute Path Imports

これはテストに関係ないが
This is just a step that's going to make our lives a little bit easier.

`.env` ファイルを作る

```
NODE_PATH=src/
```

the benefit to this is that I can now move this test file around if I need to where I can move around those other component files around if I want to.

### 25 beforeEach

```js
let wrapped;
beforeEach(() => {
  wrapped = shallow(<App />)
})
```

### 28. CommentBox Test File

CommentBox のテストを書いていく
`__test__/CommentBox.test.js`

FullDOM rendering: we are sharing the same fake DOM that's been implemented by that JS DOM library and that means that these different components that we are creating can potentially interact with each other and cause issues across our differnet tests.

**NOTE: So after every single test that we're going to make sure that we do a little bit of cleanup. We're going to make sure that we take the component that we created and got mounted into that virtual DOM and we're going to attempt to unmount it.**


```js
import React from 'react'
import { mount } from 'enzyme'
import CommentBox from 'components/CommentBox'

let wrapped;

beforeEach(() => {
   wrapped = mount(<CommentBox />)
});

afterEach(() => {
  wrapped.unmount()
});

it('has a text area and a button', () => {
  expect(wrapped.find('textarea').length).toEqual(1);
  expect(wrapped.find('button').length).toEqual(1);
});

```

### 31. Simulating Change Events

1. Find the textarea element
2. Simulate a 'change' event
3. Provide a fake event object
4. Force the component to update
5. Assert that the textarea valu has changed

### 32. Providing Fake Events

simulate(event)

1. event (String): The event name to be simulated
2. mock (Object [optional]): A mock event object that will be merged with the event object passed to the handlers.

```js
  wrapped.find('textarea').simulate('change')
```

When we trigger or simulate an event we want to use the real HTML name of that event not to react name.
**Instead we are simulating just the name of the event by itself which is simply change not onchange.**


Now the second argument to this is going to be just alittle bit more confusing.
**we need to essentially modify the value of event target value so to do so we're going to making use of the second argument to that simulate funcion.**

So a mock evnet object is what we're going to pass in here and it's going to be merged with the real event object that gets passed to our event handler.

```js
  wrapped.find('textarea').simulate('change', { 
    target: { value: 'new comment' }
  })
```

### 33. Forcing Component Updates

Why ne need to actually force the component to update.

Now the key step in there is that we want our component to render automatically when we call setState.
But It triggers our component to be rendered asynchronously.

`.update()` Forces a re-render.

```js
wrapped.update()
```

### 34. Retrieving Prop Values

```js
expect(wrapped.find('textarea').prop('value'))
```

### 35. Form Submit Exsercise & Exercise Solution

```js
it('when form is submitted, text area gets emptied', () => {
  wrapped.find('textarea').simulate('change', {
    targe: { value: 'new comment' }
  });
  wrapped.update();
  wrapped.find('form').simulate('submit');
  wrapped.update();
  expect(wrapped.find('textarea').prop('value')).toEqual('')
});
```

### 37. Describe Statememts

describe function is used to group together certain sets of tests that have some common set up or tear down for each of them.

The benefit to a describe block is not just in kind of doing some organization save a single test file but it can be alse used to limit the scope of before each statements.

```js
describe('the text area', () => {

  beforeEach(() => {
    wrapped.find('textarea').simulate('change', { 
      target: { value: 'new comment'}
    })
    wrapped.update()
  });

  it('has a text area that users can type in', () => {
    expect(wrapped.find('textarea').prop('value')).toEqual('new comment')
  });

  it('when form is submitted, text area gets emptied', () => {
    wrapped.find('form').simulate('submit');
    wrapped.update();
    expect(wrapped.find('textarea').prop('value')).toEqual('')
  });
});
```

### 38. Redux Setup

`src/reducers/comments.js`

```js
export default function(state, action) {
  switch (action.type) {
    default:
      return state;
  }
}
```

`src/reducers/index.js`

```js
import { combineReducers } from 'redux'
import commentsReducer from 'reducers/comments'

export default combineReducers({
  comments: commentsReducer
})
```

Remember combineReducers takes multiple reducers and combines them all together into a single object.

### The Provider Tag

```js
import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducers from 'reducers'
import App from './components/App'

const store = createStore(reducers, {})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
)
```

### 40. The SaveComment Action Creator

`src/actions/index.js`

```js
import { SAVE_COMMENT } from 'actions/types';

export function saveComment(comment) {
  return {
    type: SAVE_COMMENT,
    payload: comment
  }
}
```

`src/actions/types.js`

```js
export const SAVE_COMMENT = 'SAVE_COMMENT';
```

`src/reducers/comments.js`

```js
import { SAVE_COMMENT } from 'actions/types';

export default function(state, action) {
  switch (action.type) {
    case SAVE_COMMENT:
      return [...state, action.payload];
    default:
      return state;
  }
}
```

### 41. Bonding React with Redux

```js
import { connect } from 'react-redux';
import * as actions from 'actions'

export default connect(null, actions)(CommentBox)
```

```sh
Invariant Violation: Could not find "store" in the context of "
Connect(CommentBox)".
```

### 42. Redux Test Errors

So let me be clear about what's happening here.

We've got that provider tag which has a instance of a redux store that provider tag. **When we wrap a component with a connect function that connect function expects to see some parent component within this hierarchy that has the provider tag.**

It's going to look up the hierarchy and try to find that provider.

the browser still works just fine. **It specifically in our test environment that this flow starts to break down.**

the commentBox component by itself and then we try to render that component by itselft in isolation.
we're just kind of throwing it off into the wild and it has absolutely no connection or any tie whatsoever.
And that's why we're seeing this error message.

#### solution 1 the most obvious way of fixing this problem

```js
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from 'reducers';

let wrapped;

beforeEach(() => {
  wrapped = mount(
    <Provider store={createStore(reducers, {})}>
      <CommentBox />
    </Provider>
  )
})
```

but it's also probably the worst way to see what's going wrong is that now inside of every test file that we put together...

### 43. Adding a Root Component

#### solution 2

make a file `src/Root.js`

```js
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import reducers from 'reducers'

export default props => {
  return (
    <Provider store={createStore(reducers, {})}>
      {props.children}
    </Provider>
  )
}
```

```js
import Root from 'Root';
import CommentBox from 'components/CommentBox'

let wrapped;

beforeEach(() => {
   wrapped = mount(
     <Root>
       <CommentBox />
     </Root>
   )
});
```

### 44. Testing Reducers

redux 側のテストを書いていく
if we pass the comments reducer and action with some unknown type or some random type it won't throw an error or cause any issue for us.

fake action でテストする。actual action を呼ぶ必要はない

```js
import commentsReducer from 'reducers/comments';
import { SAVE_COMMENT } from 'actions/types';

it('handles actions of type SAVE_COMMENTS', () => {
  const action = {
    type: SAVE_COMMENT,
    payload: 'New Comment'
  }
  const newState = commentsReducer([], action)
  expect(newState).toEqual(['New Comment'])
});
```

### 45. Handling Unknown Types

```js
it('handles action with anknown type', () => {
  const newState = commentsReducer([], { type: 'LFDJSAFDJSA' })

  expect(newState).toEqual([])
});
```

### 46. Testing Action Creator

```js
import { saveComment } from 'actions';
import { SAVE_COMMENT } from 'actions/types';

describe('saveCommnet', () => {
  it('has the correct type', () => {
    const action = saveComment();

    expect(action.type).toEqual(SAVE_COMMENT);
  });

  it('has the correct payload', () => {
    const action = saveComment('New Comment');

    expect(action.payload).toEqual('New Comment');
  });
});
```

### 47. Comment List Wireup

```js
import React from 'react'
import { connect } from 'react-redux';

class CommentList extends React.Component {
  renderComments() {
    return this.props.comments.map(comment => {
      return <li key={comment}>{comment}</li>
    })
  }
  render() {
    return (
      <div>
        <ul>
          {this.renderComments()}
        </ul>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { comments: state.comments }
}

export default connect(mapStateToProps)(CommentList);
```

### 48. Getting Data Into Redux

```js
import React from 'react';
import { mount } from 'enzyme';

import CommentList from 'components/CommentList'
import Root from 'Root'

let wrapped;
beforeEach(() => {
  wrapped = mount(
    <Root>
      {/**
        * We don't have any way of modifying any of the data inside there. 
        * we could forcibly pass the prop into the commentList of comments.
        */}
      <CommentList comments={[]} />
    </Root>
  )
});

it('creates one LI per comment', () => {
  
});
```

### 48. Redux Initial State

```js
let wrapped;
beforeEach(() => {
  const initialState = {
    comments: ['comment 1', 'Comments 2']
  }
  wrapped = mount(
    <Root initialState={initialState}>
      <CommentList />
    </Root>
  )
});
```

```js
export default ({ children, initialState = {} }) => {
  return (
    <Provider store={createStore(reducers, initialState)}>
      {children}
    </Provider>
  )
}
```

### 50. Cheerio Queries

`.render()`: Returns a CheerioWrapper stounf the rendered HTML of the current node's subtree.
Cheerio is a library very similar ot a JQuery.
It allows us to kind of crawl or run queries or essentially selectors over snippets of HTML.

```js
it('shows the text for each comment', () => {
  expect(wrapped.render().text()).toContain('Comment 1')
  expect(wrapped.render().text()).toContain('Comment 2')
});
```

### 51. One More Feature

So all the code we've tested so far is not making a single HTML request.

JSONPlaceholder API

`yarn add axios redux-promise moxios`

`Root.js`
```js
import reduxPromise from 'redux-promise'
export default ({ children, initialState = {} }) => {
  const store = createStore(reducers, initialState, applyMiddleware(reduxPromise))
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}
```

`actions/index.js`
```js
export function fetchComment() {
  const response = axios.get('http://jsonplaceholder.typicode.com/comments')
  return {
    type: FETCH_COMMENT,
    payload: response
  }
}
```

`reduers/comments.js`
```js
    case FETCH_COMMENT:
      const comments = action.payload.data.map(comment => comment.name)
      return [...state, ...comments]
```

### 55. Integration Tests in Action

`src/__tests__/integrations.test.js`を作る

```js
import React from 'react';
import { mount } from 'enzyme'
import Root from 'Root'
import App from 'components/App';

it('can fetch a list of comments and display them', () => { 
  // Attempt to render the *entire* app

  // find the 'fetchComments' button and click it

  // Expect to find a list of comments!
});
```

### 57. Simulating Button Click

クラスをつける　`button className="fetch-comments"` 

```js
it('can fetch a list of comments and display them', () => { 
  // Attempt to render the *entire* app
  const wrapped = mount(
    <Root>
      <App />
    </Root>
  )
  
  // find the 'fetchComments' button and click it
  wrapped.find('.fetch-comments').simulate('click')

  // Expect to find a list of comments!
  expect(wrapped.find('li').length).toEqual(500)
});
```

### 58. Why the Failure

```sh
  ● can fetch a list of comments and display them

    expect(received).toEqual(expected)

    Expected: 500
    Received: 0
```

So when our test suite runs all of our code is making use of the JSDOM API.
And we had said that JSDOM API is kind of like a fake browser environment.

So the issue is that when our application tries to use axois to make a request to the ouside world or to some outside API that request is failing entirely because we are working with a fake browser environment.
**we don't have the ability to make Ajax requests from within our test suite when we are making use of JSDOM.**

axios <-> moxios

The idea behind that moxios library is that we can tell it to watch axios for attempting to make a request and any time it does we're goint to trick axios into thinkig that it instantly gets a response. no network request is going to be actually created.


### 59. Faking Requests with Moxios

```js
import moxios from 'moxios'

beforeEach(() => {
  moxios.install();
  moxios.stubRequest('http://jsonplaceholder.typicode.com/comments', {
    status: 200,
    response: [{ name: 'Fetched #1'}, { name: 'Fetched #2'}]
  })
});

afterEach(() => {
  moxios.uninstall()
});
```

### 60. The Reason for Failure

why our test is still failing. simulate がクリックされてすぐに expect が走るから。

To solve this you are going to introduce a tiny arbitary little delay between issuing that request and when our test suite tries to find that list of comments.

### 61. Introducing a Pause

```js
it('can fetch a list of comments and display them', (done) => { 
  const wrapped = mount(
    <Root>
      <App />
    </Root>
  )
  wrapped.find('.fetch-comments').simulate('click')
  // introduce a TINY little pause
  setTimeout(() => {
    wrapped.update()
    expect(wrapped.find('li').length).toEqual(3)
    done()
    wrapped.unmount();
  }, 100)
});
```

### 62. Moxios's Wait Function

*NOTE: But using a setTimout is extremely imprecise!*

```js
  moxios.wait(() => {
    wrapped.update()
    expect(wrapped.find('li').length).toEqual(2)
    done()
    wrapped.unmount()
  }, 100)
```

 