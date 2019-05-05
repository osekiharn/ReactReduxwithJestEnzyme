# Middleware with Redux

## Diagram

React -> Action Creator -> Action -> Middleware -> Reducers -> State -> React

Action が呼ばれた時に middleware は動き始める

middleware function give us the ability to log modify or even stop actions that have been returned from our action creators.

middelware allow us to inspect these actions that are being returned from actin creators 


- We call fetchComments 
- Ajax request issued
- Actions returned from action creator
- Response from JSON API recieved
- Action send to the reducer

The time between making the request and then returning the action is near instantaneous
it hanppens like lickety split in a fraction

lickety split 全速力で
in a fraction a seconde 数分の1秒で、

debugger を埋め込んで　action.payloadを見てみる

次に redux promies を消してみる

that payload is not a response coming back form JSON API.
Instead it's a pending promise says pending.
So clearly without that promise middleware our application does not work the way we expect.

### How async middlewares work

Every single middleware inside of our application has the ability to inspect that action and take some operation on its like say logging it or modifying it stopping it whatever it might be.

**We going to build from scratch the redux Promise middleware!**

action (payload) を見て、promsie オブジェクトかどうかを判別する
APIリクエストでなければスルーして次のmiddlewareへ渡す
promise をもっていたら、promise resolveするまでreducer に渡さない

promise が解決してもすぐそのまま渡さず、同じaction type の　brand new action を作って、new action を作って　最初の middleware へ戻す

なぜ新しいアクションを作って最初に戻すのかというと、promise オブジェクトをスルーする middleware に通したいからループさせる

### Crazy Middleware Syntax

`src/middleware`フォルダを作る。middlewareはここに入れる
`async.js`を作る

```js
export default function({ dispatch }) {
  return function(next) {
    return function(action) {

    }
  }
}
```

refactor

```js
export default ({dispatch}) => next => action => {
  // Check to see if the action
  // has a promise on its 'payload' property
  // If it does, then wait for it to resolve
  // If it does't, then send the action on to the
  // next middlware
  
}
```

Step 1

```js
export default ({dispatch}) => next => action => {
  // Check to see if the action
  // has a promise on its 'payload' property
  // If it does, then wait for it to resolve
  // If it does't, then send the action on to the
  // next middlware
  if (!action.payload || !action.payload.then) {
    return next(action)   
  }
}
```

Step 2

```js
export default ({dispatch}) => next => action => {
  ...
  // We want to wait for the promise to resolve
  // (get its data!!) and then crete a new action
  // with that data and dispatch it
  action.payload.then((response) => {
    const newAction = { ...action, palyload: response }
    dispatch(newAction)
  })
}
```

### Observing the Middleware

```js
import async from '/middlewares/async'
...
applyMiddleware(async)
```

### State Validation Middleware

(http://jsonschema.net)[http://jsonschema.net]

generate JSON schema

