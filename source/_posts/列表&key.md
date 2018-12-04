---
title: React列表&key
tags: [React, 笔记]
archives_title: Archives
categories: JavaScript, React
date: 2017-11-28
---
# map()方法遍历数组
```javascript
const numbers = [1, 2, 3, 4, 5];
const listItem = numbers.map((num) => {
  return <li>{num}</li>;
});

ReactDOM.render(<ul>{listItem}</ul>, document.getElementById('root'));
```
组件写法:
```javascript
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((num) => {
    return (
      <li key={num.toString()}>
        {num}
      </li>
    )
  });
  return (
    <ul>{listItems}</ul>
  );
}
const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(<NumberList numbers={numbers} />, document.getElementById('root'));
```
用map创建时需要给列表元素添加一个key，最好是独一无二的字符串
可以来自数据的id:
```javascript
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```
没有确定的id，用索引index作为key
```javascript
const todoItems = todos.map((todo, index) =>
  <li key={index}>
    {todo.text}
  </li>
);
```
# 用keys提取组件
```javascript
function ListItem(props) {
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((num) => 
    <ListItem key={num.toString()} value={num} />
  );
  return (
    <ul>{listItems}</ul>
  )
}
const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(<NumberList numbers={numbers}/>, document.getElementById('root'));
```

