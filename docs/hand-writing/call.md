---
title: call、bind、apply 实现
order: 2
toc: menu
---

## 前言

call(), .apply() .bind() 的区别和作用？

作用：call、apply、bind 都可以改变函数执行时的上下文，即改变 this 指向。

区别：

1. call 和 apply 是`立即执行`的，而 bind 方法的返回值是函数，并且需要稍后调用，才会执行。
2. call 和 apply `参数写法上`有区别的，call 和 apply 的第一个参数都是接收一个对象，不传或者传 null 是指向全局对象 window。call 从第二个参数开始可以接收任意个参数，而 apply 第二个参数必须是数组或者类数组。

## call 的实现

1. ES5 实现

```js
Function.prototype.myCall = function(context, ...args) {
  if (this === Function.prototype) {
    // 防止 Function.prototype.call() 直接调用
    return undefined;
  }

  var context = context || window;
  context.fn = this;
  // 执行
  var result = eval(`context.fn(...args)`);
  // 删除 fn 属性
  delete context.fn;
  return result;
};
```

2. ES6 实现

```js
Function.prototype.myCall = function(context = window, ...args) {
  if (this === Function.prototype) {
    return undefined;
  }

  context = context || window;
  // 为了 key 不重名
  const fn = Symbol();
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
};
```

## apply 实现

1. ES5 实现

```js
Function.prototype.myApply = function(context, args) {
  if (this === Function.prototype) {
    return undefined;
  }

  var context = context || window;
  context.fn = this;
  var result = eval(`context.fn(...args)`);
  delete context.fn;
  return result;
};
```

2. ES6 实现

```js
Function.prototype.myApply = function(context = window, args) {
  if (this === Function.prototype) {
    return undefined;
  }

  context = context || window;
  const fn = Symbol();
  context[fn] = this;

  let result;
  if (Array.isArray(args)) {
    result = context[fn](...args);
  } else {
    result = context[fn]();
  }

  delete context[fn];
  return result;
};
```

## bind 实现

```js
Function.prototype.myBind = function(context, ...args1) {
  if (this === Function.prototype) {
    throw new TypeError('Error');
  }

  const _this = this;
  // 返回一个闭包
  return function F(...args2) {
    // 判断是否用于构造函数
    if (this instanceof F) {
      return new _this(...args1, ...args2);
    }
    return _this.apply(context, args1.concat(args2));
  };
};
```
