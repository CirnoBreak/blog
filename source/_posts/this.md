---
title: JavaScript之this
tags: [深入JavaScript, 笔记]
archives_title: Archives
categories: JavaScript
date: 2017-11-08
---

参考:

> 《你不知道的 JavaScript part2 第 1、2 章》

# this 初步理解

当函数被调用时，会创建一个活动记录(上下文)，这个记录包括函数在哪被调用(调用栈)、函数调用方法、传入参数等信息，`this`就是记录其中的一个属性
误解：`this`指向函数自身，`this`指向函数函数的词法作用域。
而实际上，`this`是在函数被调用时发生的绑定，他的指向取决于函数在哪被调用

# this 的绑定规则

## 默认绑定

```javascript
function foo() {
  console.log(this.a);
}
var a = 2;
foo(); // 2
```

在调用`foo()`的时候`this.a`被解析成全局变量`a`，因为此时应用了 this 的默认绑定指向了全局  
为什么是默认绑定？因为`foo()`直接使用是不带任何修饰的函数进行引用调用，因此只能用默认绑定而不能用其他规则

```javascript
function foo() {
  "use strict";
  console.log(this.a);
}
var a = 2;
foo(); // TypeError: this is undefined
```

使用了严格模式后，全局对象无法使用默认绑定，`this`会被绑定到 undefined

```javascript
function foo() {
  console.log(this.a);
}
var a = 2;
(function() {
  "use strict";
  foo(); // 2
})();
```

严格模式与`foo`的调用位置无关

## 隐式绑定

```javascript
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};
obj.foo(); // 2
```

严格来说`foo()`不属于`obj`，但这个调用位置会使用 obj 上下文去引用`foo()`。当函数引用有上下文对象的时候，隐式绑定会把`this`绑定到这个上下文

```javascript
function foo() {
  console.log(this.a);
}
var obj2 = {
  a: 42,
  foo: foo
};
var obj1 = {
  a: 2,
  obj2: obj2
};
obj1.obj2.foo(); // 42
```

对象引用层只有最顶层或者最后一层会影响其调用位置

## 隐式丢失

```JavaScript
function foo() {
    console.log( this.a );
}
var obj = {
    a: 2,
    foo: foo
};
var bar = obj.foo; // 函数别名！
var a = "oops, global"; // a 是全局对象的属性
bar(); // "oops, global"
```

虽然`bar`是`obj.foo`的一个引用，但实际上引用的是`foo`函数的本身，此时的`bar`是一个不带任何修饰的绑定，应用了默认绑定

在传入回调函数的时候也会失去绑定：

```javascript
例子1:
function foo() {
    console.log( this.a );
}
function doFoo(fn) {
    // fn 其实引用的是 foo
    fn(); // <-- 调用位置！
}
var obj = {
    a: 2,
    foo: foo
};
var a = "oops, global"; // a 是全局对象的属性
doFoo( obj.foo ); // "oops, global"

例子2:
function foo() {
    console.log( this.a );
}
var obj = {
    a: 2,
    foo: foo
};
var a = "oops, global"; // a 是全局对象的属性
setTimeout( obj.foo, 100 ); // "oops, global"
实际上的`setTimeout`：
function setTimeout(fn,delay) {
    // 等待 delay 毫秒
    fn(); // <-- 调用位置！
}
```

总结： 回调函数丢失`this`的绑定很常见，调用回调函数的函数也可能会修改`this`

## 显式绑定

使用`call()`或者`apply()`方法实现，他们的第一个参数是一个对象，他们会把这个对象绑定到这个`this`，在调用函数的时候指定这个`this`，就可以指定 this 的绑定对象，这就是显式绑定。

```javascript
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2
};
foo.call(obj); // 2
```

通过`foo.call()`,调用时`foo`强制把`this`绑定到`obj`上，如果传入一个原始值(`boolean、String、Number`)当做`this`的绑定对象，这个原始值会被转成他的对象形式(`new Boolean()、new String()、new Number()`)

## 硬绑定

显式绑定仍然无法解决绑定丢失，但显式绑定变种(硬绑定)可以解决

```javascript
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2
};
var bar = function() {
  foo.call(obj);
};
bar(); // 2
setTimeout(bar, 100); // 2
// 硬绑定的 bar 不可能再修改它的 this
bar.call(window); // 2
```

如何运行？ 先创建函数`bar()`，并在内部手动调用`foo.call(obj)`,强制把`foo`的`this`绑定到`obj`,之后无论如何调用`bar`都会在`obj`上调用`foo`

硬绑定的应用场景就是创建一个包装函数，传入所有参数并返回所有收到的值。
例子:

```javascript
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}
var obj = {
  a: 2
};
var bar = function() {
  return foo.apply(obj, arguments);
};
var b = bar(3); // 2 3
console.log(b); // 5
```

另一种就是创建一个可以重复利用的辅助函数，例子:

```javascript
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}
// 简单的辅助绑定函数
function bind(fn, obj) {
  return function() {
    return fn.apply(obj, arguments);
  };
}
var obj = {
  a: 2
};
var bar = bind(foo, obj);
var b = bar(3); // 2 3
console.log(b); // 5
```

`ES5`提供了内置方法`Function.prototype.bind`实现硬绑定，会把参数设置为`this`的执行上下文并调用原始函数，例子:

```javascript
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}
var obj = {
  a: 2
};
var bar = foo.bind(obj);
var b = bar(3); // 2 3
console.log(b); // 5
```

## new 绑定

使用`new`来调用函数会发生下列操作:

1. 创建（或者说构造）一个全新的对象。
2. 这个新对象会被执行原型连接。
3. 这个新对象会绑定到函数调用的 `this`。
4. 如果函数没有返回其他对象， 那么 `new` 表达式中的函数调用会自动返回这个新对象。

```javascript
function foo(a) {
  this.a = a;
}
var bar = new foo(2);
console.log(bar.a); // 2
```

此时，会构造一个新对象并把它绑定到`foo()`中调用的`this`上。

# 优先级

```javascript
function foo() {
  console.log(this.a);
}
var obj1 = {
  a: 2,
  foo: foo
};
var obj2 = {
  a: 3,
  foo: foo
};
obj1.foo(); // 2
obj2.foo(); // 3
obj1.foo.call(obj2); // 3
obj2.foo.call(obj1); // 2
```

从这里可以看出显式绑定优先级高于隐式绑定

```javascript
function foo(something) {
  this.a = something;
}
var obj1 = {
  foo: foo
};
var obj2 = {};
obj1.foo(2);
console.log(obj1.a); // 2
obj1.foo.call(obj2, 3);
console.log(obj2.a); // 3
var bar = new obj1.foo(4);
console.log(obj1.a); // 2
console.log(bar.a); // 4
```

从这里可以看出 new 绑定比隐式绑定优先级高

```javascript
function foo(something) {
  this.a = something;
}
var obj1 = {};
var bar = foo.bind(obj1);
bar(2);
console.log(obj1.a); // 2
var baz = new bar(3);
console.log(obj1.a); // 2
console.log(baz.a); // 3
```

`bar`被硬绑定到`obj1`上，但`new Bar(3)`并没有把`obj1.a`修改为 3，反而`new`修改了硬绑定调用`bar()`的`this`，使用`new`绑定后得到`baz`的新对象，`baz.a`的值为`3`

## 部分应用化(柯里化的一种)

bind()功能之一:把除了第一个参数外的其他参数传给下层函数,这种叫做部分应用化

```javascript
function foo(p1, p2) {
  this.val = p1 + p2;
}
// 使用 new 时 this 会被修改
var bar = foo.bind(null, "p1");
var baz = new bar("p2");
baz.val; // p1p2
```

## 总结如何判断 this

1.  函数在`new`中调用(`new绑定`) => `this`绑定指定对象

```javascript
var bar = new foo();
```

2. 函数通过`call、apply`(显示绑定)或者硬绑定 => `this`绑定的是指定的对象

```javascript
var bar = foo.call(obj);
```

3. 函数在某个上下文中调用 => `this`绑定那个上下文对象

```javascript
var bar = obj.foo();
```

4. 都不是，则是默认绑定。严格模式绑定到`undefined`，否则绑定到全局对象。

```javascript
var bar = foo();
```

# 特殊绑定

## 被忽略的 this

```javascript
function foo() {
  console.log(this.a);
}
var a = 2;
foo.call(null); // 2
```

把 null、undefined 传入 apply、call、bind 在调用时会被忽略而变成默认绑定

null 的作用:

```javascript
function foo(a, b) {
  console.log("a:" + a + ", b:" + b);
} // 把数组“展开” 成参数
foo.apply(null, [2, 3]); // a:2, b:3
// 使用 bind(..) 进行柯里化
var bar = foo.bind(null, 2);
bar(3); // a:2, b:3
```

## 间接引用

```javascript
function foo() {
  console.log(this.a);
}
var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };
o.foo(); // 3
(p.foo = o.foo)(); // 2
```

`p.foo = o.foo`实际返回的是目标函数的引用，因此调用位置是`foo()`而不是`p.foo()`或者`o.foo()`,这里会启动默认绑定
注:对默认绑定来说，决定 this 绑定对象的不是调用位置而是函数体是否处于严格模式，如果是就绑定 undefined,否则绑定到全局对象

# 箭头函数 this 的词法

```javascript
function foo() {
  // 返回一个箭头函数
  return a => {
    //this 继承自 foo()
    console.log(this.a);
  };
}
var obj1 = {
  a: 2
};
var obj2 = {
  a: 3100
};
var bar = foo.call(obj1);
bar.call(obj2); // 2, 不是 3 ！
```

foo()创建箭头函数的时候捕获调用 foo 的时候的 this,由于 foo()的 this 绑定到 obj1,bar 的 this 也会被绑定到 obj1，箭头函数的绑定无法修改

箭头函数常用于回调函数:

```javascript
function foo() {
  var self = this; // lexical capture of this
  setTimeout(function() {
    console.log(self.a);
  }, 100);
}
var obj = {
  a: 2
};
foo.call(obj); // 2
```

等价于:

```javascript
function foo() {
  var self = this; // lexical capture of this
  setTimeout(function() {
    console.log(self.a);
  }, 100);
}
var obj = {
  a: 2
};
foo.call(obj); // 2
```
