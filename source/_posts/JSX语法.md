---
title: JSX语法
tags: [React, 笔记]
archives_title: Archives
categories: JavaScript
date: 2017-11-27
---

参考

> 阮一峰网络日志: [React 入门实例教程](http://www.ruanyifeng.com/blog/2015/03/react.html)

# 基本

```javascript
    var names = ['aaa', 'bbb', 'ccc'];
    ReactDOM.render(
        <div>
        {
            names.map(function (name) {
                return <div>hello, {name}!</div>
            });
        }
        </div>,
        document.getElementById('root')
    );
```

等价于:

```html
<div>
  <div>hello, aaa!</div>
  <div>hello, bbb!</div>
  <div>hello, ccc!</div>
</div>
```

JSX 基本语法法则: 遇到`HTML`标签(`<`开头)就用 HTML 解析，遇到代码块(`{`开头)就用 JavaScript 解析

# JSX 允许直接在模板插入 JavaScript 变量，变量如果是数组则会展开

```javascript
    var arr = {
        <h1>Hello World</h1>,
        <h2>Hi</h2>
    };
    ReactDOM.render(
        <div>{arr}</div>,
        document.getElementById('root')
    );
```

等价于:

```html
<div>
  <h1>Hello World</h1>
  <h2>Hi</h2>
</div>
```
