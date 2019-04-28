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

create react app で インストールされる stuff 

- React
- Webpack: Links together JS files
- Babel Turns ES2015/6/7 and JSX into ES5 code
- Jest Automated test runner

test　を学ぶ為に簡単な comment 保存アプリを作る

`yarn add redux react-redux`

- Look at each individual part of your application
- Imagine telling a friend 'heres what this piece of code does'
- Write a test to verify each part does what you expect.

テストを書いていこう

