---
title: 对深浅拷贝的简单理解
tags: [Javascript]
archives_title: Archives
categories: Javascript
date: 2019-02-27
---

深浅拷贝在前端开发中是必然会踩的一个坑，也是面试常考题。至于深浅拷贝为何会存在，主要是跟 JavaScript 的数据类型以及一些历史遗留的问题有关，下面来简单了解下这两者的区别以及如何实现。

# 为何需要深浅拷贝?

首先，先从 JavaScript 的数据类型开始，在 JavaScript 中，有其中的内置类型，而这其中内置类型又分为两大类: 6 种原始类型(Boolean, Null, Undefined, Number, String, Symbol)和 Object。其中原始类型又叫基本类型，属于值类型，是按值访问的，因此可以操作保存在变量的实际的值；而 Object 属于引用类型，是按引用访问的，在操作对象的时候，实际上是操作对象的引用而不是对象的实际的值。

```js
let num1 = 5;
let num2 = num1; // 5
num2 = 3;
console.log(num1, num2); // 5 3，指向不同数据

let obj1 = new Object();
let obj2 = obj1(); // {}
obj2.a = "ok"; // { a: 'ok' }
console.log(obj1, obj2); // { a: 'ok' } { a: 'ok' }， 指向同一份数据
```

可见，由于 Object 是引用类型，在吧 obj2 赋值给 obj1 的过程中，实际上，此时 obj1 跟 obj2 都指向了同一份数据(堆内存的同一块地址)，也就是说，在修改 obj2 的同时，也会对 obj1 造成影响。那我们要怎么样才能避免出现这样的问题?这时候就需要深/浅拷贝了。

# 浅拷贝

按字面上的意思来理解，浅拷贝就是浅层的拷贝，在实际上是只对第一层进行拷贝。随着 ES6 的到来，我们有非常简单的浅拷贝解决方案。

1. 使用 Object.assign()

```js
let obj1 = {
  a: "ok"
};
let obj2 = Object.assign({}, obj1); // { a: 'ok' }
obj2.b = "yes"; // { a: 'ok', b: 'yes' }
console.log(obj1, obj2); // { a: 'ok' } { a: 'ok', b: 'yes' }
```

2. 使用扩展运算符(...)

```js
let obj1 = {
  a: "ok"
};
let obj2 = { ...obj1 };
obj2.b = "yes"; // { a: 'ok', b: 'yes' }
console.log(obj1, obj2); // { a: 'ok' } { a: 'ok', b: 'yes' }
```

3. 传统 for 循环解决方案

```js
const shallowCopy = obj => {
  let newObj = {};
  for (let i of Ojbect.keys(obj)) {
    newObj = obj[i];
  }
  return result;
};

let obj1 = {
  a: "ok"
};
let obj2 = shallowCopy(obj1);
obj2.b = "yes"; // { a: 'ok', b: 'yes' }
console.log(obj1, obj2); // { a: 'ok' } { a: 'ok', b: 'yes' }
```

# 深拷贝

上面的例子由于对象都只有一层，所以使用浅拷贝，没什么问题，但万一对象变成了多层的时候，使用上述的方法都会出现问题，下面只举其中一个例子:

```js
let obj1 = {
  a: {
    b: {
      c: 1
    }
  }
};
let obj2 = { ...obj1 };
obj2.a.b.c = 2; // { a: { b: { c: 2 } } }
console.log(obj1, obj2); //  { a: { b: { c: 2 } } } { a: { b: { c: 2 } } }
```

那深拷贝又如何实现?

1. 简单粗暴的方式: 递归 + 浅拷贝

```js
const isObject = source => {
  return Object.prototype.toString.call(source) === "[object Object]";
};

const deepCopy = obj => {
  let target = {};
  for (let i of Object.keys(obj)) {
    if (!isObject(obj[i])) {
      target[i] = obj[i];
    } else {
      target[i] = deepCopy(obj[i]);
    }
  }
  return target;
};

let obj1 = {
  a: {
    b: {
      c: 1
    }
  }
};
let obj2 = deepCopy(obj1);
obj2.a.b.c = 2; // { a: { b: { c: 2 } } }
console.log(obj1, obj2); //  { a: { b: { c: 1 } } } { a: { b: { c: 2 } } }
```

这种方法会存在跟数组以及 ES6 相关 api 的问题，同时递归遇到很深的层次以及循环引用也会出现问题，由于只是简单实现就不考虑了。

2. JSON API 法

这种方法比较简单，只需要一行代码即可:

```js
let obj1 = {
  a: {
    b: {
      c: 1
    }
  }
};
let obj2 = JSON.parse(JSON.stringify(obj1));
obj2.a.b.c = 2; // { a: { b: { c: 2 } } }
console.log(obj1, obj2); //  { a: { b: { c: 1 } } } { a: { b: { c: 2 } } }
```

这种方法看起来特别简单，但存在局限性: JSON.stringify 在序列化的时候，会忽略值为`undefined、symbol`的整个键值对，并且不能序列化函数以及不能解决循环引用的对象。

3. MessageChanel API

```js
const deepCopy = obj => {
  return new Promise(resolve => {
    const { port1, port2 } = new MessageChannel();
    port2.onmessage = ev => resolve(ev.data);
    port1.postMessage(obj);
  });
};

let obj1 = {
  a: {
    b: {
      c: 1
    }
  }
};

let obj2 = null;

deepCopy(obj1).then(val => (obj2 = val));

obj2.a.b.c = 2; // { a: { b: { c: 2 } } }
console.log(obj1, obj2); //  { a: { b: { c: 1 } } } { a: { b: { c: 2 } } }
```

这种方法仅在所需拷贝对象含有内置类型并且不包含函数的情况下使用。

总结:
上面三种方式都能实现深拷贝，但都存在问题，目前业界常用的解决方案是使用 lodash 的 cloneDeep api，在下一篇文章尝试阅读该 api 的源码。

参考

> [MDN - JavaScript 数据类型和数据结构](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)
> 《JavaScript 高级程序设计 第 3 版》 第四章
> [InterviewMap](https://yuchengkai.cn/docs/frontend/)
